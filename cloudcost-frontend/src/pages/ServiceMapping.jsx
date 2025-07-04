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
  body: JSON.stringify({ provider, resources: resourceList }) // ✅ This is correct
});


    const data = await res.json();
    if (data.status === "success") {
      const formattedMappings = data.mappings.map(item => ({
        source_service: item.original_service,
        target_service: item.gcp_equivalent
      }));

      // Save to state
      setMappingResults(formattedMappings);

      // ✅ Save to localStorage
      localStorage.setItem("mappingResult", JSON.stringify(formattedMappings));

      // 🐞 Debug for Report.jsx
      console.log("Saved Mapping to localStorage:", formattedMappings);
    }
  };

  return (
    <div>
      <h3>Service Mapping</h3>
      <form className="mt-3" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Cloud Provider</label>
          <select className="form-select" onChange={e => setProvider(e.target.value)} value={provider}>
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
                  <td>{item.source_service}</td>
                  <td>{item.target_service}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
