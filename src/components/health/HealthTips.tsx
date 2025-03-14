
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

const healthTips = [
  {
    id: 1,
    title: "Stay Active Throughout the Day",
    description: "Try to incorporate movement breaks every hour during sedentary activities."
  },
  {
    id: 2,
    title: "Prioritize Sleep Quality",
    description: "Maintain a consistent sleep schedule and create a relaxing bedtime routine."
  },
  {
    id: 3,
    title: "Stay Hydrated",
    description: "Aim to drink at least 8 glasses of water daily, more if you're physically active."
  },
  {
    id: 4,
    title: "Practice Mindfulness",
    description: "Set aside 5-10 minutes daily for meditation or deep breathing exercises."
  }
];

const HealthTips = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Health Tips</CardTitle>
        <CardDescription>
          Recommended practices to improve your overall wellbeing
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {healthTips.map((tip) => (
            <li key={tip.id} className="flex">
              <div className="mr-3 mt-1">
                <div className="w-5 h-5 rounded-full bg-fitlink-light flex items-center justify-center">
                  <Check className="h-3 w-3 text-fitlink-secondary" />
                </div>
              </div>
              <div>
                <h3 className="font-medium text-base">{tip.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {tip.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default HealthTips;
