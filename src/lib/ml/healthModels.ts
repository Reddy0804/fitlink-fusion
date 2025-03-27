
import { DEFAULT_ML_MODEL_THRESHOLD } from "@/config/config";
import { saveHealthInsight } from "@/lib/db";
import { HealthInsight as HealthInsightType } from "@/types/healthTypes";

// Export the HealthInsight type to resolve import issues
export type HealthInsight = HealthInsightType;

// Diabetes Analysis Model
const analyzeDiabetes = (userId: number, bloodGlucose?: number): HealthInsightType | null => {
  if (!bloodGlucose) return null;
  
  let severity = 0;
  let risk: 'low' | 'moderate' | 'high' | 'critical' = 'low';
  const factors: string[] = [];
  let recommendation = '';
  
  // Basic diabetes risk evaluation based on blood glucose
  if (bloodGlucose > 125) {
    severity += 40;
    factors.push('High blood glucose');
    recommendation = 'Schedule an appointment with your healthcare provider. Reduce sugar intake and monitor glucose levels carefully.';
    risk = 'high';
  } else if (bloodGlucose > 100) {
    severity += 20;
    factors.push('Slightly elevated blood glucose');
    recommendation = 'Consider reducing carbohydrate intake. Increase physical activity and monitor blood glucose more frequently.';
    risk = 'moderate';
  } else {
    recommendation = 'Continue healthy eating habits and regular exercise.';
  }
  
  // Critical threshold check
  if (bloodGlucose > 200) {
    severity = Math.min(severity + 40, 100);
    risk = 'critical';
    factors.push('Dangerously high blood glucose');
    recommendation = 'URGENT: Contact your healthcare provider immediately. Extremely high blood glucose levels detected.';
  }
  
  if (severity === 0) return null;
  
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

// Hypertension Analysis Model
const analyzeHypertension = (userId: number, systolicBP?: number, diastolicBP?: number): HealthInsightType | null => {
  if (!systolicBP || !diastolicBP) return null;
  
  let severity = 0;
  let risk: 'low' | 'moderate' | 'high' | 'critical' = 'low';
  const factors: string[] = [];
  let recommendation = '';
  
  // Evaluate systolic blood pressure
  if (systolicBP >= 180) {
    severity += 50;
    factors.push('Extremely high systolic blood pressure');
    risk = 'critical';
  } else if (systolicBP >= 140) {
    severity += 30;
    factors.push('High systolic blood pressure');
    risk = 'high';
  } else if (systolicBP >= 120) {
    severity += 10;
    factors.push('Elevated blood pressure (systolic)');
    risk = 'low';
  }
  
  // Evaluate diastolic blood pressure
  if (diastolicBP >= 120) {
    severity += 50;
    factors.push('Extremely high diastolic blood pressure');
    risk = risk !== 'critical' ? 'critical' : risk;
  } else if (diastolicBP >= 90) {
    severity += 30;
    factors.push('High diastolic blood pressure');
    risk = risk !== 'critical' && risk !== 'high' ? 'high' : risk;
  } else if (diastolicBP >= 80) {
    severity += 10;
    factors.push('Elevated blood pressure (diastolic)');
    risk = risk === 'low' ? 'moderate' : risk;
  }
  
  // Generate recommendation based on risk level
  if (risk === 'critical') {
    recommendation = 'URGENT: Seek immediate medical attention. Your blood pressure is at a crisis level.';
  } else if (risk === 'high') {
    recommendation = 'Contact your healthcare provider today. Consider medication adjustment and lifestyle changes.';
  } else if (risk === 'moderate') {
    recommendation = 'Schedule a follow-up with your healthcare provider. Consider reducing sodium intake and increasing exercise.';
  } else {
    recommendation = 'Maintain a low-sodium diet. Continue regular blood pressure monitoring.';
  }
  
  if (severity === 0) return null;
  
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

// Cardiovascular Disease Analysis Model
const analyzeCardiovascular = (
  userId: number, 
  heartRate?: number, 
  systolicBP?: number, 
  diastolicBP?: number,
  oxygenSaturation?: number
): HealthInsightType | null => {
  if (!heartRate && !systolicBP && !diastolicBP && !oxygenSaturation) return null;
  
  let severity = 0;
  let risk: 'low' | 'moderate' | 'high' | 'critical' = 'low';
  const factors: string[] = [];
  let recommendation = '';
  
  // Heart rate analysis
  if (heartRate) {
    if (heartRate > 100) {
      severity += 20;
      factors.push('Elevated heart rate');
    } else if (heartRate < 60) {
      severity += 15;
      factors.push('Low heart rate');
    }
  }
  
  // Blood pressure contribution to cardiovascular risk
  if (systolicBP && diastolicBP) {
    if (systolicBP > 140 || diastolicBP > 90) {
      severity += 25;
      factors.push('High blood pressure');
    }
  }
  
  // Oxygen saturation
  if (oxygenSaturation) {
    if (oxygenSaturation < 90) {
      severity += 40;
      factors.push('Low oxygen saturation');
      risk = 'critical';
    } else if (oxygenSaturation < 95) {
      severity += 20;
      factors.push('Below normal oxygen saturation');
      risk = risk !== 'critical' ? 'moderate' : risk;
    }
  }
  
  // Determine risk level based on combined severity
  if (severity >= 50) {
    risk = 'critical';
  } else if (severity >= 30) {
    risk = risk !== 'critical' ? 'high' : risk;
  } else if (severity >= 15) {
    risk = risk !== 'critical' && risk !== 'high' ? 'moderate' : risk;
  }
  
  // Generate recommendation
  if (risk === 'critical') {
    recommendation = 'URGENT: Seek immediate medical attention. Multiple cardiovascular risk factors detected.';
  } else if (risk === 'high') {
    recommendation = 'Contact your healthcare provider promptly. Consider medication review and lifestyle adjustments.';
  } else if (risk === 'moderate') {
    recommendation = 'Schedule a cardiology appointment. Focus on heart-healthy diet and exercise.';
  } else {
    recommendation = 'Maintain heart-healthy habits including regular exercise and a balanced diet.';
  }
  
  if (severity === 0) return null;
  
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

// Master function to analyze health data and generate insights
export const analyzeHealthData = async (userId: number, healthData: any) => {
  console.log('Analyzing vitals:', healthData);
  
  const insights: HealthInsightType[] = [];
  
  // Run each specialized analysis model
  const diabetesInsight = analyzeDiabetes(userId, healthData.bloodGlucose);
  if (diabetesInsight) {
    insights.push(diabetesInsight);
    await saveHealthInsight(userId, diabetesInsight);
  }
  
  const hypertensionInsight = analyzeHypertension(userId, healthData.systolicBP, healthData.diastolicBP);
  if (hypertensionInsight) {
    insights.push(hypertensionInsight);
    await saveHealthInsight(userId, hypertensionInsight);
  }
  
  const cardiovascularInsight = analyzeCardiovascular(
    userId, 
    healthData.heartRate,
    healthData.systolicBP, 
    healthData.diastolicBP,
    healthData.oxygenSaturation
  );
  if (cardiovascularInsight) {
    insights.push(cardiovascularInsight);
    await saveHealthInsight(userId, cardiovascularInsight);
  }
  
  return insights;
};

// Alert threshold check (for critical conditions)
export const checkHealthAlerts = (insights: HealthInsightType[]) => {
  const criticalInsights = insights.filter(insight => 
    insight.severity > DEFAULT_ML_MODEL_THRESHOLD || insight.risk === 'critical'
  );
  
  return criticalInsights;
};
