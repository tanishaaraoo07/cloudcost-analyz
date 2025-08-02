// services/pdfGenerator.js
const PDFDocument = require("pdfkit");
const fs = require("fs");

function generatePdfReport({ discovered, mapped, comparison }, outputPath = "report.pdf") {
  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(outputPath));

  doc.fontSize(18).text("☁️ Cloud Cost Analyzer Report", { align: "center" });
  doc.moveDown();

  // Section 1: Discovered Resources
  doc.fontSize(14).text("🔍 Discovered Resources:");
  discovered.forEach((res, index) => {
    doc.fontSize(12).text(`${index + 1}. ${JSON.stringify(res)}`);
  });
  doc.moveDown();

  // Section 2: GCP Mappings
  doc.fontSize(14).text("🔄 GCP Equivalent Services:");
  mapped.forEach((item, index) => {
    doc.fontSize(12).text(`${index + 1}. ${item.originalService} → ${item.gcpEquivalent}`);
  });
  doc.moveDown();

  // Section 3: Cost Comparison
  doc.fontSize(14).text("💰 Cost Comparison:");
  comparison.forEach((item, index) => {
    doc.fontSize(12).text(`${index + 1}. ${item.resourceType} | ${item.provider}: $${item.currentCost} → GCP: $${item.gcpCost} | Savings: $${item.estimatedSavings}`);
  });

  doc.end();
}

module.exports = { generatePdfReport };
