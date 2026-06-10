// ============================================================================
// Order & Checkout Management Router
// ============================================================================
// Defines endpoints for cart checkout, history, and fulfillment.
// ============================================================================

import express from 'express';
import { query, queryOne, executeTransaction, beginTransaction, commitTransaction, rollbackTransaction } from '../config/db.js';
import { verifyToken, optionalToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Helper to send order confirmation email (mock placeholder)
const sendOrderConfirmationEmail = async (orderId, email, name, items, total) => {
  console.log(`[Email Service] Mock confirmation email triggered for order #${orderId}`);
  console.log(`To: ${name} <${email}>`);
  console.log(`Subject: Your Order #${orderId} has been confirmed!`);
  console.log(`Total: ${total} USD/PKR`);
};

// ============================================================================
// 1. TRANSACTIONAL CHECKOUT ENDPOINT
// ============================================================================

/**
 * POST /api/orders/checkout
 * Processes order checkout inside a secure transaction.
 * Performs inventory locks, price validation, stock deduction, and order creation.
 * Access: Authenticated customers
 */
router.post('/checkout', optionalToken, async (req, res) => {
  try {
    const { cartItems, shippingAddress, billingDetails, paymentMethod, totalDiscount } = req.body;
    const user_id = req.user ? req.user.user_id : null;

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart cannot be empty.' });
    }

    if (!shippingAddress) {
      return res.status(400).json({ success: false, message: 'Shipping address is required.' });
    }

    let userProfile = null;
    let guest_email = null;
    let guest_name = null;

    if (user_id) {
      // Retrieve user profile email and full name
      userProfile = await queryOne('SELECT email, full_name FROM users WHERE user_id = ?', [user_id]);
      if (!userProfile) {
        return res.status(400).json({ success: false, message: 'User account not found.' });
      }
    } else {
      // Guest Checkout Validation
      const { guestName, guestEmail } = req.body;
      if (!guestName || !guestEmail) {
        return res.status(400).json({ success: false, message: 'Guest checkout requires name and email.' });
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(guestEmail)) {
        return res.status(400).json({ success: false, message: 'Invalid email address format.' });
      }
      guest_name = guestName;
      guest_email = guestEmail;

      userProfile = {
        full_name: guestName,
        email: guestEmail
      };
    }

    let calculatedSubtotal = 0;
    let orderItemsToCreate = [];

    // Begin Transaction
    await beginTransaction();

    try {
      // 1. Loop and lock rows, validate price & stock
      for (const item of cartItems) {
        // Run verification query inside transaction (FOR UPDATE is SQLite-simulated by SQLite transaction lock)
        const product = await queryOne(
          'SELECT product_id, product_name, price, stock_quantity FROM products WHERE product_id = ? AND is_active = 1',
          [item.product_id]
        );

        if (!product) {
          throw new Error(`Product "${item.product_name || 'Item'}" (ID: ${item.product_id}) is no longer available.`);
        }

        // Verify stock levels
        if (product.stock_quantity < item.quantity) {
          throw new Error(`Insufficient stock for "${product.product_name}". Requested: ${item.quantity}, Available: ${product.stock_quantity}`);
        }

        // Verify price integrity to prevent front-end tampering
        if (Number(product.price) !== Number(item.price)) {
          throw new Error(`Price discrepancy detected for "${product.product_name}". Please refresh your cart.`);
        }

        calculatedSubtotal += product.price * item.quantity;
        orderItemsToCreate.push({
          product_id: product.product_id,
          product_name: product.product_name,
          quantity: item.quantity,
          price: product.price,
          old_stock: product.stock_quantity
        });
      }

      // 2. Calculations
      const discount = Number(totalDiscount) || 0;
      const shippingCost = calculatedSubtotal > 150 ? 0 : 10; // $10 standard, $0 if subtotal > $150
      const estimatedTax = Math.round((calculatedSubtotal - discount) * 0.08 * 100) / 100; // 8% tax rate
      const finalGrandTotal = Math.max(0, calculatedSubtotal + shippingCost + estimatedTax - discount);

      // 3. Deduct inventory & record audit log
      for (const item of orderItemsToCreate) {
        const newStock = item.old_stock - item.quantity;
        await query(
          'UPDATE products SET stock_quantity = ? WHERE product_id = ?',
          [newStock, item.product_id]
        );

        // Record in inventory log
        await query(
          `INSERT INTO inventory_log (product_id, quantity_change, previous_quantity, new_quantity, reason)
           VALUES (?, ?, ?, ?, 'purchase')`,
          [item.product_id, -item.quantity, item.old_stock, newStock]
        );
      }

      // 4. Create main Order record
      const billingAddress = billingDetails 
        ? `${billingDetails.name || userProfile.full_name} | Address: ${billingDetails.address}, ${billingDetails.city || ''}, ${billingDetails.zip || ''} | Phone: ${billingDetails.phone || ''}`
        : shippingAddress;

      const orderSql = `
        INSERT INTO orders (
          user_id, total_amount, tax_amount, shipping_amount, discount_amount,
          payment_status, order_status, shipping_address, billing_address, payment_method,
          guest_name, guest_email
        ) VALUES (?, ?, ?, ?, ?, 'completed', 'processing', ?, ?, ?, ?, ?)
      `;

      const orderResult = await query(orderSql, [
        user_id,
        finalGrandTotal,
        estimatedTax,
        shippingCost,
        discount,
        shippingAddress,
        billingAddress,
        paymentMethod || 'Credit/Debit Card',
        guest_name,
        guest_email
      ]);

      const newOrderId = orderResult.lastID;

      // 5. Create relational Order Items
      for (const item of orderItemsToCreate) {
        await query(
          `INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)`,
          [newOrderId, item.product_id, item.quantity, item.price]
        );
      }

      // Commit Transaction
      await commitTransaction();

      // Trigger email dispatch asynchronously (placeholder)
      sendOrderConfirmationEmail(
        newOrderId, 
        userProfile.email, 
        userProfile.full_name, 
        orderItemsToCreate, 
        finalGrandTotal
      );

      return res.status(201).json({
        success: true,
        orderId: newOrderId,
        message: 'Transaction authorized successfully.'
      });

    } catch (txError) {
      // Rollback Transaction on error
      await rollbackTransaction();
      throw txError;
    }

  } catch (error) {
    console.error('Checkout Transaction Failure:', error.message);
    res.status(400).json({
      success: false,
      message: error.message || 'Checkout failed.'
    });
  }
});

// ============================================================================
// 2. ORDER HISTORY ENDPOINTS
// ============================================================================

/**
 * GET /api/orders/user
 * Fetch authenticated user's order history with items
 */
router.get('/user', verifyToken, async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const orders = await query('SELECT * FROM orders WHERE user_id = ? ORDER BY order_date DESC', [user_id]);
    
    for (let order of orders) {
      order.items = await query(`
        SELECT oi.*, p.product_name, p.brand, p.image_url 
        FROM order_items oi 
        JOIN products p ON oi.product_id = p.product_id 
        WHERE oi.order_id = ?
      `, [order.order_id]);
    }

    res.status(200).json({ success: true, count: orders.length, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch order history', error: error.message });
  }
});

/**
 * PUT /api/orders/:id/cancel
 * Cancel order and restore inventory
 */
router.put('/:id/cancel', verifyToken, async (req, res) => {
  try {
    const order_id = req.params.id;
    const user_id = req.user.user_id;

    const order = await queryOne('SELECT * FROM orders WHERE order_id = ? AND user_id = ?', [order_id, user_id]);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.order_status !== 'pending' && order.order_status !== 'processing') {
      return res.status(400).json({ success: false, message: 'Only pending or processing orders can be cancelled' });
    }

    await executeTransaction(async () => {
      await query("UPDATE orders SET order_status = 'cancelled', payment_status = 'refunded' WHERE order_id = ?", [order_id]);
      
      const items = await query('SELECT product_id, quantity FROM order_items WHERE order_id = ?', [order_id]);
      for (const item of items) {
        const product = await queryOne('SELECT stock_quantity FROM products WHERE product_id = ?', [item.product_id]);
        const newQty = product.stock_quantity + item.quantity;
        
        await query('UPDATE products SET stock_quantity = ? WHERE product_id = ?', [newQty, item.product_id]);
        await query(
          `INSERT INTO inventory_log (product_id, quantity_change, previous_quantity, new_quantity, reason)
           VALUES (?, ?, ?, ?, 'return')`,
          [item.product_id, item.quantity, product.stock_quantity, newQty]
        );
      }
    });

    res.status(200).json({ success: true, message: 'Order cancelled and stock restored' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Cancellation failed', error: error.message });
  }
});

// ============================================================================
// 3. ADMIN MANAGEMENT ROUTES
// ============================================================================

/**
 * GET /api/orders
 * Fetch all orders (Admin only)
 */
router.get('/', verifyToken, requireAdmin, async (req, res) => {
  try {
    const orders = await query(`
      SELECT o.*, COALESCE(u.full_name, o.guest_name, 'Guest') as customer_name, COALESCE(u.email, o.guest_email, 'guest@example.com') as customer_email
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.user_id
      ORDER BY o.order_date DESC
    `);
    
    for (let order of orders) {
      order.items = await query(`
        SELECT oi.*, p.product_name, p.brand, p.image_url 
        FROM order_items oi 
        JOIN products p ON oi.product_id = p.product_id 
        WHERE oi.order_id = ?
      `, [order.order_id]);
    }

    res.status(200).json({ success: true, count: orders.length, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch global order history', error: error.message });
  }
});

/**
 * PUT /api/orders/:id/status
 * Update order status (Admin only)
 */
router.put('/:id/status', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { order_status } = req.body;
    const order_id = req.params.id;

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'];
    if (!validStatuses.includes(order_status)) {
      return res.status(400).json({ success: false, message: 'Invalid order status.' });
    }

    const result = await query(
      "UPDATE orders SET order_status = ?, updated_at = CURRENT_TIMESTAMP WHERE order_id = ?",
      [order_status, order_id]
    );

    if (result.changes === 0) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    res.status(200).json({ success: true, message: 'Order status updated successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update order status', error: error.message });
  }
});

/**
 * GET /api/orders/receipt/:id
 * Fetch a single order receipt details (public, for confirmation page)
 */
router.get('/receipt/:id', async (req, res) => {
  try {
    const order_id = req.params.id;

    const order = await queryOne('SELECT order_id, total_amount, shipping_address, payment_method, guest_email, guest_name FROM orders WHERE order_id = ?', [order_id]);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    order.items = await query(`
      SELECT oi.*, p.product_name, p.brand, p.image_url 
      FROM order_items oi 
      JOIN products p ON oi.product_id = p.product_id 
      WHERE oi.order_id = ?
    `, [order_id]);

    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch receipt details', error: error.message });
  }
});

export default router;
