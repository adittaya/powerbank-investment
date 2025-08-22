import React, { useState, useEffect } from 'react';
import { 
  Card, CardBody, CardTitle, Table, Button, Modal, ModalHeader, 
  ModalBody, ModalFooter, Form, FormGroup, Label, Input, Alert, Row, Col 
} from 'reactstrap';
import axios from 'axios';

const WithdrawalManagement = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modal, setModal] = useState(false);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
  const [settings, setSettings] = useState({
    minimumWithdrawalAmount: 100,
    withdrawalProcessingTime: 24
  });

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const fetchWithdrawals = async () => {
    try {
      // In a real app, you would fetch from the backend
      // const response = await axios.get('http://localhost:3000/api/admin/withdrawals');
      // setWithdrawals(response.data.withdrawals);
      
      // Mock data for demonstration
      setWithdrawals([
        {
          id: 1,
          userId: 1,
          userName: 'John Doe',
          amount: 5000,
          status: 'pending',
          createdAt: '2023-04-15T10:30:00Z'
        },
        {
          id: 2,
          userId: 2,
          userName: 'Jane Smith',
          amount: 2500,
          status: 'approved',
          createdAt: '2023-04-14T14:20:00Z'
        },
        {
          id: 3,
          userId: 3,
          userName: 'Mike Johnson',
          amount: 10000,
          status: 'completed',
          createdAt: '2023-04-10T09:15:00Z'
        },
        {
          id: 4,
          userId: 1,
          userName: 'John Doe',
          amount: 1500,
          status: 'rejected',
          createdAt: '2023-04-05T16:45:00Z'
        }
      ]);
    } catch (err) {
      setError('Error fetching withdrawals');
      console.error('Error fetching withdrawals:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleModal = (withdrawal = null) => {
    setSelectedWithdrawal(withdrawal);
    setModal(!modal);
  };

  const handleUpdateStatus = async (withdrawalId, newStatus) => {
    try {
      // In a real app, you would make an API call to update the withdrawal status
      // await axios.put(`http://localhost:3000/api/admin/withdrawals/${withdrawalId}`, { status: newStatus });
      
      setWithdrawals(withdrawals.map(w => 
        w.id === withdrawalId ? { ...w, status: newStatus } : w
      ));
      
      alert(`Withdrawal status updated to ${newStatus}`);
    } catch (err) {
      setError('Error updating withdrawal status');
      console.error('Error updating withdrawal status:', err);
    }
  };

  const handleProcessWithdrawal = (withdrawal) => {
    toggleModal(withdrawal);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (selectedWithdrawal) {
      handleUpdateStatus(selectedWithdrawal.id, selectedWithdrawal.status);
    }
    
    toggleModal();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedWithdrawal(prev => ({
      ...prev,
      [name]: value
    }));
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

  if (loading) {
    return <div className="text-center mt-5">Loading withdrawals...</div>;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Withdrawal Management</h2>
      </div>
      
      {error && <Alert color="danger">{error}</Alert>}
      
      <Row className="mb-4">
        <Col md="6">
          <Card>
            <CardBody>
              <CardTitle tag="h5">Settings</CardTitle>
              <p><strong>Minimum Withdrawal Amount:</strong> ₹{settings.minimumWithdrawalAmount}</p>
              <p><strong>Processing Time:</strong> {settings.withdrawalProcessingTime} hours</p>
              <Button color="primary">Update Settings</Button>
            </CardBody>
          </Card>
        </Col>
        
        <Col md="6">
          <Card>
            <CardBody>
              <CardTitle tag="h5">Statistics</CardTitle>
              <p><strong>Pending Withdrawals:</strong> {withdrawals.filter(w => w.status === 'pending').length}</p>
              <p><strong>Completed Today:</strong> {withdrawals.filter(w => 
                w.status === 'completed' && 
                new Date(w.createdAt).toDateString() === new Date().toDateString()
              ).length}</p>
              <p><strong>Total Amount Processed:</strong> ₹{withdrawals
                .filter(w => w.status === 'completed')
                .reduce((sum, w) => sum + w.amount, 0)
                .toLocaleString()}</p>
            </CardBody>
          </Card>
        </Col>
      </Row>
      
      <Card>
        <CardBody>
          <CardTitle tag="h5">Withdrawal Requests</CardTitle>
          <Table responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {withdrawals.map(withdrawal => (
                <tr key={withdrawal.id}>
                  <td>{withdrawal.id}</td>
                  <td>{withdrawal.userName}</td>
                  <td>₹{withdrawal.amount.toFixed(2)}</td>
                  <td>{new Date(withdrawal.createdAt).toLocaleString()}</td>
                  <td>{getStatusBadge(withdrawal.status)}</td>
                  <td>
                    {withdrawal.status === 'pending' && (
                      <>
                        <Button 
                          size="sm" 
                          color="success" 
                          className="me-1"
                          onClick={() => handleUpdateStatus(withdrawal.id, 'approved')}
                        >
                          Approve
                        </Button>
                        <Button 
                          size="sm" 
                          color="danger" 
                          className="me-1"
                          onClick={() => handleUpdateStatus(withdrawal.id, 'rejected')}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                    <Button 
                      size="sm" 
                      color="info"
                      onClick={() => handleProcessWithdrawal(withdrawal)}
                    >
                      Process
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </CardBody>
      </Card>
      
      <Modal isOpen={modal} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>
          Process Withdrawal
        </ModalHeader>
        {selectedWithdrawal && (
          <Form onSubmit={handleSubmit}>
            <ModalBody>
              <FormGroup>
                <Label for="userId">User ID</Label>
                <Input
                  type="text"
                  id="userId"
                  name="userId"
                  value={selectedWithdrawal.userId}
                  readOnly
                />
              </FormGroup>
              
              <FormGroup>
                <Label for="userName">User Name</Label>
                <Input
                  type="text"
                  id="userName"
                  name="userName"
                  value={selectedWithdrawal.userName}
                  readOnly
                />
              </FormGroup>
              
              <FormGroup>
                <Label for="amount">Amount (₹)</Label>
                <Input
                  type="text"
                  id="amount"
                  name="amount"
                  value={selectedWithdrawal.amount.toFixed(2)}
                  readOnly
                />
              </FormGroup>
              
              <FormGroup>
                <Label for="status">Status</Label>
                <Input
                  type="select"
                  id="status"
                  name="status"
                  value={selectedWithdrawal.status}
                  onChange={handleChange}
                  required
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="completed">Completed</option>
                  <option value="rejected">Rejected</option>
                </Input>
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" onClick={toggleModal}>
                Cancel
              </Button>
              <Button color="primary" type="submit">
                Update Status
              </Button>
            </ModalFooter>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default WithdrawalManagement;