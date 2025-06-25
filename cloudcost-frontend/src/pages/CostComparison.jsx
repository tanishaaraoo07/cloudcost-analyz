import React, { useState } from 'react';
import CostBarChart from '../components/CostBarChart';

export default function CostComparison() {
  const [resources, setResources] = useState([{ name: '', usage: '', provider: '' }]);
  const [result, setResult] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResourceChange = (index, field, value) => {
    const updated = [...resources];
    updated[index][field] = value;
    setResources(updated);
  };

  const addResource = () => {
    setResources([...resources, { name: '', usage: '', provider: '' }]);
  };

  const handleCompare = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult([]);

    for (const res of resources) {
      if (!res.name || !res.usage || isNaN(res.usage) || !res.provider) {
        setError('Please enter valid resource name, usage, and provider.');
        setLoading(false);
        return;
      }
    }

    const payload = {
      resources: resources.map(r => ({
        name: r.name,
        usage: parseFloat(r.usage),
        provider: r.provider
      }))
    };

    try {
      const response = await fetch('http://localhost:8000/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data.comparison);
      } else {
        setError(data.detail || 'Comparison failed.');
      }
    } catch (err) {
      setError('API Error: ' + err.message);
    }

    setLoading(false);
  };

  return (
    <div>
      <h3>Cost Comparison</h3>
      <form onSubmit={handleCompare}>
        {resources.map((res, idx) => (
          <div className="row mb-3" key={idx}>
            <div className="col">
              <select
                className="form-select"
                value={res.name}
                onChange={e => handleResourceChange(idx, 'name', e.target.value)}
              >
                <option value="">Select Resource</option>
                <option value="EC2">EC2</option>
                <option value="S3">S3</option>
                <option value="VM">VM</option>
                <option value="Blob Storage">Blob Storage</option>
              </select>
            </div>
            <div className="col">
              <input
                type="number"
                className="form-control"
                placeholder="Usage (e.g., hours or GB)"
                value={res.usage}
                onChange={e => handleResourceChange(idx, 'usage', e.target.value)}
              />
            </div>
            <div className="col">
              <select
                className="form-select"
                value={res.provider}
                onChange={e => handleResourceChange(idx, 'provider', e.target.value)}
              >
                <option value="">Provider</option>
                <option value="AWS">AWS</option>
                <option value="Azure">Azure</option>
              </select>
            </div>
          </div>
        ))}
        <button type="button" className="btn btn-sm btn-secondary mb-3" onClick={addResource}>
          + Add Resource
        </button>
        <br />
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Comparing...' : 'Compare Costs'}
        </button>
      </form>

      {error && <div className="alert alert-danger mt-3">{error}</div>}

      {result.length > 0 && (
        <div className="mt-4">
          <h5>Comparison Result</h5>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Type</th>
                <th>Current Provider</th>
                <th>Current Cost ($)</th>
                <th>GCP Cost ($)</th>
                <th>Savings ($)</th>
              </tr>
            </thead>
            <tbody>
              {result.map((r, idx) => (
                <tr key={idx}>
                  <td>{r.type}</td>
                  <td>{r.current_provider}</td>
                  <td>{r.current_cost}</td>
                  <td>{r.gcp_cost}</td>
                  <td>{r.savings}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <CostBarChart comparison={result} />
    </div>
  );
}
