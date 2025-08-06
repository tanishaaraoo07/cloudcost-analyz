// services/mapping.js

const mappingTable = {
  AWS: {
    EC2: "Compute Engine",
    S3: "Cloud Storage",
    RDS: "Cloud SQL",
  },
  Azure: {
    VM: "Compute Engine",
    "Blob Storage": "Cloud Storage",
    "SQL Database": "Cloud SQL",
  },
};

function mapServices(provider, services) {
  if (!mappingTable[provider]) {
    console.warn(`[Mapping] Unsupported provider: ${provider}`);
    return [];
  }

  if (!Array.isArray(services)) {
    console.warn("[Mapping] Services should be an array.");
    return [];
  }

  const providerMap = mappingTable[provider];

  return services.map((service) => {
    const gcpEquivalent = providerMap[service] || "Not Found";
    if (gcpEquivalent === "Not Found") {
      console.warn(`[Mapping] No GCP equivalent found for ${service} from ${provider}`);
    }

    return {
      originalService: service,
      gcpEquivalent,
    };
  });
}

// ✅ Export properly
module.exports = { mapServices };
