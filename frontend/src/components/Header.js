import React from 'react';
import { Navbar, Nav, Container, Button } from 'reactstrap';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    // Remove token from localStorage
    localStorage.removeItem('token');
    // Redirect to login page
    navigate('/login');
  };

  // Check if user is logged in
  const isLoggedIn = localStorage.getItem('token');

  return (
    <Navbar color="dark" dark expand="md">
      <Container>
        <Link to="/" className="navbar-brand">
          Prime Drink Investment
        </Link>
        <Nav className="ms-auto" navbar>
          {isLoggedIn ? (
            <>
              <Link to="/dashboard" className="nav-link">
                Dashboard
              </Link>
              <Link to="/investment" className="nav-link">
                Investment
              </Link>
              <Link to="/recharge" className="nav-link">
                Recharge
              </Link>
              <Link to="/withdrawal" className="nav-link">
                Withdrawal
              </Link>
              <Link to="/referral" className="nav-link">
                Referral
              </Link>
              <Button color="link" className="nav-link" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/register" className="nav-link">
                Register
              </Link>
            </>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Header;