const PDFDocument = require("pdfkit");
const getStream = require("get-stream");

async function generatePdfReport({ discovered = [], mapped = [], comparison = [], chartImageBase64 }) {
  const doc = new PDFDocument({ margin: 50 });
  const buffers = [];
  doc.on("data", buffers.push.bind(buffers));

  // Title
  doc.font("Helvetica-Bold").fontSize(20).fillColor("#333333")
    .text("Cloud Cost Analyzer Report", { align: "center" });
  doc.moveDown(2);

  // 1️⃣ Chart Image (optional)
  if (chartImageBase64) {
    try {
      const chartBuffer = Buffer.from(chartImageBase64, "base64");
      doc.image(chartBuffer, { fit: [450, 300], align: "center" });
      doc.moveDown(1.5);
    } catch (err) {
      console.error("⚠️ Chart embed error:", err.message);
    }
  }

  // 2️⃣ Discovered Resources Table
  if (discovered.length > 0) {
    doc.font("Helvetica-Bold").fontSize(14).text("1. Discovered Resources");
    doc.moveDown(0.5);

    // Header
    doc.font("Helvetica-Bold").fontSize(11)
      .text("Service Type", 50, doc.y, { continued: true })
      .text("Identifier / Name", 180, { continued: true })
      .text("Extra Info", 350);
    doc.moveDown(0.2);

    // Rows
    discovered.forEach((res) => {
      const type = res.type || "N/A";
      const idOrName = res.id || res.bucket || res.db || "—";
      const extra = res.region || res.zone || "";

      doc.font("Helvetica").fontSize(10)
        .text(type, 50, doc.y, { continued: true })
        .text(idOrName, 180, { continued: true })
        .text(extra, 350);
    });

    doc.moveDown(1.5);
  }

  // 3️⃣ GCP Service Mappings Table
  if (mapped.length > 0) {
    doc.font("Helvetica-Bold").fontSize(14).text("2. GCP Service Mappings");
    doc.moveDown(0.5);

    // Header
    doc.font("Helvetica-Bold").fontSize(11)
      .text("Original Service", 50, doc.y, { continued: true })
      .text("GCP Equivalent", 250);
    doc.moveDown(0.2);

    // Rows
    mapped.forEach((m) => {
      doc.font("Helvetica").fontSize(10)
        .text(m.originalService || "N/A", 50, doc.y, { continued: true })
        .text(m.gcpEquivalent || "N/A", 250);
    });

    doc.moveDown(1.5);
  }

  // 4️⃣ Cost Comparison Table
  if (comparison.length > 0) {
    doc.font("Helvetica-Bold").fontSize(14).text("3. Cost Comparison");
    doc.moveDown(0.5);

    // Header
    doc.font("Helvetica-Bold").fontSize(11)
      .text("Service", 50, doc.y, { continued: true })
      .text("Current Cost", 200, { continued: true })
      .text("GCP Cost", 300, { continued: true })
      .text("Savings", 400);
    doc.moveDown(0.2);

    // Rows
    comparison.forEach((item) => {
      doc.font("Helvetica").fontSize(10)
        .text(item.resourceType || "N/A", 50, doc.y, { continued: true })
        .text(`$${item.currentCost}`, 200, { continued: true })
        .text(`$${item.gcpCost}`, 300, { continued: true })
        .text(`$${item.estimatedSavings}`, 400);
    });

    // Totals row
    const totalAWS = comparison
      .filter((i) => i.provider === "AWS")
      .reduce((sum, i) => sum + i.currentCost, 0);

    const totalAzure = comparison
      .filter((i) => i.provider === "Azure")
      .reduce((sum, i) => sum + i.currentCost, 0);

    const totalGCP = comparison.reduce((sum, i) => sum + i.gcpCost, 0);

    doc.moveDown(0.5);
    doc.font("Helvetica-Bold").fontSize(11)
      .text("TOTAL →", 50, doc.y, { continued: true })
      .text(`AWS: $${totalAWS.toFixed(2)} | Azure: $${totalAzure.toFixed(2)} | GCP: $${totalGCP.toFixed(2)}`, 200);
  }

  doc.end();
  return getStream.buffer(doc);
}

module.exports = { generatePdfReport };
