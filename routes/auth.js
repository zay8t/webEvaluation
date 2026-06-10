// ============================================================================
// Authentication Routes
// ============================================================================
// Defines endpoints for user signup, login, and logout
// ============================================================================

import express from 'express';
import {
  signup,
  login,
  logout,
  getCurrentUser,
  updateProfile,
  changePassword,
  deleteAccount,
} from '../controllers/authController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// ============================================================================
// PUBLIC ROUTES
// ============================================================================

/**
 * POST /api/auth/signup
 * Register a new user
 * Body: { full_name, email, password }
 */
router.post('/signup', signup);

/**
 * POST /api/auth/login
 * Login user and receive JWT token
 * Body: { email, password }
 */
router.post('/login', login);

/**
 * POST /api/auth/logout
 * Logout user (client removes token)
 */
router.post('/logout', logout);

// ============================================================================
// PROTECTED ROUTES
// ============================================================================

/**
 * GET /api/auth/me
 * Get current authenticated user info
 * Requires: Valid JWT token
 */
router.get('/me', verifyToken, getCurrentUser);

/**
 * PUT /api/auth/profile
 * Update profile details (name, phone, address)
 */
router.put('/profile', verifyToken, updateProfile);

/**
 * PUT /api/auth/password
 * Change password
 */
router.put('/password', verifyToken, changePassword);

/**
 * DELETE /api/auth/account
 * Delete account
 */
router.delete('/account', verifyToken, deleteAccount);

export default router;
