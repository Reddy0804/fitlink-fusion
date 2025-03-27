
// Patient information
export interface Patient {
  id: number;
  name: string;
  email: string;
  age?: number;
  height?: number; // cm
  weight?: number; // kg
  medicalConditions?: string[];
  medications?: string[];
  emergencyContact?: string;
}

// User authentication
export interface User {
  id: number;
  name: string;
  email: string;
  role?: 'admin' | 'patient';
}

// Health tracking data
export interface HealthData {
  id?: number;
  userId: number;
  timestamp?: string;
  steps?: number;
  weight?: number;
  heartRate?: number;
  sleepHours?: number;
  waterIntake?: number;
  stressLevel?: number;
  bloodGlucose?: number;
  systolicBP?: number;
  diastolicBP?: number;
  oxygenSaturation?: number;
  temperature?: number;
  respirationRate?: number;
}

// ML model health insights
export interface HealthInsight {
  id?: number;
  userId: number;
  condition: 'diabetes' | 'hypertension' | 'cardiovascular';
  severity: number; // 0-100 scale
  risk: 'low' | 'moderate' | 'high' | 'critical';
  factors: string[];
  recommendation: string;
  timestamp: string;
}

// Vital signs data
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
