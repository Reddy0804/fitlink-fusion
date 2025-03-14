
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { day: "Mon", steps: 7500, calories: 1800 },
  { day: "Tue", steps: 8200, calories: 2100 },
  { day: "Wed", steps: 6800, calories: 1750 },
  { day: "Thu", steps: 9100, calories: 2300 },
  { day: "Fri", steps: 8700, calories: 2200 },
  { day: "Sat", steps: 10200, calories: 2500 },
  { day: "Sun", steps: 7300, calories: 1950 },
];

interface ActivityChartProps {
  title: string;
  description: string;
}

const ActivityChart = ({ title, description }: ActivityChartProps) => {
  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis 
                yAxisId="left"
                tick={{ fontSize: 12 }} 
                domain={[0, 12000]}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right" 
                tick={{ fontSize: 12 }} 
                domain={[0, 3000]}
              />
              <Tooltip />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="steps"
                stroke="#3B82F6"
                fill="#3B82F6"
                fillOpacity={0.2}
                name="Steps"
              />
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="calories"
                stroke="#10B981"
                fill="#10B981"
                fillOpacity={0.2}
                name="Calories"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityChart;
