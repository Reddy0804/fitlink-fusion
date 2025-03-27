
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Droplet, ArrowUpDown, Thermometer, Scale, Wind } from "lucide-react";

interface LiveDataStreamProps {
  data: any[];
}

const LiveDataStream = ({ data }: LiveDataStreamProps) => {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Live Data Stream</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center py-8 text-muted-foreground">No data available</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Live Data Stream</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {data.map((entry, index) => (
            <div key={index} className="border-l-4 border-blue-500 pl-4 py-3 bg-blue-50 rounded-r-lg relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-white opacity-50"></div>
              <div className="relative">
                <div className="flex justify-between items-start">
                  <span className="text-xs text-muted-foreground block mb-1">
                    {new Date(entry.timestamp).toLocaleString()}
                  </span>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    New Data
                  </span>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mt-2">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1 text-sm font-medium text-gray-700">
                      <Heart className="h-4 w-4 text-red-500" />
                      <span>Heart Rate</span>
                    </div>
                    <span className="text-lg font-semibold">{entry.heartRate} bpm</span>
                  </div>
                  
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1 text-sm font-medium text-gray-700">
                      <Droplet className="h-4 w-4 text-blue-500" />
                      <span>Glucose</span>
                    </div>
                    <span className="text-lg font-semibold">{entry.bloodGlucose} mg/dL</span>
                  </div>
                  
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1 text-sm font-medium text-gray-700">
                      <ArrowUpDown className="h-4 w-4 text-purple-500" />
                      <span>BP</span>
                    </div>
                    <span className="text-lg font-semibold">{entry.systolicBP}/{entry.diastolicBP}</span>
                  </div>
                  
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1 text-sm font-medium text-gray-700">
                      <Thermometer className="h-4 w-4 text-orange-500" />
                      <span>Temp</span>
                    </div>
                    <span className="text-lg font-semibold">{entry.temperature}°C</span>
                  </div>
                  
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1 text-sm font-medium text-gray-700">
                      <Scale className="h-4 w-4 text-green-500" />
                      <span>Weight</span>
                    </div>
                    <span className="text-lg font-semibold">{entry.weight} kg</span>
                  </div>
                  
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1 text-sm font-medium text-gray-700">
                      <Wind className="h-4 w-4 text-gray-500" />
                      <span>Resp Rate</span>
                    </div>
                    <span className="text-lg font-semibold">{entry.respirationRate}/min</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveDataStream;
