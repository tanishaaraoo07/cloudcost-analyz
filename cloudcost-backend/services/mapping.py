# services/mapping.py

def get_service_mapping(provider: str, resources: list):
    # Mock mapping database
    mapping_db = {
        "AWS": {
            "EC2": "Compute Engine",
            "S3": "Cloud Storage",
            "RDS": "Cloud SQL"
        },
        "Azure": {
            "VM": "Compute Engine",
            "Blob Storage": "Cloud Storage",
            "SQL Database": "Cloud SQL"
        }
    }

    mapped = []
    for res in resources:
        gcp_equiv = mapping_db.get(provider, {}).get(res, "Unknown")
        mapped.append({
            "original_service": res,
            "gcp_equivalent": gcp_equiv
        })

    return mapped
