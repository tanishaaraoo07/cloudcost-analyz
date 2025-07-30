from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, JSONResponse
from models.schemas import DiscoveryRequest, CompareRequest, MappingRequest, PDFRequest
from services.compare import compare_costs
from services.mapping import get_service_mapping
from pdf_generator import generate_pdf_report

from fastapi import Request


import boto3
from azure.identity import ClientSecretCredential
from azure.mgmt.compute import ComputeManagementClient

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "CloudCost API is running"}

from pymongo import MongoClient
import certifi
import os

from pymongo import MongoClient
import certifi

MONGO_URI = "mongodb+srv://cbtanisha10:JPbvppiNTw9APRk3@cloudcost.mjrwyxi.mongodb.net/?retryWrites=true&w=majority&appName=cloudcost"

client = MongoClient(MONGO_URI, tlsCAFile=certifi.where())  # ← add this
db = client["cloudcost"]
users = db["users"]


@app.post("/signup")
async def signup(request: Request):
    data = await request.json()
    if users.find_one({"email": data["email"]}):
        return JSONResponse(content={"message": "User already exists"}, status_code=400)
    
    users.insert_one({
        "name": data["name"],
        "email": data["email"],
        "password": data["password"]  # ❗ In real apps, use hashed passwords!
    })
    return {"token": "dummy-token"}

@app.post("/login")
async def login(request: Request):
    data = await request.json()
    user = users.find_one({"email": data["email"], "password": data["password"]})
    if user:
        return {"token": "dummy-token"}
    return JSONResponse(content={"message": "Invalid credentials"}, status_code=401)


# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",          # Local Vite dev server
        "https://cloudcost-analyz.vercel.app",  # Your deployed frontend
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# 🚀 DISCOVER API
@app.post("/discover")
async def discover_resources(request: Request):
    body = await request.json()
    provider = body.get("provider")
    use_mock = body.get("use_mock", False)  # 👈 must default to False

    print("🧪 use_mock =", use_mock)

    if use_mock:
        print("✅ Returning mock data")
        return {
            "resources": [
                {"instance_id": "i-demo123", "type": "t2.micro", "state": "running"},
                {"instance_id": "i-demo456", "type": "t2.medium", "state": "stopped"},
                {"instance_id": "i-demo789", "type": "t3.large", "state": "stopped"}
            ]
        }

    # Real AWS discovery logic
    if provider == "AWS":
        access_key = body.get("access_key")
        secret_key = body.get("secret_key")
        region = body.get("region", "ap-south-1")
        resources = discover_aws_resources(access_key, secret_key, region)
        return {"resources": resources}


# 🧮 COMPARE COSTS
@app.post("/compare")
def compare_costs_handler(request: CompareRequest):
    comparison = []
    mapping_data = []

    for resource in request.resources:
        name = resource.name
        usage = resource.usage
        provider = resource.provider

        aws_rate = {"EC2": 0.1, "S3": 0.02}
        azure_rate = {"VM": 0.11, "Blob Storage": 0.025}
        gcp_rate = {"EC2": 0.08, "S3": 0.015, "VM": 0.09, "Blob Storage": 0.02}

        if name in aws_rate:
            current_cost = aws_rate[name] * usage
            current_provider = "AWS"
        elif name in azure_rate:
            current_cost = azure_rate[name] * usage
            current_provider = "Azure"
        else:
            current_cost = 0
            current_provider = provider

        gcp_cost = gcp_rate.get(name, 0) * usage
        savings = round(current_cost - gcp_cost, 2)

        comparison.append({
            "type": name,
            "current_provider": current_provider,
            "current_cost": round(current_cost, 2),
            "gcp_cost": round(gcp_cost, 2),
            "savings": savings
        })

        gcp_equiv = {
            "EC2": "Compute Engine",
            "S3": "Cloud Storage",
            "VM": "Compute Engine",
            "Blob Storage": "Cloud Storage"
        }

        mapping_data.append({
            "original_service": name,
            "gcp_equivalent": gcp_equiv.get(name, "Unknown")
        })

    return {
        "comparison": comparison,
        "mapping": mapping_data
    }

# 🔁 MAPPING SERVICE
from fastapi import Request

SERVICE_MAP = {
    "EC2": "Compute Engine",
    "S3": "Cloud Storage",
    "RDS": "Cloud SQL",
    "Lambda": "Cloud Functions",
    "DynamoDB": "Firestore",
    "CloudWatch": "Operations Suite",
    "IAM": "Cloud IAM",
    "ELB": "Cloud Load Balancing",
    # add more as needed
}

@app.post("/mapping")
async def get_mapping(request: Request):
    try:
        body = await request.json()
        provider = body.get("provider")
        resources = body.get("resources", [])

        mappings = []
        for service in resources:
            gcp_equiv = SERVICE_MAP.get(service, "No direct equivalent")
            mappings.append({
                "original_service": service,
                "gcp_equivalent": gcp_equiv
            })

        return {"status": "success", "mappings": mappings}
    except Exception as e:
        return {"status": "error", "message": str(e)}


# 📄 PDF GENERATION
import io
import base64

@app.post("/generate-pdf")
async def generate_pdf(request: Request):
    try:
        body = await request.json()
        raw_cost_data = body.get("cost_data", [])
        raw_mapping_data = body.get("mapping_data", [])
        chart_image_base64 = body.get("chart_image", None)

        # ✅ Normalize cost data
        cost_data = []
        for item in raw_cost_data:
            service = item.get("type") or item.get("service", "Unnamed")
            provider = item.get("current_provider")
            aws = item.get("aws_cost", 0)
            azure = item.get("azure_cost", 0)
            gcp = item.get("gcp_cost", 0)

            cost_data.append({
                "service": service,
                "aws_cost": item["current_cost"] if provider == "AWS" else aws,
                "azure_cost": item["current_cost"] if provider == "Azure" else azure,
                "gcp_cost": gcp
            })

        # ✅ Normalize mapping data
        mapping_data = []
        for m in raw_mapping_data:
            source = m.get("original_service") or m.get("source_service", "Unknown")
            target = m.get("gcp_equivalent") or m.get("target_service", "Unknown")
            mapping_data.append({
                "source_service": source,
                "target_service": target
            })

        # ✅ Generate PDF
        pdf_buffer = generate_pdf_report(cost_data, mapping_data, chart_image_base64)
        pdf_buffer.seek(0)

        return StreamingResponse(
            content=pdf_buffer,
            media_type="application/pdf",
            headers={"Content-Disposition": "attachment; filename=cloudcost_report.pdf"}
        )
    except Exception as e:
        print("❌ PDF generation failed:", e)
        return JSONResponse(status_code=500, content={"error": str(e)})


# 🔍 AWS Discovery Logic
def discover_aws_resources(access_key: str, secret_key: str, region: str = "ap-south-1"):
    session = boto3.Session(
        aws_access_key_id=access_key,
        aws_secret_access_key=secret_key,
        region_name=region
    )
    ec2_client = session.client('ec2')

    try:
        instances = ec2_client.describe_instances()
    except Exception as e:
        print(f"❌ Error during AWS discovery: {e}")
        return []

    ec2_list = []
    for resv in instances.get("Reservations", []):
        for inst in resv.get("Instances", []):
            ec2_list.append({
                "instance_id": inst.get("InstanceId"),
                "type": inst.get("InstanceType"),
                "state": inst.get("State", {}).get("Name")
            })

    return ec2_list

# 🔍 Azure Discovery Logic
def discover_azure_resources(tenant_id, client_id, client_secret, subscription_id):
    try:
        credentials = ClientSecretCredential(
            tenant_id=tenant_id,
            client_id=client_id,
            client_secret=client_secret
        )

        compute_client = ComputeManagementClient(credentials, subscription_id)

        vm_list = []
        for vm in compute_client.virtual_machines.list_all():
            vm_list.append({
                "name": vm.name,
                "location": vm.location,
                "size": vm.hardware_profile.vm_size
            })

        return vm_list

    except Exception as e:
        print(f"Error during Azure discovery: {e}")
        return []
