import React, { useState } from 'react';

export default function ServiceMapping() {
  const [provider, setProvider] = useState('AWS');
  const [services, setServices] = useState('');
  const [mappingResults, setMappingResults] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resourceList = services.split(',').map(s => s.trim());

    const res = await fetch("http://localhost:8000/mapping", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ provider, resources: resourceList })
    });

    const data = await res.json();
    if (data.status === "success") {
      setMappingResults(data.mappings);
    }
  };

  return (
    <div>
      <h3>Service Mapping</h3>
      <form className="mt-3" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Cloud Provider</label>
          <select className="form-select" onChange={e => setProvider(e.target.value)}>
            <option value="AWS">AWS</option>
            <option value="Azure">Azure</option>
          </select>
        </div>
        <div className="mb-3">
          <label>Enter Services (comma-separated)</label>
          <input
            className="form-control"
            placeholder="e.g., EC2, S3, RDS"
            value={services}
            onChange={e => setServices(e.target.value)}
          />
        </div>
        <button className="btn btn-primary" type="submit">Map to GCP</button>
      </form>

      {mappingResults.length > 0 && (
        <div className="mt-4">
          <h5>Mapping Results</h5>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Original Service</th>
                <th>GCP Equivalent</th>
              </tr>
            </thead>
            <tbody>
              {mappingResults.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.original_service}</td>
                  <td>{item.gcp_equivalent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
