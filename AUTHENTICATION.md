# MY EYES - Authentication System Guide

## Overview

The MY EYES backend includes a complete authentication system with:
- User signup with email validation
- Secure password hashing with bcryptjs
- JWT-based authentication
- Role-based access control (Customer, Admin, Staff)
- Protected route middleware

## File Structure

```
my-eyes-pre-launch-main/
├── controllers/
│   └── authController.js        # Signup, login, logout logic
├── middleware/
│   └── auth.js                  # Token verification & role checks
├── routes/
│   └── auth.js                  # Auth endpoint definitions
├── config/
│   └── db.js                    # SQLite database connection
├── server.js                    # Main Express app
├── package.json                 # Dependencies
├── schema.sql                   # Database schema
├── .env.example                 # Environment variables template
└── API_DOCUMENTATION.md         # Complete API reference
```

---

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

This installs:
- `express` - Web framework
- `sqlite3` - Database driver
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT authentication
- `cors` - Cross-origin requests
- `dotenv` - Environment variables

### 2. Create Environment File

```bash
cp .env.example .env
```

Edit `.env` and set:

```env
JWT_SECRET=your-super-secure-secret-key-here
BCRYPT_ROUNDS=10
PORT=5000
NODE_ENV=development
DB_PATH=./data/my_eyes_store.db
```

**Generate a secure JWT secret:**

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Using OpenSSL
openssl rand -base64 32
```

### 3. Initialize Database

The database is created automatically on first run. To populate with schema:

```bash
sqlite3 ./data/my_eyes_store.db < schema.sql
```

### 4. Start the Server

```bash
npm run dev
```

Expected output:
```
============================================================
MY EYES - Backend Server
============================================================
✓ Server running on http://localhost:5000
✓ Environment: development
✓ Database: SQLite (data/my_eyes_store.db)
✓ CORS enabled for: http://localhost:3000, http://localhost:5173
✓ Database connection successful
============================================================
```

---

## API Endpoints

### Public Routes (No Authentication Required)

#### Signup
```
POST /api/auth/signup
Content-Type: application/json

{
  "full_name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "user_id": 1,
    "full_name": "John Doe",
    "email": "john@example.com",
    "role": "customer",
    "theme_preference": "light"
  }
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { ... }
}
```

### Protected Routes (JWT Required)

#### Get Current User
```
GET /api/auth/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Authentication Flow

### 1. User Registration

```javascript
// Client-side
const response = await fetch('http://localhost:5000/api/auth/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    full_name: 'John Doe',
    email: 'john@example.com',
    password: 'securepassword123'
  })
});

const data = await response.json();
// Save token
localStorage.setItem('token', data.token);
```

### 2. User Login

```javascript
const response = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'john@example.com',
    password: 'securepassword123'
  })
});

const data = await response.json();
localStorage.setItem('token', data.token);
```

### 3. Making Authenticated Requests

```javascript
const token = localStorage.getItem('token');

const response = await fetch('http://localhost:5000/api/auth/me', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
});

const user = await response.json();
```

### 4. User Logout

```javascript
// Remove token from storage
localStorage.removeItem('token');
```

---

## Middleware Protection

### Protecting Routes

To protect a route, use the `verifyToken` middleware:

```javascript
// routes/products.js
import express from 'express';
import { verifyToken, requireCustomer } from '../middleware/auth.js';
import { getProducts } from '../controllers/productController.js';

const router = express.Router();

// Protected route - requires valid token
router.get('/', verifyToken, getProducts);

// Protected route - requires customer role
router.post('/order', verifyToken, requireCustomer, createOrder);

export default router;
```

### Available Middleware

| Middleware | Purpose |
|-----------|---------|
| `verifyToken` | Validates JWT token from Authorization header |
| `requireCustomer` | Ensures user has customer or admin role |
| `requireAdmin` | Ensures user has admin role |
| `optionalToken` | Validates token if provided, but doesn't require it |

---

## Security Best Practices

### 1. Password Hashing

Passwords are hashed using bcryptjs with configurable salt rounds:

```javascript
const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 10;
const hashedPassword = await bcryptjs.hash(password, saltRounds);
```

### 2. JWT Token Storage

**Frontend:**
```javascript
// Store in localStorage (convenient but less secure)
localStorage.setItem('token', token);

// OR store in sessionStorage (more secure)
sessionStorage.setItem('token', token);

// OR use httpOnly cookies (most secure, requires backend support)
```

### 3. HTTPS in Production

Always use HTTPS for token transmission:

```env
# Production .env
NODE_ENV=production
JWT_SECRET=generated-secure-key
# Use HTTPS URLs for CORS
CORS_ORIGIN=https://myeyes.com,https://www.myeyes.com
```

### 4. Token Expiration

Tokens expire after the configured duration (default 7 days):

```env
JWT_EXPIRE=7d  # or 24h, 30d, etc.
```

### 5. Environment Variables

Keep sensitive data in `.env`:
- Never commit `.env` to version control
- Add `.env` to `.gitignore`
- Use different secrets for development and production

---

## Error Handling

### Common Errors

**400 - Bad Request**
```json
{
  "success": false,
  "message": "Invalid email format"
}
```

**401 - Unauthorized**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

**409 - Conflict**
```json
{
  "success": false,
  "message": "Email already registered"
}
```

### Handling in Frontend

```javascript
const login = async (email, password) => {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle errors
      console.error(data.message);
      return null;
    }

    localStorage.setItem('token', data.token);
    return data.user;
  } catch (error) {
    console.error('Login failed:', error);
  }
};
```

---

## Testing

### Using cURL

```bash
# Signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Test User",
    "email": "test@example.com",
    "password": "testpass123"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpass123"
  }'

# Get current user (replace TOKEN with actual token)
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer TOKEN"
```

### Using Postman

1. Open Postman
2. Create new request
3. Set method to POST
4. Enter URL: `http://localhost:5000/api/auth/login`
5. Go to Body → raw → JSON
6. Add JSON: `{"email":"test@example.com","password":"testpass123"}`
7. Send request and copy token from response
8. For protected routes, go to Headers and add:
   - Key: `Authorization`
   - Value: `Bearer <token>`

---

## Database Schema

### Users Table

```sql
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address VARCHAR(500),
    role ENUM('customer', 'admin', 'staff') DEFAULT 'customer',
    theme_preference ENUM('light', 'dark') DEFAULT 'light',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_created_at (created_at)
);
```

---

## Troubleshooting

### Issue: Token Expired Error

**Solution:** Implement token refresh endpoint (recommended for production)

```javascript
// Example implementation
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    
    const newToken = jwt.sign(
      { user_id: decoded.user_id, email: decoded.email, role: decoded.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );
    
    res.json({ success: true, token: newToken });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid refresh token' });
  }
};
```

### Issue: CORS Error

**Solution:** Update `.env` CORS_ORIGIN with your frontend URL

```env
CORS_ORIGIN=http://localhost:3000,http://localhost:5173,https://yourdomain.com
```

### Issue: Password Hash Fails

**Solution:** Ensure bcryptjs is installed and BCRYPT_ROUNDS is valid

```bash
npm install bcryptjs
# Ensure BCRYPT_ROUNDS is 8-12 in .env
```

---

## Next Steps

1. ✅ Create frontend authentication forms (signup/login)
2. ✅ Implement token persistence and retrieval
3. ✅ Add user profile management
4. ✅ Implement password reset functionality
5. ✅ Add email verification (optional)
6. ✅ Implement role-based access control in routes
7. ✅ Add audit logging for security events

---

## Support

For issues or questions, refer to:
- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
- [schema.sql](./schema.sql)
- [.env.example](./.env.example)

