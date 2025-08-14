// Static cost data for AWS, Azure, GCP
const costTable = {
  AWS: {
    EC2: 0.12,
    S3: 0.023,
    RDS: 0.25,
    VM: 0.15,      // Approx AWS EC2-like
    Blob: 0.025,   // AWS S3-like
    SQL: 0.20,     // AWS RDS-like
  },
  Azure: {
    EC2: 0.11,     // Azure VM equivalent
    S3: 0.024,     // Azure Blob equivalent
    RDS: 0.22,     // Azure SQL Database
    VM: 0.14,
    Blob: 0.024,
    SQL: 0.18,
  },
  GCP: {
    EC2: 0.10,     // GCP Compute Engine
    S3: 0.020,     // GCP Cloud Storage
    RDS: 0.21,     // GCP Cloud SQL
    VM: 0.13,
    Blob: 0.022,
    SQL: 0.17,
  },
};

/**
 * Compare costs across providers.
 * @param {Array} resources - Array of { type, usage, provider }
 * @returns {Array} Comparison results
 */
module.exports = async function compareCosts(resources) {
  return resources.map((res) => {
    const type = res.type;
    const usage = Number(res.usage) || 1;
    const provider = res.provider;

    if (!costTable[provider] || !costTable[provider][type]) {
      throw new Error(`Invalid resource type/provider: ${type} - ${provider}`);
    }

    const currentCost = costTable[provider][type] * usage;
    const gcpCost = costTable["GCP"][type] * usage;
    const awsCost = costTable["AWS"][type] * usage;
    const azureCost = costTable["Azure"][type] * usage;

    return {
      resourceType: type,
      currentCost: parseFloat(currentCost.toFixed(2)),
      gcpCost: parseFloat(gcpCost.toFixed(2)),
      awsCost: parseFloat(awsCost.toFixed(2)),
      azureCost: parseFloat(azureCost.toFixed(2)),
      estimatedSavings: parseFloat((currentCost - gcpCost).toFixed(2)),
    };
  });
};
