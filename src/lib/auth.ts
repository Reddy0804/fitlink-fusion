
import { executeQuery } from "./db";

interface User {
  id: number;
  name: string;
  email: string;
}

// Mock token handling for frontend
const setToken = (token: string) => {
  localStorage.setItem("token", token);
};

export const loginUser = async (email: string, password: string): Promise<User> => {
  // For demo and development purposes, we'll use a mock login
  // In a real application, this would make an API call to your backend
  
  try {
    // In a real app, this would be a server call
    // For now we'll simulate a "successful" login with mock data
    const mockUser = {
      id: 1,
      name: "Jamie",
      email: email
    };
    
    // Store a fake token
    setToken("mock-jwt-token");
    
    return mockUser;
  } catch (error) {
    console.error("Login error:", error);
    throw new Error("Invalid credentials");
  }
};

export const registerUser = async (name: string, email: string, password: string): Promise<User> => {
  // For demo purposes, we'll use a mock registration
  try {
    // In a real app, this would be a server call
    const mockUser = {
      id: 1, 
      name,
      email
    };
    
    // Store a fake token
    setToken("mock-jwt-token");
    
    return mockUser;
  } catch (error) {
    console.error("Registration error:", error);
    throw new Error("Registration failed");
  }
};

export const getCurrentUser = async (): Promise<User | null> => {
  const token = localStorage.getItem("token");
  
  if (!token) return null;
  
  // In a real app, you would validate the token with your backend
  // For demo purposes, return a mock user if token exists
  try {
    return {
      id: 1,
      name: "Jamie",
      email: "user@example.com"
    };
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
};
