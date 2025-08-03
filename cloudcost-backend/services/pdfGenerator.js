const PDFDocument = require("pdfkit");
const getStream = require("get-stream");

async function generatePdfReport({ discovered, mapped, comparison }) {
  const doc = new PDFDocument({ margin: 50 });

  let buffers = [];
  doc.on("data", buffers.push.bind(buffers));
  doc.on("end", () => {});

  doc.font("Helvetica-Bold").fontSize(18).text("Cloud Cost Analyzer Report", { align: "center" });
  doc.moveDown(1.5);

  doc.font("Helvetica-Bold").fontSize(14).text("Discovered Resources");
  doc.moveDown(0.5);
  (discovered || []).forEach((res, idx) => {
    doc.font("Helvetica").fontSize(11).text(`${idx + 1}. ${JSON.stringify(res)}`, { indent: 20 });
  });
  doc.moveDown(1.5);

  doc.font("Helvetica-Bold").fontSize(14).text("GCP Service Mappings");
  doc.moveDown(0.5);
  (mapped || []).forEach((m, idx) => {
    doc.font("Helvetica").fontSize(11).text(`${idx + 1}. ${m.originalService} → ${m.gcpEquivalent}`, { indent: 20 });
  });
  doc.moveDown(1.5);

  doc.font("Helvetica-Bold").fontSize(14).text("Cost Comparison");
  doc.moveDown(0.5);
  (comparison || []).forEach((item, idx) => {
    const { resourceType, provider, currentCost, gcpCost, estimatedSavings } = item;
    doc.font("Helvetica").fontSize(11).text(
      `${idx + 1}. ${resourceType} (${provider}) - $${currentCost} → GCP: $${gcpCost} | Savings: $${estimatedSavings}`,
      { indent: 20 }
    );
  });

  doc.end();

  return getStream.buffer(doc);
}

module.exports = { generatePdfReport };
