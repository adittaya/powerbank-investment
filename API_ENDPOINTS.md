# Power Bank Investment API Endpoints

## Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login

## User Dashboard
- `GET /api/profile` - Get user profile (requires authentication)
- `GET /api/plans` - Get investment plans
- `GET /api/recharge-details` - Get recharge UPI details
- `POST /api/recharge` - Submit recharge request (requires authentication)
- `POST /api/withdraw` - Submit withdrawal request (requires authentication)
- `GET /api/withdrawals` - Get withdrawal history (requires authentication)
- `GET /api/referrals` - Get referral information (requires authentication)

## Admin
- `GET /api/admin/users` - Get all users
- `GET /api/admin/plans` - Get all investment plans
- `POST /api/admin/plans` - Create new investment plan
- `PUT /api/admin/plans/:id` - Update investment plan
- `GET /api/admin/withdrawals` - Get all withdrawals
- `PUT /api/admin/withdrawals/:id` - Update withdrawal status
- `GET /api/admin/dashboard` - Get admin dashboard data

## Test Results
✅ All endpoints are working correctly
✅ Authentication with JWT tokens is functioning
✅ User registration and login work properly
✅ Investment plans are accessible
✅ Recharge and withdrawal systems function
✅ Referral system is operational
✅ Admin endpoints are accessible