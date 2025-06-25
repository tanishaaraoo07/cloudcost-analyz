def discover_resources(request):
    if request.provider == "AWS":
        if not request.access_key or not request.secret_key:
            raise Exception("Missing AWS credentials")
        return [
            {"type": "EC2", "id": "i-1234567890", "region": "us-east-1"},
            {"type": "S3", "bucket": "my-app-data"},
        ]
    elif request.provider == "Azure":
        if not request.tenant_id or not request.client_secret:
            raise Exception("Missing Azure credentials")
        return [
            {"type": "VM", "name": "my-vm", "location": "East US"},
            {"type": "Blob Storage", "container": "files"},
        ]
    else:
        raise Exception(f"Unsupported cloud provider: {request.provider}")
