import React, { useState } from "react";
import { cloudApi } from "../api";
import CostBarChart from "../components/CostBarChart";

export default function CostComparison() {
  const [resources, setResources] = useState([
    { type: "EC2", usage: 1, provider: "AWS" },
  ]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAdd = () => {
    setResources([
      ...resources,
      { type: "EC2", usage: 1, provider: "AWS" },
    ]);
  };

  const handleChange = (idx, field, value) => {
    const updated = [...resources];
    updated[idx][field] = value;
    setResources(updated);
  };

  const handleCompare = async () => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    alert("🔒 Please log in to compare cloud costs.");
    return;
  }

  setLoading(true);
  setError(null);

  try {
    // ✅ Ensure every resource has provider, type, and usage
    const simplified = resources.map((r) => ({
      provider: r.provider?.trim() || "AWS", // fallback to AWS if empty
      type: r.type?.trim() || "Unknown",
      usage: Number(r.usage) > 0 ? Number(r.usage) : 1,
    }));

    // ✅ Send correct structure
    const payload = { resources: simplified };

    console.log("📤 Compare Request Payload:", payload);

    const response = await cloudApi.post("/compare", payload);

    const comparison = response.data.result || [];

    // ✅ Map backend response safely
    const formatted = comparison.map((item, idx) => {
      const prov = simplified[idx]?.provider || "AWS";
      return {
        type: item.resourceType || simplified[idx]?.type || "Unknown",
        current_provider: prov,
        current_cost: item.currentCost || 0,
        gcp_cost: item.gcpCost || 0,
        aws_cost: prov === "AWS" ? item.currentCost || 0 : item.awsCost || 0,
        azure_cost: prov === "Azure" ? item.currentCost || 0 : item.azureCost || 0,
        savings: item.estimatedSavings || 0,
      };
    });

      // Save results for report
      localStorage.setItem(
        "cloudCostData",
        JSON.stringify({
          costSummary: formatted,
          mappingSummary: response.data.mapping || [],
        })
      );

      setResults(formatted);
    } catch (err) {
      console.error(err);
      setError("Comparison failed. Please check your inputs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-start px-3 py-5">
      <div className="card shadow p-4 w-100" style={{ maxWidth: "700px" }}>
        <h3 className="text-center text-success mb-4">📊 Cost Comparison</h3>

        {resources.map((res, idx) => (
          <div className="row g-3 mb-3" key={idx}>
            <div className="col-md-4">
              <select
                className="form-select"
                value={res.type}
                onChange={(e) => handleChange(idx, "type", e.target.value)}
              >
                <option>EC2</option>
                <option>S3</option>
                <option>RDS</option>
                <option>VM</option>
                <option>Blob</option>
                <option>SQL</option>
              </select>
            </div>
            <div className="col-md-4">
              <input
                type="number"
                className="form-control"
                value={res.usage}
                onChange={(e) => handleChange(idx, "usage", e.target.value)}
                placeholder="Usage (hours/GB)"
              />
            </div>
            <div className="col-md-4">
              <select
                className="form-select"
                value={res.provider}
                onChange={(e) => handleChange(idx, "provider", e.target.value)}
              >
                <option>AWS</option>
                <option>Azure</option>
              </select>
            </div>
          </div>
        ))}

        <div className="d-flex justify-content-between mb-3">
          <button className="btn btn-outline-secondary" onClick={handleAdd}>
            + Add Resource
          </button>
          <button
            className="btn btn-success"
            onClick={handleCompare}
            disabled={loading}
          >
            {loading ? "Comparing..." : "Compare Costs"}
          </button>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        {results.length > 0 && (
          <div className="mt-4">
            <h5 className="text-primary">Results:</h5>
            <ul className="list-group mb-4">
              {results.map((item, idx) => (
                <li key={idx} className="list-group-item">
                  {item.type} → {item.current_provider} (${item.current_cost}) vs GCP (${item.gcp_cost}) | Savings: ${item.savings}
                </li>
              ))}
            </ul>

            <div className="card p-3 shadow-sm">
              <CostBarChart comparison={results} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
