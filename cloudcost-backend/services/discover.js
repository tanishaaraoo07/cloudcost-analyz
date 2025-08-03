function discoverResources(provider, useMock = false) {
  if (!provider || typeof provider !== "string") {
    return [{ error: "Invalid provider" }];
  }

  const p = provider.trim().toUpperCase();
  console.log(`[Discover] Called for ${p} | Mock: ${useMock}`);

  if (!useMock) {
    return [{ error: "🔐 Real cloud discovery is not implemented. Use mock mode." }];
  }

  switch (p) {
    case "AWS":
      return [
        { type: "EC2", id: "i-123456", region: "us-east-1" },
        { type: "S3", bucket: "my-app-data" },
        { type: "RDS", db: "cloud-cost-db" }
      ];
    case "AZURE":
      return [
        { type: "VM", name: "vm-001", region: "eastus" },
        { type: "Blob Storage", container: "project-data" },
        { type: "SQL Database", db: "cloudcostsql" }
      ];
    default:
      return [{ error: `❌ Provider "${provider}" not supported.` }];
  }
}

module.exports = { discoverResources };
