import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TopNavbar from './components/Navbar';
import Home from './pages/Home';
import Discover from './pages/Discover';
import CostComparison from './pages/CostComparison';
import ServiceMapping from './pages/ServiceMapping';
import Report from './pages/Report';
import Footer from './components/footer';
import './index.css';
import Explore from './pages/explore';

function App() {
  useEffect(() => {
    fetch('https://cloudcost-analyz.onrender.com/')
      .then(() => console.log("Backend awake"))
      .catch(() => console.log("Backend wake-up failed"));
  }, []);

  return (
    <Router>
      <TopNavbar />
      <div className="d-flex flex-column min-vh-100">
        <main className="flex-grow-1 px-0" style={{ width: '100%', margin: 0, padding: 0 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/compare" element={<CostComparison />} />
            <Route path="/mapping" element={<ServiceMapping />} />
            <Route path="/report" element={<Report />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
