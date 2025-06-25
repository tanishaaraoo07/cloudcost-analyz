import { Link } from 'react-router-dom';

export default function Sidebar() {
  return (
    <div className="bg-light p-3" style={{ width: '200px', minHeight: '100vh' }}>
      <h5>CloudCost Analyzer</h5>
      <ul className="nav flex-column">
        <li className="nav-item">
          <Link to="/" className="nav-link">Home</Link>
        </li>
        <li className="nav-item">
          <Link to="/discover" className="nav-link">Discovery</Link>
        </li>
        <li className="nav-item">
          <Link to="/compare" className="nav-link">Cost Comparison</Link>
        </li>
        <li className="nav-item">
          <Link to="/mapping" className="nav-link">Service Mapping</Link>
        </li>
        <li className="nav-item">
          <Link to="/report" className="nav-link">Report</Link>
        </li>
      </ul>
    </div>
  );
}
