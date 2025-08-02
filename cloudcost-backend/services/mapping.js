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
  const providerMap = mappingTable[provider];

  if (!providerMap) return [];

  return services.map(service => ({
    originalService: service,
    gcpEquivalent: providerMap[service] || "Not Found",
  }));
}

module.exports = { mapServices };
