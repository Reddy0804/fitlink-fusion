
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

export const registerUser = async (username: string, email: string, password: string): Promise<User | null> => {
  try {
    // Check if user already exists
    const credentials = JSON.parse(localStorage.getItem("health_app_credentials") || '[]');
    const userExists = credentials.find((u: any) => 
      u.username === username || u.email === email
    );
    
    if (userExists) {
      throw new Error("User already exists");
    }
    
    // Create new user ID
    const newUserId = credentials.length > 0 
      ? Math.max(...credentials.map((u: any) => u.id)) + 1 
      : 1;
    
    // Add new user credentials
    const newUser = {
      id: newUserId,
      username,
      email,
      password,
      role: 'patient'
    };
    
    credentials.push(newUser);
    localStorage.setItem("health_app_credentials", JSON.stringify(credentials));
    
    // Create patient record
    const patient = {
      id: newUserId,
      name: username,
      email,
      age: 30, // Default values
      height: 175,
      weight: 70
    };
    
    const patients = JSON.parse(localStorage.getItem("health_app_patients") || '[]');
    patients.push(patient);
    localStorage.setItem("health_app_patients", JSON.stringify(patients));
    
    return {
      id: newUserId,
      name: username,
      email,
      role: 'patient'
    };
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
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
