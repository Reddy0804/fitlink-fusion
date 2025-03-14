
// Database utilities
import { toast } from "@/components/ui/use-toast";

// Simulated database for demo purposes
const mockDb = {
  users: [],
  healthData: []
};

export const initDb = async () => {
  console.log("Database initialized");
  return true;
};

export const executeQuery = async (query: string, params: any[] = []) => {
  // This is a mock implementation for frontend demo
  console.log("Executing query:", query, params);
  
  // Mock response based on the query
  if (query.includes("SELECT") && query.includes("users")) {
    return { rows: mockDb.users };
  }
  
  if (query.includes("INSERT INTO users")) {
    const mockUser = {
      id: mockDb.users.length + 1,
      name: params[0],
      email: params[1],
      password: "hashed_" + params[2]
    };
    mockDb.users.push(mockUser);
    return { insertId: mockUser.id };
  }
  
  return { rows: [] };
};

// Health tracking utility functions
export const saveHealthData = async (userId: number, data: any) => {
  try {
    console.log("Saving health data for user:", userId, data);
    // In a real app, this would insert into the database
    const mockEntry = {
      id: mockDb.healthData.length + 1,
      userId,
      ...data,
      date: new Date().toISOString()
    };
    mockDb.healthData.push(mockEntry);
    return mockEntry;
  } catch (error) {
    console.error("Error saving health data:", error);
    toast({
      title: "Error",
      description: "Failed to save health data. Please try again.",
      variant: "destructive",
    });
    throw error;
  }
};

export const getHealthData = async (userId: number) => {
  try {
    console.log("Getting health data for user:", userId);
    // In a real app, this would query the database
    return mockDb.healthData.filter(entry => entry.userId === userId);
  } catch (error) {
    console.error("Error getting health data:", error);
    toast({
      title: "Error",
      description: "Failed to load health data.",
      variant: "destructive",
    });
    throw error;
  }
};
