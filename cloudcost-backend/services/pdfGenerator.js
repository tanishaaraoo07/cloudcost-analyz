// services/pdfgenerator.js

const PDFDocument = require("pdfkit");
const getStream = require("get-stream");

/**
 * Generates a PDF report for Cloud Cost Analyzer
 * @param {Object} data
 * @param {Array} data.discovered - Discovered resources list
 * @param {Array} data.mapped - Mapped service list
 * @param {Array} data.comparison - Cost comparison list
 * @returns {Buffer} PDF buffer
 */
async function generatePdfReport({ discovered = [], mapped = [], comparison = [] }) {
  const doc = new PDFDocument({ margin: 50 });

  const buffers = [];
  doc.on("data", buffers.push.bind(buffers));
  doc.on("end", () => {});

  // Title
  doc.font("Helvetica-Bold").fontSize(20).fillColor("#333333")
    .text("Cloud Cost Analyzer Report", { align: "center" });
  doc.moveDown(2);

  // Section: Discovered Resources
  if (discovered.length > 0) {
    doc.font("Helvetica-Bold").fontSize(14).fillColor("#000000").text("1. Discovered Resources");
    doc.moveDown(0.5);
    discovered.forEach((res, idx) => {
      doc.font("Helvetica").fontSize(11).fillColor("#444444")
        .text(`${idx + 1}. ${JSON.stringify(res)}`, { indent: 20 });
    });
    doc.moveDown(1.5);
  }

  // Section: Service Mappings
  if (mapped.length > 0) {
    doc.font("Helvetica-Bold").fontSize(14).fillColor("#000000").text("2. GCP Service Mappings");
    doc.moveDown(0.5);
    mapped.forEach((m, idx) => {
      doc.font("Helvetica").fontSize(11).fillColor("#444444")
        .text(`${idx + 1}. ${m.originalService} → ${m.gcpEquivalent}`, { indent: 20 });
    });
    doc.moveDown(1.5);
  }

  // Section: Cost Comparison
  if (comparison.length > 0) {
    doc.font("Helvetica-Bold").fontSize(14).fillColor("#000000").text("3. Cost Comparison");
    doc.moveDown(0.5);
    comparison.forEach((item, idx) => {
      doc.font("Helvetica").fontSize(11).fillColor("#444444")
        .text(
          `${idx + 1}. ${item.resourceType} (${item.provider}) - $${item.currentCost} → GCP: $${item.gcpCost} | Savings: $${item.estimatedSavings}`,
          { indent: 20 }
        );
    });
  }

  doc.end();
  return getStream.buffer(doc);
}

module.exports = { generatePdfReport };
