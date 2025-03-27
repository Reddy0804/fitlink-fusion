
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CustomProgress from "@/components/ui/custom-progress";
import { useAuth } from "@/context/AuthContext";
import { getHealthInsights } from "@/lib/db";
import { HealthInsight } from "@/lib/ml/healthModels";
import { Heart, Droplet, Activity } from "lucide-react";

const getRiskColor = (risk: string) => {
  switch (risk) {
    case 'low':
      return {
        text: 'text-green-600',
        bg: 'bg-green-500',
        bgLight: 'bg-green-50',
        border: 'border-green-100'
      };
    case 'moderate':
      return {
        text: 'text-yellow-600',
        bg: 'bg-yellow-500',
        bgLight: 'bg-yellow-50',
        border: 'border-yellow-100'
      };
    case 'high':
      return {
        text: 'text-orange-600',
        bg: 'bg-orange-500',
        bgLight: 'bg-orange-50',
        border: 'border-orange-100'
      };
    case 'critical':
      return {
        text: 'text-red-600',
        bg: 'bg-red-500',
        bgLight: 'bg-red-50',
        border: 'border-red-100'
      };
    default:
      return {
        text: 'text-gray-600',
        bg: 'bg-gray-500',
        bgLight: 'bg-gray-50',
        border: 'border-gray-100'
      };
  }
};

const getConditionIcon = (condition: string) => {
  switch (condition) {
    case 'diabetes':
      return <Droplet className="h-5 w-5" />;
    case 'hypertension':
      return <Heart className="h-5 w-5" />;
    case 'cardiovascular':
      return <Activity className="h-5 w-5" />;
    default:
      return <Activity className="h-5 w-5" />;
  }
};

const getConditionName = (condition: string) => {
  switch (condition) {
    case 'diabetes':
      return 'Diabetes';
    case 'hypertension':
      return 'Hypertension';
    case 'cardiovascular':
      return 'Cardiovascular';
    default:
      return condition;
  }
};

const HealthInsightsPanel = () => {
  const [insights, setInsights] = useState<HealthInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
  useEffect(() => {
    loadInsights();
    
    // Refresh insights every minute
    const intervalId = setInterval(loadInsights, 60000);
    
    return () => clearInterval(intervalId);
  }, [user]);
  
  const loadInsights = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const data = await getHealthInsights(user.id);
      
      // Group by condition and take the most recent for each
      const latestByCondition: Record<string, HealthInsight> = {};
      
      data.forEach(insight => {
        if (!latestByCondition[insight.condition] || 
            new Date(insight.timestamp) > new Date(latestByCondition[insight.condition].timestamp)) {
          latestByCondition[insight.condition] = insight;
        }
      });
      
      setInsights(Object.values(latestByCondition));
    } catch (error) {
      console.error("Error loading health insights:", error);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Health Risk Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-40">
            <div className="animate-pulse flex flex-col items-center gap-4 w-full">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-8 bg-gray-200 rounded w-full"></div>
              <div className="h-8 bg-gray-200 rounded w-full"></div>
              <div className="h-8 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Health Risk Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        {insights.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No health insights available yet.</p>
            <p className="text-sm mt-2">Continue tracking your health data to receive ML-powered analysis.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {insights.map((insight) => {
              const colors = getRiskColor(insight.risk);
              
              return (
                <div key={insight.condition} className={`${colors.bgLight} ${colors.border} border rounded-lg p-4`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full ${colors.bgLight} flex items-center justify-center`}>
                        {getConditionIcon(insight.condition)}
                      </div>
                      <span className="font-medium">{getConditionName(insight.condition)}</span>
                    </div>
                    <span className={`text-sm font-semibold ${colors.text} uppercase`}>
                      {insight.risk}
                    </span>
                  </div>
                  
                  <div className="mb-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm">Risk Level</span>
                      <span className="text-sm font-medium">{insight.severity}%</span>
                    </div>
                    <CustomProgress
                      value={insight.severity}
                      className="h-2"
                      indicatorClassName={colors.bg}
                    />
                  </div>
                  
                  <div className="text-sm mt-3">
                    <p className="font-medium mb-1">Key Factors:</p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1">
                      {insight.factors.map((factor, index) => (
                        <li key={index}>{factor}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HealthInsightsPanel;
