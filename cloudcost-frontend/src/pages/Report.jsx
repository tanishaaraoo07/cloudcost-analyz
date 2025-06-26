import { useState, useEffect } from 'react';

export default function Report() {
  const [loading, setLoading] = useState(false);
  const [rawCostData, setRawCostData] = useState([]);
  const [rawMappingData, setRawMappingData] = useState([]);

  useEffect(() => {
    const cost = localStorage.getItem("comparisonResult");
    const mapping = localStorage.getItem("mappingResult");

    if (cost) setRawCostData(JSON.parse(cost));
    if (mapping) setRawMappingData(JSON.parse(mapping));
  }, []);

  // ✅ Transform for display and PDF
  const transformedCostData = rawCostData.map(item => ({
    service: item.type || item.service || "Unnamed",
    aws_cost: item.current_provider === "AWS" ? item.current_cost : 0,
    azure_cost: item.current_provider === "Azure" ? item.current_cost : 0,
    gcp_cost: item.gcp_cost ?? 0
  }));

  const transformedMappingData = rawMappingData.map(item => ({
    source_service: item.original_service || item.source_service || "Unknown",
    target_service: item.gcp_equivalent || item.target_service || "Unknown"
  }));

  const handleDownload = async () => {
    if (transformedCostData.length === 0) {
      alert("No cost comparison data found.");
      return;
    }

    setLoading(true);
    try {
      console.log("Sending to PDF:", {
  cost_data: transformedCostData,
  mapping_data: transformedMappingData
});

      const response = await fetch('https://cloudcost-analyz.onrender.com/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cost_data: transformedCostData,
          mapping_data: transformedMappingData
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

  const totalAWS = transformedCostData.reduce((sum, item) => sum + (parseFloat(item.aws_cost) || 0), 0);
  const totalAzure = transformedCostData.reduce((sum, item) => sum + (parseFloat(item.azure_cost) || 0), 0);
  const totalGCP = transformedCostData.reduce((sum, item) => sum + (parseFloat(item.gcp_cost) || 0), 0);

  return (
    <div className="container mt-4">
      <h3 className="mb-3">📄 Cloud Migration Report</h3>

      {transformedCostData.length > 0 ? (
        <div className="mb-4">
          <h5>🧮 Cost Comparison Summary:</h5>
          <ul>
            {transformedCostData.map((item, idx) => (
              <li key={idx}>
                {item.service} → AWS: {formatCost(item.aws_cost)}, Azure: {formatCost(item.azure_cost)}, GCP: {formatCost(item.gcp_cost)}
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

      {transformedMappingData.length > 0 ? (
        <div className="mb-4">
          <h5>🔁 Service Mappings:</h5>
          <ul>
            {transformedMappingData.map((item, idx) => (
              <li key={idx}>
                {item.source_service} → {item.target_service}
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
