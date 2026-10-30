const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const fallbackStore = require('./fallbackStore');

dotenv.config();

let pool = null;
let useFallback = false;

// Check if we should initialize MySQL pool
function initPool() {
  if (pool) return pool;

  const host = process.env.DB_HOST || 'localhost';
  const isCloudHost = host !== 'localhost' && host !== '127.0.0.1';
  const needsSsl = process.env.DB_SSL === 'true' || isCloudHost;

  try {
    if (process.env.DATABASE_URL || process.env.MYSQL_URL) {
      pool = mysql.createPool({
        uri: process.env.DATABASE_URL || process.env.MYSQL_URL,
        waitForConnections: true,
        connectionLimit: 10,
        ssl: needsSsl ? { rejectUnauthorized: false } : undefined
      });
    } else {
      pool = mysql.createPool({
        host,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : '',
        database: process.env.DB_NAME || 'nutrilife_db',
        port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        enableKeepAlive: true,
        keepAliveInitialDelay: 0,
        ssl: needsSsl ? { rejectUnauthorized: false } : undefined
      });
    }
  } catch (err) {
    console.warn('⚠️ MySQL pool initialization notice:', err.message);
  }

  return pool;
}

// Test connection function
async function testConnection() {
  try {
    const p = initPool();
    if (!p) return false;
    const connection = await p.getConnection();
    console.log('✅ Connected to MySQL database:', process.env.DB_NAME || 'nutrilife_db');
    connection.release();
    useFallback = false;
    return true;
  } catch (error) {
    console.warn('⚠️ MySQL Connection Notice:');
    console.warn(`   Host: ${process.env.DB_HOST || 'localhost'}`);
    console.warn(`   Message: ${error.message}`);
    console.warn('👉 Switching to resilient in-memory data store for cloud serverless execution.');
    useFallback = true;
    return false;
  }
}

// Robust query wrapper with automatic cloud serverless fallback
async function query(sql, params = []) {
  if (useFallback) {
    return fallbackStore.execute(sql, params);
  }

  try {
    const p = initPool();
    return await p.execute(sql, params);
  } catch (error) {
    // If connection to localhost 3306 is refused (e.g. running on Vercel without a cloud DB)
    if (
      error.code === 'ECONNREFUSED' ||
      error.code === 'ETIMEDOUT' ||
      error.code === 'ENOTFOUND' ||
      error.message?.includes('ECONNREFUSED')
    ) {
      console.warn('⚠️ Cloud serverless notice: MySQL unreachable on 127.0.0.1. Serving request with built-in data store.');
      useFallback = true;
      return fallbackStore.execute(sql, params);
    }
    throw error;
  }
}

module.exports = {
  get pool() {
    return initPool();
  },
  testConnection,
  query
};
