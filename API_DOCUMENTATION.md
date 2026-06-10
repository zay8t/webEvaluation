# MY EYES - Backend API Documentation

## Overview

MY EYES is a full-stack eyewear e-commerce platform with a complete backend API built with Node.js, Express, and SQLite.

## Base URL

```
http://localhost:5000/api
```

## Authentication

The API uses JSON Web Tokens (JWT) for authentication. Include your token in the Authorization header:

```
Authorization: Bearer <your_token_here>
```

---

## Authentication Endpoints

### 1. User Signup

**Endpoint:** `POST /api/auth/signup`

**Description:** Register a new user account

**Request Body:**
```json
{
  "full_name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response (201):**
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

**Error Response (400):**
```json
{
  "success": false,
  "message": "Invalid email format | Password must be at least 6 characters"
}
```

**Error Response (409):**
```json
{
  "success": false,
  "message": "Email already registered"
}
```

---

### 2. User Login

**Endpoint:** `POST /api/auth/login`

**Description:** Login with email and password to receive JWT token

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
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

**Error Response (401):**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

### 3. User Logout

**Endpoint:** `POST /api/auth/logout`

**Description:** Logout user (client-side token removal)

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### 4. Get Current User

**Endpoint:** `GET /api/auth/me`

**Description:** Retrieve current authenticated user information

**Headers Required:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "user": {
    "user_id": 1,
    "full_name": "John Doe",
    "email": "john@example.com",
    "phone": "123-456-7890",
    "address": "123 Main St, City, State",
    "role": "customer",
    "theme_preference": "light"
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "No token provided | Invalid token"
}
```

---

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource already exists |
| 500 | Internal Server Error |

---

## Error Handling

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Additional error details (development only)"
}
```

---

## Middleware Protection

### Public Routes
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/logout`

### Protected Routes (Require Valid JWT)
- `GET /api/auth/me` - Requires `verifyToken`

### Role-Based Access
- **Customer**: Can access user profiles, orders, reviews, wishlist
- **Admin**: Can access all customer functions + manage products, orders, users

---

## User Roles

| Role | Permissions |
|------|------------|
| `customer` | Default role for new users, access to personal data |
| `admin` | Full platform access, manage all resources |
| `staff` | Limited admin access, manage products and orders |

---

## Example Usage

### JavaScript/Fetch

```javascript
// Signup
const signup = async () => {
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
  localStorage.setItem('token', data.token);
  return data;
};

// Login
const login = async () => {
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
  return data;
};

// Get Current User
const getCurrentUser = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:5000/api/auth/me', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  return await response.json();
};
```

### cURL

```bash
# Signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword123"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securepassword123"
  }'

# Get Current User
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer <your_token_here>"
```

---

## Database Schema

### Users Table

| Column | Type | Constraints |
|--------|------|-------------|
| user_id | INT | PRIMARY KEY, AUTO_INCREMENT |
| full_name | VARCHAR(255) | NOT NULL |
| email | VARCHAR(255) | NOT NULL, UNIQUE |
| password | VARCHAR(255) | NOT NULL |
| phone | VARCHAR(20) | Optional |
| address | VARCHAR(500) | Optional |
| role | ENUM | DEFAULT 'customer' |
| theme_preference | ENUM | DEFAULT 'light' |
| is_active | BOOLEAN | DEFAULT TRUE |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | AUTO UPDATE |

---

## Security Notes

1. **Passwords**: Always hashed with bcryptjs before storage
2. **JWT Secret**: Keep `JWT_SECRET` in `.env` file, never expose
3. **Token Expiration**: Defaults to 7 days, configurable in `.env`
4. **HTTPS**: Use HTTPS in production for secure token transmission
5. **Rate Limiting**: Consider implementing rate limiting for signup/login endpoints
6. **Input Validation**: All inputs are validated on the server side

---

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env` file with required variables:
   ```
   PORT=5000
   NODE_ENV=development
   DB_PATH=./data/my_eyes_store.db
   JWT_SECRET=your_secure_secret_key
   JWT_EXPIRE=7d
   BCRYPT_ROUNDS=10
   ```

3. Start the server:
   ```bash
   npm run dev
   ```

4. Test authentication endpoints using cURL or Postman

---

## Future Endpoints

- `GET /api/products` - Get all products
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order details
- `POST /api/reviews` - Create product review
- `POST /api/wishlist` - Add to wishlist
- `GET /api/contact` - Submit contact form

---

## Support

For issues or questions, contact the development team.
