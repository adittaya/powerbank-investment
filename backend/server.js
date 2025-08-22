const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory data structures (in a real app, you would use a database)
let users = [
  // Default admin user
  {
    id: 1,
    name: "Admin User",
    mobileNumber: "9999999999",
    username: "admin",
    password: "$2a$10$8K1p/a0dhrxiowP.dnkgNORTWgdEDHn5L2/xjpEWuC.QQv4rKO9jO", // Hashed "Admin123!"
    referralCode: "ADMIN001",
    referredBy: null,
    balance: 0,
    earnings: 0,
    withdrawalWallet: 0,
    investments: [],
    isAdmin: true,
    createdAt: new Date()
  }
];
let investmentPlans = [
  {
    id: 1,
    name: "Prime Drink Plan A",
    description: "Basic investment plan",
    price: 1000,
    dailyProfitPercentage: 2.5,
    durationDays: 30,
    imageUrl: "/storage/emulated/0/Download/prime-bottle.jpg",
    isActive: true
  },
  {
    id: 2,
    name: "Prime Drink Plan B",
    description: "Standard investment plan",
    price: 5000,
    dailyProfitPercentage: 3.0,
    durationDays: 60,
    imageUrl: "/storage/emulated/0/Download/prime-bottle.jpg",
    isActive: true
  },
  {
    id: 3,
    name: "Prime Drink Plan C",
    description: "Premium investment plan",
    price: 10000,
    dailyProfitPercentage: 3.5,
    durationDays: 90,
    imageUrl: "/storage/emulated/0/Download/prime-bottle.jpg",
    isActive: true
  }
];
let transactions = [];
let withdrawals = [];
let referralCommissions = [];

// Helper function to generate referral code
function generateReferralCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// Helper function to find user by mobile or username
function findUser(identifier) {
  return users.find(user => 
    user.mobileNumber === identifier || user.username === identifier
  );
}

// Helper function to verify if user is admin
function isAdminUser(user) {
  return user && user.isAdmin === true;
}

// Helper function to verify password
function verifyPassword(password, hashedPassword) {
  return bcrypt.compareSync(password, hashedPassword);
}

// Helper function to generate JWT token
function generateToken(user) {
  return jwt.sign(
    { 
      id: user.id, 
      username: user.username,
      isAdmin: isAdminUser(user)
    },
    process.env.JWT_SECRET || 'a0QAW6CshPrs3tFjy8I8YwKsIlT8vLSNgYvG3CVgH481d+tB++duJuAlI8mQ2tKiiWqcqRY5lcltkAS4iUQhZw==',
    { expiresIn: '24h' }
  );
}

// Routes

// User Registration
app.post('/api/register', (req, res) => {
  try {
    const { name, mobileNumber, username, password, confirmPassword, referralCode } = req.body;
    
    // Validation
    if (!name || !mobileNumber || !username || !password || !confirmPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }
    
    // Check if user already exists
    if (findUser(mobileNumber) || findUser(username)) {
      return res.status(400).json({ message: 'User already exists with this mobile number or username' });
    }
    
    // Hash password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    
    // Generate referral code
    const generatedReferralCode = generateReferralCode();
    
    // Find referrer if referral code provided
    let referredBy = null;
    if (referralCode) {
      const referrer = users.find(user => user.referralCode === referralCode);
      if (referrer) {
        referredBy = referralCode;
      }
    }
    
    // Create new user
    const newUser = {
      id: users.length + 1,
      name,
      mobileNumber,
      username,
      password: hashedPassword,
      referralCode: generatedReferralCode,
      referredBy,
      balance: 0,
      earnings: 0,
      withdrawalWallet: 0,
      investments: [],
      isAdmin: false, // Regular users are not admins
      createdAt: new Date()
    };
    
    users.push(newUser);
    
    // Generate token
    const token = generateToken(newUser);
    
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        name: newUser.name,
        mobileNumber: newUser.mobileNumber,
        username: newUser.username,
        referralCode: newUser.referralCode,
        referredBy: newUser.referredBy,
        balance: newUser.balance,
        earnings: newUser.earnings,
        withdrawalWallet: newUser.withdrawalWallet
      },
      token
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// User Login
app.post('/api/login', (req, res) => {
  try {
    const { identifier, password } = req.body;
    
    // Validation
    if (!identifier || !password) {
      return res.status(400).json({ message: 'Mobile number/username and password are required' });
    }
    
    // Find user
    const user = findUser(identifier);
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }
    
    // Verify password
    if (!verifyPassword(password, user.password)) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Generate token
    const token = generateToken(user);
    
    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        mobileNumber: user.mobileNumber,
        username: user.username,
        referralCode: user.referralCode,
        referredBy: user.referredBy,
        balance: user.balance,
        earnings: user.earnings,
        withdrawalWallet: user.withdrawalWallet,
        isAdmin: isAdminUser(user)
      },
      token
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get User Profile
app.get('/api/profile', (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'a0QAW6CshPrs3tFjy8I8YwKsIlT8vLSNgYvG3CVgH481d+tB++duJuAlI8mQ2tKiiWqcqRY5lcltkAS4iUQhZw==');
    const user = users.find(u => u.id === decoded.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      user: {
        id: user.id,
        name: user.name,
        mobileNumber: user.mobileNumber,
        username: user.username,
        referralCode: user.referralCode,
        referredBy: user.referredBy,
        balance: user.balance,
        earnings: user.earnings,
        withdrawalWallet: user.withdrawalWallet,
        investments: user.investments,
        isAdmin: isAdminUser(user)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get Investment Plans
app.get('/api/plans', (req, res) => {
  try {
    const activePlans = investmentPlans.filter(plan => plan.isActive);
    res.json({ plans: activePlans });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get Recharge Details
app.get('/api/recharge-details', (req, res) => {
  try {
    res.json({
      upiId: "7047571829@upi",
      qrCodeUrl: "/storage/emulated/0/DCIM/QR_1755182073.png"
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Submit Recharge Transaction
app.post('/api/recharge', (req, res) => {
  try {
    const { amount, utrNumber } = req.body;
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'a0QAW6CshPrs3tFjy8I8YwKsIlT8vLSNgYvG3CVgH481d+tB++duJuAlI8mQ2tKiiWqcqRY5lcltkAS4iUQhZw==');
    const user = users.find(u => u.id === decoded.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (!amount || !utrNumber) {
      return res.status(400).json({ message: 'Amount and UTR number are required' });
    }
    
    // Create transaction
    const newTransaction = {
      id: transactions.length + 1,
      userId: user.id,
      amount: parseFloat(amount),
      transactionType: 'recharge',
      status: 'pending',
      utrNumber,
      createdAt: new Date()
    };
    
    transactions.push(newTransaction);
    
    res.json({
      message: 'Recharge request submitted successfully',
      transaction: newTransaction
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Admin: Approve Recharge (This would be called by admin to approve a recharge)
app.put('/api/admin/transactions/:id/approve', requireAdmin, (req, res) => {
  try {
    const transactionId = parseInt(req.params.id);
    const transaction = transactions.find(t => t.id === transactionId);
    
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    
    if (transaction.status !== 'pending') {
      return res.status(400).json({ message: 'Transaction is not pending' });
    }
    
    // Update transaction status
    transaction.status = 'completed';
    transaction.updatedAt = new Date();
    
    // Add amount to user's withdrawal wallet
    const user = users.find(u => u.id === transaction.userId);
    if (user) {
      user.withdrawalWallet += transaction.amount;
    }
    
    res.json({
      message: 'Recharge approved successfully',
      transaction
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Submit Withdrawal Request
app.post('/api/withdraw', (req, res) => {
  try {
    const { amount } = req.body;
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'a0QAW6CshPrs3tFjy8I8YwKsIlT8vLSNgYvG3CVgH481d+tB++duJuAlI8mQ2tKiiWqcqRY5lcltkAS4iUQhZw==');
    const user = users.find(u => u.id === decoded.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (!amount) {
      return res.status(400).json({ message: 'Amount is required' });
    }
    
    const withdrawalAmount = parseFloat(amount);
    
    // Validate amount is a positive number
    if (isNaN(withdrawalAmount) || withdrawalAmount <= 0) {
      return res.status(400).json({ message: 'Amount must be a positive number' });
    }
    
    // Check if user has sufficient balance
    if (user.withdrawalWallet < withdrawalAmount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }
    
    // Check minimum withdrawal amount (₹100)
    if (withdrawalAmount < 100) {
      return res.status(400).json({ message: 'Minimum withdrawal amount is ₹100' });
    }
    
    // Create withdrawal
    const newWithdrawal = {
      id: withdrawals.length + 1,
      userId: user.id,
      amount: withdrawalAmount,
      status: 'pending',
      createdAt: new Date()
    };
    
    withdrawals.push(newWithdrawal);
    
    // Deduct from withdrawal wallet
    user.withdrawalWallet -= withdrawalAmount;
    
    res.json({
      message: 'Withdrawal request submitted successfully',
      withdrawal: newWithdrawal
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get Withdrawal History
app.get('/api/withdrawals', (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'a0QAW6CshPrs3tFjy8I8YwKsIlT8vLSNgYvG3CVgH481d+tB++duJuAlI8mQ2tKiiWqcqRY5lcltkAS4iUQhZw==');
    const user = users.find(u => u.id === decoded.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const userWithdrawals = withdrawals.filter(w => w.userId === user.id);
    
    res.json({ withdrawals: userWithdrawals });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get Transaction History
app.get('/api/transactions', (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'a0QAW6CshPrs3tFjy8I8YwKsIlT8vLSNgYvG3CVgH481d+tB++duJuAlI8mQ2tKiiWqcqRY5lcltkAS4iUQhZw==');
    const user = users.find(u => u.id === decoded.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Combine all transactions for the user (recharges, withdrawals, etc.)
    const userTransactions = [];
    
    // Add recharge transactions
    const rechargeTransactions = transactions.filter(t => t.userId === user.id);
    userTransactions.push(...rechargeTransactions.map(t => ({
      id: t.id,
      userId: t.userId,
      amount: t.amount,
      transactionType: t.transactionType,
      status: t.status,
      utrNumber: t.utrNumber,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt
    })));
    
    // Add withdrawal transactions
    const withdrawalTransactions = withdrawals.filter(w => w.userId === user.id);
    userTransactions.push(...withdrawalTransactions.map(w => ({
      id: w.id,
      userId: w.userId,
      amount: w.amount,
      transactionType: 'withdrawal',
      status: w.status,
      createdAt: w.createdAt,
      updatedAt: w.updatedAt,
      processedAt: w.processedAt
    })));
    
    // Sort by date (newest first)
    userTransactions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.json({ transactions: userTransactions });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Admin: Approve Recharge (This would be called by admin to approve a recharge)
app.put('/api/admin/transactions/:id/approve', requireAdmin, (req, res) => {
  try {
    const transactionId = parseInt(req.params.id);
    const transaction = transactions.find(t => t.id === transactionId);
    
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    
    if (transaction.status !== 'pending') {
      return res.status(400).json({ message: 'Transaction is not pending' });
    }
    
    // Update transaction status
    transaction.status = 'completed';
    transaction.updatedAt = new Date();
    
    // Add amount to user's withdrawal wallet
    const user = users.find(u => u.id === transaction.userId);
    if (user) {
      user.withdrawalWallet += transaction.amount;
    }
    
    res.json({
      message: 'Recharge approved successfully',
      transaction
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get Referral Details

// Admin: Approve Recharge (This would be called by admin to approve a recharge)
// Admin: Approve Recharge (This would be called by admin to approve a recharge)
app.put('/api/admin/transactions/:id/approve', requireAdmin, (req, res) => {
  try {
    const transactionId = parseInt(req.params.id);
    const transaction = transactions.find(t => t.id === transactionId);
    
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    
    if (transaction.status !== 'pending') {
      return res.status(400).json({ message: 'Transaction is not pending' });
    }
    
    // Update transaction status
    transaction.status = 'completed';
    transaction.updatedAt = new Date();
    
    // Add amount to user's withdrawal wallet
    const user = users.find(u => u.id === transaction.userId);
    if (user) {
      user.withdrawalWallet += transaction.amount;
    }
    
    res.json({
      message: 'Recharge approved successfully',
      transaction
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get Referral Details
app.get('/api/referrals', (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'a0QAW6CshPrs3tFjy8I8YwKsIlT8vLSNgYvG3CVgH481d+tB++duJuAlI8mQ2tKiiWqcqRY5lcltkAS4iUQhZw==');
    const user = users.find(u => u.id === decoded.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Get users referred by this user
    const referredUsers = users.filter(u => u.referredBy === user.referralCode);
    
    // Get referral commissions
    const userCommissions = referralCommissions.filter(c => c.referrerId === user.id);
    
    res.json({
      referralCode: user.referralCode,
      referredUsers: referredUsers.map(u => ({
        id: u.id,
        name: u.name,
        username: u.username,
        createdAt: u.createdAt
      })),
      commissions: userCommissions
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Middleware to check if user is admin
function requireAdmin(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'a0QAW6CshPrs3tFjy8I8YwKsIlT8vLSNgYvG3CVgH481d+tB++duJuAlI8mQ2tKiiWqcqRY5lcltkAS4iUQhZw==');
    
    if (!decoded.isAdmin) {
      return res.status(403).json({ message: 'Access denied. Admin rights required.' });
    }
    
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

// Admin Routes

// Get all users (admin)
app.get('/api/admin/users', requireAdmin, (req, res) => {
  try {
    res.json({ users: users.map(u => ({
      id: u.id,
      name: u.name,
      mobileNumber: u.mobileNumber,
      username: u.username,
      referralCode: u.referralCode,
      referredBy: u.referredBy,
      balance: u.balance,
      earnings: u.earnings,
      withdrawalWallet: u.withdrawalWallet,
      createdAt: u.createdAt,
      isActive: u.isActive !== false,
      isAdmin: u.isAdmin || false
    })) });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all investment plans (admin)
app.get('/api/admin/plans', requireAdmin, (req, res) => {
  try {
    res.json({ plans: investmentPlans });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new investment plan (admin)
app.post('/api/admin/plans', requireAdmin, (req, res) => {
  try {
    const { name, description, price, dailyProfitPercentage, durationDays, imageUrl } = req.body;
    
    const newPlan = {
      id: investmentPlans.length + 1,
      name,
      description,
      price: parseFloat(price),
      dailyProfitPercentage: parseFloat(dailyProfitPercentage),
      durationDays: parseInt(durationDays),
      imageUrl,
      isActive: true,
      createdAt: new Date()
    };
    
    investmentPlans.push(newPlan);
    
    res.status(201).json({
      message: 'Investment plan created successfully',
      plan: newPlan
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update investment plan (admin)
app.put('/api/admin/plans/:id', requireAdmin, (req, res) => {
  try {
    const planId = parseInt(req.params.id);
    const plan = investmentPlans.find(p => p.id === planId);
    
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }
    
    const { name, description, price, dailyProfitPercentage, durationDays, imageUrl, isActive } = req.body;
    
    if (name) plan.name = name;
    if (description) plan.description = description;
    if (price) plan.price = parseFloat(price);
    if (dailyProfitPercentage) plan.dailyProfitPercentage = parseFloat(dailyProfitPercentage);
    if (durationDays) plan.durationDays = parseInt(durationDays);
    if (imageUrl) plan.imageUrl = imageUrl;
    if (isActive !== undefined) plan.isActive = isActive;
    
    plan.updatedAt = new Date();
    
    res.json({
      message: 'Investment plan updated successfully',
      plan
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all transactions (admin)
app.get('/api/admin/transactions', requireAdmin, (req, res) => {
  try {
    // Combine all transactions (recharges, withdrawals, etc.)
    const allTransactions = [];
    
    // Add recharge transactions
    transactions.forEach(t => {
      allTransactions.push({
        id: t.id,
        userId: t.userId,
        amount: t.amount,
        transactionType: t.transactionType,
        status: t.status,
        utrNumber: t.utrNumber,
        createdAt: t.createdAt,
        updatedAt: t.updatedAt
      });
    });
    
    // Add withdrawal transactions
    withdrawals.forEach(w => {
      allTransactions.push({
        id: w.id,
        userId: w.userId,
        amount: w.amount,
        transactionType: 'withdrawal',
        status: w.status,
        createdAt: w.createdAt,
        updatedAt: w.updatedAt,
        processedAt: w.processedAt
      });
    });
    
    // Sort by date (newest first)
    allTransactions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.json({ transactions: allTransactions });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all withdrawals (admin)
app.get('/api/admin/withdrawals', requireAdmin, (req, res) => {
  try {
    res.json({ withdrawals });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all transactions (admin)
app.get('/api/admin/transactions', requireAdmin, (req, res) => {
  try {
    // Combine all transactions (recharges, withdrawals, etc.)
    const allTransactions = [];
    
    // Add recharge transactions
    transactions.forEach(t => {
      allTransactions.push({
        id: t.id,
        userId: t.userId,
        amount: t.amount,
        transactionType: t.transactionType,
        status: t.status,
        utrNumber: t.utrNumber,
        createdAt: t.createdAt,
        updatedAt: t.updatedAt
      });
    });
    
    // Add withdrawal transactions
    withdrawals.forEach(w => {
      allTransactions.push({
        id: w.id,
        userId: w.userId,
        amount: w.amount,
        transactionType: 'withdrawal',
        status: w.status,
        createdAt: w.createdAt,
        updatedAt: w.updatedAt,
        processedAt: w.processedAt
      });
    });
    
    // Sort by date (newest first)
    allTransactions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.json({ transactions: allTransactions });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update withdrawal status (admin)
app.put('/api/admin/withdrawals/:id', requireAdmin, (req, res) => {
  try {
    const withdrawalId = parseInt(req.params.id);
    const withdrawal = withdrawals.find(w => w.id === withdrawalId);
    
    if (!withdrawal) {
      return res.status(404).json({ message: 'Withdrawal not found' });
    }
    
    const { status } = req.body;
    
    if (status) {
      withdrawal.status = status;
      withdrawal.processedAt = new Date();
      withdrawal.updatedAt = new Date();
    }
    
    res.json({
      message: 'Withdrawal updated successfully',
      withdrawal
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get admin dashboard data
app.get('/api/admin/dashboard', requireAdmin, (req, res) => {
  try {
    const totalDeposits = transactions
      .filter(t => t.transactionType === 'recharge' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const totalWithdrawals = withdrawals
      .filter(w => w.status === 'completed')
      .reduce((sum, w) => sum + w.amount, 0);
      
    const activeUsers = users.filter(u => u.isActive !== false).length;
    
    res.json({
      totalDeposits,
      totalWithdrawals,
      activeUsers,
      totalUsers: users.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});