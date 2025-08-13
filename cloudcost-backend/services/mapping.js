// services/mapping.js - CommonJS format
function mapServices(provider, resources) {
  const mappings = {
    AWS: {
      EC2: { category: "Compute", gcpEquivalent: "Compute Engine", description: "Virtual machines in the cloud", pricing: "https://aws.amazon.com/ec2/pricing/" },
      S3: { category: "Storage", gcpEquivalent: "Cloud Storage", description: "Object storage service", pricing: "https://aws.amazon.com/s3/pricing/" },
      RDS: { category: "Databases", gcpEquivalent: "Cloud SQL", description: "Managed relational databases", pricing: "https://aws.amazon.com/rds/pricing/" }
    },
    Azure: {
      VM: { category: "Compute", gcpEquivalent: "Compute Engine", description: "Scalable virtual machines", pricing: "https://azure.microsoft.com/en-us/pricing/details/virtual-machines/" },
      Blob: { category: "Storage", gcpEquivalent: "Cloud Storage", description: "Object storage service", pricing: "https://azure.microsoft.com/en-us/pricing/details/storage/blobs/" },
      SQL: { category: "Databases", gcpEquivalent: "Cloud SQL", description: "Managed relational databases", pricing: "https://azure.microsoft.com/en-us/pricing/details/sql-database/" }
    },
    GCP: {
      "Compute Engine": { category: "Compute", gcpEquivalent: "Compute Engine", description: "Virtual machines in Google Cloud", pricing: "https://cloud.google.com/compute/pricing" },
      "Cloud Storage": { category: "Storage", gcpEquivalent: "Cloud Storage", description: "Object storage service", pricing: "https://cloud.google.com/storage/pricing" },
      "Cloud SQL": { category: "Databases", gcpEquivalent: "Cloud SQL", description: "Managed relational databases", pricing: "https://cloud.google.com/sql/pricing" }
    }
    // 🔹 You can keep extending for Oracle, IBM, DigitalOcean, etc.
  };

  const normalizedProvider = provider.trim();
  
  return resources.map((resource) => {
    const type =
      typeof resource === "string"
        ? resource.trim()
        : resource.type || resource.service || resource.name || "Unknown";

    const mapping = mappings[normalizedProvider]?.[type] || null;

    return mapping
      ? {
          originalService: type,
          category: mapping.category,
          gcpEquivalent: mapping.gcpEquivalent,
          description: mapping.description,
          pricingURL: mapping.pricing
        }
      : {
          originalService: type,
          category: "Unknown",
          gcpEquivalent: "Unmapped Service",
          description: "No equivalent found",
          pricingURL: null
        };
  });
}

module.exports = { mapServices };
