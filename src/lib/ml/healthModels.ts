import { saveHealthInsight } from "@/lib/db";
import { HealthInsight } from "@/types/healthTypes";

// Types of conditions we're monitoring
export type ConditionType = 'diabetes' | 'hypertension' | 'cardiovascular';

// Simple rule-based model for diabetes risk assessment
export const diabetesModel = (
  bloodGlucose: number,
  weight: number,
  age: number = 45
): { severity: number; risk: 'low' | 'moderate' | 'high' | 'critical'; factors: string[] } => {
  let severity = 0;
  const factors: string[] = [];
  
  // Blood glucose impact (most significant factor)
  if (bloodGlucose > 180) {
    severity += 50;
    factors.push('Very high blood glucose levels');
  } else if (bloodGlucose > 140) {
    severity += 30;
    factors.push('Elevated blood glucose levels');
  } else if (bloodGlucose > 120) {
    severity += 15;
    factors.push('Slightly elevated blood glucose');
  }
  
  // Additional factors (can be expanded)
  // Weight factor (using a simple approach - would use BMI in a real implementation)
  if (weight > 100) {
    severity += 15;
    factors.push('Weight is a contributing factor');
  }
  
  // Age factor (simplified)
  if (age > 60) {
    severity += 10;
    factors.push('Age increases risk');
  } else if (age > 40) {
    severity += 5;
  }
  
  // Constrain severity to 0-100
  severity = Math.min(Math.max(severity, 0), 100);
  
  // Determine risk category
  let risk: 'low' | 'moderate' | 'high' | 'critical';
  if (severity < 20) risk = 'low';
  else if (severity < 50) risk = 'moderate';
  else if (severity < 75) risk = 'high';
  else risk = 'critical';
  
  return { severity, risk, factors };
};

// Simple rule-based model for hypertension risk assessment
export const hypertensionModel = (
  systolicBP: number,
  diastolicBP: number,
  age: number = 45
): { severity: number; risk: 'low' | 'moderate' | 'high' | 'critical'; factors: string[] } => {
  let severity = 0;
  const factors: string[] = [];
  
  // Systolic BP impact
  if (systolicBP >= 180) {
    severity += 50;
    factors.push('Severe hypertension (systolic)');
  } else if (systolicBP >= 160) {
    severity += 40;
    factors.push('Stage 2 hypertension (systolic)');
  } else if (systolicBP >= 140) {
    severity += 25;
    factors.push('Stage 1 hypertension (systolic)');
  } else if (systolicBP >= 130) {
    severity += 10;
    factors.push('Elevated blood pressure (systolic)');
  }
  
  // Diastolic BP impact
  if (diastolicBP >= 120) {
    severity += 50;
    factors.push('Severe hypertension (diastolic)');
  } else if (diastolicBP >= 100) {
    severity += 40;
    factors.push('Stage 2 hypertension (diastolic)');
  } else if (diastolicBP >= 90) {
    severity += 25;
    factors.push('Stage 1 hypertension (diastolic)');
  } else if (diastolicBP >= 80) {
    severity += 10;
    factors.push('Elevated blood pressure (diastolic)');
  }
  
  // Age factor (simplified)
  if (age > 65) {
    severity += 10;
    factors.push('Age increases risk');
  }
  
  // Constrain severity to 0-100
  severity = Math.min(Math.max(severity, 0), 100);
  
  // Determine risk category
  let risk: 'low' | 'moderate' | 'high' | 'critical';
  if (severity < 20) risk = 'low';
  else if (severity < 50) risk = 'moderate';
  else if (severity < 75) risk = 'high';
  else risk = 'critical';
  
  return { severity, risk, factors };
};

// Simple rule-based model for cardiovascular disease risk assessment
export const cardiovascularModel = (
  systolicBP: number,
  diastolicBP: number,
  heartRate: number,
  age: number = 45
): { severity: number; risk: 'low' | 'moderate' | 'high' | 'critical'; factors: string[] } => {
  let severity = 0;
  const factors: string[] = [];
  
  // Blood pressure impact
  if (systolicBP >= 160 || diastolicBP >= 100) {
    severity += 30;
    factors.push('Hypertension increases cardiovascular risk');
  } else if (systolicBP >= 140 || diastolicBP >= 90) {
    severity += 20;
    factors.push('Elevated blood pressure increases cardiovascular risk');
  }
  
  // Heart rate impact
  if (heartRate > 100) {
    severity += 20;
    factors.push('Elevated resting heart rate');
  } else if (heartRate < 60) {
    severity += 10;
    factors.push('Low resting heart rate (may be normal for athletes)');
  }
  
  // Age factor (simplified)
  if (age > 65) {
    severity += 20;
    factors.push('Age significantly increases cardiovascular risk');
  } else if (age > 45) {
    severity += 10;
    factors.push('Age moderately increases cardiovascular risk');
  }
  
  // Constrain severity to 0-100
  severity = Math.min(Math.max(severity, 0), 100);
  
  // Determine risk category
  let risk: 'low' | 'moderate' | 'high' | 'critical';
  if (severity < 20) risk = 'low';
  else if (severity < 50) risk = 'moderate';
  else if (severity < 75) risk = 'high';
  else risk = 'critical';
  
  return { severity, risk, factors };
};

// Get recommendations based on condition and severity
const getRecommendations = (condition: ConditionType, severity: number): string => {
  if (condition === 'diabetes') {
    if (severity < 20) {
      return 'Continue monitoring blood glucose levels. Maintain a balanced diet and regular exercise.';
    } else if (severity < 50) {
      return 'Consider reducing carbohydrate intake. Increase physical activity and monitor blood glucose more frequently.';
    } else if (severity < 75) {
      return 'Consult with your healthcare provider. Follow a strict diabetes management plan and consider medication adjustments.';
    } else {
      return 'URGENT: Contact your healthcare provider immediately. Your blood glucose levels indicate a potentially serious condition.';
    }
  } else if (condition === 'hypertension') {
    if (severity < 20) {
      return 'Maintain a low-sodium diet. Continue regular blood pressure monitoring.';
    } else if (severity < 50) {
      return 'Reduce sodium intake, increase physical activity, and practice stress reduction techniques.';
    } else if (severity < 75) {
      return 'Consult with your healthcare provider. Medication adjustment may be necessary. Follow DASH diet principles.';
    } else {
      return 'URGENT: Contact your healthcare provider immediately. Your blood pressure indicates a hypertensive crisis.';
    }
  } else if (condition === 'cardiovascular') {
    if (severity < 20) {
      return 'Maintain heart-healthy habits including regular exercise and a balanced diet.';
    } else if (severity < 50) {
      return 'Increase cardiovascular exercise, reduce saturated fat intake, and monitor blood pressure regularly.';
    } else if (severity < 75) {
      return 'Consult with your cardiologist. Follow a heart-healthy diet and consider medication adjustments.';
    } else {
      return 'URGENT: Contact your healthcare provider immediately. Your cardiovascular indicators show significant risk.';
    }
  }
  
  return 'Continue monitoring your health and consult with healthcare providers regularly.';
};

// Main function to analyze health data
export const analyzeHealthData = async (userId: number, healthData: any): Promise<HealthInsight[]> => {
  const insights: HealthInsight[] = [];
  const timestamp = new Date().toISOString();
  const age = healthData.age || 45; 
  
  // Analyze diabetes risk
  if (healthData.bloodGlucose) {
    const { severity, risk, factors } = diabetesModel(
      healthData.bloodGlucose,
      healthData.weight || 70,
      age
    );
    
    const recommendation = getRecommendations('diabetes', severity);
    
    const diabetesInsight: HealthInsight = {
      userId,
      condition: 'diabetes',
      severity,
      risk,
      factors,
      recommendation,
      timestamp
    };
    
    insights.push(diabetesInsight);
    await saveHealthInsight(userId, diabetesInsight);
  }
  
  // Analyze hypertension risk
  if (healthData.systolicBP && healthData.diastolicBP) {
    const { severity, risk, factors } = hypertensionModel(
      healthData.systolicBP,
      healthData.diastolicBP,
      age
    );
    
    const recommendation = getRecommendations('hypertension', severity);
    
    const hypertensionInsight: HealthInsight = {
      userId,
      condition: 'hypertension',
      severity,
      risk,
      factors,
      recommendation,
      timestamp
    };
    
    insights.push(hypertensionInsight);
    await saveHealthInsight(userId, hypertensionInsight);
  }
  
  // Analyze cardiovascular risk
  if (healthData.systolicBP && healthData.diastolicBP && healthData.heartRate) {
    const { severity, risk, factors } = cardiovascularModel(
      healthData.systolicBP,
      healthData.diastolicBP,
      healthData.heartRate,
      age
    );
    
    const recommendation = getRecommendations('cardiovascular', severity);
    
    const cardiovascularInsight: HealthInsight = {
      userId,
      condition: 'cardiovascular',
      severity,
      risk,
      factors,
      recommendation,
      timestamp
    };
    
    insights.push(cardiovascularInsight);
    await saveHealthInsight(userId, cardiovascularInsight);
  }
  
  return insights;
};
