const PDFDocument = require("pdfkit");
const getStream = require("get-stream");

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
  doc.font("Helvetica-Bold").fontSize(20).fillColor("#333333")
    .text("Cloud Cost Analyzer Report", { align: "center" });
  doc.moveDown(1.5);

  // ===== 1. Discovered Resources Table =====
  if (discovered.length > 0) {
    doc.font("Helvetica-Bold").fontSize(14).text("1. Discovered Resources");
    doc.moveDown(0.5);

    doc.font("Helvetica-Bold").fontSize(11);
    doc.text("No.", 50, doc.y, { continued: true });
    doc.text("Details", 80);
    doc.moveDown(0.2);

    doc.font("Helvetica").fontSize(10);
    discovered.forEach((res, idx) => {
      doc.text(idx + 1, 50, doc.y, { continued: true });
      doc.text(JSON.stringify(res), 80);
    });
    doc.moveDown(1.5);
  }

  // ===== 2. Service Mapping Table =====
  if (mapped.length > 0) {
    doc.font("Helvetica-Bold").fontSize(14).text("2. Service Mappings");
    doc.moveDown(0.5);

    doc.font("Helvetica-Bold").fontSize(11);
    doc.text("No.", 50, doc.y, { continued: true });
    doc.text("Original Service", 80, { continued: true });
    doc.text("→", 250, { continued: true });
    doc.text("GCP Equivalent", 270);
    doc.moveDown(0.2);

    doc.font("Helvetica").fontSize(10);
    mapped.forEach((m, idx) => {
      doc.text(idx + 1, 50, doc.y, { continued: true });
      doc.text(m.originalService || "Unknown", 80, { continued: true });
      doc.text("→", 250, { continued: true });
      doc.text(m.gcpEquivalent || "Unknown", 270);
    });
    doc.moveDown(1.5);
  }

  // ===== 3. Cost Comparison Table =====
  if (comparison.length > 0) {
    doc.font("Helvetica-Bold").fontSize(14).text("3. Cost Comparison");
    doc.moveDown(0.5);

    doc.font("Helvetica-Bold").fontSize(11);
    doc.text("No.", 50, doc.y, { continued: true });
    doc.text("Resource", 80, { continued: true });
    doc.text("Provider", 200, { continued: true });
    doc.text("Current Cost", 280, { continued: true });
    doc.text("GCP Cost", 370, { continued: true });
    doc.text("Savings", 450);
    doc.moveDown(0.2);

    doc.font("Helvetica").fontSize(10);
    comparison.forEach((item, idx) => {
      const current = parseFloat(item.currentCost) || 0;
      const gcp = parseFloat(item.gcpCost) || 0;
      const savings = current - gcp;

      doc.text(idx + 1, 50, doc.y, { continued: true });
      doc.text(item.resourceType || "Unknown", 80, { continued: true });
      doc.text(item.provider || "N/A", 200, { continued: true });
      doc.text(`$${current.toFixed(2)}`, 280, { continued: true });
      doc.text(`$${gcp.toFixed(2)}`, 370, { continued: true });
      doc.text(`$${savings.toFixed(2)}`, 450);
    });
    doc.moveDown(1.5);
  }

  // ===== 4. Chart at the End =====
  if (chartImageBase64) {
    try {
      doc.font("Helvetica-Bold").fontSize(14).text("4. Cost Comparison Chart");
      doc.moveDown(0.5);

      const chartBuffer = Buffer.from(chartImageBase64, "base64");
      doc.image(chartBuffer, {
        fit: [500, 300],
        align: "center",
        valign: "center",
      });
    } catch (err) {
      console.error("Chart embedding failed:", err);
    }
  }

  doc.end();
  return getStream.buffer(doc);
}

module.exports = { generatePdfReport };
