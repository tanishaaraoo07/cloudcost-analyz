const fs = require("fs");
const puppeteer = require("puppeteer");

async function generatePdfReport({ discovered, mapped, comparison }, outputPath = "report.pdf") {
  const html = `
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; margin: 30px; }
        h1, h2 { color: #2c3e50; }
        .section { margin-bottom: 30px; }
        ul { padding-left: 20px; }
        li { margin-bottom: 5px; }
      </style>
    </head>
    <body>
      <h1>Cloud Cost Analyzer Report</h1>

      <div class="section">
        <h2>1. Discovered Resources</h2>
        <ul>
          ${discovered.map((res) => `<li>${JSON.stringify(res)}</li>`).join("") || "<li>No data</li>"}
        </ul>
      </div>

      <div class="section">
        <h2>2. GCP Service Mappings</h2>
        <ul>
          ${mapped.map((m) => `<li>${m.originalService} → ${m.gcpEquivalent}</li>`).join("") || "<li>No data</li>"}
        </ul>
      </div>

      <div class="section">
        <h2>3. Cost Comparison</h2>
        <ul>
          ${comparison.map((item) => `
            <li>${item.resourceType} (${item.provider}): $${item.currentCost} → GCP: $${item.gcpCost} | Savings: $${item.estimatedSavings}</li>
          `).join("") || "<li>No data</li>"}
        </ul>
      </div>
    </body>
    </html>
  `;

  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });
  await page.pdf({ path: outputPath, format: "A4", printBackground: true });
  await browser.close();
}

module.exports = { generatePdfReport };
module.exports = { mapServices }; // ✅ Correct structure
