const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const { compareCosts } = require("../services/compare");
const { mapServices } = require("../services/mapping");
const { discoverResources } = require("../services/discover");
const { generatePdfReport } = require("../services/pdfGenerator");

// POST /api/cloud/compare
router.post("/compare", async (req, res) => {
  try {
    const { provider, resources } = req.body;

    if (!provider || !resources || !Array.isArray(resources)) {
      return res.status(400).json({ error: "Missing or invalid provider/resources" });
    }

    const result = await compareCosts(provider, resources);
    console.log("[/compare] Comparison Result:", result);

    return res.status(200).json({ result });
  } catch (err) {
    console.error("Error in /compare:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// POST /api/cloud/mapping
router.post("/mapping", async (req, res) => {
  try {
    const { provider, services } = req.body;

    if (!provider || !services || !Array.isArray(services)) {
      return res.status(400).json({ error: "Missing or invalid provider/services" });
    }

    const mapped = await mapServices(provider, services);
    console.log("[/mapping] Mapped Services:", mapped);

    return res.status(200).json({ mapped });
  } catch (err) {
    console.error("Error in /mapping:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// POST /api/cloud/discover
router.post("/discover", async (req, res) => {
  try {
    const { provider } = req.body;

    if (!provider) {
      return res.status(400).json({ error: "Provider is required" });
    }

const discovered = discoverResources(provider, req.body.use_mock || false);
    console.log("[/discover] Discovered Resources:", discovered);

    return res.status(200).json({ discovered });
  } catch (err) {
    console.error("Error in /discover:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// POST /api/cloud/report
router.post("/report", async (req, res) => {
  const { discovered, mapped, comparison } = req.body;

  if (!discovered || !mapped || !comparison) {
    return res.status(400).json({ error: "Missing data for PDF report" });
  }

  try {
    const pdfBuffer = await generatePdfReport({ discovered, mapped, comparison });
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=CloudCost-Report.pdf",
      "Content-Length": pdfBuffer.length,
    });
    return res.send(pdfBuffer);
  } catch (err) {
    console.error("❌ PDF Generation Error:", err);
    res.status(500).json({ error: "Failed to generate PDF" });
  }
});

module.exports = router;
