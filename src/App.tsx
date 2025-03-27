
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { useEffect } from "react";
import { initDb } from "./lib/db";

import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Dashboard from "./pages/Index";
import HealthTracking from "./pages/HealthTracking";
import Recommendations from "./pages/Recommendations";
import Supervisor from "./pages/Supervisor";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  // Initialize database on app start
  useEffect(() => {
    initDb().catch(console.error);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected routes */}
              <Route element={<ProtectedRoute />}>
                <Route element={<Layout />}>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/tracking" element={<HealthTracking />} />
                  <Route path="/recommendations" element={<Recommendations />} />
                  <Route path="/supervisor" element={<Supervisor />} />
                </Route>
              </Route>
              
              {/* 404 route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
