// services/pdfGenerator.js
const PDFDocument = require("pdfkit");
const getStream = require("get-stream");

async function generatePdfReport({
  discovered = [],
  mapped = [],
  comparison = [],
  chartImageBase64 = null
}) {
  const doc = new PDFDocument({ margin: 40 });
  const buffers = [];
  doc.on("data", buffers.push.bind(buffers));

  const safeArray = (arr) => (Array.isArray(arr) ? arr : []);

  discovered = safeArray(discovered);
  mapped = safeArray(mapped);
  comparison = safeArray(comparison);

  const safeValue = (val) =>
    val === null || val === undefined || Number.isNaN(val) ? "N/A" : val;

  // Title
  doc.font("Helvetica-Bold").fontSize(20).fillColor("#333")
    .text("Cloud Cost Analyzer Report", { align: "center" });
  doc.moveDown(1);

  // ===== 1. Discovered Resources Table =====
  doc.font("Helvetica-Bold").fontSize(14).fillColor("#000")
    .text("1. Discovered Resources", { underline: true });
  doc.moveDown(0.5);

  if (discovered.length > 0) {
    discovered.forEach((res, idx) => {
      doc.font("Helvetica").fontSize(11).fillColor("#444")
        .text(`${idx + 1}. ${JSON.stringify(res)}`);
    });
  } else {
    doc.font("Helvetica-Oblique").fontSize(11).fillColor("red")
      .text("No discovered resources available.");
  }
  doc.moveDown(1);

  // ===== 2. Service Mappings Table =====
  doc.font("Helvetica-Bold").fontSize(14).fillColor("#000")
    .text("2. Service Mappings", { underline: true });
  doc.moveDown(0.5);

  if (mapped.length > 0) {
    mapped.forEach((m, idx) => {
      doc.font("Helvetica").fontSize(11).fillColor("#444")
        .text(`${idx + 1}. ${safeValue(m.originalService)} → ${safeValue(m.gcpEquivalent)}`);
    });
  } else {
    doc.font("Helvetica-Oblique").fontSize(11).fillColor("red")
      .text("No service mappings available.");
  }
  doc.moveDown(1);

  // ===== 3. Cost Comparison Table =====
  doc.font("Helvetica-Bold").fontSize(14).fillColor("#000")
    .text("3. Cost Comparison", { underline: true });
  doc.moveDown(0.5);

  if (comparison.length > 0) {
    comparison.forEach((c, idx) => {
      doc.font("Helvetica").fontSize(11).fillColor("#444")
        .text(`${idx + 1}. ${safeValue(c.resourceType)} (${safeValue(c.provider)}) - Current: $${safeValue(c.currentCost)} | GCP: $${safeValue(c.gcpCost)} | Savings: $${safeValue(c.estimatedSavings)}`);
    });
  } else {
    doc.font("Helvetica-Oblique").fontSize(11).fillColor("red")
      .text("No cost comparison data available.");
  }
  doc.moveDown(1);

  // ===== 4. Bar Chart =====
  if (chartImageBase64 && typeof chartImageBase64 === "string" && chartImageBase64.length > 50) {
    try {
      const chartBuffer = Buffer.from(chartImageBase64, "base64");
      doc.font("Helvetica-Bold").fontSize(14).fillColor("#000")
        .text("4. Cost Comparison Chart", { underline: true });
      doc.moveDown(0.5);
      doc.image(chartBuffer, { fit: [500, 300], align: "center" });
    } catch (err) {
      doc.font("Helvetica-Oblique").fontSize(11).fillColor("red")
        .text("Failed to load chart image.");
    }
  } else {
    doc.font("Helvetica-Oblique").fontSize(11).fillColor("red")
      .text("Chart not available.");
  }

  doc.end();
  return getStream.buffer(doc);
}

module.exports = { generatePdfReport };
