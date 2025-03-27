
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { saveHealthData, getHealthData } from "@/lib/db";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type HealthData = {
  steps: number;
  weight: number;
  heartRate: number;
  sleepHours: number;
  waterIntake: number;
  stressLevel: number;
  bloodGlucose?: number;
  systolicBP?: number;
  diastolicBP?: number;
  oxygenSaturation?: number;
  temperature?: number;
  respirationRate?: number;
};

const HealthTrackingForm = () => {
  const [formData, setFormData] = useState<HealthData>({
    steps: 8000,
    weight: 70,
    heartRate: 72,
    sleepHours: 7,
    waterIntake: 2000,
    stressLevel: 3,
    bloodGlucose: 110,
    systolicBP: 120,
    diastolicBP: 80,
    oxygenSaturation: 98,
    temperature: 36.8,
    respirationRate: 14
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
      
      // Save health data using our database utility
      await saveHealthData(user.id, formData);
      
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
        <Tabs defaultValue="basic">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="basic">Basic Metrics</TabsTrigger>
            <TabsTrigger value="vitals">Vital Signs</TabsTrigger>
            <TabsTrigger value="advanced">Advanced Metrics</TabsTrigger>
          </TabsList>
          
          <form onSubmit={handleSubmit}>
            <TabsContent value="basic" className="space-y-6">
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
            </TabsContent>
            
            <TabsContent value="vitals" className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
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
                  <Label htmlFor="bloodGlucose">Blood Glucose (mg/dL)</Label>
                  <Input
                    id="bloodGlucose"
                    name="bloodGlucose"
                    type="number"
                    value={formData.bloodGlucose}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="systolicBP">Systolic BP (mmHg)</Label>
                  <Input
                    id="systolicBP"
                    name="systolicBP"
                    type="number"
                    value={formData.systolicBP}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="diastolicBP">Diastolic BP (mmHg)</Label>
                  <Input
                    id="diastolicBP"
                    name="diastolicBP"
                    type="number"
                    value={formData.diastolicBP}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="temperature">Body Temperature (°C)</Label>
                  <Input
                    id="temperature"
                    name="temperature"
                    type="number"
                    step="0.1"
                    value={formData.temperature}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="advanced" className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="oxygenSaturation">Oxygen Saturation (%)</Label>
                  <Input
                    id="oxygenSaturation"
                    name="oxygenSaturation"
                    type="number"
                    max="100"
                    value={formData.oxygenSaturation}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="respirationRate">Respiration Rate (per min)</Label>
                  <Input
                    id="respirationRate"
                    name="respirationRate"
                    type="number"
                    value={formData.respirationRate}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </TabsContent>
            
            <div className="pt-6">
              <Button 
                type="submit" 
                className="w-full sm:w-auto health-gradient" 
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Health Data"}
              </Button>
            </div>
          </form>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default HealthTrackingForm;
