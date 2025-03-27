
import { toast } from "@/hooks/use-toast";
import dbService from "./database/dbService";

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
