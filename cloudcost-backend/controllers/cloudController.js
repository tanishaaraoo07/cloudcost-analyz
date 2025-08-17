// controllers/cloudController.js

const compareCosts = async (req, res) => {
  try {
    const { resources } = req.body;

    if (!resources || !Array.isArray(resources)) {
      return res.status(400).json({ success: false, error: "Invalid resources input" });
    }

    // 🔹 Mock calculation (replace with real SDK logic later)
    const result = resources.map((r) => ({
      resource: r,
      AWS: "$100",
      Azure: "$120",
      GCP: "$90"
    }));

    res.json({ success: true, data: result });
  } catch (error) {
    console.error("Error in compareCosts:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { compareCosts };
