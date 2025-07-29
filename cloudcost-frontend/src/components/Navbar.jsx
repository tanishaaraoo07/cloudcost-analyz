import React from 'react';
import { NavLink } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';

function TopNavbar() {
  return (
    <Navbar style={{ backgroundColor: '#25C39F' }} variant="dark" expand="md" sticky="top">
      <Container fluid>
        <Navbar.Brand href="/" className="fw-bold">🌐 CloudCost Analyzer</Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar">
          <Nav className="ms-auto d-flex gap-3">
            <NavLink to="/" className="nav-link text-white">Home</NavLink>
            <NavLink to="/discover" className="nav-link text-white">Discovery</NavLink>
            <NavLink to="/compare" className="nav-link text-white">Cost Comparison</NavLink>
            <NavLink to="/mapping" className="nav-link text-white">Service Mapping</NavLink>
            <NavLink to="/report" className="nav-link text-white">Report</NavLink>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default TopNavbar;
