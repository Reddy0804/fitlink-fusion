import { GROQ_API_ENDPOINT } from "@/config/config";
import { HealthInsight } from "@/types/healthTypes";

// Default API key - this is what the user provided
const DEFAULT_API_KEY = "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";

// This key will be set by the user through UI or use the default
let apiKey = DEFAULT_API_KEY;

export const setApiKey = (key: string) => {
  const keyToUse = key.trim() || DEFAULT_API_KEY;
  apiKey = keyToUse;
  localStorage.setItem('groq_api_key', keyToUse);
  console.log('Groq API key set successfully');
  return true;
};

export const getApiKey = (): string => {
  if (!apiKey) {
    apiKey = localStorage.getItem('groq_api_key') || DEFAULT_API_KEY;
  }
  return apiKey;
};

interface AiResponse {
  content: string;
  sources?: string[];
  error?: string;
}

// Generate AI response using Groq LLama API
export const generateAiResponse = async (
  question: string, 
  insights: HealthInsight[],
  patientInfo?: any
): Promise<AiResponse> => {
  const key = getApiKey();
  
  try {
    // Build context for the AI from patient info and health insights
    let context = "You are an AI health consultant helping a patient understand their health conditions. ";
    
    if (patientInfo) {
      context += `Patient information: Name: ${patientInfo.name}, Age: ${patientInfo.age || 'unknown'}, `;
      
      if (patientInfo.medicalConditions && patientInfo.medicalConditions.length > 0) {
        context += `Medical conditions: ${patientInfo.medicalConditions.join(', ')}, `;
      }
      
      if (patientInfo.medications && patientInfo.medications.length > 0) {
        context += `Current medications: ${patientInfo.medications.join(', ')}, `;
      }
    }
    
    // Add health insights to context
    if (insights && insights.length > 0) {
      context += "Based on health data, the following insights have been generated by our health monitoring system: ";
      
      insights.forEach(insight => {
        context += `Condition: ${insight.condition}, Risk level: ${insight.risk}, Severity: ${insight.severity}/100, `;
        context += `Key factors: ${insight.factors.join('; ')}, Recommendation: ${insight.recommendation}. `;
      });
    } else {
      context += "No health insights are available yet based on the patient's data. ";
    }
    
    context += "Please provide helpful, accurate information. If the patient appears to be experiencing a medical emergency, advise them to contact emergency services immediately.";
    
    // Make API request to Groq
    const response = await fetch(GROQ_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",  // Using LLama3 8B model for quick responses
        messages: [
          { role: "system", content: context },
          { role: "user", content: question }
        ],
        temperature: 0.5,
        max_tokens: 1024
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Groq API error:", errorData);
      return {
        content: "I'm having trouble connecting to my language model. Please try again later.",
        error: errorData.error?.message || "API request failed"
      };
    }
    
    const data = await response.json();
    return {
      content: data.choices[0].message.content
    };
  } catch (error) {
    console.error("Error generating AI response:", error);
    return {
      content: "I encountered an error while processing your question. Please try again later.",
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
};

// Analyze health trends using AI
export const analyzeHealthTrends = async (
  userId: number,
  healthData: any[],
  insights: HealthInsight[]
): Promise<AiResponse> => {
  // This would use the Groq API to analyze trends in the patient's health data
  // For now, we'll implement a simplified version
  
  if (!healthData || healthData.length === 0) {
    return {
      content: "Not enough health data available to analyze trends."
    };
  }
  
  // Group insights by condition
  const conditionInsights: Record<string, HealthInsight[]> = {};
  
  insights.forEach(insight => {
    if (!conditionInsights[insight.condition]) {
      conditionInsights[insight.condition] = [];
    }
    conditionInsights[insight.condition].push(insight);
  });
  
  // Analyze trends for each condition
  let trendAnalysis = "Based on your recent health data:\n\n";
  
  Object.entries(conditionInsights).forEach(([condition, insightList]) => {
    if (insightList.length < 2) {
      trendAnalysis += `${condition}: Not enough data to establish a trend.\n`;
      return;
    }
    
    // Sort by timestamp (oldest first)
    insightList.sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    
    // Check if severity is increasing or decreasing
    const firstSeverity = insightList[0].severity;
    const lastSeverity = insightList[insightList.length - 1].severity;
    const severityChange = lastSeverity - firstSeverity;
    
    if (Math.abs(severityChange) < 5) {
      trendAnalysis += `${condition}: Your condition appears stable.\n`;
    } else if (severityChange > 0) {
      trendAnalysis += `${condition}: There's been an increase in severity (${severityChange.toFixed(1)} points). ${insightList[insightList.length - 1].recommendation}\n`;
    } else {
      trendAnalysis += `${condition}: There's been an improvement (${Math.abs(severityChange).toFixed(1)} points). Continue your current management approach.\n`;
    }
  });
  
  return {
    content: trendAnalysis
  };
};
