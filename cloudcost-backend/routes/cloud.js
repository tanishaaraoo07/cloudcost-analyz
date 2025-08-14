const express = require("express");
const router = express.Router();

const { compareCosts } = require("../services/compare");
const { mapServices } = require("../services/mapping"); // ✅ FIXED
const { discoverResources } = require("../services/discover");
const { generatePdfReport } = require("../services/pdfGenerator");

// ✅ POST /api/cloud/compare
router.post("/compare", async (req, res) => {
  try {
    console.log("📩 Incoming Compare Request Body:", JSON.stringify(req.body, null, 2));

    const { provider, resources } = req.body || {};

    if (!provider) {
      console.warn("⚠️ Missing provider field");
      return res.status(400).json({ error: "Provider is required" });
    }
    if (!Array.isArray(resources)) {
      console.warn("⚠️ Resources is not an array");
      return res.status(400).json({ error: "Resources should be an array" });
    }

    const result = await compareCosts(provider, resources);

    console.log(`✅ Comparison done for ${provider}`);
    return res.status(200).json(result);

  } catch (err) {
    console.error("❌ Error in /compare:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});


//module.exports = router;


// ✅ POST /api/cloud/mapping
router.post("/mapping", (req, res) => {
  try {
    console.log("📩 Incoming mapping request body:", req.body);

    let { provider, services } = req.body;

    if (!provider || !services) {
      return res.status(400).json({ error: "Missing provider or services" });
    }

    // Normalize and ensure array format
    if (typeof services === "string") {
      services = services
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }

    if (!Array.isArray(services) || services.length === 0) {
      return res.status(400).json({ error: "Invalid or empty services list" });
    }

    const mapped = mapServices(provider, services);

    res.json({
      provider,
      totalMapped: mapped.length,
      mapped
    });
  } catch (err) {
    console.error("❌ Mapping error:", err);
    res.status(500).json({ error: "Mapping failed", details: err.message });
  }
});





// ✅ POST /api/cloud/discover
router.post("/discover", (req, res) => {
  try {
    const { provider, use_mock = true } = req.body;
    if (!provider) {
      return res.status(400).json({ error: "Provider is required" });
    }
    const discovered = discoverResources(provider, use_mock);
    res.json({ discovered });
  } catch (err) {
    console.error("❌ Discover error:", err.message);
    res.status(500).json({ error: "Discovery failed" });
  }
});

// ✅ POST /api/cloud/report

router.post("/report", async (req, res) => {
  try {
    const { discovered, mapped, comparison, chartImageBase64 } = req.body;

    // Validate that arrays exist (avoid undefined errors)
    if (!Array.isArray(discovered) || !Array.isArray(mapped) || !Array.isArray(comparison)) {
      return res.status(400).json({ error: "Invalid data format. Expected arrays." });
    }

    // Generate PDF buffer
    const pdfBuffer = await generatePdfReport({
      discovered,
      mapped,
      comparison,
      chartImageBase64: chartImageBase64 || null
    });

    // Send as downloadable PDF
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=CloudCost-Report.pdf");
    res.send(pdfBuffer);
  } catch (error) {
    console.error("❌ PDF Generation Error:", error);
    res.status(500).json({ error: "Failed to generate PDF" });
  }
});

module.exports = router;