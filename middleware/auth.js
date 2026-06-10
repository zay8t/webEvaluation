// ============================================================================
// Authentication Middleware
// ============================================================================
// Protects routes and verifies JWT tokens
// ============================================================================

import jwt from 'jsonwebtoken';

// ============================================================================
// VERIFY TOKEN MIDDLEWARE
// ============================================================================
/**
 * Verifies JWT token from Authorization header
 * Required for all protected routes
 */
export const verifyToken = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided',
      });
    }

    // Extract token
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your_super_secret_jwt_key'
    );

    // Attach user data to request
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired',
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
      });
    }

    res.status(401).json({
      success: false,
      message: 'Token verification failed',
      error: error.message,
    });
  }
};

// ============================================================================
// REQUIRE CUSTOMER ROLE MIDDLEWARE
// ============================================================================
/**
 * Ensures user has 'customer' role
 * Use after verifyToken middleware
 */
export const requireCustomer = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
    }

    if (req.user.role !== 'customer' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Customer access required',
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Authorization check failed',
      error: error.message,
    });
  }
};

// ============================================================================
// REQUIRE ADMIN ROLE MIDDLEWARE
// ============================================================================
/**
 * Ensures user has 'admin' role
 * Use after verifyToken middleware
 */
export const requireAdmin = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required',
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Authorization check failed',
      error: error.message,
    });
  }
};

// ============================================================================
// OPTIONAL TOKEN MIDDLEWARE
// ============================================================================
/**
 * Optionally verifies token if provided
 * Doesn't fail if token is missing, but validates if present
 */
export const optionalToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // No token provided is okay
      req.user = null;
      return next();
    }

    const token = authHeader.substring(7);

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'your_super_secret_jwt_key'
      );
      req.user = decoded;
    } catch (error) {
      // Invalid token - continue without user
      req.user = null;
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Token processing failed',
      error: error.message,
    });
  }
};
