
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

export interface VitalSigns {
  bloodGlucose: number; // mg/dL
  systolicBP: number; // mmHg
  diastolicBP: number; // mmHg
  heartRate: number; // bpm
  oxygenSaturation: number; // percentage
  temperature: number; // Celsius
  respirationRate: number; // breaths per minute
  userId: number;
}

export interface HealthInsight {
  id?: number;
  userId: number;
  condition: 'diabetes' | 'hypertension' | 'cardiovascular';
  severity: number; // 0-100 scale
  risk: 'low' | 'moderate' | 'high' | 'critical';
  factors: string[];
  recommendation: string;
  timestamp: string;
  metric?: string;
  value?: number;
  unit?: string;
  trend?: "increasing" | "decreasing" | "stable";
}
