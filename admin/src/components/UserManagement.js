import React, { useState, useEffect } from 'react';
import { 
  Card, CardBody, CardTitle, Table, Button, Modal, ModalHeader, 
  ModalBody, ModalFooter, Form, FormGroup, Label, Input, Alert 
} from 'reactstrap';
import axios from 'axios';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modal, setModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    mobileNumber: '',
    username: '',
    isActive: true
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // In a real app, you would fetch from the backend
      // const response = await axios.get('http://localhost:3000/api/admin/users');
      // setUsers(response.data.users);
      
      // Mock data for demonstration
      setUsers([
        {
          id: 1,
          name: 'John Doe',
          mobileNumber: '9876543210',
          username: 'johndoe',
          referralCode: 'ABC123',
          referredBy: null,
          balance: 5000,
          earnings: 250,
          withdrawalWallet: 1000,
          createdAt: '2023-01-15',
          isActive: true
        },
        {
          id: 2,
          name: 'Jane Smith',
          mobileNumber: '9876543211',
          username: 'janesmith',
          referralCode: 'DEF456',
          referredBy: 'ABC123',
          balance: 10000,
          earnings: 500,
          withdrawalWallet: 2000,
          createdAt: '2023-02-20',
          isActive: true
        },
        {
          id: 3,
          name: 'Mike Johnson',
          mobileNumber: '9876543212',
          username: 'mikej',
          referralCode: 'GHI789',
          referredBy: 'DEF456',
          balance: 7500,
          earnings: 375,
          withdrawalWallet: 1500,
          createdAt: '2023-03-10',
          isActive: false
        }
      ]);
    } catch (err) {
      setError('Error fetching users');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleModal = () => {
    setModal(!modal);
    if (!modal) {
      setEditingUser(null);
      setFormData({
        name: '',
        mobileNumber: '',
        username: '',
        isActive: true
      });
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      mobileNumber: user.mobileNumber,
      username: user.username,
      isActive: user.isActive
    });
    toggleModal();
  };

  const handleDelete = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      // In a real app, you would make an API call to delete the user
      setUsers(users.filter(user => user.id !== userId));
      alert('User deleted successfully');
    }
  };

  const handleResetPassword = (userId) => {
    // In a real app, you would make an API call to reset the user's password
    alert(`Password reset instructions sent to user ID: ${userId}`);
  };

  const handleToggleStatus = (userId) => {
    // In a real app, you would make an API call to toggle user status
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, isActive: !user.isActive } 
        : user
    ));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingUser) {
      // Update existing user
      setUsers(users.map(user => 
        user.id === editingUser.id 
          ? { ...user, ...formData } 
          : user
      ));
      alert('User updated successfully');
    } else {
      // Add new user
      const newUser = {
        id: users.length + 1,
        ...formData,
        referralCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
        referredBy: null,
        balance: 0,
        earnings: 0,
        withdrawalWallet: 0,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setUsers([...users, newUser]);
      alert('User created successfully');
    }
    
    toggleModal();
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  if (loading) {
    return <div className="text-center mt-5">Loading users...</div>;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>User Management</h2>
        <Button color="primary" onClick={toggleModal}>
          Add New User
        </Button>
      </div>
      
      {error && <Alert color="danger">{error}</Alert>}
      
      <Card>
        <CardBody>
          <CardTitle tag="h5">All Users</CardTitle>
          <Table responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Mobile</th>
                <th>Username</th>
                <th>Referral Code</th>
                <th>Balance</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.mobileNumber}</td>
                  <td>{user.username}</td>
                  <td>{user.referralCode}</td>
                  <td>₹{user.balance.toFixed(2)}</td>
                  <td>
                    <span className={`badge ${user.isActive ? 'bg-success' : 'bg-danger'}`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <Button 
                      size="sm" 
                      color="info" 
                      className="me-1"
                      onClick={() => handleEdit(user)}
                    >
                      Edit
                    </Button>
                    <Button 
                      size="sm" 
                      color="warning" 
                      className="me-1"
                      onClick={() => handleResetPassword(user.id)}
                    >
                      Reset Password
                    </Button>
                    <Button 
                      size="sm" 
                      color={user.isActive ? 'secondary' : 'success'}
                      className="me-1"
                      onClick={() => handleToggleStatus(user.id)}
                    >
                      {user.isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button 
                      size="sm" 
                      color="danger"
                      onClick={() => handleDelete(user.id)}
                    >
                      Delete
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
          {editingUser ? 'Edit User' : 'Add New User'}
        </ModalHeader>
        <Form onSubmit={handleSubmit}>
          <ModalBody>
            <FormGroup>
              <Label for="name">Name</Label>
              <Input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </FormGroup>
            
            <FormGroup>
              <Label for="mobileNumber">Mobile Number</Label>
              <Input
                type="text"
                id="mobileNumber"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                required
              />
            </FormGroup>
            
            <FormGroup>
              <Label for="username">Username</Label>
              <Input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </FormGroup>
            
            <FormGroup check>
              <Input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
              />
              <Label check for="isActive">
                Active User
              </Label>
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={toggleModal}>
              Cancel
            </Button>
            <Button color="primary" type="submit">
              {editingUser ? 'Update User' : 'Create User'}
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;