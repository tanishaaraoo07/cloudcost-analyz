// services/pdfGenerator.js
const PDFDocument = require("pdfkit");
const getStream = require("get-stream");

/**
 * Generates a PDF report for Cloud Cost Analyzer
 * @param {Object} data
 * @param {Array} data.discovered - Discovered resources list
 * @param {Array} data.mapped - Mapped service list
 * @param {Array} data.comparison - Cost comparison list
 * @param {String} data.chartImageBase64 - Base64 chart image
 * @returns {Buffer} PDF buffer
 */
async function generatePdfReport({ discovered = [], mapped = [], comparison = [], chartImageBase64 = null }) {
  const doc = new PDFDocument({ margin: 40 });

  const buffers = [];
  doc.on("data", buffers.push.bind(buffers));
  doc.on("end", () => {});

  // ===== TITLE =====
  doc.font("Helvetica-Bold").fontSize(22).fillColor("#2E4053")
    .text("📄 Cloud Cost Analyzer Report", { align: "center" });
  doc.moveDown(2);

  // ===== SECTION 1: Discovered Resources =====
  if (discovered.length > 0) {
    doc.font("Helvetica-Bold").fontSize(16).fillColor("#000000").text("1️⃣ Discovered Resources");
    doc.moveDown(0.5);

    // Table headers
    doc.font("Helvetica-Bold").fontSize(12);
    doc.text("Type", 50, doc.y, { continued: true });
    doc.text("Details", 150);
    doc.moveDown(0.2);
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();

    // Table rows
    doc.font("Helvetica").fontSize(11).fillColor("#444444");
    discovered.forEach((res) => {
      doc.text(res.type || "-", 50, doc.y, { continued: true });
      doc.text(JSON.stringify(res), 150);
    });
    doc.moveDown(1.5);
  }

  // ===== SECTION 2: Service Mappings =====
  if (mapped.length > 0) {
    doc.font("Helvetica-Bold").fontSize(16).fillColor("#000000").text("2️⃣ GCP Service Mappings");
    doc.moveDown(0.5);

    doc.font("Helvetica-Bold").fontSize(12);
    doc.text("Source Service", 50, doc.y, { continued: true });
    doc.text("GCP Equivalent", 200);
    doc.moveDown(0.2);
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();

    doc.font("Helvetica").fontSize(11).fillColor("#444444");
    mapped.forEach((m) => {
      doc.text(m.originalService || "-", 50, doc.y, { continued: true });
      doc.text(m.gcpEquivalent || "-", 200);
    });
    doc.moveDown(1.5);
  }

  // ===== SECTION 3: Cost Comparison =====
  if (comparison.length > 0) {
    doc.font("Helvetica-Bold").fontSize(16).fillColor("#000000").text("3️⃣ Cost Comparison");
    doc.moveDown(0.5);

    doc.font("Helvetica-Bold").fontSize(12);
    doc.text("Resource", 50, doc.y, { continued: true });
    doc.text("Provider", 200, { continued: true });
    doc.text("Current ($)", 300, { continued: true });
    doc.text("GCP ($)", 380, { continued: true });
    doc.text("Savings ($)", 460);
    doc.moveDown(0.2);
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();

    doc.font("Helvetica").fontSize(11).fillColor("#444444");
    comparison.forEach((item) => {
      doc.text(item.resourceType || "-", 50, doc.y, { continued: true });
      doc.text(item.provider || "-", 200, { continued: true });
      doc.text(item.currentCost?.toFixed(2) || "0", 300, { continued: true });
      doc.text(item.gcpCost?.toFixed(2) || "0", 380, { continued: true });
      doc.text(item.estimatedSavings?.toFixed(2) || "0", 460);
    });
    doc.moveDown(1.5);
  }

  // ===== SECTION 4: Chart =====
  if (chartImageBase64) {
    try {
      const chartBuffer = Buffer.from(chartImageBase64, "base64");
      doc.addPage();
      doc.font("Helvetica-Bold").fontSize(16).fillColor("#000000").text("📉 Cost Comparison Chart", { align: "center" });
      doc.moveDown(1);
      doc.image(chartBuffer, { fit: [500, 300], align: "center", valign: "center" });
    } catch (error) {
      console.error("⚠️ Failed to embed chart:", error.message);
    }
  }

  // ===== FOOTER =====
  doc.moveDown(2);
  doc.font("Helvetica-Oblique").fontSize(10).fillColor("#888888")
    .text(`Generated on: ${new Date().toLocaleString()}`, { align: "right" });

  doc.end();
  return getStream.buffer(doc);
}

module.exports = { generatePdfReport };
