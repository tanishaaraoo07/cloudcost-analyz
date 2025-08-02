// services/compare.js

const costTable = {
  EC2: { AWS: 25, GCP: 20, Azure: 23 },
  S3: { AWS: 5, GCP: 4, Azure: 6 },
  RDS: { AWS: 15, GCP: 13, Azure: 16 },
};

function compareCosts(provider, resources) {
  let comparison = [];

  for (let res of resources) {
    const { type } = res;
    const costs = costTable[type];

    if (costs) {
      const currentCost = costs[provider];
      const gcpCost = costs["GCP"];
      const savings = currentCost - gcpCost;

      comparison.push({
        resourceType: type,
        provider,
        currentCost,
        gcpCost,
        estimatedSavings: savings,
      });
    }
  }

  return comparison;
}

module.exports = { compareCosts };
