import { useState, useEffect } from "react";
import "./Report.css";

export default function Report() {
  const [costData, setCostData] = useState([]);
  const [mappingData, setMappingData] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("cloudCostData"));
    if (data) {
      setCostData(data.costSummary || []);
      setMappingData(data.mappingSummary || []);
    }
  }, []);

  const downloadPDF = async () => {
    const response = await fetch("http://localhost:8000/pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ costData, mappingData }),
    });
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cloud-migration-report.pdf";
    a.click();
  };

  return (
    <div className="report-wrapper">
      <div className="report-card shadow p-4 rounded bg-white">
        <h2 className="mb-4 text-center text-success">Cloud Migration Report</h2>

        <h5>📊 Cost Comparison Summary:</h5>
        <ul className="list-group mb-3">
          {costData.map((item, index) => (
            <li key={index} className="list-group-item">
              {item.service} → AWS: ${item.aws}, Azure: ${item.azure}, GCP: ${item.gcp}
            </li>
          ))}
        </ul>
        <strong>
          Total → AWS: ${costData.reduce((sum, i) => sum + i.aws, 0).toFixed(2)}, Azure: $
          {costData.reduce((sum, i) => sum + i.azure, 0).toFixed(2)}, GCP: $
          {costData.reduce((sum, i) => sum + i.gcp, 0).toFixed(2)}
        </strong>

        <h5 className="mt-4">📘 Service Mappings:</h5>
        <ul className="list-group mb-3">
          {mappingData.map((item, index) => (
            <li key={index} className="list-group-item">
              {item.source} → {item.target}
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
