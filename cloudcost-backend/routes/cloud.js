// routes/cloud.js
const express = require("express");
const router = express.Router();

const { compareCosts } = require("../services/compare");

// POST /api/cloud/compare
router.post("/compare", (req, res) => {
  const { provider, resources } = req.body;

  if (!provider || !resources) {
    return res.status(400).json({ error: "Missing provider or resources" });
  }

  const result = compareCosts(provider, resources);
  console.log("Comparison Result:", result);
  res.json({ result });
});

module.exports = router;

const { mapServices } = require("../services/mapping");

// POST /api/cloud/mapping
router.post("/mapping", (req, res) => {
  const { provider, services } = req.body;

  if (!provider || !services || !Array.isArray(services)) {
    return res.status(400).json({ error: "Missing or invalid provider/services" });
  }

  const mapped = mapServices(provider, services);
  res.json({ mapped });
});


const { discoverResources } = require("../services/discover");

// POST /api/cloud/discover
router.post("/discover", (req, res) => {
  const { provider } = req.body;

  if (!provider) {
    return res.status(400).json({ error: "Provider is required" });
  }

  const discovered = discoverResources(provider);
  res.json({ discovered });
});


const { generatePdfReport } = require("../services/pdfGenerator");
const fs = require("fs");

router.post("/report", (req, res) => {
  const { discovered, mapped, comparison } = req.body;

  if (!discovered || !mapped || !comparison) {
    return res.status(400).json({ error: "Missing data for PDF report" });
  }

  const filename = `CloudCost-Report-${Date.now()}.pdf`;
  const outputPath = `./reports/${filename}`;

  // Ensure reports folder exists
  if (!fs.existsSync("reports")) fs.mkdirSync("reports");

  generatePdfReport({ discovered, mapped, comparison }, outputPath);

  setTimeout(() => {
    res.download(outputPath);
  }, 1000); // short delay to allow file write
});
