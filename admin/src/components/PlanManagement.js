import React, { useState, useEffect } from 'react';
import { 
  Card, CardBody, CardTitle, Table, Button, Modal, ModalHeader, 
  ModalBody, ModalFooter, Form, FormGroup, Label, Input, Alert, Row, Col 
} from 'reactstrap';
import axios from 'axios';

const PlanManagement = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modal, setModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    dailyProfitPercentage: '',
    durationDays: '',
    imageUrl: '',
    isActive: true
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      // In a real app, you would fetch from the backend
      // const response = await axios.get('http://localhost:3000/api/admin/plans');
      // setPlans(response.data.plans);
      
      // Mock data for demonstration
      setPlans([
        {
          id: 1,
          name: "Prime Drink Plan A",
          description: "Basic investment plan with daily profits",
          price: 1000,
          dailyProfitPercentage: 2.5,
          durationDays: 30,
          imageUrl: "/storage/emulated/0/Download/prime-bottle.jpg",
          isActive: true,
          createdAt: '2023-01-15'
        },
        {
          id: 2,
          name: "Prime Drink Plan B",
          description: "Standard investment plan with higher returns",
          price: 5000,
          dailyProfitPercentage: 3.0,
          durationDays: 60,
          imageUrl: "/storage/emulated/0/Download/prime-bottle.jpg",
          isActive: true,
          createdAt: '2023-02-20'
        },
        {
          id: 3,
          name: "Prime Drink Plan C",
          description: "Premium investment plan with maximum returns",
          price: 10000,
          dailyProfitPercentage: 3.5,
          durationDays: 90,
          imageUrl: "/storage/emulated/0/Download/prime-bottle.jpg",
          isActive: false,
          createdAt: '2023-03-10'
        }
      ]);
    } catch (err) {
      setError('Error fetching plans');
      console.error('Error fetching plans:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleModal = () => {
    setModal(!modal);
    if (!modal) {
      setEditingPlan(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        dailyProfitPercentage: '',
        durationDays: '',
        imageUrl: '',
        isActive: true
      });
    }
  };

  const handleEdit = (plan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      description: plan.description,
      price: plan.price,
      dailyProfitPercentage: plan.dailyProfitPercentage,
      durationDays: plan.durationDays,
      imageUrl: plan.imageUrl,
      isActive: plan.isActive
    });
    toggleModal();
  };

  const handleDelete = (planId) => {
    if (window.confirm('Are you sure you want to delete this plan?')) {
      // In a real app, you would make an API call to delete the plan
      setPlans(plans.filter(plan => plan.id !== planId));
      alert('Plan deleted successfully');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingPlan) {
      // Update existing plan
      setPlans(plans.map(plan => 
        plan.id === editingPlan.id 
          ? { 
              ...plan, 
              ...formData,
              price: parseFloat(formData.price),
              dailyProfitPercentage: parseFloat(formData.dailyProfitPercentage),
              durationDays: parseInt(formData.durationDays)
            } 
          : plan
      ));
      alert('Plan updated successfully');
    } else {
      // Add new plan
      const newPlan = {
        id: plans.length + 1,
        ...formData,
        price: parseFloat(formData.price),
        dailyProfitPercentage: parseFloat(formData.dailyProfitPercentage),
        durationDays: parseInt(formData.durationDays),
        createdAt: new Date().toISOString().split('T')[0]
      };
      setPlans([...plans, newPlan]);
      alert('Plan created successfully');
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
    return <div className="text-center mt-5">Loading plans...</div>;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Plan Management</h2>
        <Button color="primary" onClick={toggleModal}>
          Add New Plan
        </Button>
      </div>
      
      {error && <Alert color="danger">{error}</Alert>}
      
      <Card>
        <CardBody>
          <CardTitle tag="h5">Investment Plans</CardTitle>
          <Table responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Price</th>
                <th>Daily Profit</th>
                <th>Duration</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {plans.map(plan => (
                <tr key={plan.id}>
                  <td>{plan.id}</td>
                  <td>{plan.name}</td>
                  <td>₹{plan.price.toFixed(2)}</td>
                  <td>{plan.dailyProfitPercentage}%</td>
                  <td>{plan.durationDays} days</td>
                  <td>
                    <span className={`badge ${plan.isActive ? 'bg-success' : 'bg-danger'}`}>
                      {plan.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <Button 
                      size="sm" 
                      color="info" 
                      className="me-1"
                      onClick={() => handleEdit(plan)}
                    >
                      Edit
                    </Button>
                    <Button 
                      size="sm" 
                      color="danger"
                      onClick={() => handleDelete(plan.id)}
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
      
      <Modal isOpen={modal} toggle={toggleModal} size="lg">
        <ModalHeader toggle={toggleModal}>
          {editingPlan ? 'Edit Investment Plan' : 'Add New Investment Plan'}
        </ModalHeader>
        <Form onSubmit={handleSubmit}>
          <ModalBody>
            <Row>
              <Col md="6">
                <FormGroup>
                  <Label for="name">Plan Name</Label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="price">Price (₹)</Label>
                  <Input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                  />
                </FormGroup>
              </Col>
            </Row>
            
            <FormGroup>
              <Label for="description">Description</Label>
              <Input
                type="textarea"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
              />
            </FormGroup>
            
            <Row>
              <Col md="6">
                <FormGroup>
                  <Label for="dailyProfitPercentage">Daily Profit Percentage (%)</Label>
                  <Input
                    type="number"
                    id="dailyProfitPercentage"
                    name="dailyProfitPercentage"
                    value={formData.dailyProfitPercentage}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                  />
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="durationDays">Duration (Days)</Label>
                  <Input
                    type="number"
                    id="durationDays"
                    name="durationDays"
                    value={formData.durationDays}
                    onChange={handleChange}
                    required
                    min="1"
                  />
                </FormGroup>
              </Col>
            </Row>
            
            <FormGroup>
              <Label for="imageUrl">Image URL</Label>
              <Input
                type="text"
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
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
                Active Plan
              </Label>
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={toggleModal}>
              Cancel
            </Button>
            <Button color="primary" type="submit">
              {editingPlan ? 'Update Plan' : 'Create Plan'}
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    </div>
  );
};

export default PlanManagement;