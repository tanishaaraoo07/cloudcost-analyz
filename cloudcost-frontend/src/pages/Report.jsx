import { useState, useEffect } from "react";
import html2canvas from "html2canvas";
import axios from "../api"; // your axios instance
import "./report.css";

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
    try {
      const chartCanvas = document.querySelector("canvas");
      const chartImage = await html2canvas(chartCanvas);
      const base64Image = chartImage.toDataURL("image/png");

      const response = await axios.post(
        "/generate-pdf",
        {
          cost_data: costData,
          mapping_data: mappingData,
          chart_image: base64Image,
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
              {item.service} → AWS: ${item.aws_cost}, Azure: ${item.azure_cost}, GCP: ${item.gcp_cost}
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
