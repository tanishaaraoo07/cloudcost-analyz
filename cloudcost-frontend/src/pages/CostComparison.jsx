import React, { useState } from "react";
import { cloudApi } from "../api";
import CostBarChart from "../components/CostBarChart";

export default function CostComparison() {
  const [resources, setResources] = useState([{ type: "EC2", usage: 1, provider: "AWS" }]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAdd = () => {
    setResources([...resources, { type: "EC2", usage: 1, provider: "AWS" }]);
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
      const provider = resources[0].provider;
      const simplified = resources.map(r => ({ type: r.type }));

      const response = await cloudApi.post("/compare", {
        provider,
        resources: simplified,
      });

      const comparison = response.data.result || [];

      // Convert for Report.jsx
      const formatted = comparison.map(item => ({
        type: item.resourceType,
        current_provider: item.provider,
        current_cost: item.currentCost,
        gcp_cost: item.gcpCost,
        aws_cost: item.provider === "AWS" ? item.currentCost : null,
        azure_cost: item.provider === "Azure" ? item.currentCost : null,
        savings: item.estimatedSavings,
      }));

      setResults(formatted);

      localStorage.setItem("cloudCostData", JSON.stringify({
        costSummary: formatted,
        mappingSummary: [], // mapping added later
      }));

      localStorage.setItem("comparisonResult", JSON.stringify(formatted));
    } catch (err) {
      setError("Comparison failed");
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
              <select className="form-select" value={res.type} onChange={(e) => handleChange(idx, "type", e.target.value)}>
                <option>EC2</option>
                <option>S3</option>
                <option>RDS</option>
                <option>VM</option>
                <option>Blob Storage</option>
              </select>
            </div>
            <div className="col-md-4">
              <input
                type="number"
                className="form-control"
                value={res.usage}
                onChange={(e) => handleChange(idx, "usage", e.target.value)}
                placeholder="Usage"
              />
            </div>
            <div className="col-md-4">
              <select className="form-select" value={res.provider} onChange={(e) => handleChange(idx, "provider", e.target.value)}>
                <option>AWS</option>
                <option>Azure</option>
              </select>
            </div>
          </div>
        ))}

        <div className="d-flex justify-content-between mb-3">
          <button className="btn btn-outline-secondary" onClick={handleAdd}>+ Add Resource</button>
          <button className="btn btn-success" onClick={handleCompare} disabled={loading}>
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
