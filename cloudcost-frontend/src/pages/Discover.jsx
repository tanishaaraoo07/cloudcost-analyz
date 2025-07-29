import React, { useState } from "react";
import axios from "../api";

export default function Discover() {
  const [provider, setProvider] = useState("AWS");
  const [accessKey, setAccessKey] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [region, setRegion] = useState("");
  const [useMock, setUseMock] = useState(false); // ✅ New state for toggle
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDiscover = async () => {
    setLoading(true);
    setError(null);
    try {console.log("Sending request:", {
  provider,
  access_key: accessKey,
  secret_key: secretKey,
  region,
  use_mock: useMock,
});

      const response = await axios.post("/discover", {
        provider,
        access_key: accessKey,
        secret_key: secretKey,
        region,
        use_mock: useMock, // ✅ Send mock flag
      });
      setResources(response.data.resources);
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
    <div className="discover-wrapper">
      <div className="discover-card shadow p-4">
        <h3 className="mb-4 text-center text-success">🌩️ Resource Discovery</h3>

        <div className="mb-3">
          <label className="form-label">Cloud Provider</label>
          <select
            className="form-select"
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
          >
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

        {/* ✅ Mock Toggle */}
        <div className="form-check mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            id="mockToggle"
            checked={useMock}
            onChange={(e) => setUseMock(e.target.checked)}
          />
          <label className="form-check-label" htmlFor="mockToggle">
            Use Mock Discovery (for Recruiter Demo)
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
