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
      const response = await fetch('http://localhost:8000/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cost_data: costData, mapping_data: mappingData }),
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

  return (
    <div>
      <h3>Generate PDF Report</h3>
      <button className="btn btn-success" onClick={handleDownload} disabled={loading}>
        {loading ? 'Generating...' : 'Download PDF'}
      </button>
    </div>
  );
}
