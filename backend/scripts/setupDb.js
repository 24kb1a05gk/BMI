const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function setupDatabase() {
  console.log('🔄 Initializing NutriLife database setup...');
  const host = process.env.DB_HOST || 'localhost';
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : '';
  const port = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306;

  let connection;
  try {
    // Connect without selecting database
    connection = await mysql.createConnection({
      host,
      user,
      password,
      port,
      multipleStatements: true
    });
    console.log(`✅ Connected to MySQL server at ${host}:${port}`);

    // Read nutrilife.sql
    const sqlPath = path.join(__dirname, '..', '..', 'nutrilife.sql');
    if (!fs.existsSync(sqlPath)) {
      throw new Error(`nutrilife.sql not found at ${sqlPath}`);
    }

    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    console.log('⏳ Executing nutrilife.sql schema and seed data...');
    await connection.query(sqlContent);

    console.log('🎉 nutrilife_db successfully created and seeded with 40+ healthy meals!');
  } catch (error) {
    console.error('❌ Database setup error:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

setupDatabase();
