// ============================================================================
// Product Management Routes
// ============================================================================
// Defines endpoints for viewing and managing eyewear products
// ============================================================================

import express from 'express';
import { query, queryOne } from '../config/db.js';
import { verifyToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// ============================================================================
// PUBLIC ROUTES
// ============================================================================

/**
 * GET /api/products
 * Fetch all products with dynamic filtering
 * Query Params: brand, category, gender, frame_type, min_price, max_price
 */
router.get('/', async (req, res) => {
  try {
    const { brand, category, gender, frame_type, min_price, max_price } = req.query;
    
    let sql = 'SELECT * FROM products WHERE is_active = 1';
    const params = [];

    if (brand) {
      // Support comma-separated brands
      const brands = brand.split(',');
      sql += ` AND brand IN (${brands.map(() => '?').join(',')})`;
      params.push(...brands);
    }

    if (category) {
      sql += ' AND category = ?';
      params.push(category);
    }

    if (gender) {
      sql += ' AND gender = ?';
      params.push(gender);
    }

    if (frame_type) {
      // Support comma-separated types
      const types = frame_type.split(',');
      sql += ` AND frame_type IN (${types.map(() => '?').join(',')})`;
      params.push(...types);
    }

    if (min_price) {
      sql += ' AND price >= ?';
      params.push(parseFloat(min_price));
    }

    if (max_price) {
      sql += ' AND price <= ?';
      params.push(parseFloat(max_price));
    }

    sql += ' ORDER BY created_at DESC';

    const products = await query(sql, params);
    res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message
    });
  }
});

/**
 * GET /api/products/:id
 * Fetch a single product by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const product = await queryOne('SELECT * FROM products WHERE product_id = ?', [req.params.id]);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product details',
      error: error.message
    });
  }
});

// ============================================================================
// ADMIN PROTECTED ROUTES
// ============================================================================

/**
 * POST /api/products
 * Create a new product
 */
router.post('/', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { 
      product_name, brand, category, description, frame_type, 
      gender, price, stock_quantity, image_url, color, material, lens_type, sku 
    } = req.body;

    const sql = `
      INSERT INTO products (
        product_name, brand, category, description, frame_type, 
        gender, price, stock_quantity, image_url, color, material, lens_type, sku
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const result = await query(sql, [
      product_name, brand, category, description, frame_type, 
      gender, price, stock_quantity, image_url, color, material, lens_type, sku
    ]);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      productId: result.lastID
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create product',
      error: error.message
    });
  }
});

/**
 * PUT /api/products/:id
 * Update an existing product
 */
router.put('/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { 
      product_name, brand, category, description, frame_type, 
      gender, price, stock_quantity, image_url, color, material, lens_type, sku, is_active
    } = req.body;

    const sql = `
      UPDATE products SET 
        product_name = ?, brand = ?, category = ?, description = ?, frame_type = ?, 
        gender = ?, price = ?, stock_quantity = ?, image_url = ?, color = ?, 
        material = ?, lens_type = ?, sku = ?, is_active = ?
      WHERE product_id = ?
    `;

    const result = await query(sql, [
      product_name, brand, category, description, frame_type, 
      gender, price, stock_quantity, image_url, color, material, 
      lens_type, sku, is_active, req.params.id
    ]);

    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found or no changes made'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update product',
      error: error.message
    });
  }
});

/**
 * DELETE /api/products/:id
 * Soft delete or hard delete a product
 * Defaulting to soft delete (is_active = 0) as per common practice
 */
router.delete('/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    // Hard delete as requested by prompt "removal of database product rows"
    const result = await query('DELETE FROM products WHERE product_id = ?', [req.params.id]);

    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete product',
      error: error.message
    });
  }
});

export default router;
