const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// Helper to generate JWT token
function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET || 'nutrilife_super_secure_jwt_secret_key_2026_xyz',
    { expiresIn: '7d' }
  );
}

// POST /api/auth/register
async function register(req, res, next) {
  try {
    const { full_name, email, password, confirm_password } = req.body;

    if (!full_name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide full name, email, and password.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.'
      });
    }

    if (confirm_password && password !== confirm_password) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match.'
      });
    }

    const trimmedEmail = email.trim().toLowerCase();

    // Check unique email
    const [existingUsers] = await db.query('SELECT id FROM users WHERE email = ?', [trimmedEmail]);
    if (existingUsers.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists. Please login instead.'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Insert user
    const [result] = await db.query(
      'INSERT INTO users (full_name, email, password_hash) VALUES (?, ?, ?)',
      [full_name.trim(), trimmedEmail, passwordHash]
    );

    const newUser = {
      id: result.insertId,
      full_name: full_name.trim(),
      email: trimmedEmail
    };

    const token = generateToken(newUser);

    return res.status(201).json({
      success: true,
      message: 'Account registered successfully!',
      token,
      user: newUser,
      hasProfile: false
    });
  } catch (error) {
    next(error);
  }
}

// POST /api/auth/login
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password.'
      });
    }

    const trimmedEmail = email.trim().toLowerCase();

    // Find user
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [trimmedEmail]);
    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const user = users[0];

    // Check password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    // Check if profile exists
    const [profiles] = await db.query('SELECT id, bmi, health_goal FROM user_profiles WHERE user_id = ?', [user.id]);
    const [prefs] = await db.query('SELECT preference_type FROM food_preferences WHERE user_id = ?', [user.id]);

    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully!',
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email
      },
      hasProfile: profiles.length > 0,
      profile: profiles[0] || null,
      foodPreference: prefs.length > 0 ? prefs[0].preference_type : null
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/auth/me
async function getMe(req, res, next) {
  try {
    const userId = req.user.id;

    const [users] = await db.query(
      'SELECT id, full_name, email, created_at FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const [profiles] = await db.query(
      'SELECT * FROM user_profiles WHERE user_id = ?',
      [userId]
    );

    const [prefs] = await db.query(
      'SELECT preference_type FROM food_preferences WHERE user_id = ?',
      [userId]
    );

    return res.status(200).json({
      success: true,
      user: {
        ...users[0],
        hasProfile: profiles.length > 0,
        profile: profiles[0] || null,
        foodPreference: prefs.length > 0 ? prefs[0].preference_type : null
      }
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  login,
  getMe
};
