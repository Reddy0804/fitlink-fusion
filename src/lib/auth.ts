
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from './db';

const JWT_SECRET = 'fitlink-fusion-secret-key'; // In production, use environment variable

// User interface
export interface User {
  id: number;
  username: string;
  email: string;
}

// Register a new user
export async function registerUser(username: string, email: string, password: string): Promise<User | null> {
  try {
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Insert user into database
    const result: any = await query(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );
    
    if (result.insertId) {
      return {
        id: result.insertId,
        username,
        email
      };
    }
    return null;
  } catch (error) {
    console.error('User registration failed:', error);
    throw error;
  }
}

// Login user
export async function loginUser(email: string, password: string): Promise<{ user: User, token: string } | null> {
  try {
    const users = await query('SELECT * FROM users WHERE email = ?', [email]) as any[];
    
    if (users.length === 0) {
      return null;
    }
    
    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return null;
    }
    
    // Create JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      },
      token
    };
  } catch (error) {
    console.error('User login failed:', error);
    throw error;
  }
}

// Verify JWT token
export function verifyToken(token: string): User | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as User;
    return decoded;
  } catch (error) {
    return null;
  }
}
