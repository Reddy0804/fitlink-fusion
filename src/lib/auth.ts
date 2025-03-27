
import dbService from "./database/dbService";

interface User {
  id: number;
  name: string;
  email: string;
  role?: string;
}

// Token handling for frontend
const setToken = (token: string) => {
  localStorage.setItem("token", token);
};

// Simple token generator for demo purposes
const generateToken = (userId: number): string => {
  return `mock-jwt-${userId}-${Date.now()}`;
};

export const loginUser = async (username: string, password: string): Promise<User> => {
  try {
    // Validate credentials against database
    const auth = await dbService.validateCredentials(username, password);
    
    if (!auth) {
      throw new Error("Invalid credentials");
    }
    
    // Get patient information
    const patient = await dbService.getPatient(auth.id);
    
    if (!patient) {
      throw new Error("Patient record not found");
    }
    
    // Generate and store token
    const token = generateToken(auth.id);
    setToken(token);
    
    // Return user object
    return {
      id: patient.id,
      name: patient.name,
      email: patient.email,
      role: auth.role
    };
  } catch (error) {
    console.error("Login error:", error);
    throw new Error("Invalid credentials");
  }
};

export const getCurrentUser = async (): Promise<User | null> => {
  const token = localStorage.getItem("token");
  
  if (!token) return null;
  
  // For demo purposes, extract user ID from token
  // In a real app, you would validate the token with your backend
  try {
    const userId = parseInt(token.split('-')[2]);
    
    if (isNaN(userId)) {
      throw new Error("Invalid token");
    }
    
    const patient = await dbService.getPatient(userId);
    
    if (!patient) {
      throw new Error("Patient record not found");
    }
    
    return {
      id: patient.id,
      name: patient.name,
      email: patient.email
    };
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
};
