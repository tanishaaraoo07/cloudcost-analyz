import { useState, useEffect } from "react";
import { downloadReport } from "../api";
import { saveAs } from "file-saver";
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
        m.originalService || m.original_service || m.source_service || "Unknown",
      gcpEquivalent:
        m.gcpEquivalent || m.gcp_equivalent || m.target_service || "Unknown",
    }));

    setCostData(formattedCost);
    setMappingData(formattedMap);
    setDiscoveredData(rawDiscover);
  }, []);

  const downloadPDF = async () => {
    try {
      const response = await downloadReport({
        discovered: discoveredData,
        mapped: mappingData,
        comparison: costData,
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

        <h5>📊 Cost Comparison Summary:</h5>
        <ul className="list-group mb-3">
          {costData.map((item, index) => (
            <li key={index} className="list-group-item">
              {item.resourceType} → {item.provider}: ${item.currentCost} | GCP: $
              {item.gcpCost} | Savings: ${item.estimatedSavings}
            </li>
          ))}
        </ul>

        <strong>
          Total → AWS: $
          {costData
            .filter((i) => i.provider === "AWS")
            .reduce((sum, i) => sum + i.currentCost, 0)
            .toFixed(2)},{" "}
          Azure: $
          {costData
            .filter((i) => i.provider === "Azure")
            .reduce((sum, i) => sum + i.currentCost, 0)
            .toFixed(2)},{" "}
          GCP: $
          {costData.reduce((sum, i) => sum + i.gcpCost, 0).toFixed(2)}
        </strong>

        {costData.length > 0 && (
          <>
            <h5 className="mt-4 text-info">📉 Cost Comparison Chart</h5>
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
          </>
        )}

        <h5 className="mt-4">📘 Service Mappings:</h5>
        <ul className="list-group mb-3">
          {mappingData.map((item, index) => (
            <li key={index} className="list-group-item">
              {item.originalService} → {item.gcpEquivalent}
            </li>
          ))}
        </ul>

        <button className="btn btn-success w-100 mt-3" onClick={downloadPDF}>
          📄 Download PDF Report
        </button>
      </div>
    </div>
  );
}
