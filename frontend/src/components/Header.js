import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Button } from 'reactstrap';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // Decode token to get user info
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser(payload);
      } catch (error) {
        console.error('Error decoding token:', error);
        // If there's an error decoding the token, remove it
        localStorage.removeItem('token');
      }
    }
  }, []);
  
  const handleLogout = () => {
    // Remove token from localStorage
    localStorage.removeItem('token');
    // Clear user state
    setUser(null);
    // Redirect to login page
    navigate('/login');
  };

  return (
    <Navbar color="dark" dark expand="md">
      <Container>
        <Link to="/" className="navbar-brand">
          Prime Drink Investment
        </Link>
        <Nav className="ms-auto" navbar>
          {user ? (
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
              {user.isAdmin && (
                <Link to="/admin" className="nav-link">
                  Admin Panel
                </Link>
              )}
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