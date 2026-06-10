# Frontend Authentication Pages

## Overview

This package includes fully functional HTML signup and login pages with client-side form validation, authentication handling, and user profile management. All pages work seamlessly with the Express backend API.

---

## Files Included

### 1. **signup.html**
User registration form with complete validation
- **Fields:** Full Name, Email, Password, Confirm Password
- **Features:**
  - Real-time password strength indicator (weak/fair/strong)
  - Email format validation
  - Password confirmation matching
  - Terms & conditions checkbox
  - Success message with auto-redirect

### 2. **login.html**
User authentication form
- **Fields:** Email, Password, Remember Me checkbox
- **Features:**
  - Email format validation
  - Error handling with user-friendly messages
  - "Forgot Password?" link (placeholder)
  - "Sign Up" link for new users
  - Direct redirect to profile on success

### 3. **auth.js**
Shared authentication handler for both forms
- **Functions:**
  - Form validation (email, password, names)
  - API communication with backend
  - Token and profile storage in localStorage
  - Auto-redirect to protected pages
  - Session management

### 4. **profile.html**
User profile dashboard (redirected to after login)
- **Features:**
  - Display user profile information
  - Show user role and member since date
  - Session management with logout button
  - Debug token information section
  - Placeholder buttons for future features (Edit Profile, Change Password, Delete Account)

---

## Features Implemented

### ✅ Form Validation

#### Signup Form Validation:
```javascript
✓ Full Name: Minimum 2 characters
✓ Email: Valid email format (regex validation)
✓ Password: Minimum 6 characters
✓ Confirm Password: Matches password field
✓ Terms: Must be checked
```

#### Login Form Validation:
```javascript
✓ Email: Valid email format
✓ Password: Required field
```

### ✅ Password Strength Indicator
Real-time visual feedback on signup form:
- **Red (Weak):** Less than 6 characters
- **Orange (Fair):** 6-9 characters OR no special characters
- **Green (Strong):** 10+ characters with special characters

### ✅ Error Handling
- Field-level error messages displayed below each input
- Input fields highlighted with red border on error
- Alert error messages at top of form
- Network error handling with user-friendly messages
- Backend error responses displayed to user

### ✅ Loading States
- Submit button disabled during API call
- Loading spinner shows while processing
- Button text changes to loading state
- User feedback on submission

### ✅ localStorage Management

**Token Storage:**
```javascript
// Key: 'auth_token'
// Value: JWT token from backend
localStorage.setItem('auth_token', token);
```

**Profile Storage:**
```javascript
// Key: 'user_profile'
// Value: JSON object with user data
localStorage.setItem('user_profile', JSON.stringify(userProfile));
```

### ✅ Auto-Redirect
- Successful signup → Profile page (after 2 second success message)
- Successful login → Profile page (immediate)
- Accessing profile without auth → Login page

---

## How to Use

### 1. Setup Backend

Ensure your Express backend is running:
```bash
npm run dev
# Server should be on http://localhost:5000
```

### 2. Open Signup Page
```
file:///C:/Users/smabb/Downloads/my-eyes-pre-launch-main/signup.html
```

### 3. Create Account
- Enter full name, email, password
- Confirm password matches
- Check terms checkbox
- Click "Create Account"
- Success message appears → Auto-redirect to profile

### 4. View Profile
After successful login/signup, you'll be on the profile page showing:
- User name and email
- User role
- Member since date
- Session token (masked)

### 5. Logout
Click the "Log Out" button to clear localStorage and return to login page

---

## API Integration

### Signup Request
```javascript
POST http://localhost:5000/api/auth/signup
Content-Type: application/json

{
  "full_name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response:**
```javascript
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "user_id": 1,
    "full_name": "John Doe",
    "email": "john@example.com",
    "role": "customer"
  }
}
```

### Login Request
```javascript
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response:**
```javascript
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "user_id": 1,
    "full_name": "John Doe",
    "email": "john@example.com",
    "role": "customer"
  }
}
```

---

## Validation Rules

### Email Validation
```javascript
Pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/

Valid Examples:
✓ user@example.com
✓ john.doe@company.co.uk
✓ test+tag@domain.org

Invalid Examples:
✗ invalidemail
✗ user@
✗ @example.com
```

### Password Validation
```javascript
Minimum 6 characters

Valid Examples:
✓ password123
✓ SecurePass!
✓ 123456

Invalid Examples:
✗ pass (5 chars)
✗ 12345 (5 chars)
```

### Full Name Validation
```javascript
Minimum 2 characters (trimmed)

Valid Examples:
✓ John Doe
✓ A B
✓ Jean-Pierre

Invalid Examples:
✗ A (1 character)
✗ "" (empty)
```

---

## Error Messages

### Signup Errors

| Error | Message | Trigger |
|-------|---------|---------|
| Empty Full Name | "Full name must be at least 2 characters" | Less than 2 chars |
| Invalid Email | "Please enter a valid email address" | Wrong format |
| Empty Password | "Password is required" | No value entered |
| Short Password | "Password must be at least 6 characters" | Less than 6 chars |
| Password Mismatch | "Passwords do not match" | Confirm != Password |
| No Terms | "Please agree to the terms and conditions" | Unchecked checkbox |
| Email Exists | "Email already registered" | Backend response |
| Server Error | "An error occurred during signup" | Network error |

### Login Errors

| Error | Message | Trigger |
|-------|---------|---------|
| Empty Email | "Email is required" | No value entered |
| Invalid Email | "Please enter a valid email address" | Wrong format |
| Empty Password | "Password is required" | No value entered |
| Invalid Credentials | "Invalid email or password" | Backend response |
| User Inactive | "This account is inactive" | Backend response |
| Server Error | "An error occurred during login" | Network error |

---

## localStorage Data Structure

### auth_token
```javascript
Type: String (JWT)
Key: 'auth_token'
Expires: 7 days (set by backend, not stored)
```

### user_profile
```javascript
Type: JSON Object
Key: 'user_profile'

Structure:
{
  "user_id": 1,
  "full_name": "John Doe",
  "email": "john@example.com",
  "role": "customer",
  "is_active": true,
  "created_at": "2026-06-10T12:00:00Z"
}
```

---

## JavaScript API

### Public Functions (from auth.js)

#### `isAuthenticated()`
```javascript
// Check if user has valid token
if (isAuthenticated()) {
  console.log('User is logged in');
}

Returns: Boolean
```

#### `getCurrentUser()`
```javascript
// Get stored user profile
const user = getCurrentUser();
console.log(user.full_name); // "John Doe"

Returns: Object or null
```

#### `getStoredToken()`
```javascript
// Get stored JWT token
const token = getStoredToken();

Returns: String or null
```

#### `logout()`
```javascript
// Clear session and redirect to login
logout();
```

#### `clearAuthData()`
```javascript
// Remove token and profile from localStorage
clearAuthData();
```

#### `handleSignup(form)`
```javascript
// Called when signup form is submitted
// Automatically called from form submission handler
```

#### `handleLogin(form)`
```javascript
// Called when login form is submitted
// Automatically called from form submission handler
```

---

## Using Auth in Your Pages

### Check if User is Logged In
```javascript
// Add to any HTML page
<script src="auth.js"></script>

<script>
  document.addEventListener('DOMContentLoaded', function() {
    if (!isAuthenticated()) {
      // Redirect to login or show sign-in prompt
      window.location.href = 'login.html';
    }
  });
</script>
```

### Display User Information
```javascript
<script src="auth.js"></script>

<script>
  document.addEventListener('DOMContentLoaded', function() {
    const user = getCurrentUser();
    if (user) {
      document.getElementById('userName').textContent = user.full_name;
      document.getElementById('userEmail').textContent = user.email;
    }
  });
</script>
```

### Make Authenticated Requests
```javascript
<script src="auth.js"></script>

<script>
  async function getProtectedData() {
    const token = getStoredToken();
    
    const response = await fetch('/api/protected-endpoint', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    return data;
  }
</script>
```

---

## Troubleshooting

### "Failed to connect to API"
**Problem:** auth.js cannot reach backend
**Solution:**
1. Verify backend is running: `npm run dev`
2. Check backend is on `http://localhost:5000`
3. Verify CORS is enabled in backend
4. Check browser console for specific error

### "Passwords do not match"
**Problem:** User enters different passwords in password and confirm fields
**Solution:** Ensure both fields match exactly

### "Invalid email address"
**Problem:** Email format not recognized
**Solution:** Use format: `user@example.com`

### "Token not saving"
**Problem:** localStorage not persisting token
**Solution:**
1. Check browser allows localStorage
2. Check browser is not in private/incognito mode
3. Check quota hasn't been exceeded

### Profile page shows loading state forever
**Problem:** User profile not loading from localStorage
**Solution:**
1. Try logging in again
2. Check browser console for errors
3. Clear browser data and retry

---

## Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

**Requirements:**
- JavaScript enabled
- localStorage support
- ES6 support (arrow functions, async/await)

---

## Security Considerations

⚠️ **Important Notes:**

1. **localStorage Vulnerability**
   - localStorage can be accessed by any JavaScript
   - Use HTTPS in production
   - Consider using httpOnly cookies for tokens

2. **CORS in Development**
   - CORS allows frontend to access backend
   - Only allow trusted origins in production

3. **Password Handling**
   - Passwords hashed on backend with bcryptjs
   - Never log or display passwords
   - Use HTTPS for password transmission

4. **Token Expiration**
   - Default token expires in 7 days
   - Implement token refresh in production
   - Handle expired token errors gracefully

5. **Email Validation**
   - Frontend validation is for UX
   - Backend also validates before saving
   - Consider email verification in production

---

## Testing Checklist

- [ ] Open signup.html in browser
- [ ] Test empty form submission (should show errors)
- [ ] Test invalid email (should show error)
- [ ] Test short password (should show error)
- [ ] Test password mismatch (should show error)
- [ ] Test valid form submission
- [ ] Verify redirect to profile page
- [ ] Check localStorage has token and profile
- [ ] Verify profile page displays user info
- [ ] Test logout button
- [ ] Verify token cleared from localStorage
- [ ] Try accessing profile without login (should redirect to login)
- [ ] Open login.html and test with saved credentials
- [ ] Verify password strength indicator updates
- [ ] Test error messages from backend

---

## Next Steps

1. **Email Verification**
   - Send verification email on signup
   - Require email confirmation before account activation

2. **Password Reset**
   - Forgot password link implementation
   - Reset token generation
   - Email-based password reset

3. **Token Refresh**
   - Implement refresh token flow
   - Auto-refresh on token expiration
   - Seamless re-authentication

4. **Social Login**
   - Google login integration
   - Facebook login integration
   - OAuth2 implementation

5. **2FA (Two-Factor Authentication)**
   - SMS verification
   - TOTP authenticator app
   - Security key support

6. **Profile Management**
   - Edit profile information
   - Upload profile picture
   - Change password securely

---

## Support

For issues or questions:
1. Check browser console for error messages
2. Review backend logs for API errors
3. Verify API_TESTER.html works with backend
4. Check API_DOCUMENTATION.md for API details
5. Review AUTHENTICATION.md for setup guide

