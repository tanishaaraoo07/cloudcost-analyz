import { useState, useEffect } from 'react';

export default function Report() {
  const [loading, setLoading] = useState(false);
  const [costData, setCostData] = useState([]);
  const [mappingData, setMappingData] = useState([]);

  useEffect(() => {
    const cost = localStorage.getItem("comparisonResult");
    const mapping = localStorage.getItem("mappingResult");

    if (cost) setCostData(JSON.parse(cost));
    if (mapping) setMappingData(JSON.parse(mapping));
  }, []);

  const handleDownload = async () => {
    if (costData.length === 0) {
      alert("No cost comparison data found.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('https://cloudcost-analyz.onrender.com/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cost_data: costData,
          mapping_data: mappingData
        }),
      });

      if (!response.ok) throw new Error('Server error');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'cloudcost_report.pdf';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed:', err);
      alert('Could not download report.');
    }
    setLoading(false);
  };

  const formatCost = (value) => (value !== undefined && !isNaN(value) ? `$${parseFloat(value).toFixed(2)}` : "$0.00");

  const totalAWS = costData.reduce((sum, item) => sum + (parseFloat(item.aws_cost) || 0), 0);
  const totalAzure = costData.reduce((sum, item) => sum + (parseFloat(item.azure_cost) || 0), 0);
  const totalGCP = costData.reduce((sum, item) => sum + (parseFloat(item.gcp_cost) || 0), 0);

  return (
    <div className="container mt-4">
      <h3 className="mb-3">📄 Cloud Migration Report</h3>

      {costData.length > 0 ? (
        <div className="mb-4">
          <h5>🧮 Cost Comparison Summary:</h5>
          <ul>
            {costData.map((item, idx) => (
              <li key={idx}>
                {item.service || "Unnamed Service"} → 
                AWS: {formatCost(item.aws_cost)}, 
                Azure: {formatCost(item.azure_cost)}, 
                GCP: {formatCost(item.gcp_cost)}
              </li>
            ))}
            <li className="mt-2 fw-bold">
              Total → AWS: {formatCost(totalAWS)}, Azure: {formatCost(totalAzure)}, GCP: {formatCost(totalGCP)}
            </li>
          </ul>
        </div>
      ) : (
        <p>No cost data available.</p>
      )}

      {mappingData.length > 0 ? (
        <div className="mb-4">
          <h5>🔁 Service Mappings:</h5>
          <ul>
            {mappingData.map((item, idx) => (
              <li key={idx}>
                {item.source_service || "Unknown"} → {item.target_service || "Unknown"}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No mapping data available.</p>
      )}

      <button className="btn btn-success" onClick={handleDownload} disabled={loading}>
        {loading ? 'Generating PDF...' : 'Download PDF'}
      </button>
    </div>
  );
}
