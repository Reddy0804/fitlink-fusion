
// Database utilities
import { toast } from "@/components/ui/use-toast";
import { HealthInsight } from "./ml/healthModels";

// Simulated database for demo purposes
const mockDb = {
  users: [],
  healthData: [],
  healthInsights: []
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
    
    // If we have ML-specific data, analyze it
    if (data.bloodGlucose || data.systolicBP || data.heartRate) {
      try {
        // Dynamically import to avoid circular dependencies
        const { analyzeHealthData } = await import('./ml/healthModels');
        analyzeHealthData(userId, data);
      } catch (error) {
        console.error("Error analyzing health data:", error);
      }
    }
    
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

// Health insights from ML models
export const saveHealthInsight = async (userId: number, insight: HealthInsight) => {
  try {
    console.log("Saving health insight for user:", userId, insight);
    // In a real app, this would insert into the database
    const mockEntry = {
      id: mockDb.healthInsights.length + 1,
      ...insight,
    };
    mockDb.healthInsights.push(mockEntry);
    
    // Check if insight requires immediate attention
    if (insight.risk === 'critical') {
      // In a real app, this would trigger notifications
      console.warn("CRITICAL HEALTH ALERT for user", userId, ":", insight.condition);
      toast({
        title: "HEALTH ALERT",
        description: `Critical risk detected: ${insight.recommendation}`,
        variant: "destructive",
      });
    }
    
    return mockEntry;
  } catch (error) {
    console.error("Error saving health insight:", error);
    throw error;
  }
};

export const getHealthInsights = async (userId: number, condition?: string) => {
  try {
    console.log("Getting health insights for user:", userId);
    // In a real app, this would query the database
    let insights = mockDb.healthInsights.filter(entry => entry.userId === userId);
    
    if (condition) {
      insights = insights.filter(insight => insight.condition === condition);
    }
    
    // Sort by timestamp (most recent first)
    insights.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    return insights;
  } catch (error) {
    console.error("Error getting health insights:", error);
    throw error;
  }
};
