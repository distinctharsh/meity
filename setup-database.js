#!/usr/bin/env node

const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function setupDatabase() {
  let connection;

  try {
    // Connect to MySQL server (without specifying database)
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '', // Update this if you have a password
    });



    // Create database
    await connection.query('CREATE DATABASE IF NOT EXISTS cabsec_cms');

    // Use the database
    await connection.query('USE cabsec_cms');

    // Read and execute the schema
    const schemaPath = path.join(__dirname, 'lib', 'cms-schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Split the schema into individual statements
    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));


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


  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
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
