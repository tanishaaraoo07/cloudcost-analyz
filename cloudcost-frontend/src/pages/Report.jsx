import { useState, useEffect } from "react";
import axios from "../api";
import "./report.css";

export default function Report() {
  const [costData, setCostData] = useState([]);
  const [mappingData, setMappingData] = useState([]);

  useEffect(() => {
    const raw = JSON.parse(localStorage.getItem("cloudCostData")) || {};
const rawCost = raw.costSummary || [];
const rawMap = raw.mappingSummary || [];

    console.log("Loaded cost from localStorage:", rawCost);
  console.log("Loaded mapping from localStorage:", rawMap);

    // Format cost data
  
const formattedCost = rawCost.map(item => ({
  type: item.type || item.service || "Unnamed",
  current_provider: item.current_provider || "Unknown",
  current_cost: item.current_cost || 0,
  gcp_cost: item.gcp_cost || 0,
}));


    setCostData(formattedCost);

    // Format mapping data for report and PDF
    const formattedMap = rawMap.map(m => ({
    original_service: m.original_service || m.source_service || "Unknown",
    gcp_equivalent: m.gcp_equivalent || m.target_service || "Unknown",
  }));
  setMappingData(formattedMap);
}, []);

  const downloadPDF = async () => {
    try {
      const response = await axios.post(
        "/generate-pdf",
        {
          cost_data: costData,
          mapping_data: mappingData,
        },
        { responseType: "blob" }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "cloud-migration-report.pdf";
      a.click();
    } catch (err) {
      console.error("PDF Download Error:", err);
      alert("Failed to generate PDF");
    }
  };

  return (
    <div className="report-wrapper">
      <div className="report-card shadow p-4 rounded bg-white">
        <h2 className="mb-4 text-center text-success">Cloud Migration Report</h2>

        <h5>📊 Cost Comparison Summary:</h5>
        <ul className="list-group mb-3">
          {costData.map((item, index) => (
            <li key={index} className="list-group-item">
              → AWS: ${item.aws_cost?.toFixed(2) || "0.00"}, Azure: ${item.azure_cost?.toFixed(2) || "0.00"}, GCP: ${item.gcp_cost?.toFixed(2) || "0.00"}
            </li>
          ))}
        </ul>

        <strong>
          Total → AWS: ${costData.reduce((sum, i) => sum + (i.aws_cost || 0), 0).toFixed(2)}, Azure: $
          {costData.reduce((sum, i) => sum + (i.azure_cost || 0), 0).toFixed(2)}, GCP: $
          {costData.reduce((sum, i) => sum + (i.gcp_cost || 0), 0).toFixed(2)}
        </strong>

        <h5 className="mt-4">📘 Service Mappings:</h5>
        <ul className="list-group mb-3">
          {mappingData.map((item, index) => (
  <li key={index} className="list-group-item">
    {item.source_service} → {item.target_service}
  </li>
))}

        </ul>

        <button className="btn btn-success w-100" onClick={downloadPDF}>
          Download PDF
        </button>
      </div>
    </div>
  );
}
