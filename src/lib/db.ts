
// Database utilities
import { toast } from "@/components/ui/use-toast";
import { HealthInsight } from "./ml/healthModels";
import dbService from "./database/dbService";

export const initDb = async () => {
  console.log("Database initialized");
  return true;
};

// Health tracking utility functions
export const saveHealthData = async (userId: number, data: any) => {
  try {
    console.log("Saving health data for user:", userId, data);
    
    // Format the data for saving
    const healthData = {
      userId,
      ...data,
      timestamp: new Date().toISOString()
    };
    
    // Save to database
    const savedData = await dbService.saveHealthData(healthData);
    
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
    
    return savedData;
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
    return dbService.getHealthData(userId);
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
    
    // Save to database
    const savedInsight = await dbService.saveHealthInsight(insight);
    
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
    
    return savedInsight;
  } catch (error) {
    console.error("Error saving health insight:", error);
    throw error;
  }
};

export const getHealthInsights = async (userId: number, condition?: string) => {
  try {
    console.log("Getting health insights for user:", userId, condition ? `for condition: ${condition}` : '');
    return dbService.getHealthInsights(userId, condition);
  } catch (error) {
    console.error("Error getting health insights:", error);
    throw error;
  }
};
