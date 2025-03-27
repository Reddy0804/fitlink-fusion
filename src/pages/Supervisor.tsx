
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar } from "recharts";
import { Activity, Heart, Droplet, ThermometerSnowflake, Scale, ArrowUpDown } from "lucide-react";
import dbService from "@/lib/database/dbService";
import LiveDataStream from "@/components/supervisor/LiveDataStream";
import DataTable from "@/components/supervisor/DataTable";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

const Supervisor = () => {
  const [healthData, setHealthData] = useState<any[]>([]);
  const [insights, setInsights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    // Initial load
    loadData();
    
    // Set up polling for real-time updates
    const intervalId = setInterval(loadData, 5000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  const loadData = async () => {
    try {
      // Load health data for all users (in a real app, would be filtered)
      const allData = await dbService.getHealthData(1);
      setHealthData(allData);
      
      // Load insights
      const allInsights = await dbService.getHealthInsights(1);
      setInsights(allInsights);
      
      setLoading(false);
    } catch (error) {
      console.error("Error loading supervisor data:", error);
      toast({
        title: "Error",
        description: "Failed to load monitoring data",
        variant: "destructive",
      });
    }
  };
  
  // Process data for charts
  const processHeartRateData = () => {
    // Take last 20 entries
    return healthData
      .slice(-20)
      .map(entry => ({
        time: new Date(entry.timestamp).toLocaleTimeString(),
        value: entry.heartRate
      }));
  };
  
  const processGlucoseData = () => {
    return healthData
      .slice(-20)
      .map(entry => ({
        time: new Date(entry.timestamp).toLocaleTimeString(),
        value: entry.bloodGlucose
      }));
  };
  
  const processBPData = () => {
    return healthData
      .slice(-20)
      .map(entry => ({
        time: new Date(entry.timestamp).toLocaleTimeString(),
        systolic: entry.systolicBP,
        diastolic: entry.diastolicBP
      }));
  };
  
  const processInsightsData = () => {
    // Group insights by condition and count
    const conditionCounts: Record<string, number> = {};
    
    insights.forEach(insight => {
      if (!conditionCounts[insight.condition]) {
        conditionCounts[insight.condition] = 0;
      }
      conditionCounts[insight.condition]++;
    });
    
    return Object.entries(conditionCounts).map(([condition, count]) => ({
      condition,
      count
    }));
  };
  
  const processRiskData = () => {
    // Group insights by risk level and count
    const riskCounts: Record<string, number> = {};
    
    insights.forEach(insight => {
      if (!riskCounts[insight.risk]) {
        riskCounts[insight.risk] = 0;
      }
      riskCounts[insight.risk]++;
    });
    
    return Object.entries(riskCounts).map(([risk, count]) => ({
      risk,
      count
    }));
  };
  
  if (loading) {
    return (
      <div className="container py-6">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-lg">Loading monitoring data...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container py-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Supervisor Dashboard</h1>
        <p className="text-muted-foreground">
          Real-time health data monitoring and system performance
        </p>
      </div>
      
      <Alert variant="default" className="bg-amber-50 border-amber-200">
        <Activity className="h-4 w-4 text-amber-600" />
        <AlertTitle>Simulation Active</AlertTitle>
        <AlertDescription>
          Health data simulation is running. New data points are generated approximately every 10 seconds.
        </AlertDescription>
      </Alert>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              <CardTitle className="text-base">Heart Rate</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={processHeartRateData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis domain={[60, 120]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#ef4444" name="Heart Rate (bpm)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Droplet className="h-5 w-5 text-blue-500" />
              <CardTitle className="text-base">Blood Glucose</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={processGlucoseData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis domain={[70, 200]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#3b82f6" name="Glucose (mg/dL)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <ArrowUpDown className="h-5 w-5 text-purple-500" />
              <CardTitle className="text-base">Blood Pressure</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={processBPData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis domain={[60, 180]} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="systolic" stroke="#8b5cf6" name="Systolic" />
                  <Line type="monotone" dataKey="diastolic" stroke="#c084fc" name="Diastolic" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="stream">
        <TabsList className="grid grid-cols-3 w-[400px] mb-6">
          <TabsTrigger value="stream">Live Data Stream</TabsTrigger>
          <TabsTrigger value="insights">ML Insights</TabsTrigger>
          <TabsTrigger value="data">Data Table</TabsTrigger>
        </TabsList>
        
        <TabsContent value="stream">
          <LiveDataStream data={healthData.slice(-10).reverse()} />
        </TabsContent>
        
        <TabsContent value="insights">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Insights by Condition</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={processInsightsData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="condition" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#8884d8" name="Count" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Insights by Risk Level</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={processRiskData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="risk" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#82ca9d" name="Count" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Latest ML Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {insights.slice(0, 5).map((insight, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{insight.condition} - Risk: <span className={`font-bold ${insight.risk === 'low' ? 'text-green-600' : insight.risk === 'moderate' ? 'text-yellow-600' : insight.risk === 'high' ? 'text-orange-600' : 'text-red-600'}`}>{insight.risk}</span></h3>
                          <p className="text-sm text-muted-foreground">{new Date(insight.timestamp).toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">Severity: {insight.severity}%</span>
                        </div>
                      </div>
                      <p className="mt-2">{insight.recommendation}</p>
                      <div className="mt-2">
                        <span className="text-sm font-medium">Factors:</span>
                        <ul className="text-sm text-muted-foreground list-disc pl-5 mt-1">
                          {insight.factors.map((factor: string, i: number) => (
                            <li key={i}>{factor}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="data">
          <DataTable data={healthData.slice(-20).reverse()} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Supervisor;
