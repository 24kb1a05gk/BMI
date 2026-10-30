const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { testConnection } = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logger (Development)
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${req.method}] ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'NutriLife Backend API',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/profile', require('./routes/profileRoutes'));
app.use('/api/preferences', require('./routes/preferenceRoutes'));
app.use('/api/meals', require('./routes/mealRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

// 404 Handler for unknown routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint ${req.method} ${req.originalUrl} not found.`
  });
});

// Centralized error handler
app.use(errorHandler);

// Start server if run directly
async function startServer() {
  await testConnection();
  app.listen(PORT, () => {
    console.log(`🚀 NutriLife Backend Server running on http://localhost:${PORT}`);
    console.log(`📡 Ready for requests from React Vite client at http://localhost:5173`);
  });
}

if (require.main === module) {
  startServer();
}

module.exports = app;
