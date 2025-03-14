
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AiRecommendationProps {
  title: string;
  description: string;
  details: string;
  category: "nutrition" | "fitness" | "sleep" | "mental";
}

const AiRecommendation = ({ 
  title, 
  description, 
  details, 
  category 
}: AiRecommendationProps) => {
  const { toast } = useToast();

  const categoryStyles = {
    nutrition: {
      bgColor: "bg-green-50",
      textColor: "text-green-600",
      borderColor: "border-green-100",
      iconBg: "bg-green-100"
    },
    fitness: {
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
      borderColor: "border-blue-100",
      iconBg: "bg-blue-100"
    },
    sleep: {
      bgColor: "bg-indigo-50",
      textColor: "text-indigo-600",
      borderColor: "border-indigo-100",
      iconBg: "bg-indigo-100"
    },
    mental: {
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
      borderColor: "border-purple-100",
      iconBg: "bg-purple-100"
    }
  };

  const styles = categoryStyles[category];

  const handleSave = () => {
    toast({
      title: "Recommendation Saved",
      description: "This recommendation has been saved to your profile.",
    });
  };

  return (
    <Card className={`${styles.bgColor} ${styles.borderColor} border`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`${styles.iconBg} p-1.5 rounded-full`}>
              <Brain className={`h-4 w-4 ${styles.textColor}`} />
            </div>
            <CardTitle className={`text-sm font-medium ${styles.textColor}`}>
              {category.charAt(0).toUpperCase() + category.slice(1)} Recommendation
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        <div className="text-sm space-y-2">
          {details.split('\n').map((point, index) => (
            <p key={index} className="text-sm">{point}</p>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" onClick={handleSave}>
          Save
        </Button>
        <Button
          size="sm"
          className="bg-white hover:bg-gray-100"
          variant="outline"
          onClick={() => {
            toast({
              title: "Feedback Recorded",
              description: "Thank you for your feedback! This helps improve our recommendations.",
            });
          }}
        >
          This Was Helpful
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AiRecommendation;
