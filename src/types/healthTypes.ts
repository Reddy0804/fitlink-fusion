export interface HealthData {
  timestamp: string;
  heartRate: number;
  bloodPressure: {
    systolic: number;
    diastolic: number;
  };
  oxygenSaturation: number;
  bodyTemperature: number;
  weight: number;
  activityLevel: string;
  sleepQuality: string;
}

export interface PatientProfile {
  userId: number;
  name: string;
  age: number;
  height: number;
  weight: number;
  medicalConditions: string[];
  medications: string[];
}

export interface HealthRecommendation {
  timestamp: string;
  message: string;
  category: string;
  priority: "high" | "medium" | "low";
}

export interface MLPrediction {
  timestamp: string;
  predictedRisk: number; // 0-100
  explanation: string;
}

// Make sure HealthInsight is properly exported to resolve the import issue
export interface HealthInsight {
  metric: string;
  value: number;
  unit: string;
  timestamp: string;
  risk: "low" | "moderate" | "high" | "critical";
  trend: "increasing" | "decreasing" | "stable";
  recommendation?: string;
}
