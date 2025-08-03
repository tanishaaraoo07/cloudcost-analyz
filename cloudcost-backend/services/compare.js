// services/compare.js

const costTable = {
  EC2: { AWS: 25, GCP: 20, Azure: 23 },
  S3: { AWS: 5, GCP: 4, Azure: 6 },
  RDS: { AWS: 15, GCP: 13, Azure: 16 },
};

function compareCosts(provider, resources) {
  const comparison = [];

  if (!Array.isArray(resources)) {
    console.warn("Invalid resources input. Must be an array.");
    return [];
  }

  for (const res of resources) {
    const { type } = res;

    if (!type || !costTable[type]) {
      console.warn(`Unknown or unsupported resource type: ${type}`);
      comparison.push({
        resourceType: type || "Unknown",
        provider,
        currentCost: 0,
        gcpCost: 0,
        estimatedSavings: 0,
        note: "Unsupported resource type",
      });
      continue;
    }

    const costs = costTable[type];
    const currentCost = costs[provider];

    if (currentCost === undefined) {
      console.warn(`No pricing found for ${type} on ${provider}`);
      comparison.push({
        resourceType: type,
        provider,
        currentCost: 0,
        gcpCost: costs["GCP"] || 0,
        estimatedSavings: 0,
        note: "Pricing not available for this provider",
      });
      continue;
    }

    const gcpCost = costs["GCP"] || 0;
    const estimatedSavings = currentCost - gcpCost;

    comparison.push({
      resourceType: type,
      provider,
      currentCost,
      gcpCost,
      estimatedSavings,
    });
  }

  return comparison;
}

module.exports = { compareCosts };
