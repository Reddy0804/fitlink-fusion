
import mysql from 'mysql2/promise';

// Database connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Vtu@20253',
  database: 'fitlink_fusion',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Initialize database
export async function initDb() {
  try {
    // Create database if not exists
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'Vtu@20253'
    });
    
    await connection.query('CREATE DATABASE IF NOT EXISTS fitlink_fusion');
    await connection.end();
    
    // Create tables
    const conn = await pool.getConnection();
    
    // Users table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    
    // Health metrics table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS health_metrics (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        date DATE NOT NULL,
        steps INT,
        weight FLOAT,
        heart_rate INT,
        sleep_hours FLOAT,
        water_intake INT,
        stress_level INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE KEY unique_user_date (user_id, date)
      )
    `);
    
    conn.release();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization failed:', error);
  }
}

// Helper function to execute SQL queries
export async function query(sql: string, params: any[] = []) {
  try {
    const [results] = await pool.execute(sql, params);
    return results;
  } catch (error) {
    console.error('Database query failed:', error);
    throw error;
  }
}

export default pool;
