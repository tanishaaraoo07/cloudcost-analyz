// pages/Explore.jsx

import React from 'react';

export default function Explore() {
  return (
    <div style={{ backgroundColor: '#e6fff2', minHeight: '100vh', padding: '2rem' }}>
      <h2 className="text-center mb-4" style={{ color: '#1F1F1F' }}>
        Explore Cloud Providers
      </h2>

      <div className="row justify-content-center">
        {[
          {
            name: 'Amazon Web Services (AWS)',
            desc: 'AWS provides reliable, scalable, and inexpensive cloud computing.',
          },
          {
            name: 'Microsoft Azure',
            desc: 'Azure offers a wide array of cloud services and integrations.',
          },
          {
            name: 'Google Cloud Platform (GCP)',
            desc: 'GCP is known for its AI tools and efficient compute services.',
          },
        ].map((provider, index) => (
          <div key={index} className="col-md-4 mb-4">
            <div
              className="p-4 rounded"
              style={{
                backgroundColor: '#d4edda', // light green
                color: '#000', // black text
                border: '2px solid #25C39F',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                minHeight: '200px',
              }}
            >
              <h4>{provider.name}</h4>
              <p>{provider.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
