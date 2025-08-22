import React, { useState } from 'react';
import { Card, CardBody, CardTitle, Form, FormGroup, Label, Input, Button, Alert, Row, Col } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Recharge = () => {
  const [step, setStep] = useState(1); // 1: Enter amount, 2: Show QR, 3: Enter UTR
  const [amount, setAmount] = useState('');
  const [utrNumber, setUtrNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rechargeDetails, setRechargeDetails] = useState(null);
  const navigate = useNavigate();

  // Fetch recharge details (UPI ID and QR code)
  const fetchRechargeDetails = async () => {
    try {
      // In a real app, you would fetch this from the backend
      setRechargeDetails({
        upiId: "7047571829@upi",
        qrCodeUrl: "/storage/emulated/0/DCIM/QR_1755182073.png"
      });
    } catch (err) {
      setError('Error fetching recharge details');
      console.error('Error fetching recharge details:', err);
    }
  };

  const handleAmountSubmit = (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    setStep(2);
    fetchRechargeDetails();
  };

  const handleCopyUpiId = () => {
    navigator.clipboard.writeText(rechargeDetails?.upiId || '');
    alert('UPI ID copied to clipboard!');
  };

  const handleUtrSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      
      const response = await axios.post('http://localhost:3000/api/recharge', {
        amount,
        utrNumber
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      alert('Recharge request submitted successfully!');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while submitting recharge request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center">
      <Card style={{ width: '100%', maxWidth: '500px' }}>
        <CardBody>
          <CardTitle tag="h3" className="text-center mb-4">
            {step === 1 && "Recharge Amount"}
            {step === 2 && "Scan QR Code"}
            {step === 3 && "Submit UTR Number"}
          </CardTitle>
          
          {error && <Alert color="danger">{error}</Alert>}
          
          {step === 1 && (
            <Form onSubmit={handleAmountSubmit}>
              <FormGroup>
                <Label for="amount">Recharge Amount (₹)</Label>
                <Input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  min="1"
                  step="0.01"
                />
              </FormGroup>
              
              <Button color="primary" block>
                Proceed to Payment
              </Button>
            </Form>
          )}
          
          {step === 2 && rechargeDetails && (
            <div className="text-center">
              <p>Pay exactly ₹{amount} to the following QR code or UPI ID:</p>
              
              <div className="my-4">
                <img 
                  src={rechargeDetails.qrCodeUrl || "/storage/emulated/0/DCIM/QR_1755182073.png"} 
                  alt="QR Code" 
                  style={{ maxWidth: '200px', height: 'auto' }}
                />
              </div>
              
              <div className="my-3">
                <p><strong>UPI ID:</strong> {rechargeDetails.upiId}</p>
                <Button color="info" onClick={handleCopyUpiId}>
                  Tap to Copy UPI ID
                </Button>
              </div>
              
              <div className="d-grid gap-2">
                <Button color="primary" onClick={() => setStep(3)}>
                  I've Paid, Proceed to Submit UTR
                </Button>
                <Button color="secondary" onClick={() => setStep(1)}>
                  Back
                </Button>
              </div>
            </div>
          )}
          
          {step === 3 && (
            <Form onSubmit={handleUtrSubmit}>
              <FormGroup>
                <Label for="utrNumber">UTR Number</Label>
                <Input
                  type="text"
                  id="utrNumber"
                  value={utrNumber}
                  onChange={(e) => setUtrNumber(e.target.value)}
                  required
                  placeholder="Enter the UTR number from your payment"
                />
                <small className="text-muted">
                  The UTR number can be found in your bank's transaction details
                </small>
              </FormGroup>
              
              <Row>
                <Col>
                  <Button color="secondary" block onClick={() => setStep(2)}>
                    Back
                  </Button>
                </Col>
                <Col>
                  <Button color="primary" block disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit UTR'}
                  </Button>
                </Col>
              </Row>
            </Form>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default Recharge;