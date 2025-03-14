
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, X, ActivitySquare, Bell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import MobileNav from "./MobileNav";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { toast } = useToast();

  const handleNotificationClick = () => {
    toast({
      title: "Notifications",
      description: "You have no new notifications.",
    });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <ActivitySquare className="h-6 w-6 text-fitlink-primary" />
            <span className="font-bold text-xl hidden sm:inline-block">FitLink Fusion</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium hover:text-fitlink-primary transition-colors">
            Dashboard
          </Link>
          <Link to="/tracking" className="text-sm font-medium hover:text-fitlink-primary transition-colors">
            Health Tracking
          </Link>
          <Link to="/recommendations" className="text-sm font-medium hover:text-fitlink-primary transition-colors">
            AI Recommendations
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleNotificationClick}
            className="relative"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 bg-fitlink-primary text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
              2
            </span>
          </Button>
          
          <Avatar className="h-8 w-8">
            <AvatarImage src="/avatar-placeholder.jpg" alt="User" />
            <AvatarFallback className="bg-fitlink-primary text-white">
              JD
            </AvatarFallback>
          </Avatar>

          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileNav 
        isOpen={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)} 
      />
    </header>
  );
};

export default Header;
