from pydantic import BaseModel
from typing import List

class Resource(BaseModel):
    name: str
    provider: str
    usage: float

class CompareRequest(BaseModel):
    resources: List[Resource]

# Other schemas
class MappingRequest(BaseModel):
    provider: str
    resources: List[str]

class DiscoveryRequest(BaseModel):
    provider: str
    access_key: str = None
    secret_key: str = None
    tenant_id: str = None
    client_secret: str = None

class PDFRequest(BaseModel):
    cost_data: List[dict]
    mapping_data: List[dict]
