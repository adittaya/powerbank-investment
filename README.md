# Power Bank Application + Investment Website System

This is a complete Power Bank Application + Investment Website system with user frontend, admin panel, and backend API.

## Features

### User Features
- User Registration and Login (with referral code support)
- Dashboard with balance, earnings, and withdrawal wallet
- Investment plans with daily profit generation
- Recharge system with UPI payment (3-step process)
- Withdrawal system with history tracking
- Referral program with 3-level commission structure
- Responsive design for mobile devices

### Admin Features
- User management (activate, deactivate, reset password)
- Investment plan management (create, edit, delete)
- Withdrawal request management (approve, reject, process)
- Referral commission tracking
- System settings configuration
- Dashboard with analytics

## Technology Stack

- **Frontend**: React.js, Bootstrap, Reactstrap
- **Admin Panel**: React.js, Bootstrap, Reactstrap, Chart.js
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL (schema provided)
- **Authentication**: JWT tokens

## Project Structure

```
powerbank-investment/
├── backend/          # Backend API (Node.js + Express)
├── frontend/         # User frontend (React)
├── admin/            # Admin panel (React)
└── database-schema.sql  # Database schema
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)
- PostgreSQL database

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the backend directory with the following:
   ```
   PORT=3000
   JWT_SECRET=your_jwt_secret_here
   DATABASE_URL=your_postgresql_connection_string
   ```

4. Run the backend server:
   ```bash
   npm start
   ```
   or for development with auto-reload:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the frontend:
   ```bash
   npm start
   ```

### Admin Panel Setup

1. Navigate to the admin directory:
   ```bash
   cd admin
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the admin panel:
   ```bash
   npm start
   ```

## Database Setup

1. Create a PostgreSQL database
2. Run the SQL commands in `database-schema.sql` to create tables
3. Update the backend `.env` file with your database connection string

## API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login

### User Dashboard
- `GET /api/profile` - Get user profile
- `GET /api/plans` - Get investment plans
- `GET /api/recharge-details` - Get recharge UPI details
- `POST /api/recharge` - Submit recharge request
- `POST /api/withdraw` - Submit withdrawal request
- `GET /api/withdrawals` - Get withdrawal history
- `GET /api/referrals` - Get referral information

### Admin
- `GET /api/admin/users` - Get all users
- `GET /api/admin/plans` - Get all investment plans
- `POST /api/admin/plans` - Create new investment plan
- `PUT /api/admin/plans/:id` - Update investment plan
- `GET /api/admin/withdrawals` - Get all withdrawals
- `PUT /api/admin/withdrawals/:id` - Update withdrawal status
- `GET /api/admin/dashboard` - Get admin dashboard data

## Environment Variables

The following environment variables are used in the application:

- `SUPABASE_ACCES_KEY` - Supabase access key
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_API_KEY` - Supabase API key
- `JWT_SECRET` - Secret key for JWT token generation
- `RENDER_API_KEY` - Render API key
- `PORT` - Server port (default: 3000)
- `NETLIFY_AUTH_TOKEN` - Netlify authentication token
- `GITHUB_TOKEN` - GitHub personal access token

## Deployment

### Backend
The backend can be deployed to any Node.js hosting platform like:
- Render
- Heroku
- DigitalOcean App Platform

### Frontend
The frontend can be deployed to:
- Netlify
- Vercel
- GitHub Pages

### Admin Panel
The admin panel can be deployed to:
- Netlify
- Vercel
- Any static hosting platform

## Development

To run the development servers:

1. Start the backend:
   ```bash
   cd backend
   npm run dev
   ```

2. Start the frontend:
   ```bash
   cd frontend
   npm start
   ```

3. Start the admin panel:
   ```bash
   cd admin
   npm start
   ```

## Contributing

1. Fork the repository
2. Create a new branch for your feature
3. Commit your changes
4. Push to the branch
5. Create a pull request

## License

This project is licensed under the MIT License.