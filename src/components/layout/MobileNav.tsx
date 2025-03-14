
import { Link } from "react-router-dom";
import { X, Home, Activity, Brain, LogIn, UserPlus, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileNav = ({ isOpen, onClose }: MobileNavProps) => {
  const { isAuthenticated, logout } = useAuth();

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
        
        <div className="border-t border-border my-2"></div>
        
        {isAuthenticated ? (
          <Button 
            variant="ghost" 
            className="flex items-center justify-start gap-3 text-lg font-medium" 
            onClick={() => {
              logout();
              onClose();
            }}
          >
            <LogOut className="h-5 w-5 text-fitlink-primary" />
            Logout
          </Button>
        ) : (
          <>
            <Link 
              to="/login" 
              className="flex items-center gap-3 text-lg font-medium" 
              onClick={onClose}
            >
              <LogIn className="h-5 w-5 text-fitlink-primary" />
              Sign In
            </Link>
            <Link 
              to="/register" 
              className="flex items-center gap-3 text-lg font-medium" 
              onClick={onClose}
            >
              <UserPlus className="h-5 w-5 text-fitlink-secondary" />
              Create Account
            </Link>
          </>
        )}
      </nav>
    </div>
  );
};

export default MobileNav;
