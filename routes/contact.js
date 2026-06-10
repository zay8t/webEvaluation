import express from 'express';
import { query } from '../config/db.js';

const router = express.Router();

/**
 * POST /api/contact
 * Submit a customer contact inquiry
 * Body: { name, email, subject, message }
 */
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required (name, email, subject, and message).',
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email address format.',
      });
    }

    await query(
      `INSERT INTO contact_inquiries (name, email, subject, message, status)
       VALUES (?, ?, ?, ?, 'pending')`,
      [name, email, subject, message]
    );

    res.status(201).json({
      success: true,
      message: 'Your inquiry has been submitted successfully. We will get back to you shortly!',
    });
  } catch (error) {
    console.error('Contact Submission Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit contact inquiry.',
      error: error.message,
    });
  }
});

export default router;
