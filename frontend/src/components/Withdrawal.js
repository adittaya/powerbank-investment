import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardTitle, Form, FormGroup, Label, Input, Button, Alert, Table, Row, Col } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Withdrawal = () => {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [withdrawals, setWithdrawals] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        
        // Fetch user profile to get withdrawal wallet balance
        const userResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/profile`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setUser(userResponse.data.user);
        
        // Fetch withdrawal history
        const withdrawalsResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/withdrawals`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setWithdrawals(withdrawalsResponse.data.withdrawals);
        
        // Fetch transaction history
        const transactionsResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/transactions`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setTransactions(transactionsResponse.data.transactions);
      } catch (err) {
        setError('Error fetching data');
        console.error('Error fetching data:', err);
      }
    };
    
    fetchData();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    // Validate amount
    if (!amount || parseFloat(amount) < 100) {
      setError('Minimum withdrawal amount is ₹100');
      setLoading(false);
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/withdraw`, {
        amount
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setSuccess('Withdrawal request submitted successfully!');
      setAmount('');
      
      // Refresh withdrawals list
      const withdrawalsResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/withdrawals`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setWithdrawals(withdrawalsResponse.data.withdrawals);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while submitting withdrawal request');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="badge bg-warning">Pending</span>;
      case 'approved':
        return <span className="badge bg-primary">Approved</span>;
      case 'completed':
        return <span className="badge bg-success">Completed</span>;
      case 'rejected':
        return <span className="badge bg-danger">Rejected</span>;
      default:
        return <span className="badge bg-secondary">{status}</span>;
    }
  };

  return (
    <div>
      <h2 className="mb-4">Withdrawal</h2>
      
      <Row className="mb-4">
        <Col md="12">
          <h4>Transaction History</h4>
          {transactions && transactions.length > 0 ? (
            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
              <Table responsive size="sm">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map(transaction => (
                    <tr key={transaction.id}>
                      <td>{transaction.createdAt ? new Date(transaction.createdAt).toLocaleDateString() : 'N/A'}</td>
                      <td>{transaction.transactionType || 'N/A'}</td>
                      <td>₹{transaction.amount ? transaction.amount.toFixed(2) : '0.00'}</td>
                      <td>{getStatusBadge(transaction.status || 'unknown')}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          ) : (
            <p>No transaction history found.</p>
          )}
        </Col>
      </Row>
      
      <Row className="mb-4">
        <Col md="12">
          <h4>Withdrawal History</h4>
          {withdrawals && withdrawals.length > 0 ? (
            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
              <Table responsive size="sm">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {withdrawals.map(withdrawal => (
                    <tr key={withdrawal.id}>
                      <td>{withdrawal.createdAt ? new Date(withdrawal.createdAt).toLocaleDateString() : 'N/A'}</td>
                      <td>₹{withdrawal.amount ? withdrawal.amount.toFixed(2) : '0.00'}</td>
                      <td>{getStatusBadge(withdrawal.status || 'unknown')}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          ) : (
            <p>No withdrawal history found.</p>
          )}
        </Col>
      </Row>
      
      <Row>
        <Col md="6">
          <Card className="mb-4">
            <CardBody>
              <CardTitle tag="h5">Request Withdrawal</CardTitle>
              
              {user && (
                <div className="mb-3">
                  <p><strong>Available Balance:</strong> ₹{user.withdrawalWallet ? user.withdrawalWallet.toFixed(2) : '0.00'}</p>
                </div>
              )}
              
              {error && <Alert color="danger">{error}</Alert>}
              {success && <Alert color="success">{success}</Alert>}
              
              <Form onSubmit={handleSubmit}>
                <FormGroup>
                  <Label for="amount">Withdrawal Amount (₹)</Label>
                  <Input
                    type="number"
                    id="amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    min="100"
                    step="0.01"
                    placeholder="Minimum ₹100"
                  />
                  <small className="text-muted">
                    Minimum withdrawal amount is ₹100
                  </small>
                </FormGroup>
                
                <Button color="primary" block disabled={loading}>
                  {loading ? 'Processing...' : 'Request Withdrawal'}
                </Button>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Withdrawal;