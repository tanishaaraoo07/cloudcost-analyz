import React, { useState } from 'react';
import { cloudApi } from "../api";

export default function ServiceMapping() {
  const [provider, setProvider] = useState('AWS');
  const [services, setServices] = useState('');
  const [mappingResults, setMappingResults] = useState([]);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("🔒 Please log in to map services.");
      return;
    }

    if (!services.trim()) {
      setError("⚠️ Please enter at least one service.");
      return;
    }

    const resourceList = services
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    try {
      const res = await cloudApi.post("/mapping", {
        provider,
        services: resourceList
      });

      const formatted = res.data.mapped.map(item => ({
        source_service: item.originalService,
        target_service: item.gcpEquivalent
      }));

      setMappingResults(formatted);

      // Save to localStorage for Report page
      const existing = JSON.parse(localStorage.getItem("cloudCostData") || "{}");
      localStorage.setItem("cloudCostData", JSON.stringify({
        ...existing,
        mappingSummary: formatted
      }));
    } catch (err) {
      console.error("Mapping Error:", err);
      setError("❌ Failed to map services. Check input or try again.");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-start px-3 py-5">
      <div className="card shadow p-4 w-100" style={{ maxWidth: "700px" }}>
        <h3 className="text-center text-success mb-4">🔁 Service Mapping</h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Cloud Provider</label>
            <select className="form-select" value={provider} onChange={(e) => setProvider(e.target.value)}>
              <option value="AWS">AWS</option>
              <option value="Azure">Azure</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Enter Services (comma-separated)</label>
            <input
              className="form-control"
              placeholder="e.g., EC2, S3, RDS"
              value={services}
              onChange={(e) => setServices(e.target.value)}
            />
          </div>

          {error && <div className="alert alert-danger mb-3">{error}</div>}

          <button className="btn btn-primary w-100" type="submit">Map to GCP</button>
        </form>

        {mappingResults.length > 0 && (
          <div className="mt-5">
            <h5 className="text-primary">Mapping Results</h5>
            <table className="table table-bordered mt-3">
              <thead className="table-light">
                <tr>
                  <th>Original Service</th>
                  <th>GCP Equivalent</th>
                </tr>
              </thead>
              <tbody>
                {mappingResults.map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.source_service}</td>
                    <td>{item.target_service}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
