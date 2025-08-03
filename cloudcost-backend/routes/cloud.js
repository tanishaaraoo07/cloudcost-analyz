const express = require("express");
const router = express.Router();

// ✅ Service imports
const { compareCosts } = require("../services/compare");
const { mapServices } = require("../services/mapping");
const { discoverResources } = require("../services/discover");
const { generatePdfReport } = require("../services/pdfGenerator");

// ✅ POST /api/cloud/compare
router.post("/compare", async (req, res) => {
  try {
    const { provider, resources } = req.body;

    if (!provider || !Array.isArray(resources)) {
      return res.status(400).json({ error: "Missing or invalid provider/resources" });
    }

    const result = await compareCosts(provider, resources);
    console.log("[/compare] Comparison Result:", result);

    return res.status(200).json({ result });
  } catch (err) {
    console.error("❌ Error in /compare:", err.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ POST /api/cloud/mapping
router.post("/mapping", (req, res) => {
  try {
    const { provider, services } = req.body;

    if (!provider || !Array.isArray(services)) {
      return res.status(400).json({ error: "Missing or invalid provider/services" });
    }

    const mapped = mapServices(provider, services);
    res.json({ mapped });
  } catch (err) {
    console.error("❌ Mapping error:", err.message);
    res.status(500).json({ error: "Mapping failed" });
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
    const { discovered, mapped, comparison } = req.body;

    if (!discovered || !mapped || !comparison) {
      return res.status(400).json({ error: "Missing data for PDF report" });
    }

    const pdfBuffer = await generatePdfReport({ discovered, mapped, comparison });

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=CloudCost-Report.pdf",
      "Content-Length": pdfBuffer.length,
    });

    res.send(pdfBuffer);
  } catch (err) {
    console.error("❌ PDF error:", err.message);
    res.status(500).json({ error: "Failed to generate PDF" });
  }
});

module.exports = router;
