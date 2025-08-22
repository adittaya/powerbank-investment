-- Database Schema for Power Bank Application + Investment Website

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    mobile_number VARCHAR(15) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    referral_code VARCHAR(20) UNIQUE NOT NULL,
    referred_by VARCHAR(20), -- Referral code of the person who referred this user
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

-- Investment Plans table
CREATE TABLE investment_plans (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    daily_profit_percentage DECIMAL(5, 2) NOT NULL, -- Daily profit percentage
    duration_days INTEGER NOT NULL, -- Duration in days
    image_url VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Investments table
CREATE TABLE user_investments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    plan_id INTEGER REFERENCES investment_plans(id),
    amount_invested DECIMAL(10, 2) NOT NULL,
    daily_profit DECIMAL(10, 2) NOT NULL,
    total_profit DECIMAL(10, 2) NOT NULL,
    start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_date TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transactions table (for recharges)
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    amount DECIMAL(10, 2) NOT NULL,
    transaction_type VARCHAR(20) NOT NULL, -- 'recharge', 'withdrawal', 'investment', 'profit'
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'completed', 'failed'
    utr_number VARCHAR(100), -- UTR number for recharge
    transaction_id VARCHAR(100), -- Payment gateway transaction ID
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Withdrawals table
CREATE TABLE withdrawals (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'completed'
    processed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Referral Commissions table
CREATE TABLE referral_commissions (
    id SERIAL PRIMARY KEY,
    referrer_id INTEGER REFERENCES users(id),
    referred_id INTEGER REFERENCES users(id),
    commission_level INTEGER NOT NULL, -- 1, 2, or 3
    commission_amount DECIMAL(10, 2) NOT NULL,
    investment_id INTEGER REFERENCES user_investments(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin Settings table
CREATE TABLE admin_settings (
    id SERIAL PRIMARY KEY,
    setting_key VARCHAR(50) UNIQUE NOT NULL,
    setting_value TEXT,
    description VARCHAR(255)
);

-- Insert default settings
INSERT INTO admin_settings (setting_key, setting_value, description) VALUES
('minimum_withdrawal_amount', '100.00', 'Minimum withdrawal amount'),
('withdrawal_processing_time', '24', 'Withdrawal processing time in hours'),
('referral_commission_level_1', '30', 'Level 1 referral commission percentage'),
('referral_commission_level_2', '2', 'Level 2 referral commission percentage'),
('referral_commission_level_3', '1', 'Level 3 referral commission percentage');