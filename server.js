// ============================================================================
// MY EYES - Express Server Configuration
// ============================================================================
// Main entry point for the MY EYES backend API server
// Configures Express middleware, CORS, routes, and error handling
// ============================================================================

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testConnection, closeDatabase } from './config/db.js';

// Load environment variables
dotenv.config();

// ============================================================================
// Initialize Express App
// ============================================================================
const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// ============================================================================
// CORS Configuration
// ============================================================================
// Configure CORS to allow requests from specified origins
const corsOptions = {
  origin: process.env.CORS_ORIGIN?.split(',') || [
    'http://localhost:3000',
    'http://localhost:5173', // Vite default port
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173',
  ],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400, // 24 hours
};

// Apply CORS middleware
app.use(cors(corsOptions));

// ============================================================================
// Body Parser Middleware
// ============================================================================
// Parse incoming JSON and URL-encoded request bodies
app.use(express.json({ 
  limit: '10mb',
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// ============================================================================
// Security Headers Middleware
// ============================================================================
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// ============================================================================
// Request Logging Middleware
// ============================================================================
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// ============================================================================
// Health Check Route
// ============================================================================
app.get('/health', async (req, res) => {
  try {
    const dbConnected = await testConnection();
    res.status(200).json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      environment: NODE_ENV,
      database: dbConnected ? 'connected' : 'disconnected',
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: 'Server health check failed',
      error: error.message,
    });
  }
});

// ============================================================================
// API Routes
// ============================================================================
// TODO: Import and use route handlers
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import adminRoutes from './routes/admin.js';
import contactRoutes from './routes/contact.js';

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contact', contactRoutes);

// TODO: Import and add other routes
// import productRoutes from './routes/products.js';
// import orderRoutes from './routes/orders.js';
// import userRoutes from './routes/users.js';
// import reviewRoutes from './routes/reviews.js';
// import contactRoutes from './routes/contact.js';
// import wishlistRoutes from './routes/wishlist.js';

// app.use('/api/products', productRoutes);
// app.use('/api/orders', orderRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/reviews', reviewRoutes);
// app.use('/api/contact', contactRoutes);
// app.use('/api/wishlist', wishlistRoutes);

// ============================================================================
// 404 Not Found Middleware
// ============================================================================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path,
    method: req.method,
  });
});

// ============================================================================
// Global Error Handler Middleware
// ============================================================================
app.use((error, req, res, next) => {
  console.error('Error:', {
    message: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method,
  });

  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    ...(NODE_ENV === 'development' && { error: error.stack }),
  });
});

// ============================================================================
// Graceful Shutdown
// ============================================================================
const gracefulShutdown = async () => {
  console.log('\nShutting down gracefully...');
  await closeDatabase();
  process.exit(0);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// ============================================================================
// Start Server
// ============================================================================
const server = app.listen(PORT, async () => {
  console.log('\n' + '='.repeat(60));
  console.log('MY EYES - Backend Server');
  console.log('='.repeat(60));
  console.log(`✓ Server running on http://localhost:${PORT}`);
  console.log(`✓ Environment: ${NODE_ENV}`);
  console.log(`✓ Database: SQLite (${process.env.DB_PATH || 'data/my_eyes_store.db'})`);
  console.log(`✓ CORS enabled for: ${corsOptions.origin.join(', ')}`);

  // Test database connection
  const dbConnected = await testConnection();
  if (!dbConnected) {
    console.warn('⚠ Warning: Unable to connect to database');
  }

  console.log('='.repeat(60) + '\n');
});

// Handle server errors
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`✗ Port ${PORT} is already in use`);
  } else {
    console.error('✗ Server error:', error.message);
  }
  process.exit(1);
});

export default app;
