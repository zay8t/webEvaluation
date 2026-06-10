// ============================================================================
// Authentication Controller
// ============================================================================
// Handles user authentication logic for signup and login
// ============================================================================

import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query, queryOne } from '../config/db.js';

// ============================================================================
// SIGNUP CONTROLLER
// ============================================================================
/**
 * Register a new user
 * POST /api/auth/signup
 * Body: { full_name, email, password }
 */
export const signup = async (req, res) => {
  try {
    const { full_name, email, password } = req.body;

    // Validation
    if (!full_name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'full_name, email, and password are required',
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format',
      });
    }

    // Password validation (minimum 6 characters)
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters',
      });
    }

    // Check if user already exists
    const existingUser = await queryOne(
      'SELECT user_id FROM users WHERE email = ?',
      [email]
    );

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered',
      });
    }

    // Hash password
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 10;
    const hashedPassword = await bcryptjs.hash(password, saltRounds);

    const role = email === 'admin@myeyes.com' ? 'admin' : 'customer';
    const result = await query(
      `INSERT INTO users (full_name, email, password, role, theme_preference, is_active)
       VALUES (?, ?, ?, ?, 'light', 1)`,
      [full_name, email, hashedPassword, role]
    );

    const userId = result.lastID || Date.now();

    // Generate JWT token
    const token = jwt.sign(
      { 
        user_id: userId, 
        email, 
        role: role 
      },
      process.env.JWT_SECRET || 'your_super_secret_jwt_key',
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        user_id: userId,
        full_name,
        email,
        role: 'customer',
        theme_preference: 'light',
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating user account',
      error: error.message,
    });
  }
};

// ============================================================================
// LOGIN CONTROLLER
// ============================================================================
/**
 * Login user and generate JWT token
 * POST /api/auth/login
 * Body: { email, password }
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    // Find user by email
    const user = await queryOne(
      `SELECT user_id, full_name, email, password, role, theme_preference, is_active 
       FROM users WHERE email = ?`,
      [email]
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check if user is active
    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: 'User account is inactive',
      });
    }

    // Verify password
    const isPasswordValid = await bcryptjs.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        user_id: user.user_id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET || 'your_super_secret_jwt_key',
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        user_id: user.user_id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        theme_preference: user.theme_preference,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error during login',
      error: error.message,
    });
  }
};

// ============================================================================
// LOGOUT CONTROLLER
// ============================================================================
/**
 * Logout user (client-side token removal)
 * POST /api/auth/logout
 */
export const logout = (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error during logout',
      error: error.message,
    });
  }
};

// ============================================================================
// GET CURRENT USER
// ============================================================================
/**
 * Get current authenticated user info
 * GET /api/auth/me
 * Requires valid JWT token
 */
export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.user_id;

    const user = await queryOne(
      `SELECT user_id, full_name, email, phone, address, role, theme_preference 
       FROM users WHERE user_id = ?`,
      [userId]
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user information',
      error: error.message,
    });
  }
};

// ============================================================================
// UPDATE PROFILE CONTROLLER
// ============================================================================
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { full_name, phone, address } = req.body;

    if (!full_name) {
      return res.status(400).json({
        success: false,
        message: 'Full name is required',
      });
    }

    await query(
      `UPDATE users 
       SET full_name = ?, phone = ?, address = ?, updated_at = CURRENT_TIMESTAMP 
       WHERE user_id = ?`,
      [full_name, phone || '', address || '', userId]
    );

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message,
    });
  }
};

// ============================================================================
// CHANGE PASSWORD CONTROLLER
// ============================================================================
export const changePassword = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long',
      });
    }

    // Get current hashed password
    const user = await queryOne('SELECT password FROM users WHERE user_id = ?', [userId]);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Compare
    const isMatch = await bcryptjs.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Incorrect current password',
      });
    }

    // Hash new password
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 10;
    const hashed = await bcryptjs.hash(newPassword, saltRounds);

    await query('UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?', [hashed, userId]);

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Error changing password',
      error: error.message,
    });
  }
};

// ============================================================================
// DELETE ACCOUNT CONTROLLER
// ============================================================================
export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.user_id;

    await query('DELETE FROM users WHERE user_id = ?', [userId]);

    res.status(200).json({
      success: true,
      message: 'Account deleted successfully',
    });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting account',
      error: error.message,
    });
  }
};
