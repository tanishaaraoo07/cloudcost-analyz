# services/compare.py

def compare_costs(provider: str, resources: list):
    # Mock cost mapping
    cost_table = {
        "EC2": {"AWS": 25, "GCP": 20},
        "S3": {"AWS": 5, "GCP": 4},
        "VM": {"Azure": 24, "GCP": 19},
        "Blob Storage": {"Azure": 4, "GCP": 3.5}
    }

    result = []

    for res in resources:
        rtype = res["name"]
        current_cost = cost_table.get(rtype, {}).get(provider, 0)
        gcp_cost = cost_table.get(rtype, {}).get("GCP", 0)
        result.append({
            "type": rtype,
            "current_provider": provider,
            "current_cost": current_cost,
            "gcp_cost": gcp_cost,
            "savings": current_cost - gcp_cost
        })

    return result
