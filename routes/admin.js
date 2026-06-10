// ============================================================================
// Administrative Engine Routes
// ============================================================================
// Exclusive endpoints for store oversight, analytics, and moderation
// ============================================================================

import express from 'express';
import { query, queryOne } from '../config/db.js';
import { verifyToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /api/admin/dashboard-stats
 * Returns high-level metrics for the dashboard summary cards
 * Access: Admin Only
 */
router.get('/dashboard-stats', verifyToken, requireAdmin, async (req, res) => {
  try {
    // Concurrent queries for performance
    const [userCount, productCount, orderCount, revenue] = await Promise.all([
      queryOne('SELECT COUNT(*) as count FROM users'),
      queryOne('SELECT COUNT(*) as count FROM products'),
      queryOne('SELECT COUNT(*) as count FROM orders'),
      queryOne("SELECT SUM(total_amount) as total FROM orders WHERE payment_status IN ('paid', 'Paid', 'completed')")
    ]);

    const [pendingOrders, lowStock] = await Promise.all([
      queryOne("SELECT COUNT(*) as count FROM orders WHERE order_status IN ('pending', 'processing')"),
      queryOne("SELECT COUNT(*) as count FROM products WHERE stock_quantity < 5")
    ]);

    res.status(200).json({
      success: true,
      stats: {
        total_users: userCount.count,
        total_products: productCount.count,
        total_orders: orderCount.count,
        total_revenue: revenue.total || 0,
        pending_orders: pendingOrders.count,
        low_stock_alerts: lowStock.count
      }
    });
  } catch (error) {
    console.error('Admin Stats Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch dashboard statistics' });
  }
});

/**
 * GET /api/admin/users
 * Returns list of all registered users
 */
router.get('/users', verifyToken, requireAdmin, async (req, res) => {
  try {
    const users = await query(`
      SELECT user_id, full_name, email, role, is_active, created_at 
      FROM users 
      ORDER BY created_at DESC
    `);
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
});

/**
 * GET /api/admin/reviews
 * Returns list of all product reviews with product details
 */
router.get('/reviews', verifyToken, requireAdmin, async (req, res) => {
  try {
    const reviews = await query(`
      SELECT r.*, p.product_name, u.full_name as user_name
      FROM reviews r
      JOIN products p ON r.product_id = p.product_id
      JOIN users u ON r.user_id = u.user_id
      ORDER BY r.review_date DESC
    `);
    res.status(200).json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch reviews' });
  }
});

/**
 * DELETE /api/admin/reviews/:id
 * Remove a review (Moderation)
 */
router.delete('/reviews/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const result = await query('DELETE FROM reviews WHERE review_id = ?', [req.params.id]);
    if (result.changes === 0) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    res.status(200).json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete review' });
  }
});

/**
 * GET /api/admin/contact
 * Returns all contact form submissions
 */
router.get('/contact', verifyToken, requireAdmin, async (req, res) => {
  try {
    const inquiries = await query('SELECT * FROM contact_inquiries ORDER BY created_at DESC');
    res.status(200).json({ success: true, inquiries });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch inquiries' });
  }
});

/**
 * PATCH /api/admin/contact/:id/resolve
 * Mark a contact inquiry as resolved
 */
router.patch('/contact/:id/resolve', verifyToken, requireAdmin, async (req, res) => {
  try {
    const result = await query("UPDATE contact_inquiries SET status = 'resolved' WHERE inquiry_id = ?", [req.params.id]);
    if (result.changes === 0) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }
    res.status(200).json({ success: true, message: 'Inquiry marked as resolved' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to resolve inquiry' });
  }
});

export default router;
