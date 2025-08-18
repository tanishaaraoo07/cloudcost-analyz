import React, { useState } from "react";
import { cloudApi } from "../api";

function Discover() {
  const [provider, setProvider] = useState("AWS");
  const [accessKey, setAccessKey] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [region, setRegion] = useState("");
  const [useMock, setUseMock] = useState(true); // ✅ default true for mock
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDiscover = async () => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      alert("🔒 Please log in to use Discover Resources.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await cloudApi.post("/discover", {
        provider,
        access_key: accessKey,
        secret_key: secretKey,
        region,
        use_mock: useMock,
      });

      const discoveredResources = response.data.discovered || response.data.resources || [];

      setResources(discoveredResources);

      // 🔐 Store in localStorage
      const prev = JSON.parse(localStorage.getItem("cloudCostData") || "{}");
      localStorage.setItem("cloudCostData", JSON.stringify({
  ...prev,
  discoverSummary: discoveredResources
}));


      alert("✅ Discovery completed and saved.");
    } catch (err) {
      console.error("Discovery API Error:", err);
      if (err.response) {
        console.error("Response data:", err.response.data);
      }
      setError("Discovery failed. Check your keys or network.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-start px-3 py-5">
      <div className="card shadow p-4 w-100" style={{ maxWidth: "700px" }}>
        <h3 className="mb-4 text-center text-success">🌩️ Resource Discovery</h3>

        <div className="mb-3">
          <label className="form-label">Cloud Provider</label>
          <select className="form-select" value={provider} onChange={(e) => setProvider(e.target.value)}>
            <option>AWS</option>
            <option>Azure</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Access Key</label>
          <input
            type="text"
            className="form-control"
            value={accessKey}
            onChange={(e) => setAccessKey(e.target.value)}
            placeholder="Enter AWS Access Key"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Secret Key</label>
          <input
            type="password"
            className="form-control"
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
            placeholder="Enter Secret Key"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Region</label>
          <input
            type="text"
            className="form-control"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            placeholder="e.g., ap-south-1"
          />
        </div>

        <div className="form-check mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            id="mockToggle"
            checked={useMock}
            onChange={(e) => setUseMock(e.target.checked)}
          />
          <label className="form-check-label" htmlFor="mockToggle">
            Use Mock Discovery (for Demo)
          </label>
        </div>

        <button
          className="btn btn-success w-100"
          onClick={handleDiscover}
          disabled={loading}
        >
          {loading ? "Discovering..." : "Discover Resources"}
        </button>

        {error && <div className="alert alert-danger mt-3">{error}</div>}

        {resources.length > 0 && (
          <div className="mt-4">
            <h5 className="text-primary">Discovered Resources</h5>
            <ul className="list-group">
              {resources.map((res, idx) => (
                <li key={idx} className="list-group-item">
                  {JSON.stringify(res)}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default Discover;
