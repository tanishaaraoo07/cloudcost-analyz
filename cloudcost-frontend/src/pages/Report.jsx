import { useState, useEffect, useRef } from "react";
import { downloadReport } from "../api";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./report.css";

export default function Report() {
  const [costData, setCostData] = useState([]);
  const [mappingData, setMappingData] = useState([]);
  const [discoveredData, setDiscoveredData] = useState([]);
  const chartRef = useRef(null);

  useEffect(() => {
    const raw = JSON.parse(localStorage.getItem("cloudCostData")) || {};
    const rawCost = raw.costSummary || [];
    const rawMap = raw.mappingSummary || [];
    const rawDiscover = raw.discoverSummary || [];

    const formattedCost = rawCost.map((item) => ({
      resourceType: item.resourceType || item.type || "Unnamed",
      provider: item.provider || item.current_provider || "Unknown",
      currentCost: item.currentCost ?? item.current_cost ?? 0,
      gcpCost: item.gcpCost ?? item.gcp_cost ?? 0,
      estimatedSavings:
        (item.currentCost ?? item.current_cost ?? 0) -
        (item.gcpCost ?? item.gcp_cost ?? 0),
    }));

    const formattedMap = rawMap.map((m) => ({
      originalService:
        m.originalService || m.source_service || m.source || "Unknown",
      gcpEquivalent:
        m.gcpEquivalent || m.target_service || m.target || "Unknown",
    }));

    setCostData(formattedCost);
    setMappingData(formattedMap);
    setDiscoveredData(rawDiscover);
  }, []);

  const downloadPDF = async () => {
    if (!discoveredData.length || !mappingData.length || !costData.length) {
      alert("⚠️ Some sections are empty. Please run discovery, mapping, and cost comparison first.");
      return;
    }

    try {
      // Capture chart as image
      let chartImageBase64 = null;
      if (chartRef.current) {
        const canvas = await html2canvas(chartRef.current);
        chartImageBase64 = canvas.toDataURL("image/png").split(",")[1]; // remove data:image/png;base64,
      }

      // Send data to backend
      const response = await downloadReport({
        discovered: discoveredData,
        mapped: mappingData,
        comparison: costData,
        chartImageBase64
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      saveAs(blob, `CloudCost-Report-${Date.now()}.pdf`);
    } catch (err) {
      console.error("❌ PDF Download Error:", err);
      alert("Failed to generate or download PDF.");
    }
  };

  return (
    <div className="report-wrapper px-4 py-5">
      <div className="report-card shadow p-4 rounded bg-white">
        <h2 className="mb-4 text-center text-success">Cloud Migration Report</h2>

        {/* Section: Discovery */}
        <h5>🔍 Discovered Resources:</h5>
        <ul className="list-group mb-4">
          {discoveredData.length > 0 ? (
            discoveredData.map((item, index) => (
              <li key={index} className="list-group-item">
                {JSON.stringify(item)}
              </li>
            ))
          ) : (
            <li className="list-group-item text-muted">No discovery data available</li>
          )}
        </ul>

        {/* Section: Cost Comparison */}
        <h5>📊 Cost Comparison Summary:</h5>
        <ul className="list-group mb-3">
          {costData.map((item, index) => (
            <li key={index} className="list-group-item">
              {item.resourceType} → {item.provider}: ${item.currentCost} | GCP: ${item.gcpCost} | Savings: ${item.estimatedSavings}
            </li>
          ))}
        </ul>

        <strong>
          Total → AWS: $
          {costData
            .filter((i) => i.provider === "AWS")
            .reduce((sum, i) => sum + i.currentCost, 0)
            .toFixed(2)}{" "}
          | Azure: $
          {costData
            .filter((i) => i.provider === "Azure")
            .reduce((sum, i) => sum + i.currentCost, 0)
            .toFixed(2)}{" "}
          | GCP: $
          {costData.reduce((sum, i) => sum + i.gcpCost, 0).toFixed(2)}
        </strong>

        {costData.length > 0 && (
          <>
            <h5 className="mt-4 text-info">📉 Cost Comparison Chart</h5>
            <div ref={chartRef} id="costChart">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={costData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="resourceType" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="currentCost" fill="#8884d8" name="Current Cost" />
                  <Bar dataKey="gcpCost" fill="#82ca9d" name="GCP Cost" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        {/* Section: Mappings */}
        <h5 className="mt-4">🔄 Service Mappings:</h5>
        <ul className="list-group mb-3">
          {mappingData.length > 0 ? (
            mappingData.map((item, index) => (
              <li key={index} className="list-group-item">
                {item.originalService} → {item.gcpEquivalent}
              </li>
            ))
          ) : (
            <li className="list-group-item text-muted">No service mapping available</li>
          )}
        </ul>

        <button className="btn btn-success w-100 mt-3" onClick={downloadPDF}>
          📄 Download PDF Report
        </button>
      </div>
    </div>
  );
}
