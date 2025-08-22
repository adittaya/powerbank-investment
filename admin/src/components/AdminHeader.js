import React from 'react';
import { Navbar, Nav, Container, Button } from 'reactstrap';
import { Link, useNavigate } from 'react-router-dom';

const AdminHeader = () => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    // Remove admin token from localStorage (in a real app)
    // localStorage.removeItem('adminToken');
    // Redirect to admin login page
    navigate('/login');
  };

  return (
    <Navbar color="dark" dark expand="md">
      <Container>
        <Link to="/" className="navbar-brand">
          Prime Drink Admin Panel
        </Link>
        <Nav className="ms-auto" navbar>
          <Button color="link" className="nav-link" onClick={handleLogout}>
            Logout
          </Button>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default AdminHeader;