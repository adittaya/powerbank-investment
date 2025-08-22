import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardTitle, Button, Alert, Table, Row, Col } from 'reactstrap';
import axios from 'axios';

const Referral = () => {
  const [referralData, setReferralData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReferralData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          // Handle unauthenticated user
          setError('Please login to view referral information');
          return;
        }
        
        const response = await axios.get('http://localhost:3000/api/referrals', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setReferralData(response.data);
      } catch (err) {
        setError('Error fetching referral data');
        console.error('Error fetching referral data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchReferralData();
  }, []);

  const handleCopyReferralCode = () => {
    if (referralData?.referralCode) {
      navigator.clipboard.writeText(referralData.referralCode);
      alert('Referral code copied to clipboard!');
    }
  };

  if (loading) {
    return <div className="text-center mt-5">Loading referral information...</div>;
  }

  return (
    <div>
      <h2 className="mb-4">Referral Program</h2>
      
      {error && <Alert color="danger">{error}</Alert>}
      
      {referralData && (
        <>
          <Row>
            <Col md="6">
              <Card className="mb-4">
                <CardBody>
                  <CardTitle tag="h5">Your Referral Code</CardTitle>
                  <h3 className="text-primary">{referralData.referralCode}</h3>
                  <p className="mt-3">
                    Share this code with your friends and earn commissions on their investments!
                  </p>
                  <Button color="primary" onClick={handleCopyReferralCode}>
                    Copy Referral Code
                  </Button>
                </CardBody>
              </Card>
            </Col>
            
            <Col md="6">
              <Card className="mb-4">
                <CardBody>
                  <CardTitle tag="h5">Commission Structure</CardTitle>
                  <ul>
                    <li><strong>Level 1:</strong> 30% commission on direct referrals</li>
                    <li><strong>Level 2:</strong> 2% commission on indirect referrals</li>
                    <li><strong>Level 3:</strong> 1% commission on third-level referrals</li>
                  </ul>
                  <p>Earn passive income by building your referral network!</p>
                </CardBody>
              </Card>
            </Col>
          </Row>
          
          <Row>
            <Col md="6">
              <Card className="mb-4">
                <CardBody>
                  <CardTitle tag="h5">Your Referrals</CardTitle>
                  {referralData.referredUsers.length > 0 ? (
                    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                      <Table responsive>
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Username</th>
                            <th>Joined</th>
                          </tr>
                        </thead>
                        <tbody>
                          {referralData.referredUsers.map((user) => (
                            <tr key={user.id}>
                              <td>{user.name}</td>
                              <td>{user.username}</td>
                              <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  ) : (
                    <p>You haven't referred any users yet.</p>
                  )}
                </CardBody>
              </Card>
            </Col>
            
            <Col md="6">
              <Card className="mb-4">
                <CardBody>
                  <CardTitle tag="h5">Commission History</CardTitle>
                  {referralData.commissions.length > 0 ? (
                    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                      <Table responsive>
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Amount</th>
                            <th>Level</th>
                          </tr>
                        </thead>
                        <tbody>
                          {referralData.commissions.map((commission) => (
                            <tr key={commission.id}>
                              <td>{new Date(commission.createdAt).toLocaleDateString()}</td>
                              <td>₹{commission.commissionAmount.toFixed(2)}</td>
                              <td>{commission.commissionLevel}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  ) : (
                    <p>No commission history found.</p>
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default Referral;