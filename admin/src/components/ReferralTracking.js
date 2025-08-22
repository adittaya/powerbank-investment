import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardTitle, Table, Button, Alert, Row, Col } from 'reactstrap';

const ReferralTracking = () => {
  const [commissions, setCommissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCommissions();
  }, []);

  const fetchCommissions = async () => {
    try {
      // In a real app, you would fetch from the backend
      
      // Mock data for demonstration
      setCommissions([
        {
          id: 1,
          referrerName: 'John Doe',
          referrerId: 1,
          referredName: 'Jane Smith',
          referredId: 2,
          commissionLevel: 1,
          commissionAmount: 1500,
          investmentId: 101,
          createdAt: '2023-04-15T10:30:00Z'
        },
        {
          id: 2,
          referrerName: 'Jane Smith',
          referrerId: 2,
          referredName: 'Mike Johnson',
          referredId: 3,
          commissionLevel: 1,
          commissionAmount: 750,
          investmentId: 102,
          createdAt: '2023-04-14T14:20:00Z'
        },
        {
          id: 3,
          referrerName: 'John Doe',
          referrerId: 1,
          referredName: 'Mike Johnson',
          referredId: 3,
          commissionLevel: 2,
          commissionAmount: 50,
          investmentId: 102,
          createdAt: '2023-04-14T14:20:00Z'
        }
      ]);
    } catch (err) {
      setError('Error fetching commissions');
      console.error('Error fetching commissions:', err);
    } finally {
      setLoading(false);
    }
  };

  const getLevelBadge = (level) => {
    switch (level) {
      case 1:
        return <span className="badge bg-primary">Level 1</span>;
      case 2:
        return <span className="badge bg-success">Level 2</span>;
      case 3:
        return <span className="badge bg-warning">Level 3</span>;
      default:
        return <span className="badge bg-secondary">Level {level}</span>;
    }
  };

  if (loading) {
    return <div className="text-center mt-5">Loading referral data...</div>;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Referral Tracking</h2>
      </div>
      
      {error && <Alert color="danger">{error}</Alert>}
      
      <Row className="mb-4">
        <Col md="4">
          <Card>
            <CardBody>
              <CardTitle tag="h5">Level 1 Commission</CardTitle>
              <h3 className="text-primary">30%</h3>
              <p>Direct referrals</p>
            </CardBody>
          </Card>
        </Col>
        
        <Col md="4">
          <Card>
            <CardBody>
              <CardTitle tag="h5">Level 2 Commission</CardTitle>
              <h3 className="text-success">2%</h3>
              <p>Indirect referrals</p>
            </CardBody>
          </Card>
        </Col>
        
        <Col md="4">
          <Card>
            <CardBody>
              <CardTitle tag="h5">Level 3 Commission</CardTitle>
              <h3 className="text-warning">1%</h3>
              <p>Third-level referrals</p>
            </CardBody>
          </Card>
        </Col>
      </Row>
      
      <Card>
        <CardBody>
          <CardTitle tag="h5">Referral Commissions</CardTitle>
          <Table responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Referrer</th>
                <th>Referred User</th>
                <th>Level</th>
                <th>Amount</th>
                <th>Investment</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {commissions.map(commission => (
                <tr key={commission.id}>
                  <td>{commission.id}</td>
                  <td>{commission.referrerName}</td>
                  <td>{commission.referredName}</td>
                  <td>{getLevelBadge(commission.commissionLevel)}</td>
                  <td>₹{commission.commissionAmount.toFixed(2)}</td>
                  <td>#{commission.investmentId}</td>
                  <td>{new Date(commission.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </CardBody>
      </Card>
      
      <Card className="mt-4">
        <CardBody>
          <CardTitle tag="h5">Top Referrers</CardTitle>
          <Table responsive>
            <thead>
              <tr>
                <th>Rank</th>
                <th>User</th>
                <th>Total Referrals</th>
                <th>Total Commission</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>John Doe</td>
                <td>15</td>
                <td>₹25,500</td>
              </tr>
              <tr>
                <td>2</td>
                <td>Jane Smith</td>
                <td>8</td>
                <td>₹12,750</td>
              </tr>
              <tr>
                <td>3</td>
                <td>Mike Johnson</td>
                <td>5</td>
                <td>₹8,200</td>
              </tr>
            </tbody>
          </Table>
        </CardBody>
      </Card>
    </div>
  );
};

export default ReferralTracking;