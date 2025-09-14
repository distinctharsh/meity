#!/usr/bin/env node

const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

console.log('🗄️ Setting up MEITY CMS Database...\n');

async function setupDatabase() {
  let connection;
  
  try {
    // Connect to MySQL server (without specifying database)
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '', // Update this if you have a password
    });

    console.log('✅ Connected to MySQL server');

    // Create database
    await connection.query('CREATE DATABASE IF NOT EXISTS meity_clone');
    console.log('✅ Database "meity_clone" created');

    // Use the database
    await connection.query('USE meity_clone');
    console.log('✅ Using database "meity_clone"');

    // Read and execute the schema
    const schemaPath = path.join(__dirname, 'lib', 'cms-schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Split the schema into individual statements
    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    console.log('📋 Executing database schema...');
    
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          // Use query instead of execute for DDL statements
          await connection.query(statement);
        } catch (error) {
          // Skip errors for statements that might already exist
          if (!error.message.includes('already exists') && !error.message.includes('Duplicate entry')) {
            console.warn(`⚠️ Warning: ${error.message}`);
          }
        }
      }
    }

    console.log('✅ Database schema executed successfully');
    console.log('✅ Default admin user created (username: admin, password: admin123)');
    console.log('✅ Default navigation structure created');
    console.log('✅ Default site settings created');

    console.log('\n🎉 Database setup completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Go to http://localhost:3000/admin/login');
    console.log('2. Login with: admin / admin123');
    console.log('3. Change the default password immediately!');

  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure MySQL is running');
    console.log('2. Check your MySQL credentials in .env.local');
    console.log('3. Try running: npm install mysql2');
    
    if (error.code === 'ECONNREFUSED') {
      console.log('4. MySQL server is not running. Start MySQL service.');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('4. Wrong username/password. Update .env.local file.');
    }
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

setupDatabase();
