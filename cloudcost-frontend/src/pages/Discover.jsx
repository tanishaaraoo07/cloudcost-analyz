import React, { useState } from 'react';

export default function Discover() {
  const [provider, setProvider] = useState('AWS');
  const [formData, setFormData] = useState({
    access_key: '',
    secret_key: '',
    region: '',
    tenant_id: '',
    client_id: '',
    client_secret: ''
  });
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDiscover = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResources([]);

    const body = { provider, ...formData };

    try {
      const response = await fetch("http://localhost:8000/discover", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();
      console.log("API raw response:", data);
      console.log("HTTP status:", response.status);

      if (response.ok) {
        setResources(data.resources);
      } else {
        setError(data.detail || 'Discovery failed');
      }
    } catch (err) {
      setError("API Error: " + err.message);
    }

    setLoading(false);
  };

  return (
    <div>
      <h3>Resource Discovery</h3>
      <form className="mt-3" onSubmit={handleDiscover}>
        <div className="mb-3">
          <label className="form-label">Cloud Provider</label>
          <select className="form-select" value={provider} onChange={e => setProvider(e.target.value)}>
            <option value="AWS">AWS</option>
            <option value="Azure">Azure</option>
          </select>
        </div>

        {provider === 'AWS' ? (
          <>
            <div className="mb-3">
              <label>Access Key</label>
              <input name="access_key" className="form-control" placeholder="Enter AWS Access Key" onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label>Secret Key</label>
              <input name="secret_key" type="password" className="form-control" placeholder="Enter Secret Key" onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label>Region</label>
              <input name="region" className="form-control" placeholder="e.g., ap-south-1" onChange={handleChange} />
            </div>

          </>
        ) : (
          <>
            <div className="mb-3">
              <label>Tenant ID</label>
              <input name="tenant_id" className="form-control" placeholder="Enter Tenant ID" onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label>Client Secret</label>
              <input name="client_secret" type="password" className="form-control" placeholder="Enter Client Secret" onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label>Client ID</label>
              <input
              name="client_id"
              className="form-control"
              placeholder="Enter Client ID (Application ID)"
              onChange={handleChange}
              />
              </div>
          </>
        )}

        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? "Discovering..." : "Discover Resources"}
        </button>
      </form>

      {error && <div className="alert alert-danger mt-3">{error}</div>}

      {resources.length > 0 && (
        <div className="mt-4">
          <h5>Discovered Resources:</h5>
          <ul className="list-group">
            {resources.map((res, idx) => (
              <li key={idx} className="list-group-item">
                {Object.entries(res).map(([key, val]) => (
                  <span key={key}><strong>{key}:</strong> {val} &nbsp;</span>
                ))}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
