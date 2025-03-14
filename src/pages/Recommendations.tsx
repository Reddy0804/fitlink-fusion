
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AiRecommendation from "@/components/ai/AiRecommendation";

const Recommendations = () => {
  const [activeTab, setActiveTab] = useState("all");

  const recommendations = [
    {
      id: 1,
      title: "Optimize Your Sleep Schedule",
      description: "Based on your sleep patterns, we've identified an opportunity to improve your sleep quality.",
      details: "Your data shows inconsistent sleep times throughout the week.\n\nRecommendation: Try to maintain a consistent sleep schedule, even on weekends.\n\nEstablish a calming pre-sleep routine 30 minutes before bedtime.\n\nAim to sleep in 90-minute cycles (e.g., 7.5 hours instead of 8).",
      category: "sleep"
    },
    {
      id: 2,
      title: "Personalized Hydration Plan",
      description: "Your hydration levels could be improved to support optimal health and performance.",
      details: "Your water intake is currently below the recommended amount for your activity level.\n\nRecommendation: Increase water intake by 500ml daily.\n\nTry drinking a full glass of water upon waking.\n\nSet reminders to drink water throughout the day, especially before and after exercise.",
      category: "nutrition"
    },
    {
      id: 3,
      title: "Stress Management Techniques",
      description: "Based on your stress levels and activity patterns, we recommend these mindfulness practices.",
      details: "Your recent data indicates elevated stress levels, particularly in the afternoons.\n\nRecommendation: Practice 5-minute deep breathing exercises twice daily.\n\nIncorporate a 10-minute mindfulness meditation before work.\n\nTry progressive muscle relaxation techniques before bedtime to improve sleep quality.",
      category: "mental"
    },
    {
      id: 4,
      title: "Optimized Workout Schedule",
      description: "Enhance your fitness results with this personalized exercise recommendation.",
      details: "Your activity data shows consistent cardiovascular exercise but limited strength training.\n\nRecommendation: Add 2 strength training sessions per week.\n\nFocus on compound movements (squats, deadlifts, push-ups, rows).\n\nConsider active recovery days between intense workouts to optimize results and prevent overtraining.",
      category: "fitness"
    },
  ];

  const filteredRecommendations = activeTab === "all" 
    ? recommendations 
    : recommendations.filter(rec => rec.category === activeTab);

  return (
    <div className="container py-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">AI Recommendations</h1>
        <p className="text-muted-foreground">
          Personalized health and wellness recommendations based on your data.
        </p>
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 w-full sm:w-auto">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
          <TabsTrigger value="fitness">Fitness</TabsTrigger>
          <TabsTrigger value="sleep">Sleep</TabsTrigger>
          <TabsTrigger value="mental">Mental</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredRecommendations.map((recommendation) => (
              <AiRecommendation
                key={recommendation.id}
                title={recommendation.title}
                description={recommendation.description}
                details={recommendation.details}
                category={recommendation.category as any}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Recommendations;
