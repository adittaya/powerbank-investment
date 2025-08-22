import React, { useState, useEffect } from 'react';
import { 
  Card, CardBody, CardTitle, Form, FormGroup, Label, Input, Button, Alert, Row, Col 
} from 'reactstrap';

const Settings = () => {
  const [settings, setSettings] = useState({
    minimumWithdrawalAmount: 100,
    withdrawalProcessingTime: 24,
    referralCommissionLevel1: 30,
    referralCommissionLevel2: 2,
    referralCommissionLevel3: 1
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // In a real app, you would fetch settings from the backend
    // fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: parseFloat(value) || value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess('');
    setError('');
    
    try {
      // In a real app, you would make an API call to save settings
      // await axios.post('http://localhost:3000/api/admin/settings', settings);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess('Settings updated successfully');
    } catch (err) {
      setError('Error updating settings');
      console.error('Error updating settings:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h2>System Settings</h2>
      
      {error && <Alert color="danger">{error}</Alert>}
      {success && <Alert color="success">{success}</Alert>}
      
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md="6">
            <Card className="mb-4">
              <CardBody>
                <CardTitle tag="h5">Withdrawal Settings</CardTitle>
                
                <FormGroup>
                  <Label for="minimumWithdrawalAmount">Minimum Withdrawal Amount (₹)</Label>
                  <Input
                    type="number"
                    id="minimumWithdrawalAmount"
                    name="minimumWithdrawalAmount"
                    value={settings.minimumWithdrawalAmount}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label for="withdrawalProcessingTime">Withdrawal Processing Time (hours)</Label>
                  <Input
                    type="number"
                    id="withdrawalProcessingTime"
                    name="withdrawalProcessingTime"
                    value={settings.withdrawalProcessingTime}
                    onChange={handleChange}
                    required
                    min="1"
                  />
                </FormGroup>
              </CardBody>
            </Card>
          </Col>
          
          <Col md="6">
            <Card className="mb-4">
              <CardBody>
                <CardTitle tag="h5">Referral Commission Settings</CardTitle>
                
                <FormGroup>
                  <Label for="referralCommissionLevel1">Level 1 Commission (%)</Label>
                  <Input
                    type="number"
                    id="referralCommissionLevel1"
                    name="referralCommissionLevel1"
                    value={settings.referralCommissionLevel1}
                    onChange={handleChange}
                    required
                    min="0"
                    max="100"
                    step="0.01"
                  />
                  <small className="text-muted">Direct referrals</small>
                </FormGroup>
                
                <FormGroup>
                  <Label for="referralCommissionLevel2">Level 2 Commission (%)</Label>
                  <Input
                    type="number"
                    id="referralCommissionLevel2"
                    name="referralCommissionLevel2"
                    value={settings.referralCommissionLevel2}
                    onChange={handleChange}
                    required
                    min="0"
                    max="100"
                    step="0.01"
                  />
                  <small className="text-muted">Indirect referrals</small>
                </FormGroup>
                
                <FormGroup>
                  <Label for="referralCommissionLevel3">Level 3 Commission (%)</Label>
                  <Input
                    type="number"
                    id="referralCommissionLevel3"
                    name="referralCommissionLevel3"
                    value={settings.referralCommissionLevel3}
                    onChange={handleChange}
                    required
                    min="0"
                    max="100"
                    step="0.01"
                  />
                  <small className="text-muted">Third-level referrals</small>
                </FormGroup>
              </CardBody>
            </Card>
          </Col>
        </Row>
        
        <Row>
          <Col>
            <Card>
              <CardBody>
                <CardTitle tag="h5">Additional Settings</CardTitle>
                
                <FormGroup>
                  <Label for="supportEmail">Support Email</Label>
                  <Input
                    type="email"
                    id="supportEmail"
                    name="supportEmail"
                    value="support@primedrink.com"
                    readOnly
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label for="telegramChannel">Telegram Channel</Label>
                  <Input
                    type="text"
                    id="telegramChannel"
                    name="telegramChannel"
                    value="https://t.me/primedrink"
                    readOnly
                  />
                </FormGroup>
                
                <Button color="primary" type="submit" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Settings'}
                </Button>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default Settings;