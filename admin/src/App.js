import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Import components
import AdminHeader from './components/AdminHeader';
import AdminSidebar from './components/AdminSidebar';
import AdminFooter from './components/AdminFooter';
import AdminDashboard from './components/AdminDashboard';
import UserManagement from './components/UserManagement';
import PlanManagement from './components/PlanManagement';
import WithdrawalManagement from './components/WithdrawalManagement';
import ReferralTracking from './components/ReferralTracking';
import Settings from './components/Settings';

function App() {
  return (
    <Router>
      <div className="App d-flex flex-column min-vh-100">
        <AdminHeader />
        <div className="d-flex flex-grow-1">
          <AdminSidebar />
          <Container className="flex-grow-1 py-4">
            <Routes>
              <Route path="/" element={<AdminDashboard />} />
              <Route path="/users" element={<UserManagement />} />
              <Route path="/plans" element={<PlanManagement />} />
              <Route path="/withdrawals" element={<WithdrawalManagement />} />
              <Route path="/referrals" element={<ReferralTracking />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </Container>
        </div>
        <AdminFooter />
      </div>
    </Router>
  );
}

export default App;