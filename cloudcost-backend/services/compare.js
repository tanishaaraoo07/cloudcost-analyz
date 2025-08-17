// services/compare.js

// Example static pricing table (replace with real SDK calls later)
const pricingTable = {
  AWS:   { VM: 0.12, Blob: 0.02,  DB: 0.25 },
  Azure: { VM: 0.11, Blob: 0.025, DB: 0.24 },
  GCP:   { VM: 0.10, Blob: 0.018, DB: 0.23 }
};

/**
 * Compare costs across providers
 * @param {Array} resources - [{ provider, type, usage }]
 * @returns {Array} comparison results
 */
function compareCosts(resources) {
  return resources.map(r => {
    const currentRate = pricingTable[r.provider]?.[r.type] || 0;
    const awsRate     = pricingTable.AWS?.[r.type]   || 0;
    const azureRate   = pricingTable.Azure?.[r.type] || 0;
    const gcpRate     = pricingTable.GCP?.[r.type]   || 0;

    const currentCost = Number((currentRate * r.usage).toFixed(2));
    const awsCost     = Number((awsRate   * r.usage).toFixed(2));
    const azureCost   = Number((azureRate * r.usage).toFixed(2));
    const gcpCost     = Number((gcpRate   * r.usage).toFixed(2));

    const cheapest = Math.min(awsCost, azureCost, gcpCost);
    const estimatedSavings = Number((currentCost - cheapest).toFixed(2));

    return {
      resourceType: r.type,
      currentProvider: r.provider,
      currentCost,
      awsCost,
      azureCost,
      gcpCost,
      estimatedSavings
    };
  });
}

module.exports = { compareCosts };
