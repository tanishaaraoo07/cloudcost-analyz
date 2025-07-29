import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-light text-center py-3 mt-auto">
      <div className="container">
        <p className="mb-0 text-muted">
          &copy; {new Date().getFullYear()} CloudCost Analyzer. Built with ❤️ using React & FastAPI.
        </p>
      </div>
    </footer>
  );
}
