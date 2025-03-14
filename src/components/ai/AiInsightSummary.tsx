
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CustomProgress from "@/components/ui/custom-progress";

interface HealthScore {
  category: string;
  score: number;
  color: string;
}

interface AiInsightSummaryProps {
  overallScore: number;
  healthScores: HealthScore[];
}

const AiInsightSummary = ({ overallScore, healthScores }: AiInsightSummaryProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreText = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Needs Improvement";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Health Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Overall Health Score</span>
            <span className={`text-xl font-bold ${getScoreColor(overallScore)}`}>
              {overallScore}
            </span>
          </div>
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className={`text-xs font-semibold inline-block py-1 px-2 uppercase rounded ${getScoreColor(overallScore)} bg-opacity-10`}>
                  {getScoreText(overallScore)}
                </span>
              </div>
            </div>
            <div className="h-2 bg-gray-200 rounded overflow-hidden">
              <div 
                className="bg-gradient-to-r from-fitlink-primary to-fitlink-secondary h-full rounded" 
                style={{ width: `${overallScore}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {healthScores.map((item) => (
            <div key={item.category}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm">{item.category}</span>
                <span className={`text-sm font-medium ${getScoreColor(item.score)}`}>
                  {item.score}%
                </span>
              </div>
              <CustomProgress 
                value={item.score} 
                className="h-2" 
                indicatorClassName={item.color}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AiInsightSummary;
