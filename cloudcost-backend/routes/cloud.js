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
router.post("/mapping", (req, res) => {
  const { provider, services } = req.body;

  if (!provider || !services || !Array.isArray(services)) {
    return res.status(400).json({ error: "Missing or invalid provider/services" });
  }

  try {
    const mapped = mapServices(provider, services);
    res.json({ mapped });
  } catch (err) {
    console.error("❌ Mapping error:", err.message);
    res.status(500).json({ error: "Mapping failed" });
  }
});

// POST /api/cloud/discover
const { discoverResources } = require("../services/discover");

router.post("/discover", (req, res) => {
  const { provider, use_mock = true } = req.body;

  if (!provider) {
    return res.status(400).json({ error: "Provider is required" });
  }

  try {
    const discovered = discoverResources(provider, use_mock);
    res.json({ discovered });
  } catch (err) {
    console.error("❌ Discover error:", err.message);
    res.status(500).json({ error: "Discovery failed" });
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

    res.send(pdfBuffer);
  } catch (err) {
    console.error("❌ PDF error:", err.message);
    res.status(500).json({ error: "Failed to generate PDF" });
  }
});

