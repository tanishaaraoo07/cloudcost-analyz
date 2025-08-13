import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function CostBarChart({ comparison }) {
  const labels = comparison.map(item => item.type);

  const currentCosts = comparison.map(item =>
    item.current_cost !== undefined ? item.current_cost : 0
  );
  const gcpCosts = comparison.map(item =>
    item.gcp_cost !== undefined ? item.gcp_cost : 0
  );

  // Dynamic label based on actual provider in first row
  const providerLabel =
    comparison.length > 0 ? comparison[0].current_provider : "Current Provider";

  const data = {
    labels,
    datasets: [
      {
        label: providerLabel,
        backgroundColor: '#007bff',
        data: currentCosts,
      },
      {
        label: 'GCP',
        backgroundColor: '#28a745',
        data: gcpCosts,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  return (
    <div className="mt-4">
      <h5>Cost Comparison Chart</h5>
      <Bar data={data} options={options} />
    </div>
  );
}
