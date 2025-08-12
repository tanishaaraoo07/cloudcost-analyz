// services/pdfGenerator.js
const PDFDocument = require("pdfkit");
const getStream = require("get-stream");

/**
 * Generates a PDF report for Cloud Cost Analyzer
 * @param {Object} data
 * @param {Array} data.discovered - Discovered resources list
 * @param {Array} data.mapped - Mapped service list
 * @param {Array} data.comparison - Cost comparison list
 * @param {String} data.chartImageBase64 - Base64 string of chart image
 * @returns {Buffer} PDF buffer
 */
async function generatePdfReport({
  discovered = [],
  mapped = [],
  comparison = [],
  chartImageBase64 = null
}) {
  const doc = new PDFDocument({ margin: 50 });

  const buffers = [];
  doc.on("data", buffers.push.bind(buffers));
  doc.on("end", () => {});

  // Title
  doc
    .font("Helvetica-Bold")
    .fontSize(20)
    .fillColor("#333333")
    .text("Cloud Cost Analyzer Report", { align: "center" });
  doc.moveDown(1);

  // Add chart if exists
  if (chartImageBase64) {
    try {
      const chartBuffer = Buffer.from(chartImageBase64, "base64");
      doc.image(chartBuffer, {
        fit: [500, 300],
        align: "center",
        valign: "center",
      });
      doc.moveDown(1.5);
    } catch (err) {
      console.error("Chart image embedding failed:", err);
    }
  }

  // Section: Discovered Resources
  if (discovered.length > 0) {
    doc
      .font("Helvetica-Bold")
      .fontSize(14)
      .fillColor("#000000")
      .text("1. Discovered Resources");
    doc.moveDown(0.5);

    discovered.forEach((res, idx) => {
      doc
        .font("Helvetica")
        .fontSize(11)
        .fillColor("#444444")
        .text(`${idx + 1}. ${JSON.stringify(res)}`, { indent: 20 });
    });
    doc.moveDown(1.5);
  }

  // Section: Service Mappings
  if (mapped.length > 0) {
    doc
      .font("Helvetica-Bold")
      .fontSize(14)
      .fillColor("#000000")
      .text("2. GCP Service Mappings");
    doc.moveDown(0.5);

    mapped.forEach((m, idx) => {
      const original = m.originalService || "Unknown";
      const target = m.gcpEquivalent || "Unknown";

      doc
        .font("Helvetica")
        .fontSize(11)
        .fillColor("#444444")
        .text(`${idx + 1}. ${original} → ${target}`, { indent: 20 });
    });
    doc.moveDown(1.5);
  }

  // Section: Cost Comparison
  if (comparison.length > 0) {
    doc
      .font("Helvetica-Bold")
      .fontSize(14)
      .fillColor("#000000")
      .text("3. Cost Comparison");
    doc.moveDown(0.5);

    comparison.forEach((item, idx) => {
      const currentCost = parseFloat(item.currentCost) || 0;
      const gcpCost = parseFloat(item.gcpCost) || 0;
      const savings = currentCost - gcpCost;

      doc
        .font("Helvetica")
        .fontSize(11)
        .fillColor("#444444")
        .text(
          `${idx + 1}. ${item.resourceType || "Unknown"} (${item.provider || "N/A"}) - $${currentCost.toFixed(2)} → GCP: $${gcpCost.toFixed(2)} | Savings: $${savings.toFixed(2)}`,
          { indent: 20 }
        );
    });
  }

  doc.end();
  return getStream.buffer(doc);
}

module.exports = { generatePdfReport };
