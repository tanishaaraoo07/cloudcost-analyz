// services/mapping.js - CommonJS format
function mapServices(provider, resources) {
  const mappings = {
    AWS: {
      EC2: "Virtual Machines",
      S3: "Storage",
      RDS: "Databases"
    },
    Azure: {
      VM: "Virtual Machines",
      Blob: "Storage",
      SQL: "Databases"
    }
  };

  // Always return format the frontend expects
  return resources.map((resource) => {
    const type =
      typeof resource === "string"
        ? resource
        : resource.type || resource.service || resource.name || "Unknown";

    return {
      originalService: type,
      gcpEquivalent: mappings[provider]?.[type] || "Unmapped Service"
    };
  });
}

module.exports = { mapServices };
