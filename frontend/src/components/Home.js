import React from 'react';
import { Card, CardBody, CardTitle, CardText, Button, Row, Col } from 'reactstrap';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  
  const handleGetStarted = () => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
  };

  return (
    <div className="container">
      <Row className="justify-content-center">
        <Col md="8" className="text-center">
          <h1 className="display-4 mb-4">Prime Drink Investment</h1>
          <p className="lead mb-4">
            Invest in our premium power bank plans and earn daily profits. Join thousands of satisfied investors today!
          </p>
          <Button color="primary" size="lg" onClick={handleGetStarted}>
            Get Started
          </Button>
        </Col>
      </Row>
      
      <Row className="mt-5">
        <Col md="4">
          <Card className="h-100">
            <CardBody>
              <CardTitle tag="h5">Daily Profits</CardTitle>
              <CardText>
                Earn consistent daily profits from your investments with our premium plans.
              </CardText>
            </CardBody>
          </Card>
        </Col>
        <Col md="4">
          <Card className="h-100">
            <CardBody>
              <CardTitle tag="h5">Referral System</CardTitle>
              <CardText>
                Earn commissions by referring friends to our platform. 30% for Level 1 referrals!
              </CardText>
            </CardBody>
          </Card>
        </Col>
        <Col md="4">
          <Card className="h-100">
            <CardBody>
              <CardTitle tag="h5">Secure & Reliable</CardTitle>
              <CardText>
                Your investments are secure with our advanced security measures and professional team.
              </CardText>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Home;