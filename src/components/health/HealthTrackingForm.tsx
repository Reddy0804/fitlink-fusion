
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { query } from "@/lib/db";

type HealthData = {
  steps: number;
  weight: number;
  heartRate: number;
  sleepHours: number;
  waterIntake: number;
  stressLevel: number;
};

const HealthTrackingForm = () => {
  const [formData, setFormData] = useState<HealthData>({
    steps: 8000,
    weight: 70,
    heartRate: 72,
    sleepHours: 7,
    waterIntake: 2000,
    stressLevel: 3,
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: parseFloat(value),
    });
  };

  const handleSliderChange = (name: string, value: number[]) => {
    setFormData({
      ...formData,
      [name]: value[0],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (!user) {
        throw new Error("User not authenticated");
      }
      
      // Format today's date in YYYY-MM-DD format
      const today = new Date().toISOString().split('T')[0];
      
      // Check if entry for today already exists
      const existingEntries = await query(
        'SELECT * FROM health_metrics WHERE user_id = ? AND date = ?',
        [user.id, today]
      ) as any[];
      
      let result;
      
      if (existingEntries.length > 0) {
        // Update existing entry
        result = await query(
          `UPDATE health_metrics 
           SET steps = ?, weight = ?, heart_rate = ?, sleep_hours = ?, water_intake = ?, stress_level = ?
           WHERE user_id = ? AND date = ?`,
          [
            formData.steps, 
            formData.weight, 
            formData.heartRate, 
            formData.sleepHours, 
            formData.waterIntake, 
            formData.stressLevel,
            user.id,
            today
          ]
        );
      } else {
        // Insert new entry
        result = await query(
          `INSERT INTO health_metrics 
           (user_id, date, steps, weight, heart_rate, sleep_hours, water_intake, stress_level)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            user.id,
            today,
            formData.steps, 
            formData.weight, 
            formData.heartRate, 
            formData.sleepHours, 
            formData.waterIntake, 
            formData.stressLevel
          ]
        );
      }
      
      toast({
        title: "Data Saved",
        description: "Your health metrics have been recorded successfully.",
      });
    } catch (error) {
      console.error("Error saving health data:", error);
      toast({
        title: "Error",
        description: "Failed to save health data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Track Your Health</CardTitle>
        <CardDescription>
          Record your daily health metrics to get personalized insights
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="steps">Steps</Label>
              <Input
                id="steps"
                name="steps"
                type="number"
                value={formData.steps}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                name="weight"
                type="number"
                step="0.1"
                value={formData.weight}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="heartRate">Heart Rate (bpm)</Label>
              <Input
                id="heartRate"
                name="heartRate"
                type="number"
                value={formData.heartRate}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sleepHours">Sleep (hours)</Label>
              <Input
                id="sleepHours"
                name="sleepHours"
                type="number"
                step="0.5"
                value={formData.sleepHours}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="waterIntake">Water Intake (ml)</Label>
              <Input
                id="waterIntake"
                name="waterIntake"
                type="number"
                step="50"
                value={formData.waterIntake}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="stressLevel">
                Stress Level ({formData.stressLevel}/10)
              </Label>
              <Slider
                id="stressLevel"
                min={1}
                max={10}
                step={1}
                value={[formData.stressLevel]}
                onValueChange={(value) => handleSliderChange("stressLevel", value)}
              />
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full sm:w-auto health-gradient" 
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Health Data"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default HealthTrackingForm;
