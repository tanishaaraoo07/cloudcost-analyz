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

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with frontend URL in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# 🚀 DISCOVER API
@app.post("/discover")
async def discover_resources(request: Request):
    body = await request.json()
    provider = body.get("provider")

    print("🔥 FORCED MOCK RESPONSE: ignoring request body")
    return {
        "resources": [
            {"instance_id": "i-demo123", "type": "t2.micro", "state": "running"},
            {"instance_id": "i-demo456", "type": "t2.medium", "state": "stopped"},
            {"instance_id": "i-demo789", "type": "t3.large", "state": "stopped"}
        ]
    }

    try:
        if provider == "AWS":
            access_key = body.get("access_key")
            secret_key = body.get("secret_key")
            region = body.get("region", "ap-south-1")

            resources = discover_aws_resources(access_key, secret_key, region)

        else:
            return JSONResponse(status_code=400, content={"detail": "Unsupported provider"})

        return {"resources": resources}

    except Exception as e:
        return JSONResponse(status_code=500, content={"detail": str(e)})

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
@app.post("/generate-pdf")
async def generate_pdf(request: Request):
    try:
        body = await request.json()
        raw_cost_data = body.get("cost_data", [])
        raw_mapping_data = body.get("mapping_data", [])

        # 🔄 Normalize cost data keys to match PDF expectations
        cost_data = []
        for item in raw_cost_data:
            cost_data.append({
                "service": item.get("type") or item.get("service", "Unnamed"),
                "aws_cost": item.get("current_cost") if item.get("current_provider") == "AWS" else 0,
                "azure_cost": item.get("current_cost") if item.get("current_provider") == "Azure" else 0,
                "gcp_cost": item.get("gcp_cost", 0)
            })

        # 🔄 Normalize mapping keys
        mapping_data = []
        for m in raw_mapping_data:
            mapping_data.append({
                "source_service": m.get("original_service", "Unknown"),
                "target_service": m.get("gcp_equivalent", "Unknown")
            })

        # Generate PDF
        pdf_buffer = generate_pdf_report(cost_data, mapping_data)
        pdf_buffer.seek(0)

        return StreamingResponse(
            content=pdf_buffer,
            media_type="application/pdf",
            headers={"Content-Disposition": "attachment; filename=cloudcost_report.pdf"}
        )

    except Exception as e:
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
