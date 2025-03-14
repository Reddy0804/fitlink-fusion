
import { Brain } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface RecommendationCardProps {
  title: string;
  description: string;
}

const RecommendationCard = ({ title, description }: RecommendationCardProps) => {
  return (
    <Card className="bg-gradient-to-br from-fitlink-light to-white border-none">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
            <Brain className="h-4 w-4 text-fitlink-accent" />
          </div>
          <CardTitle className="text-base">AI Recommendation</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <h3 className="font-semibold text-lg mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" className="w-full">
          <Link to="/recommendations">View All Recommendations</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RecommendationCard;
