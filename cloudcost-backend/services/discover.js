// services/discover.js

function discoverResources(provider) {
  switch (provider) {
    case "AWS":
      return [
        { type: "EC2", id: "i-123456", region: "us-east-1" },
        { type: "S3", bucket: "my-app-data" },
        { type: "RDS", db: "cloud-cost-db" }
      ];

    case "Azure":
      return [
        { type: "VM", name: "vm-001", region: "eastus" },
        { type: "Blob Storage", container: "project-data" },
        { type: "SQL Database", db: "cloudcostsql" }
      ];

    case "GCP":
      return [
        { type: "Compute Engine", id: "gcp-vm-01", zone: "us-central1-a" },
        { type: "Cloud Storage", bucket: "gcp-storage" },
        { type: "Cloud SQL", instance: "sql-instance-1" }
      ];

    default:
      return [];
  }
}

module.exports = { discoverResources };
