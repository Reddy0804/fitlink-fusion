
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, AlertTriangle, MessageCircle, ArrowDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { getHealthInsights } from "@/lib/db";
import { useAuth } from "@/context/AuthContext";
import { HealthInsight } from "@/lib/ml/healthModels";

interface AiHealthConsultantProps {
  className?: string;
}

interface Message {
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  isAlert?: boolean;
}

const AiHealthConsultant = ({ className }: AiHealthConsultantProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [insights, setInsights] = useState<HealthInsight[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  useEffect(() => {
    // Initial greeting
    setMessages([
      {
        content: "Hello! I'm your AI health consultant. I'm analyzing your health data and will alert you of any concerns. Feel free to ask me any health-related questions.",
        sender: 'ai',
        timestamp: new Date()
      }
    ]);
    
    // Fetch initial insights
    loadHealthInsights();
    
    // Set up interval to refresh insights periodically
    const intervalId = setInterval(loadHealthInsights, 30000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  const loadHealthInsights = async () => {
    if (!user) return;
    
    try {
      const data = await getHealthInsights(user.id);
      setInsights(data);
      
      // Check for critical insights that haven't been mentioned yet
      const criticalInsights = data.filter(insight => 
        insight.risk === 'critical' && 
        !messages.some(m => m.content.includes(insight.recommendation))
      );
      
      if (criticalInsights.length > 0) {
        // Add critical alerts to messages
        const newAlerts = criticalInsights.map(insight => ({
          content: `ALERT: ${insight.recommendation}`,
          sender: 'ai' as const,
          timestamp: new Date(),
          isAlert: true
        }));
        
        setMessages(prev => [...prev, ...newAlerts]);
      }
    } catch (error) {
      console.error("Error loading health insights:", error);
    }
  };
  
  const handleSendMessage = async () => {
    if (!input.trim() || !user) return;
    
    // Add user message
    const userMessage: Message = {
      content: input,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    
    try {
      // Generate AI response based on user question and health insights
      const response = await generateAiResponse(input, insights);
      
      // Add AI response after a small delay to make it feel more natural
      setTimeout(() => {
        setMessages(prev => [...prev, {
          content: response,
          sender: 'ai',
          timestamp: new Date()
        }]);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error generating response:", error);
      setLoading(false);
      
      toast({
        title: "Error",
        description: "Failed to generate a response. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Simple AI response generator based on input and health insights
  const generateAiResponse = async (question: string, insights: HealthInsight[]): Promise<string> => {
    const normalizedQuestion = question.toLowerCase();
    
    // Check if the question is about diabetes
    if (normalizedQuestion.includes('diabetes') || normalizedQuestion.includes('blood sugar') || normalizedQuestion.includes('glucose')) {
      const diabetesInsights = insights.filter(i => i.condition === 'diabetes');
      
      if (diabetesInsights.length > 0) {
        const latestInsight = diabetesInsights[0];
        
        if (normalizedQuestion.includes('what') && normalizedQuestion.includes('risk')) {
          return `Based on your blood glucose readings, your diabetes risk is currently ${latestInsight.risk}. ${latestInsight.recommendation}`;
        } else if (normalizedQuestion.includes('what') && normalizedQuestion.includes('do')) {
          return `To manage your diabetes risk: ${latestInsight.recommendation} Regular monitoring is important.`;
        } else {
          return `Your latest blood glucose reading indicates a ${latestInsight.risk} risk level. ${latestInsight.factors.join('. ')}. ${latestInsight.recommendation}`;
        }
      } else {
        return "I don't have enough data about your blood glucose levels yet. Regular monitoring will help provide better insights.";
      }
    }
    
    // Check if the question is about blood pressure or hypertension
    else if (normalizedQuestion.includes('blood pressure') || normalizedQuestion.includes('hypertension')) {
      const bpInsights = insights.filter(i => i.condition === 'hypertension');
      
      if (bpInsights.length > 0) {
        const latestInsight = bpInsights[0];
        
        return `Your blood pressure readings indicate a ${latestInsight.risk} risk level. ${latestInsight.factors.join('. ')}. ${latestInsight.recommendation}`;
      } else {
        return "I don't have enough data about your blood pressure yet. Regular monitoring will help provide better insights.";
      }
    }
    
    // Check if the question is about heart health
    else if (normalizedQuestion.includes('heart') || normalizedQuestion.includes('cardiovascular') || normalizedQuestion.includes('cardiac')) {
      const heartInsights = insights.filter(i => i.condition === 'cardiovascular');
      
      if (heartInsights.length > 0) {
        const latestInsight = heartInsights[0];
        
        return `Your cardiovascular health indicators show a ${latestInsight.risk} risk level. ${latestInsight.factors.join('. ')}. ${latestInsight.recommendation}`;
      } else {
        return "I don't have enough data about your cardiovascular health yet. Regular monitoring will help provide better insights.";
      }
    }
    
    // General health questions
    else if (normalizedQuestion.includes('health') && normalizedQuestion.includes('overall')) {
      // Get the highest risk from all conditions
      if (insights.length > 0) {
        const riskLevels = {
          'low': 1,
          'moderate': 2,
          'high': 3,
          'critical': 4
        };
        
        let highestRiskInsight = insights[0];
        
        for (const insight of insights) {
          if (riskLevels[insight.risk] > riskLevels[highestRiskInsight.risk]) {
            highestRiskInsight = insight;
          }
        }
        
        return `Overall, your most significant health concern is related to ${highestRiskInsight.condition} with a ${highestRiskInsight.risk} risk level. ${highestRiskInsight.recommendation}`;
      } else {
        return "I don't have enough health data yet to give you a comprehensive overview. Continue tracking your health metrics to get more insights.";
      }
    }
    
    // What can you do questions
    else if (normalizedQuestion.includes('what can you do') || normalizedQuestion.includes('how can you help')) {
      return "I can monitor your health data, analyze trends, provide personalized recommendations, answer health-related questions, and alert you if I detect any concerning patterns. The more data you provide, the better insights I can offer.";
    }
    
    // Fallback response
    else {
      return "I'm currently focused on monitoring diabetes, hypertension, and cardiovascular health. Please ask me specific questions about these areas or about your overall health status.";
    }
  };
  
  return (
    <Card className={`flex flex-col h-[500px] ${className}`}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-fitlink-secondary/10 flex items-center justify-center">
            <Brain className="h-5 w-5 text-fitlink-accent" />
          </div>
          <div>
            <CardTitle className="text-lg">AI Health Consultant</CardTitle>
            <CardDescription>Ask questions about your health</CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow overflow-y-auto">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.sender === 'user'
                    ? 'bg-fitlink-primary text-white'
                    : message.isAlert
                    ? 'bg-red-100 border border-red-300 text-red-800'
                    : 'bg-gray-100'
                }`}
              >
                {message.isAlert && (
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <span className="font-semibold text-red-600">Health Alert</span>
                  </div>
                )}
                <p className="text-sm">{message.content}</p>
                <p className="text-xs mt-1 opacity-70">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-lg p-3 bg-gray-100">
                <div className="flex items-center gap-2">
                  <div className="bg-gray-300 w-2 h-2 rounded-full animate-pulse"></div>
                  <div className="bg-gray-300 w-2 h-2 rounded-full animate-pulse delay-150"></div>
                  <div className="bg-gray-300 w-2 h-2 rounded-full animate-pulse delay-300"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="border-t pt-3">
        <div className="flex w-full gap-2">
          <Input
            placeholder="Ask me about your health..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-grow"
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={loading || !input.trim()}
          >
            <ArrowDown className="h-4 w-4 -rotate-90" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default AiHealthConsultant;
