const jwt = require('jsonwebtoken');
const db = require('../config/db');

async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No authorization token provided.'
      });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Invalid authorization token format.'
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'nutrilife_super_secure_jwt_secret_key_2026_xyz'
    );

    // Verify user exists in MySQL
    const [rows] = await db.query('SELECT id, full_name, email FROM users WHERE id = ?', [decoded.id]);
    if (!rows || rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Session invalid or user no longer exists.'
      });
    }

    req.user = {
      id: rows[0].id,
      full_name: rows[0].full_name,
      email: rows[0].email
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired. Please log in again.'
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Invalid authorization token.'
    });
  }
}

module.exports = authMiddleware;
