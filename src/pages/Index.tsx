
import { Activity, Heart, Moon, Droplet } from "lucide-react";
import HealthMetricCard from "@/components/dashboard/HealthMetricCard";
import ActivityChart from "@/components/dashboard/ActivityChart";
import RecommendationCard from "@/components/dashboard/RecommendationCard";
import AiInsightSummary from "@/components/ai/AiInsightSummary";

const Dashboard = () => {
  const healthScores = [
    { category: "Physical Activity", score: 78, color: "bg-blue-500" },
    { category: "Nutrition", score: 65, color: "bg-green-500" },
    { category: "Sleep Quality", score: 82, color: "bg-indigo-500" },
    { category: "Stress Management", score: 60, color: "bg-purple-500" },
  ];

  return (
    <div className="container py-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Welcome back, Jamie</h1>
        <p className="text-muted-foreground">
          Here's an overview of your health metrics and personalized recommendations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <HealthMetricCard
          title="Daily Steps"
          value={8743}
          unit="steps"
          change={5}
          target={10000}
          icon={<Activity className="h-5 w-5" />}
        />
        <HealthMetricCard
          title="Avg. Heart Rate"
          value={72}
          unit="bpm"
          change={-2}
          icon={<Heart className="h-5 w-5" />}
        />
        <HealthMetricCard
          title="Sleep Duration"
          value={7.5}
          unit="hours"
          change={12}
          target={8}
          icon={<Moon className="h-5 w-5" />}
        />
        <HealthMetricCard
          title="Water Intake"
          value={1800}
          unit="ml"
          change={-8}
          target={2500}
          icon={<Droplet className="h-5 w-5" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-2">
          <ActivityChart
            title="Weekly Activity"
            description="Your activity trends over the past week"
          />
        </div>
        <div className="space-y-6">
          <AiInsightSummary 
            overallScore={72} 
            healthScores={healthScores} 
          />
          <RecommendationCard
            title="Improve your sleep quality"
            description="Based on your recent sleep patterns, we recommend adjusting your bedtime routine to improve sleep quality."
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
