import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardTitle, CardImg, CardText, Button, Row, Col, Alert } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Investment = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/plans');
        setPlans(response.data.plans);
      } catch (err) {
        setError('Error fetching investment plans');
        console.error('Error fetching plans:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPlans();
  }, []);

  const handleInvest = (planId) => {
    // In a real app, you would implement the investment logic here
    alert(`Invest in plan ${planId}. This would open a payment screen in a real application.`);
  };

  if (loading) {
    return <div className="text-center mt-5">Loading investment plans...</div>;
  }

  return (
    <div>
      <h2 className="mb-4">Investment Plans</h2>
      
      {error && <Alert color="danger">{error}</Alert>}
      
      <Row>
        {plans.map((plan) => (
          <Col md="4" key={plan.id} className="mb-4">
            <Card className="plan-card h-100">
              <CardImg
                top
                src={plan.imageUrl || "/storage/emulated/0/Download/prime-bottle.jpg"}
                alt={plan.name}
                style={{ height: '200px', objectFit: 'cover' }}
              />
              <CardBody className="d-flex flex-column">
                <CardTitle tag="h5">{plan.name}</CardTitle>
                <CardText>{plan.description}</CardText>
                
                <div className="mt-auto">
                  <CardText tag="h5" className="text-primary">₹{plan.price.toFixed(2)}</CardText>
                  <CardText>
                    <strong>Daily Profit:</strong> {plan.dailyProfitPercentage}%<br />
                    <strong>Duration:</strong> {plan.durationDays} days
                  </CardText>
                  <Button 
                    color="primary" 
                    block 
                    onClick={() => handleInvest(plan.id)}
                  >
                    Invest Now
                  </Button>
                </div>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Investment;