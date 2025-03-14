
import { Link } from "react-router-dom";
import { X, Home, Activity, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileNav = ({ isOpen, onClose }: MobileNavProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background md:hidden">
      <div className="container flex h-16 items-center justify-between">
        <div className="text-xl font-bold">FitLink Fusion</div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      <nav className="container mt-8 flex flex-col gap-6">
        <Link 
          to="/" 
          className="flex items-center gap-3 text-lg font-medium" 
          onClick={onClose}
        >
          <Home className="h-5 w-5 text-fitlink-primary" />
          Dashboard
        </Link>
        <Link 
          to="/tracking" 
          className="flex items-center gap-3 text-lg font-medium" 
          onClick={onClose}
        >
          <Activity className="h-5 w-5 text-fitlink-secondary" />
          Health Tracking
        </Link>
        <Link 
          to="/recommendations" 
          className="flex items-center gap-3 text-lg font-medium" 
          onClick={onClose}
        >
          <Brain className="h-5 w-5 text-fitlink-accent" />
          AI Recommendations
        </Link>
      </nav>
    </div>
  );
};

export default MobileNav;
