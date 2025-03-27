
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, AlertTriangle, MessageCircle, ArrowDown, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { getHealthInsights } from "@/lib/db";
import { useAuth } from "@/context/AuthContext";
import { HealthInsight } from "@/types/healthTypes";
import { generateAiResponse, getApiKey, setApiKey } from "@/lib/ai/aiService";
import dbService from "@/lib/database/dbService";

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
  const [apiKeyInput, setApiKeyInput] = useState(getApiKey());
  const [showSettings, setShowSettings] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const [patientInfo, setPatientInfo] = useState<any>(null);
  
  // Check if API key is already set
  useEffect(() => {
    const existingKey = getApiKey();
    if (!existingKey) {
      // Show settings dialog if no API key is set
      setShowSettings(true);
    } else {
      // Set the current API key to the input field
      setApiKeyInput(existingKey);
    }
    
    // Load patient info for context
    if (user) {
      loadPatientInfo();
    }
  }, [user]);
  
  // Initial greeting and data loading
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
    if (user) {
      loadHealthInsights();
    }
    
    // Set up interval to refresh insights periodically
    const intervalId = setInterval(() => {
      if (user) {
        loadHealthInsights();
      }
    }, 30000);
    
    return () => clearInterval(intervalId);
  }, [user]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const loadPatientInfo = async () => {
    if (!user) return;
    
    try {
      const patient = await dbService.getPatient(user.id);
      if (patient) {
        setPatientInfo(patient);
      }
    } catch (error) {
      console.error("Error loading patient info:", error);
    }
  };
  
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
    
    // Check if API key is set
    if (!getApiKey()) {
      toast({
        title: "API Key Required",
        description: "Please set your Groq LLama API key in settings to use the AI consultant.",
        variant: "destructive",
      });
      setShowSettings(true);
      return;
    }
    
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
      const aiResponse = await generateAiResponse(input, insights, patientInfo);
      
      // Add AI response after a small delay to make it feel more natural
      setTimeout(() => {
        setMessages(prev => [...prev, {
          content: aiResponse.content,
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
  
  const handleSaveApiKey = () => {
    if (!apiKeyInput.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid API key.",
        variant: "destructive",
      });
      return;
    }
    
    const success = setApiKey(apiKeyInput.trim());
    
    if (success) {
      toast({
        title: "Success",
        description: "API key saved successfully.",
      });
      setShowSettings(false);
      
      // Add a system message about the connection
      setMessages(prev => [...prev, {
        content: "Connected to Groq LLama AI. I'm ready to assist you with your health questions.",
        sender: 'ai',
        timestamp: new Date()
      }]);
    } else {
      toast({
        title: "Error",
        description: "Failed to save API key. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <>
      <Card className={`flex flex-col h-[500px] ${className}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-fitlink-secondary/10 flex items-center justify-center">
                <Brain className="h-5 w-5 text-fitlink-accent" />
              </div>
              <div>
                <CardTitle className="text-lg">AI Health Consultant</CardTitle>
                <CardDescription>Ask questions about your health</CardDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSettings(true)}
              title="API Settings"
            >
              <Settings className="h-5 w-5" />
            </Button>
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
                  <p className="text-sm whitespace-pre-line">{message.content}</p>
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
            <div ref={messagesEndRef} />
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
              disabled={loading || !input.trim() || !getApiKey()}
            >
              <ArrowDown className="h-4 w-4 -rotate-90" />
            </Button>
          </div>
        </CardFooter>
      </Card>
      
      {/* API Key Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>AI Consultant Settings</DialogTitle>
            <DialogDescription>
              Please provide your Groq LLama API key to enable the AI health consultant.
              You can get an API key from <a href="https://console.groq.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Groq Console</a>.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="apiKey">Groq LLama API Key</Label>
              <Input
                id="apiKey"
                type="password"
                placeholder="Enter your API key"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
              />
            </div>
            
            <div className="text-sm text-gray-500">
              <p>Your API key is stored securely in your browser's local storage and is only used to make requests to the Groq API.</p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSettings(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveApiKey}>
              Save API Key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AiHealthConsultant;
