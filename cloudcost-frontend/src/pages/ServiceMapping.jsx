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
      const formattedMappings = data.mappings.map(item => ({
        source_service: item.original_service,
        target_service: item.gcp_equivalent
      }));

      setMappingResults(formattedMappings);

      // ✅ Save to localStorage for report page
      localStorage.setItem("mappingResult", JSON.stringify(formattedMappings));
      console.log("Saved Mapping to localStorage:", formattedMappings);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-start px-3 py-5">
      <div className="card shadow p-4 w-100" style={{ maxWidth: "700px" }}>
        <h3 className="text-center text-success mb-4">🔁 Service Mapping</h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Cloud Provider</label>
            <select className="form-select" onChange={e => setProvider(e.target.value)} value={provider}>
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
              onChange={e => setServices(e.target.value)}
            />
          </div>

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
