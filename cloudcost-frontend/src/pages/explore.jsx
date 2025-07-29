import React from 'react';
import awsLogo from '../assets/aws.png';
import azureLogo from '../assets/azure.png';
import gcpLogo from '../assets/gcp.png';

export default function Explore() {
  const cardStyle = {
    backgroundColor: '#d4edda',
    color: '#000',
    border: '2px solid #25C39F',
    borderRadius: '16px',
    padding: '2rem',
    boxShadow: '0 6px 18px rgba(0, 0, 0, 0.12)',
    marginBottom: '2rem',
    maxWidth: '850px',
    minHeight: '420px',
    margin: '2rem auto',
  };

  const sectionTitle = {
    color: '#1F1F1F',
    fontWeight: 'bold',
    margin: '1rem 0',
    fontSize: '1.5rem',
  };

  const logoContainer = {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    overflow: 'hidden',
    border: '3px solid #25C39F',
    margin: '0 auto 1rem auto',
    backgroundColor: '#fff',
  };

  const logoStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  };

  const linkStyle = {
    color: '#000',
    fontWeight: 'bold',
    textDecoration: 'underline',
  };

  const tableStyle = {
    width: '100%',
    backgroundColor: '#ffffff',
    borderCollapse: 'collapse',
    marginTop: '2rem',
  };

  const thStyle = {
    backgroundColor: '#25C39F',
    color: 'white',
    padding: '10px',
    border: '1px solid #ccc',
  };

  const tdStyle = {
    padding: '10px',
    border: '1px solid #ccc',
    textAlign: 'center',
  };

  return (
    <div style={{ backgroundColor: '#e6fff2', minHeight: '100vh', padding: '2rem' }}>
      <h1 className="text-center mb-5" style={{ color: '#1F1F1F' }}>
        Explore Cloud Provider Cost Management
      </h1>

      <div className="container">
        {/* AWS Section */}
        <div style={cardStyle}>
          <div className="text-center">
            <div style={logoContainer}>
              <img src={awsLogo} alt="AWS Logo" style={logoStyle} />
            </div>
            <h3 style={sectionTitle}>Amazon Web Services (AWS)</h3>
          </div>
          <p><strong>Tools:</strong> Cost Explorer, Budgets, Cost Anomaly Detection, Pricing Calculator, Billing Dashboard</p>
          <ul>
            <li>Visualize detailed usage and cost trends.</li>
            <li>Create budgets and get alerts for anomalies.</li>
            <li>Use ML-powered tools to optimize resource spend.</li>
            <li>Allocate costs with tags and cost categories.</li>
            <li>Leverage Reserved Instances and Savings Plans for lower costs.</li>
          </ul>
          <a
            href="https://docs.aws.amazon.com/aws-cost-management/latest/userguide/what-is-cost-management.html"
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle}
          >
            AWS Cost Management Docs →
          </a>
        </div>

        {/* Azure Section */}
        <div style={cardStyle}>
          <div className="text-center">
            <div style={logoContainer}>
              <img src={azureLogo} alt="Azure Logo" style={logoStyle} />
            </div>
            <h3 style={sectionTitle}>Microsoft Azure</h3>
          </div>
          <p><strong>Tools:</strong> Azure Cost Management, Budgets, Cost Analysis, Azure Advisor, Price Calculator</p>
          <ul>
            <li>Monitor usage across subscriptions and apply governance policies.</li>
            <li>Use Azure Advisor for intelligent cost-saving tips.</li>
            <li>Create detailed budgets and export reports.</li>
            <li>Support for multi-cloud (AWS) visibility.</li>
            <li>Tag resources for internal chargebacks and accountability.</li>
          </ul>
          <a
            href="https://learn.microsoft.com/en-us/azure/cost-management-billing/"
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle}
          >
            Azure Cost Management Docs →
          </a>
        </div>

        {/* GCP Section */}
        <div style={cardStyle}>
          <div className="text-center">
            <div style={logoContainer}>
              <img src={gcpLogo} alt="GCP Logo" style={logoStyle} />
            </div>
            <h3 style={sectionTitle}>Google Cloud Platform (GCP)</h3>
          </div>
          <p><strong>Tools:</strong> Billing Reports, Budgets & Alerts, Committed Use Discounts, Recommender, APIs</p>
          <ul>
            <li>Real-time billing reports and visualizations.</li>
            <li>Create cost alerts via Pub/Sub or email.</li>
            <li>Access cost optimization recommendations using AI.</li>
            <li>Leverage discounts via Committed Use or custom pricing.</li>
            <li>Automate budget, billing, and export tasks with Cloud Billing APIs.</li>
          </ul>
          <a
            href="https://cloud.google.com/cost-management"
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle}
          >
            Google Cloud Cost Docs →
          </a>
        </div>

        {/* Comparison Table */}
        <h2 className="text-center" style={{ color: '#1F1F1F', marginTop: '3rem' }}>
          🔍 Feature Comparison
        </h2>
        <div className="table-responsive">
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Feature</th>
                <th style={thStyle}>AWS</th>
                <th style={thStyle}>Azure</th>
                <th style={thStyle}>GCP</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={tdStyle}>Budgets</td>
                <td style={tdStyle}>✅</td>
                <td style={tdStyle}>✅</td>
                <td style={tdStyle}>✅</td>
              </tr>
              <tr>
                <td style={tdStyle}>AI/ML Cost Suggestions</td>
                <td style={tdStyle}>✅</td>
                <td style={tdStyle}>✅ (Advisor)</td>
                <td style={tdStyle}>✅</td>
              </tr>
              <tr>
                <td style={tdStyle}>Multi-cloud Support</td>
                <td style={tdStyle}>❌</td>
                <td style={tdStyle}>✅</td>
                <td style={tdStyle}>❌</td>
              </tr>
              <tr>
                <td style={tdStyle}>Export Reports</td>
                <td style={tdStyle}>✅</td>
                <td style={tdStyle}>✅</td>
                <td style={tdStyle}>✅</td>
              </tr>
              <tr>
                <td style={tdStyle}>Billing APIs</td>
                <td style={tdStyle}>✅</td>
                <td style={tdStyle}>✅</td>
                <td style={tdStyle}>✅</td>
              </tr>
              <tr>
                <td style={tdStyle}>Savings Plans/Discounts</td>
                <td style={tdStyle}>Reserved/Savings Plans</td>
                <td style={tdStyle}>Reserved Instances</td>
                <td style={tdStyle}>Committed Use</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
