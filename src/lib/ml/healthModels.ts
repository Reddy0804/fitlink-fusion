
import { saveHealthInsight } from "@/lib/db";
import { HealthInsight } from "@/types/healthTypes";
import { DEFAULT_ML_MODEL_THRESHOLD } from "@/config/config";

// Analyze health data to generate insights
export const analyzeHealthData = async (userId: number, healthData: any) => {
  console.log("Analyzing health data for user:", userId);
  
  // Extract relevant metrics
  const {
    bloodGlucose,
    systolicBP,
    diastolicBP,
    heartRate,
    oxygenSaturation,
    steps,
    weight,
    sleepHours,
    temperature,
    respirationRate
  } = healthData;
  
  // Run different analyses based on available data
  const insights: HealthInsight[] = [];
  
  // Check for diabetes risk
  if (bloodGlucose) {
    const diabetesInsight = analyzeDiabetesRisk(userId, bloodGlucose);
    if (diabetesInsight) insights.push(diabetesInsight);
  }
  
  // Check for hypertension risk
  if (systolicBP && diastolicBP) {
    const hypertensionInsight = analyzeHypertensionRisk(userId, systolicBP, diastolicBP);
    if (hypertensionInsight) insights.push(hypertensionInsight);
  }
  
  // Check for cardiovascular risk
  if (heartRate || (systolicBP && diastolicBP)) {
    const cardiovascularInsight = analyzeCardiovascularRisk(
      userId, 
      heartRate, 
      systolicBP, 
      diastolicBP, 
      oxygenSaturation
    );
    if (cardiovascularInsight) insights.push(cardiovascularInsight);
  }
  
  // Save all generated insights
  for (const insight of insights) {
    await saveHealthInsight(userId, insight);
  }
  
  return insights;
};

// Analyze diabetes risk based on blood glucose level
const analyzeDiabetesRisk = (userId: number, bloodGlucose: number): HealthInsight | null => {
  // Skip analysis if data is missing
  if (!bloodGlucose) return null;
  
  let severity = 0;
  let risk: 'low' | 'moderate' | 'high' | 'critical' = 'low';
  const factors: string[] = [];
  
  // Calculate risk based on blood glucose levels
  if (bloodGlucose >= 200) {
    severity = 80;
    factors.push('Significantly elevated blood glucose');
    risk = 'critical';
  } else if (bloodGlucose >= 140) {
    severity = 60;
    factors.push('Elevated blood glucose');
    risk = 'high';
  } else if (bloodGlucose >= 110) {
    severity = 30;
    factors.push('Borderline high blood glucose');
    risk = 'moderate';
  } else {
    severity = 5;
    factors.push('Normal blood glucose');
    risk = 'low';
  }
  
  // Generate recommendation
  let recommendation = '';
  if (risk === 'critical') {
    recommendation = 'Seek immediate medical attention for your high blood glucose levels. This could indicate uncontrolled diabetes.';
  } else if (risk === 'high') {
    recommendation = 'Schedule an appointment with your healthcare provider to discuss your elevated blood glucose levels.';
  } else if (risk === 'moderate') {
    recommendation = 'Monitor your blood glucose levels regularly and consider dietary adjustments to reduce sugar intake.';
  } else {
    recommendation = 'Continue monitoring blood glucose levels as part of your regular health check-ups.';
  }
  
  return {
    userId,
    condition: 'diabetes',
    severity,
    risk,
    factors,
    recommendation,
    timestamp: new Date().toISOString()
  };
};

// Analyze hypertension risk based on blood pressure readings
const analyzeHypertensionRisk = (userId: number, systolicBP: number, diastolicBP: number): HealthInsight | null => {
  // Skip analysis if data is missing
  if (!systolicBP || !diastolicBP) return null;
  
  let severity = 0;
  let risk: 'low' | 'moderate' | 'high' | 'critical' = 'low';
  const factors: string[] = [];
  
  // Calculate risk based on systolic blood pressure
  if (systolicBP >= 180) {
    severity += 50;
    factors.push('Extremely high systolic blood pressure');
    risk = 'critical';
  } else if (systolicBP >= 140) {
    severity += 30;
    factors.push('High systolic blood pressure');
    risk = 'high';
  } else if (systolicBP >= 130) {
    severity += 10;
    factors.push('Elevated blood pressure (systolic)');
    risk = 'moderate';
  }
  
  // Calculate risk based on diastolic blood pressure
  if (diastolicBP >= 120) {
    severity += 50;
    factors.push('Extremely high diastolic blood pressure');
    if (risk !== 'critical') {
      risk = 'critical';
    }
  } else if (diastolicBP >= 90) {
    severity += 30;
    factors.push('High diastolic blood pressure');
    if (risk !== 'critical' && risk !== 'high') {
      risk = 'high';
    }
  } else if (diastolicBP >= 80) {
    severity += 10;
    factors.push('Elevated blood pressure (diastolic)');
    if (risk === 'low') {
      risk = 'moderate';
    }
  }
  
  // Generate recommendation based on risk level
  let recommendation = '';
  if (risk === 'critical') {
    recommendation = 'Seek immediate medical attention for your high blood pressure. This is a hypertensive crisis.';
  } else if (risk === 'high') {
    recommendation = 'Schedule an appointment with your healthcare provider to discuss your high blood pressure.';
  } else if (risk === 'moderate') {
    recommendation = 'Monitor your blood pressure regularly and consider lifestyle changes to lower it.';
  } else {
    recommendation = 'Continue monitoring blood pressure as part of your regular health check-ups.';
  }
  
  return {
    userId,
    condition: 'hypertension',
    severity,
    risk,
    factors,
    recommendation,
    timestamp: new Date().toISOString()
  };
};

// Analyze cardiovascular risk based on multiple factors
const analyzeCardiovascularRisk = (
  userId: number, 
  heartRate?: number, 
  systolicBP?: number, 
  diastolicBP?: number,
  oxygenSaturation?: number
): HealthInsight | null => {
  // Skip analysis if all data is missing
  if (!heartRate && !systolicBP && !diastolicBP) return null;
  
  let severity = 0;
  let risk: 'low' | 'moderate' | 'high' | 'critical' = 'low';
  const factors: string[] = [];
  
  // Calculate risk based on heart rate
  if (heartRate) {
    if (heartRate > 120) {
      severity += 30;
      factors.push('Elevated heart rate');
      risk = 'high';
    } else if (heartRate > 100) {
      severity += 15;
      factors.push('Slightly elevated heart rate');
      risk = 'moderate';
    } else if (heartRate < 50) {
      severity += 20;
      factors.push('Low heart rate');
      risk = 'moderate';
    }
  }
  
  // Factor in blood pressure for cardiovascular risk
  if (systolicBP && diastolicBP) {
    if (systolicBP >= 140 || diastolicBP >= 90) {
      severity += 20;
      factors.push('High blood pressure contributing to cardiovascular strain');
      if (risk !== 'critical' && risk !== 'high') {
        risk = 'high';
      }
    }
  }
  
  // Check oxygen saturation if available
  if (oxygenSaturation) {
    if (oxygenSaturation < 90) {
      severity += 40;
      factors.push('Low oxygen saturation');
      risk = 'critical';
    } else if (oxygenSaturation < 95) {
      severity += 20;
      factors.push('Below normal oxygen saturation');
      if (risk !== 'critical') {
        risk = 'moderate';
      }
    }
  }
  
  // Overall severity assessment
  if (severity >= 50) {
    risk = 'critical';
  } else if (severity >= 30) {
    if (risk !== 'critical') {
      risk = 'high';
    }
  } else if (severity >= 15) {
    if (risk !== 'critical' && risk !== 'high') {
      risk = 'moderate';
    }
  }
  
  // Generate recommendation
  let recommendation = '';
  if (risk === 'critical') {
    recommendation = 'Seek immediate medical attention for your cardiovascular health indicators.';
  } else if (risk === 'high') {
    recommendation = 'Schedule an appointment with a cardiologist to evaluate your cardiovascular health.';
  } else if (risk === 'moderate') {
    recommendation = 'Monitor your cardiovascular health regularly and consider lifestyle changes to improve it.';
  } else {
    recommendation = 'Continue monitoring cardiovascular health as part of your regular check-ups.';
  }
  
  return {
    userId,
    condition: 'cardiovascular',
    severity,
    risk,
    factors,
    recommendation,
    timestamp: new Date().toISOString()
  };
};
