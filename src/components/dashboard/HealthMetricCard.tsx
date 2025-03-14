
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowUp, ArrowDown } from "lucide-react";

interface HealthMetricCardProps {
  title: string;
  value: number;
  unit: string;
  change?: number;
  target?: number;
  icon: React.ReactNode;
}

const HealthMetricCard = ({ 
  title, 
  value, 
  unit, 
  change = 0, 
  target, 
  icon 
}: HealthMetricCardProps) => {
  const progress = target ? Math.min(100, (value / target) * 100) : undefined;
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <CardDescription className="text-xs">Daily tracking</CardDescription>
        </div>
        <div className="w-10 h-10 rounded-full bg-fitlink-light flex items-center justify-center text-fitlink-primary">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {value} <span className="text-sm font-normal text-muted-foreground">{unit}</span>
        </div>
        
        {change !== 0 && (
          <div className="flex items-center mt-1">
            {change > 0 ? (
              <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
            ) : (
              <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
            )}
            <span className={`text-xs ${change > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {Math.abs(change)}% from yesterday
            </span>
          </div>
        )}
        
        {progress !== undefined && (
          <div className="mt-3">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between mt-1">
              <span className="text-xs text-muted-foreground">
                Progress
              </span>
              <span className="text-xs font-medium">
                {progress.toFixed(0)}%
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HealthMetricCard;
