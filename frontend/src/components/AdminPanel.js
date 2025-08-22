import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardTitle, Row, Col, Button, Table, Alert } from 'reactstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
  const [dashboardData, setDashboardData] = useState({
    totalDeposits: 0,
    totalWithdrawals: 0,
    activeUsers: 0,
    totalUsers: 0
  });
  const [users, setUsers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        // Fetch dashboard data
        const dashboardResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/dashboard`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setDashboardData(dashboardResponse.data);

        // Fetch users
        const usersResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/users`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setUsers(usersResponse.data.users);

        // Fetch plans
        const plansResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/plans`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setPlans(plansResponse.data.plans);

        // Fetch withdrawals
        const withdrawalsResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/withdrawals`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setWithdrawals(withdrawalsResponse.data.withdrawals);

        // Fetch transactions
        const transactionsResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/transactions`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setTransactions(transactionsResponse.data.transactions);

        setLoading(false);
      } catch (err) {
        if (err.response && err.response.status === 403) {
          setError('Access denied. Admin rights required.');
        } else if (err.response && err.response.status === 401) {
          // Token is invalid or expired
          localStorage.removeItem('token');
          navigate('/login');
        } else {
          setError('Error fetching admin data');
        }
        console.error('Error fetching admin data:', err);
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [navigate]);

  const handleApproveWithdrawal = async (withdrawalId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      
      await axios.put(`${process.env.REACT_APP_API_URL}/api/admin/withdrawals/${withdrawalId}`, 
        { status: 'approved' },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      // Update local state
      setWithdrawals(withdrawals.map(w => 
        w.id === withdrawalId ? { ...w, status: 'approved' } : w
      ));
      
      alert('Withdrawal approved successfully');
    } catch (err) {
      if (err.response && err.response.status === 401) {
        // Token is invalid or expired
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        alert('Error approving withdrawal');
        console.error('Error approving withdrawal:', err);
      }
    }
  };

  const handleRejectWithdrawal = async (withdrawalId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      
      await axios.put(`${process.env.REACT_APP_API_URL}/api/admin/withdrawals/${withdrawalId}`, 
        { status: 'rejected' },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      // Update local state
      setWithdrawals(withdrawals.map(w => 
        w.id === withdrawalId ? { ...w, status: 'rejected' } : w
      ));
      
      alert('Withdrawal rejected successfully');
    } catch (err) {
      if (err.response && err.response.status === 401) {
        // Token is invalid or expired
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        alert('Error rejecting withdrawal');
        console.error('Error rejecting withdrawal:', err);
      }
    }
  };

  const handleCompleteWithdrawal = async (withdrawalId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      
      await axios.put(`${process.env.REACT_APP_API_URL}/api/admin/withdrawals/${withdrawalId}`, 
        { status: 'completed' },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      // Update local state
      setWithdrawals(withdrawals.map(w => 
        w.id === withdrawalId ? { ...w, status: 'completed' } : w
      ));
      
      alert('Withdrawal marked as completed successfully');
    } catch (err) {
      if (err.response && err.response.status === 401) {
        // Token is invalid or expired
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        alert('Error completing withdrawal');
        console.error('Error completing withdrawal:', err);
      }
    }
  };

  const handleApproveRecharge = async (transactionId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      
      await axios.put(`${process.env.REACT_APP_API_URL}/api/admin/transactions/${transactionId}/approve`, 
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      // Update local state
      setTransactions(transactions.map(t => 
        t.id === transactionId ? { ...t, status: 'completed' } : t
      ));
      
      // Also update the user's withdrawal wallet in the users list
      const transaction = transactions.find(t => t.id === transactionId);
      if (transaction) {
        setUsers(users.map(u => 
          u.id === transaction.userId ? { ...u, withdrawalWallet: u.withdrawalWallet + transaction.amount } : u
        ));
      }
      
      alert('Recharge approved successfully');
    } catch (err) {
      if (err.response && err.response.status === 401) {
        // Token is invalid or expired
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        alert('Error approving recharge');
        console.error('Error approving recharge:', err);
      }
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

  if (loading) {
    return <div className="text-center mt-5">Loading admin panel...</div>;
  }

  return (
    <div>
      <h2 className="mb-4">Admin Panel</h2>
      
      {error && <Alert color="danger">{error}</Alert>}
      
      <Row>
        <Col md="3">
          <Card className="mb-4 bg-primary text-white">
            <CardBody>
              <CardTitle tag="h5">Total Deposits</CardTitle>
              <h3>₹{dashboardData.totalDeposits.toLocaleString()}</h3>
            </CardBody>
          </Card>
        </Col>
        
        <Col md="3">
          <Card className="mb-4 bg-success text-white">
            <CardBody>
              <CardTitle tag="h5">Total Withdrawals</CardTitle>
              <h3>₹{dashboardData.totalWithdrawals.toLocaleString()}</h3>
            </CardBody>
          </Card>
        </Col>
        
        <Col md="3">
          <Card className="mb-4 bg-warning text-white">
            <CardBody>
              <CardTitle tag="h5">Active Users</CardTitle>
              <h3>{dashboardData.activeUsers}</h3>
            </CardBody>
          </Card>
        </Col>
        
        <Col md="3">
          <Card className="mb-4 bg-info text-white">
            <CardBody>
              <CardTitle tag="h5">Total Users</CardTitle>
              <h3>{dashboardData.totalUsers}</h3>
            </CardBody>
          </Card>
        </Col>
      </Row>
      
      <Row>
        <Col md="12">
          <Card className="mb-4">
            <CardBody>
              <CardTitle tag="h5">Pending Recharge Requests</CardTitle>
              {transactions.filter(t => t.transactionType === 'recharge' && t.status === 'pending').length > 0 ? (
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  <Table responsive>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>User</th>
                        <th>Amount</th>
                        <th>UTR Number</th>
                        <th>Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions
                        .filter(t => t.transactionType === 'recharge' && t.status === 'pending')
                        .map(transaction => (
                          <tr key={transaction.id}>
                            <td>{transaction.id}</td>
                            <td>{users.find(u => u.id === transaction.userId)?.username || 'Unknown'}</td>
                            <td>₹{transaction.amount.toFixed(2)}</td>
                            <td>{transaction.utrNumber}</td>
                            <td>{new Date(transaction.createdAt).toLocaleString()}</td>
                            <td>
                              <Button 
                                size="sm" 
                                color="success" 
                                className="me-1"
                                onClick={() => handleApproveRecharge(transaction.id)}
                              >
                                Approve
                              </Button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </Table>
                </div>
              ) : (
                <p>No pending recharge requests found.</p>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
      
      <Row>
        <Col md="12">
          <Card className="mb-4">
            <CardBody>
              <CardTitle tag="h5">Recent Withdrawal Requests</CardTitle>
              {withdrawals.length > 0 ? (
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
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
                          <td>{users.find(u => u.id === withdrawal.userId)?.username || 'Unknown'}</td>
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
                                  onClick={() => handleApproveWithdrawal(withdrawal.id)}
                                >
                                  Approve
                                </Button>
                                <Button 
                                  size="sm" 
                                  color="danger"
                                  onClick={() => handleRejectWithdrawal(withdrawal.id)}
                                >
                                  Reject
                                </Button>
                              </>
                            )}
                            {withdrawal.status === 'approved' && (
                              <Button 
                                size="sm" 
                                color="success" 
                                onClick={() => handleCompleteWithdrawal(withdrawal.id)}
                              >
                                Mark as Completed
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              ) : (
                <p>No withdrawal requests found.</p>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
      
      <Row>
        <Col md="6">
          <Card className="mb-4">
            <CardBody>
              <CardTitle tag="h5">Investment Plans</CardTitle>
              {plans.length > 0 ? (
                <Table responsive>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Price</th>
                      <th>Daily Profit</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {plans.map(plan => (
                      <tr key={plan.id}>
                        <td>{plan.id}</td>
                        <td>{plan.name}</td>
                        <td>₹{plan.price.toFixed(2)}</td>
                        <td>{plan.dailyProfitPercentage}%</td>
                        <td>
                          <span className={`badge ${plan.isActive ? 'bg-success' : 'bg-danger'}`}>
                            {plan.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <p>No investment plans found.</p>
              )}
            </CardBody>
          </Card>
        </Col>
        
        <Col md="6">
          <Card className="mb-4">
            <CardBody>
              <CardTitle tag="h5">Users</CardTitle>
              {users.length > 0 ? (
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  <Table responsive>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Username</th>
                        <th>Withdrawal Wallet</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(user => (
                        <tr key={user.id}>
                          <td>{user.id}</td>
                          <td>{user.name}</td>
                          <td>{user.username}</td>
                          <td>₹{user.withdrawalWallet ? user.withdrawalWallet.toFixed(2) : '0.00'}</td>
                          <td>
                            <span className={`badge ${user.isActive !== false ? 'bg-success' : 'bg-danger'}`}>
                              {user.isActive !== false ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              ) : (
                <p>No users found.</p>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminPanel;