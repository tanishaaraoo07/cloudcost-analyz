const express = require("express");
const router = express.Router();

const { compareCosts } = require("../services/compare");
const { mapServices } = require("../services/mapping"); // ✅ FIXED
const { discoverResources } = require("../services/discover");
const { generatePdfReport } = require("../services/pdfGenerator");
//const { compareCosts } = require("../controllers/cloudController");
router.post("/compare", compareCosts);

// ✅ POST /api/cloud/compare
router.post("/compare", async (req, res, next) => {
  try {
    const { resources } = req.body;
    console.log("📩 Incoming compare request body:", req.body);
    

    if (!Array.isArray(resources) || resources.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Request must contain a non-empty 'resources' array.",
      });
    }

    for (const r of resources) {
      if (!r.type || !r.provider) {
        return res.status(400).json({
          success: false,
          message: "Each resource must have 'type' and 'provider'.",
        });
      }
      if (typeof r.usage !== "number" || isNaN(r.usage) || r.usage <= 0) {
        return res.status(400).json({
          success: false,
          message: "'usage' must be a positive number for all resources.",
        });
      }
    }

    const result = compareCosts(resources);
    res.json({ success: true, result });

  } catch (err) {
    next(err);
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