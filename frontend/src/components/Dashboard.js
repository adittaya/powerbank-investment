import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardTitle, Row, Col, Button } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/profile`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setUser(response.data.user);
      } catch (err) {
        console.error('Error fetching user profile:', err);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [navigate]);

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  if (!user) {
    return <div className="text-center mt-5">Error loading user data</div>;
  }

  return (
    <div>
      <h2 className="mb-4">Dashboard</h2>
      
      <Row>
        <Col md="4">
          <Card className="mb-4 card-primary">
            <CardBody>
              <CardTitle tag="h5">Total Balance</CardTitle>
              <h3>₹{user.balance.toFixed(2)}</h3>
            </CardBody>
          </Card>
        </Col>
        
        <Col md="4">
          <Card className="mb-4 card-success">
            <CardBody>
              <CardTitle tag="h5">Daily Earnings</CardTitle>
              <h3>₹{user.earnings.toFixed(2)}</h3>
            </CardBody>
          </Card>
        </Col>
        
        <Col md="4">
          <Card className="mb-4 card-warning">
            <CardBody>
              <CardTitle tag="h5">Withdrawal Wallet</CardTitle>
              <h3>₹{user.withdrawalWallet.toFixed(2)}</h3>
            </CardBody>
          </Card>
        </Col>
      </Row>
      
      <Row>
        <Col md="12">
          <Card className="mb-4">
            <CardBody>
              <CardTitle tag="h5">Active Investments</CardTitle>
              {user.investments && user.investments.length > 0 ? (
                <div>
                  {user.investments.map((investment, index) => (
                    <div key={index} className="border-bottom pb-2 mb-2">
                      <h6>{investment.planName}</h6>
                      <p className="mb-1">Amount: ₹{investment.amount.toFixed(2)}</p>
                      <p className="mb-0">Status: {investment.status}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No active investments. <Button color="link" onClick={() => navigate('/investment')}>Invest now</Button></p>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
      
      <Row>
        <Col md="6">
          <Card className="mb-4 card-info">
            <CardBody>
              <CardTitle tag="h5">Referral Code</CardTitle>
              <h3>{user.referralCode}</h3>
              <p>Share this code with friends to earn commissions!</p>
              <Button 
                color="primary" 
                onClick={() => {
                  navigator.clipboard.writeText(user.referralCode);
                  alert('Referral code copied to clipboard!');
                }}
              >
                Copy Code
              </Button>
            </CardBody>
          </Card>
        </Col>
        
        <Col md="6">
          <Card className="mb-4">
            <CardBody>
              <CardTitle tag="h5">Quick Actions</CardTitle>
              <div className="d-grid gap-2">
                <Button color="primary" onClick={() => navigate('/recharge')}>Recharge</Button>
                <Button color="success" onClick={() => navigate('/investment')}>Invest</Button>
                <Button color="warning" onClick={() => navigate('/withdrawal')}>Withdraw</Button>
                <Button color="info" onClick={() => navigate('/referral')}>Referral Program</Button>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;