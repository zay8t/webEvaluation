# MY EYES - Authentication System & API Setup Summary

## ✅ What Has Been Created

### 1. Authentication System
- **User Registration** - Signup with email validation and password hashing
- **User Login** - Authenticate users and issue JWT tokens
- **Protected Routes** - Middleware to protect endpoints with JWT verification
- **Role-Based Access Control** - Customer, Admin, and Staff roles

### 2. Backend Files Created

#### Controllers
- `controllers/authController.js` - Signup, login, logout, and user retrieval logic

#### Middleware
- `middleware/auth.js` - Token verification and role-based access control middleware
  - `verifyToken` - Validates JWT tokens
  - `requireCustomer` - Restricts to customer/admin roles
  - `requireAdmin` - Restricts to admin role only
  - `optionalToken` - Optional token validation

#### Routes
- `routes/auth.js` - Authentication endpoints
  - `POST /api/auth/signup` - Register new user
  - `POST /api/auth/login` - Login user
  - `POST /api/auth/logout` - Logout user
  - `GET /api/auth/me` - Get current user info

#### Configuration
- `config/db.js` - SQLite database connection (already updated)
- `server.js` - Express app with auth routes integrated

#### Documentation
- `API_DOCUMENTATION.md` - Complete API reference
- `AUTHENTICATION.md` - Detailed authentication guide
- `API_TESTER.html` - Interactive API testing tool
- `schema.sql` - Database schema with Users table

---

## 🚀 Quick Start Guide

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Setup Environment Variables
```bash
cp .env.example .env
```

Edit `.env` and set:
```env
JWT_SECRET=your-secure-secret-key-here
PORT=5000
NODE_ENV=development
```

Generate a secure JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 3: Initialize Database
```bash
sqlite3 ./data/my_eyes_store.db < schema.sql
```

### Step 4: Start the Backend Server
```bash
npm run dev
```

Expected output:
```
✓ Server running on http://localhost:5000
✓ Database connection successful
✓ CORS enabled
```

### Step 5: Test the API
Open `API_TESTER.html` in your browser:
```
file:///C:/Users/smabb/Downloads/my-eyes-pre-launch-main/API_TESTER.html
```

---

## 📋 API Endpoints Summary

### Public Endpoints (No Auth Required)

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/auth/signup` | POST | Register new user |
| `/api/auth/login` | POST | Login and get JWT token |
| `/api/auth/logout` | POST | Logout user |

### Protected Endpoints (Require JWT)

| Endpoint | Method | Purpose | Required Role |
|----------|--------|---------|---------------|
| `/api/auth/me` | GET | Get current user | Any authenticated |

---

## 🔐 Authentication Flow

### 1. User Signs Up
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword123"
  }'
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "user_id": 1,
    "full_name": "John Doe",
    "email": "john@example.com",
    "role": "customer"
  }
}
```

### 2. User Logs In
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securepassword123"
  }'
```

### 3. User Makes Authenticated Request
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer TOKEN_HERE"
```

---

## 📁 Project Structure

```
my-eyes-pre-launch-main/
├── controllers/
│   └── authController.js              # Authentication logic
├── middleware/
│   └── auth.js                        # JWT verification & role checks
├── routes/
│   └── auth.js                        # Auth endpoints
├── config/
│   └── db.js                          # SQLite connection
├── server.js                          # Express app
├── schema.sql                         # Database schema
├── package.json                       # Dependencies
├── .env.example                       # Environment template
├── API_TESTER.html                    # Interactive API tester
├── API_DOCUMENTATION.md               # API reference
├── AUTHENTICATION.md                  # Auth guide
└── README.md                          # This file
```

---

## 🧪 Testing the API

### Using API_TESTER.html
1. Open the HTML file in your browser
2. Use the signup form to create a test account
3. Use the login form to authenticate
4. Click "Get Current User" to test protected route
5. View token in Token Manager section

### Using cURL
See the API documentation for cURL examples

### Using Postman
1. Create new POST request to `http://localhost:5000/api/auth/signup`
2. Set Body to JSON with user data
3. Send and copy token from response
4. Create GET request to `http://localhost:5000/api/auth/me`
5. Add Authorization header: `Bearer <token>`

---

## 🔒 Security Features

✅ **Password Hashing** - bcryptjs with configurable salt rounds (default 10)
✅ **JWT Authentication** - Secure token-based authentication
✅ **Email Validation** - Format validation on signup
✅ **Password Validation** - Minimum 6 characters required
✅ **Token Expiration** - Configurable token expiry (default 7 days)
✅ **Role-Based Access** - Customer, Admin, Staff roles
✅ **CORS Protection** - Configurable allowed origins
✅ **Error Handling** - Consistent error responses

---

## 🔧 Using Auth in Your Routes

### Protect a Route

```javascript
// routes/products.js
import express from 'express';
import { verifyToken, requireCustomer } from '../middleware/auth.js';

const router = express.Router();

// Protected route - anyone with valid token
router.get('/', verifyToken, getProducts);

// Protected route - customer/admin only
router.post('/order', verifyToken, requireCustomer, createOrder);

// Protected route - admin only
router.delete('/:id', verifyToken, requireAdmin, deleteProduct);

export default router;
```

### Register Routes in server.js

```javascript
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
```

---

## 🎯 Frontend Integration Example

### React Example

```javascript
// Store token on login
const handleLogin = async (email, password) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  const data = await response.json();
  if (data.token) {
    localStorage.setItem('token', data.token);
    // Redirect to dashboard
  }
};

// Use token in requests
const getUser = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch('/api/auth/me', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return await response.json();
};

// Clear token on logout
const handleLogout = () => {
  localStorage.removeItem('token');
  // Redirect to login
};
```

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `API_DOCUMENTATION.md` | Complete API reference with examples |
| `AUTHENTICATION.md` | Detailed authentication setup guide |
| `API_TESTER.html` | Interactive web-based API testing tool |
| `schema.sql` | Database schema and setup |
| `.env.example` | Environment variables template |

---

## ⚠️ Important Notes

1. **Never commit `.env` to version control** - Add to `.gitignore`
2. **Keep `JWT_SECRET` secure** - Use strong random values
3. **Use HTTPS in production** - Essential for token transmission
4. **Implement token refresh** - For long-lived sessions
5. **Add rate limiting** - Prevent brute force attacks on login
6. **Enable CORS carefully** - Only allow trusted origins

---

## 🐛 Troubleshooting

### "Database connection failed"
- Ensure SQLite database is initialized: `sqlite3 ./data/my_eyes_store.db < schema.sql`
- Check `DB_PATH` in `.env`

### "Token verification failed"
- Verify token is sent in `Authorization: Bearer <token>` format
- Check token hasn't expired (default 7 days)
- Ensure `JWT_SECRET` matches between signup and verification

### "CORS Error"
- Update `CORS_ORIGIN` in `.env` with your frontend URL
- Restart server after changing `.env`

### "Email already registered"
- Email is unique in database, use different email for signup
- Or delete user from database if testing

---

## 📋 Next Steps

1. **Create additional routes** for products, orders, reviews, etc.
2. **Implement email verification** for signup confirmation
3. **Add password reset functionality** with email
4. **Implement token refresh** for better security
5. **Add rate limiting** to prevent brute force
6. **Create user profile management** endpoints
7. **Add audit logging** for security events
8. **Implement frontend login/signup UI** using React components

---

## 🎉 You're Ready!

Your MY EYES e-commerce platform now has:
- ✅ Complete authentication system
- ✅ JWT-based API protection
- ✅ Role-based access control
- ✅ SQLite database
- ✅ API documentation
- ✅ Interactive API tester

**Start the server:** `npm run dev`
**Test the API:** Open `API_TESTER.html` in your browser
**Read the docs:** Check `API_DOCUMENTATION.md` and `AUTHENTICATION.md`

---

## 📞 Support

For questions or issues, refer to the documentation files:
- API endpoints → `API_DOCUMENTATION.md`
- Authentication setup → `AUTHENTICATION.md`
- Database schema → `schema.sql`
- Environment setup → `.env.example`
