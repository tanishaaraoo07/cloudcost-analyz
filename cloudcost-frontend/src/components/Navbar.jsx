import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Navbar, Nav, Container, Button, Modal, Form } from 'react-bootstrap';
import { login, signup } from '../api'; // ✅ Now uses authApi under the hood

function TopNavbar() {
  const [showModal, setShowModal] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [authData, setAuthData] = useState({ name: '', email: '', password: '' });
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) setIsAuthenticated(true);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    alert("👋 Logged out successfully.");
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = isLoginMode
        ? await login(authData)
        : await signup(authData);

      if (res.data.token) {
        localStorage.setItem('authToken', res.data.token);
        setIsAuthenticated(true);
        setShowModal(false);
        alert('✅ Logged in successfully!');
      } else {
        alert(res.data.message || 'Authentication failed.');
      }
    } catch (err) {
      alert('❌ ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <>
      <Navbar style={{ backgroundColor: '#25C39F' }} variant="dark" expand="md" sticky="top">
        <Container fluid>
          <Navbar.Brand href="/" className="fw-bold">🌐 CloudCost Analyzer</Navbar.Brand>
          <Navbar.Toggle aria-controls="main-navbar" />
          <Navbar.Collapse id="main-navbar">
            <Nav className="ms-auto d-flex gap-3 align-items-center">
              <NavLink to="/" className="nav-link text-white">Home</NavLink>
              <NavLink to="/discover" className="nav-link text-white">Discovery</NavLink>
              <NavLink to="/compare" className="nav-link text-white">Cost Comparison</NavLink>
              <NavLink to="/mapping" className="nav-link text-white">Service Mapping</NavLink>
              <NavLink to="/report" className="nav-link text-white">Report</NavLink>

              {isAuthenticated ? (
                <>
                  <span className="nav-link text-light">✅ Logged in</span>
                  <Button variant="outline-light" size="sm" onClick={handleLogout}>
                    Logout
                  </Button>
                </>
              ) : (
                <Button variant="outline-light" size="sm" onClick={() => setShowModal(true)}>
                  Login / Sign Up
                </Button>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* 🔐 Auth Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{isLoginMode ? 'Login' : 'Sign Up'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAuthSubmit}>
            {!isLoginMode && (
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  required
                  type="text"
                  value={authData.name}
                  onChange={(e) => setAuthData({ ...authData, name: e.target.value })}
                />
              </Form.Group>
            )}
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                required
                type="email"
                value={authData.email}
                onChange={(e) => setAuthData({ ...authData, email: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                required
                type="password"
                value={authData.password}
                onChange={(e) => setAuthData({ ...authData, password: e.target.value })}
              />
            </Form.Group>
            <Button type="submit" className="w-100 btn-success">
              {isLoginMode ? 'Login' : 'Sign Up'}
            </Button>
            <div className="text-center mt-2">
              <Button variant="link" onClick={() => setIsLoginMode(!isLoginMode)}>
                {isLoginMode ? 'New user? Sign Up' : 'Already have an account? Login'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default TopNavbar;
