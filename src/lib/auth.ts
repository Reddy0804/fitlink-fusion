
import { toast } from "@/hooks/use-toast";
import dbService from "./database/dbService";

// Get the current logged-in user
export const getCurrentUser = async () => {
  try {
    // In a real app, this would validate a JWT token or session
    // For this demo, we're checking localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("No auth token found");
      return null;
    }
    
    // Parse the token (in a real app, verify it)
    const userData = JSON.parse(token);
    console.log("Current user:", userData);
    
    return userData;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
};

// Login function
export const loginUser = async (username: string, password: string) => {
  try {
    console.log("Logging in user:", username);
    
    // Authenticate the user
    const user = await authenticateUser(username, password);
    
    if (user) {
      // In a real app, this would be a JWT token
      const userData = {
        id: user.id,
        name: user.username,
        email: user.email,
        role: user.role
      };
      
      // Store in localStorage for persistence
      localStorage.setItem("token", JSON.stringify(userData));
      
      console.log("Login successful");
      return userData;
    }
    
    console.log("Login failed: Invalid credentials");
    throw new Error("Invalid username or password");
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

// This function simulates authentication logic
export const authenticateUser = async (username: string, password: string) => {
  try {
    console.log("Authenticating user:", username);
    
    // In a real app, you would hash the password and check against a database
    // For this demo, we're using simple matching
    const user = await dbService.getUserByCredentials(username, password);
    
    if (user) {
      console.log("Authentication successful");
      return user;
    }
    
    console.log("Authentication failed: Invalid credentials");
    return null;
  } catch (error) {
    console.error("Authentication error:", error);
    return null;
  }
};

// Function to register a new user
export const registerUser = async (username: string, email: string, password: string) => {
  try {
    console.log("Registering user:", username, email);
    
    // Check if user already exists
    const existingUser = await dbService.getUserByUsername(username);
    if (existingUser) {
      console.log("Registration failed: Username already exists");
      return null;
    }
    
    // In a real app, you would hash the password before storing
    const newUser = {
      id: Date.now(), // Simple ID generation
      username,
      email,
      password, // In real app, this would be hashed
      role: 'patient',
      created: new Date().toISOString()
    };
    
    // Save to database
    const savedUser = await dbService.saveUser(newUser);
    if (savedUser) {
      // Create patient record
      await dbService.savePatient({
        userId: savedUser.id,
        name: username,
        age: 35, // Default age
        medicalConditions: [],
        medications: []
      });
    }
    
    console.log("User registered successfully");
    return savedUser;
  } catch (error) {
    console.error("Registration error:", error);
    return null;
  }
};
