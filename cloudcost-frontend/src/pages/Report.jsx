import { useState } from 'react';

export default function Report() {
  const [loading, setLoading] = useState(false);

  // Dummy values to simulate actual state (can replace later with props/context)
  const costData = [
    { service: 'EC2', aws_cost: 20, azure_cost: 25, gcp_cost: 18 },
    { service: 'S3', aws_cost: 5, azure_cost: 6, gcp_cost: 4 }
  ];

  const mappingData = [
    { original_service: 'EC2', gcp_equivalent: 'Compute Engine' },
    { original_service: 'S3', gcp_equivalent: 'Cloud Storage' }
  ];

  const handleDownload = async () => {
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cost_data: costData,
          mapping_data: mappingData
        }),
      });

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = 'cloud_report.pdf';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download PDF:', err);
    }

    setLoading(false);
  };

  return (
    <div>
      <h3>Generate PDF Report</h3>
      <button className="btn btn-success" onClick={handleDownload} disabled={loading}>
        {loading ? 'Generating...' : 'Download PDF'}
      </button>
    </div>
  );
}
