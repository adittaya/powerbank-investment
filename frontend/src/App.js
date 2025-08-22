import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Import components
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Investment from './components/Investment';
import Recharge from './components/Recharge';
import Withdrawal from './components/Withdrawal';
import Referral from './components/Referral';
import AdminPanel from './components/AdminPanel';

function App() {
  return (
    <Router>
      <div className="App d-flex flex-column min-vh-100">
        <Header />
        <Container className="flex-grow-1 py-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/investment" element={<Investment />} />
            <Route path="/recharge" element={<Recharge />} />
            <Route path="/withdrawal" element={<Withdrawal />} />
            <Route path="/referral" element={<Referral />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </Container>
        <Footer />
      </div>
    </Router>
  );
}

export default App;