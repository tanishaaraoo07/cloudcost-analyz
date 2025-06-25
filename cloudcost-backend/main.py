from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware  # ✅ Add this
from models.schemas import DiscoveryRequest
from services.discover import discover_resources
from models.schemas import CompareRequest
from services.compare import compare_costs
from models.schemas import MappingRequest, DiscoveryRequest, PDFRequest, CompareRequest
from services.mapping import get_service_mapping
from fastapi.responses import StreamingResponse
from pdf_generator import generate_pdf_report
app = FastAPI()
from fastapi.responses import Response  # Make sure this is imported



# ✅ Enable CORS here
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can restrict to ["http://localhost:5173"] later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/discover")
def discover(request: DiscoveryRequest):
    try:
        result = discover_resources(request)
        return {"status": "success", "resources": result}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/compare")
def compare(request: CompareRequest):
    try:
        comparison = compare_costs(
            provider=request.resources[0].provider,
            resources=[r.dict() for r in request.resources]
        )
        return {"status": "success", "comparison": comparison}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


    
   
@app.post("/mapping")
def mapping(request: MappingRequest):
    try:
        result = get_service_mapping(request.provider, request.resources)
        return {"status": "success", "mappings": result}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e)) 
    

@app.post("/generate-pdf")
async def generate_pdf(data: PDFRequest):
    print("Received request:", data.dict())  # DEBUG
    pdf_bytes = generate_pdf_report(data.cost_data, data.mapping_data)  # ✅ Use correct function
    print("PDF generated")  # DEBUG
    return Response(content=pdf_bytes, media_type="application/pdf")

