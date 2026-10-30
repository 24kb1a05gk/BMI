const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

// Create a connection pool to MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : '',
  database: process.env.DB_NAME || 'nutrilife_db',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
  waitForConnections: true,
  connectionLimit: 15,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

// Test connection function
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Connected to MySQL database:', process.env.DB_NAME || 'nutrilife_db');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ MySQL Connection Failed:');
    console.error(`   Host: ${process.env.DB_HOST || 'localhost'}`);
    console.error(`   User: ${process.env.DB_USER || 'root'}`);
    console.error(`   Database: ${process.env.DB_NAME || 'nutrilife_db'}`);
    console.error(`   Message: ${error.message}`);
    console.error('👉 Make sure MySQL is running in XAMPP and "nutrilife_db" is created with nutrilife.sql.');
    return false;
  }
}

module.exports = {
  pool,
  testConnection,
  query: (sql, params) => pool.execute(sql, params)
};
