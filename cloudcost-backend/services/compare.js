async function compareCosts(provider, resources) {
  if (!provider || !Array.isArray(resources) || resources.length === 0) {
    return {
      error: "Missing or invalid provider/resources",
      awsCosts: [],
      azureCosts: [],
      comparisonSummary: "No resources to compare."
    };
  }

  // Pricing table (per month)
  const priceCatalog = {
    AWS: {
      EC2: { unit: "hour", price: 0.1 },
      S3: { unit: "gb_month", price: 0.023 },
      RDS: { unit: "hour", price: 0.25 },
    },
    Azure: {
      VM: { unit: "hour", price: 0.09 },
      Blob: { unit: "gb_month", price: 0.02 },
      SQL: { unit: "hour", price: 0.22 },
    }
  };

  function calcCost(unit, price, usage) {
    if (unit === "hour") return +(price * 730 * usage).toFixed(2);
    if (unit === "gb_month") return +(price * usage).toFixed(2);
    return 0;
  }

  const awsCosts = [];
  const azureCosts = [];

  for (const resource of resources) {
    const type = (resource.type || "").trim();
    const usage = resource.usage || resource.storageGB || 1;

    let awsCost = 0;
    let azureCost = 0;

    if (priceCatalog.AWS[type]) {
      awsCost = calcCost(priceCatalog.AWS[type].unit, priceCatalog.AWS[type].price, usage);
    }
    if (priceCatalog.Azure[type]) {
      azureCost = calcCost(priceCatalog.Azure[type].unit, priceCatalog.Azure[type].price, usage);
    }

    awsCosts.push({ type, cost: awsCost });
    azureCosts.push({ type, cost: azureCost });
  }

  const awsTotal = awsCosts.reduce((sum, r) => sum + r.cost, 0);
  const azureTotal = azureCosts.reduce((sum, r) => sum + r.cost, 0);

  let comparisonSummary;
  if (awsTotal < azureTotal) {
    comparisonSummary = `AWS is cheaper by $${(azureTotal - awsTotal).toFixed(2)} per month.`;
  } else if (azureTotal < awsTotal) {
    comparisonSummary = `Azure is cheaper by $${(awsTotal - azureTotal).toFixed(2)} per month.`;
  } else {
    comparisonSummary = "Both providers have the same estimated cost.";
  }

  return { awsCosts, azureCosts, comparisonSummary };
}

module.exports = compareCosts;
