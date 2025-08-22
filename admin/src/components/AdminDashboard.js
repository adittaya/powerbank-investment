import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardTitle, Row, Col } from 'reactstrap';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import axios from 'axios';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalDeposits: 0,
    totalWithdrawals: 0,
    activeUsers: 0,
    totalUsers: 0
  });
  
  const [chartData, setChartData] = useState({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Deposits',
        data: [12000, 19000, 15000, 18000, 22000, 19500],
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
      {
        label: 'Withdrawals',
        data: [8000, 11000, 9500, 12000, 15000, 13000],
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      }
    ]
  });

  useEffect(() => {
    // In a real app, you would fetch this data from the backend
    // fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/admin/dashboard');
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Transactions',
      },
    },
  };

  return (
    <div>
      <h2 className="mb-4">Admin Dashboard</h2>
      
      <Row>
        <Col md="3">
          <Card className="mb-4 card-admin bg-admin-primary text-white">
            <CardBody>
              <CardTitle tag="h5">Total Deposits</CardTitle>
              <h3>₹{dashboardData.totalDeposits.toLocaleString()}</h3>
            </CardBody>
          </Card>
        </Col>
        
        <Col md="3">
          <Card className="mb-4 card-admin bg-admin-success text-white">
            <CardBody>
              <CardTitle tag="h5">Total Withdrawals</CardTitle>
              <h3>₹{dashboardData.totalWithdrawals.toLocaleString()}</h3>
            </CardBody>
          </Card>
        </Col>
        
        <Col md="3">
          <Card className="mb-4 card-admin bg-admin-warning text-white">
            <CardBody>
              <CardTitle tag="h5">Active Users</CardTitle>
              <h3>{dashboardData.activeUsers}</h3>
            </CardBody>
          </Card>
        </Col>
        
        <Col md="3">
          <Card className="mb-4 card-admin bg-admin-info text-white">
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
              <Bar options={options} data={chartData} />
            </CardBody>
          </Card>
        </Col>
      </Row>
      
      <Row>
        <Col md="6">
          <Card className="mb-4">
            <CardBody>
              <CardTitle tag="h5">Recent Activities</CardTitle>
              <ul>
                <li>User JohnDoe made a deposit of ₹5,000</li>
                <li>User JaneSmith requested withdrawal of ₹2,500</li>
                <li>New investment plan "Premium Plan" was added</li>
                <li>User MikeJohnson referred 2 new users</li>
              </ul>
            </CardBody>
          </Card>
        </Col>
        
        <Col md="6">
          <Card className="mb-4">
            <CardBody>
              <CardTitle tag="h5">System Status</CardTitle>
              <ul>
                <li>Server: <span className="badge bg-success">Online</span></li>
                <li>Database: <span className="badge bg-success">Connected</span></li>
                <li>API Response Time: 45ms</li>
                <li>Last Backup: Today, 02:00 AM</li>
              </ul>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;