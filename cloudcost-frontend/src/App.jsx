
import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Discover from './pages/Discover';
import CostComparison from './pages/CostComparison';
import ServiceMapping from './pages/ServiceMapping';
import Report from './pages/Report';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="d-flex">
        <Sidebar />
        <div className="container-fluid p-4" style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/compare" element={<CostComparison />} />
            <Route path="/mapping" element={<ServiceMapping />} />
            <Route path="/report" element={<Report />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
export default App;

useEffect(() => {
  fetch('https://cloudcost-analyz.onrender.com/')
    .then(() => console.log("Backend awake"))
    .catch(() => console.log("Backend wake-up failed"));
}, []);

