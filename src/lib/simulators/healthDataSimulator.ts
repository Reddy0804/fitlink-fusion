
import { saveHealthData } from "@/lib/db";

// Define types for vital signs
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

// Generate random values within normal ranges
const generateRandomVitals = (userId: number, condition?: string): VitalSigns => {
  // Base ranges for a healthy person
  let glucoseRange = [80, 120]; // mg/dL
  let systolicRange = [110, 130]; // mmHg
  let diastolicRange = [70, 85]; // mmHg
  let heartRateRange = [60, 100]; // bpm

  // Adjust ranges based on condition
  if (condition === 'diabetes') {
    glucoseRange = [120, 180]; // Elevated for diabetes
  } else if (condition === 'hypertension') {
    systolicRange = [130, 160];
    diastolicRange = [85, 100];
  } else if (condition === 'cardiovascular') {
    heartRateRange = [80, 110];
    systolicRange = [125, 145];
  }

  // Generate random value within range
  const getRandomInRange = (min: number, max: number) => 
    Math.floor(Math.random() * (max - min + 1)) + min;

  // Add some natural variation
  const addVariation = (value: number, percentage: number) => {
    const variation = value * (percentage / 100) * (Math.random() * 2 - 1);
    return Math.round((value + variation) * 10) / 10;
  };

  return {
    bloodGlucose: addVariation(getRandomInRange(glucoseRange[0], glucoseRange[1]), 15),
    systolicBP: getRandomInRange(systolicRange[0], systolicRange[1]),
    diastolicBP: getRandomInRange(diastolicRange[0], diastolicRange[1]),
    heartRate: getRandomInRange(heartRateRange[0], heartRateRange[1]),
    oxygenSaturation: addVariation(getRandomInRange(95, 100), 5),
    temperature: addVariation(37, 2),
    respirationRate: getRandomInRange(12, 20),
    userId
  };
};

// Function to start the simulation
export const startVitalSignsSimulation = (
  userId: number, 
  condition?: string, 
  intervalMinutes = 60
) => {
  console.log(`Starting vital signs simulation for user ${userId}, condition: ${condition || 'healthy'}`);
  
  // Convert minutes to milliseconds
  const intervalMs = intervalMinutes * 60 * 1000;
  
  // For demo purposes, we'll generate data more frequently
  const demoIntervalMs = process.env.NODE_ENV === 'development' ? 10000 : intervalMs;
  
  // Generate initial data
  generateAndSaveVitals(userId, condition);
  
  // Setup interval for continuous data generation
  const intervalId = setInterval(() => {
    generateAndSaveVitals(userId, condition);
  }, demoIntervalMs);
  
  // Return function to stop simulation
  return () => clearInterval(intervalId);
};

// Helper function to generate and save vitals
const generateAndSaveVitals = async (userId: number, condition?: string) => {
  try {
    const vitals = generateRandomVitals(userId, condition);
    
    // Format data for saving
    const healthData = {
      steps: Math.floor(Math.random() * 1000) + 3000, // Random steps
      weight: Math.floor(Math.random() * 10) + 65, // Random weight
      heartRate: vitals.heartRate,
      sleepHours: Math.floor(Math.random() * 3) + 6, // Random sleep hours
      waterIntake: Math.floor(Math.random() * 500) + 1500, // Random water intake
      stressLevel: Math.floor(Math.random() * 5) + 1, // Random stress level
      bloodGlucose: vitals.bloodGlucose,
      systolicBP: vitals.systolicBP,
      diastolicBP: vitals.diastolicBP,
      oxygenSaturation: vitals.oxygenSaturation,
      temperature: vitals.temperature,
      respirationRate: vitals.respirationRate,
    };
    
    // Save to database
    await saveHealthData(userId, healthData);
    console.log(`Generated vitals for user ${userId}:`, vitals);
    
    // Analyze vitals using ML model
    analyzeVitals(vitals);
    
  } catch (error) {
    console.error('Error generating vital signs:', error);
  }
};

// Function to analyze vitals (to be expanded with ML model)
const analyzeVitals = (vitals: VitalSigns) => {
  // This will be replaced with actual ML model in next steps
  console.log('Analyzing vitals:', vitals);
};
