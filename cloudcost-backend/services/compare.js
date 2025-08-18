// services/compare.js
// services/compare.js

async function compareCosts(req, res) {
  try {
    const { resources } = req.body;

    if (!resources || resources.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No resources provided",
      });
    }

    // Example dummy cost calculation
    const result = resources.map((r) => ({
      provider: r.provider,
      type: r.type,
      cost: Math.floor(Math.random() * 100) + 1,
    }));

    res.json({ success: true, result });
  } catch (err) {
    console.error("Compare error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

//module.exports = { compareCosts };


// Example static pricing table (replace with real SDK calls later)
// Update the pricing table to ensure consistent service names
const pricingTable = {
  AWS: { 
    'EC2': 0.12,
    'VM': 0.12,           // Added VM alias
    'S3': 0.02,
    'BLOB': 0.02,         // Added BLOB alias
    'RDS': 0.25,
    'SQL': 0.25,          // Added SQL alias
    'Compute': 0.12,
    'Storage': 0.02,
    'Database': 0.25
  },
  Azure: { 
    'VM': 0.11,           // Simplified from Virtual Machine
    'BLOB': 0.025,        // Simplified from Blob Storage
    'SQL': 0.24,          // Simplified from SQL Database
    'Virtual Machine': 0.11,
    'Blob Storage': 0.025,
    'SQL Database': 0.24,
    'Compute': 0.11,
    'Storage': 0.025,
    'Database': 0.24
  },
  GCP: { 
    'VM': 0.10,           // Added VM alias
    'BLOB': 0.018,        // Added BLOB alias
    'SQL': 0.23,          // Added SQL alias
    'Compute Engine': 0.10,
    'Cloud Storage': 0.018,
    'Cloud SQL': 0.23,
    'Compute': 0.10,
    'Storage': 0.018,
    'Database': 0.23
  }
};

async function compareCosts(resources) {
  return resources.map(r => {
    // Normalize the service type name
    const serviceType = r.type.toUpperCase();
    
    // Get costs using both specific and generic names
    const currentRate = pricingTable[r.provider]?.[serviceType] || 
                       pricingTable[r.provider]?.[getGenericType(serviceType)] || 0;
    
    const awsRate = pricingTable.AWS?.[serviceType] || 
                    pricingTable.AWS?.[getGenericType(serviceType)] || 0;
    
    const azureRate = pricingTable.Azure?.[serviceType] || 
                      pricingTable.Azure?.[getGenericType(serviceType)] || 0;
    
    const gcpRate = pricingTable.GCP?.[serviceType] || 
                    pricingTable.GCP?.[getGenericType(serviceType)] || 0;

    // Calculate costs
    const currentCost = Number((currentRate * r.usage).toFixed(2));
    const awsCost = Number((awsRate * r.usage).toFixed(2));
    const azureCost = Number((azureRate * r.usage).toFixed(2));
    const gcpCost = Number((gcpRate * r.usage).toFixed(2));

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

// Helper function to get generic type
function getGenericType(serviceType) {
  const mappings = {
    'EC2': 'Compute',
    'VM': 'Compute',
    'S3': 'Storage',
    'BLOB': 'Storage',
    'RDS': 'Database',
    'SQL': 'Database',
    'VIRTUAL MACHINE': 'Compute',
    'BLOB STORAGE': 'Storage',
    'SQL DATABASE': 'Database',
    'COMPUTE ENGINE': 'Compute',
    'CLOUD STORAGE': 'Storage',
    'CLOUD SQL': 'Database'
  };
  return mappings[serviceType] || serviceType;
}


module.exports = { compareCosts };

// ...existing code...




// ...existing code...