// compareCosts.js
async function compareCosts(provider, resources) {
    // ✅ Validate inputs
    if (!provider || !Array.isArray(resources) || resources.length === 0) {
        return {
            error: "Missing or invalid provider/resources",
            awsCosts: [],
            azureCosts: [],
            comparisonSummary: "No resources to compare."
        };
    }

    const awsCosts = [];
    const azureCosts = [];

    for (const resource of resources) {
        const { type, instanceType, region, engine, storageGB } = resource;

        let awsCost = 0;
        let azureCost = 0;

        switch (type.toLowerCase()) {
            case "ec2":
                awsCost = 8;   // Example EC2 cost
                azureCost = 9; // Example Azure VM cost
                break;

            case "vm": // Azure VM (when discovered directly)
                awsCost = 8;
                azureCost = 9;
                break;

            case "rds":
                awsCost = 15; // Example AWS RDS cost
                azureCost = 16; // Example Azure SQL cost
                break;

            case "sql": // Azure SQL standalone
                awsCost = 15;
                azureCost = 16;
                break;

            case "s3":
                awsCost = (storageGB || 50) * 0.023;
                azureCost = (storageGB || 50) * 0.02;
                break;

            case "blob": // Azure Blob Storage
                awsCost = (storageGB || 50) * 0.023;
                azureCost = (storageGB || 50) * 0.02;
                break;

            default:
                awsCost = 10;
                azureCost = 10;
                break;
        }

        awsCosts.push({ type, cost: awsCost });
        azureCosts.push({ type, cost: azureCost });
    }

    // 📊 Calculate totals
    const awsTotal = awsCosts.reduce((sum, r) => sum + r.cost, 0);
    const azureTotal = azureCosts.reduce((sum, r) => sum + r.cost, 0);

    // 📝 Summary
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
