
import { ActivitySquare } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t bg-background">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <ActivitySquare className="h-5 w-5 text-fitlink-primary" />
              <span className="font-bold text-lg">FitLink Fusion</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Transforming health and fitness through AI-powered insights and personalized recommendations.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium text-sm mb-4">Navigation</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/tracking" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Health Tracking
                </Link>
              </li>
              <li>
                <Link to="/recommendations" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  AI Recommendations
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-sm mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} FitLink Fusion. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
