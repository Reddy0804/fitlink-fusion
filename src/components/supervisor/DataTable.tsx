
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface DataTableProps {
  data: any[];
}

const DataTable = ({ data }: DataTableProps) => {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Health Data Table</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center py-8 text-muted-foreground">No data available</p>
        </CardContent>
      </Card>
    );
  }
  
  const getRiskBadge = (value: number, type: string) => {
    let color = 'bg-green-100 text-green-800';
    let risk = 'Normal';
    
    if (type === 'glucose') {
      if (value > 140) {
        color = 'bg-red-100 text-red-800';
        risk = 'High';
      } else if (value > 110) {
        color = 'bg-yellow-100 text-yellow-800';
        risk = 'Elevated';
      } 
    } else if (type === 'systolic') {
      if (value > 140) {
        color = 'bg-red-100 text-red-800';
        risk = 'High';
      } else if (value > 120) {
        color = 'bg-yellow-100 text-yellow-800';
        risk = 'Elevated';
      }
    } else if (type === 'heartRate') {
      if (value > 100) {
        color = 'bg-yellow-100 text-yellow-800';
        risk = 'Elevated';
      } else if (value < 60) {
        color = 'bg-yellow-100 text-yellow-800';
        risk = 'Low';
      }
    }
    
    return (
      <Badge variant="outline" className={`${color} border-none`}>
        {risk}
      </Badge>
    );
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Health Data Table</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Heart Rate</TableHead>
                <TableHead>Blood Glucose</TableHead>
                <TableHead>Blood Pressure</TableHead>
                <TableHead>O2 Sat</TableHead>
                <TableHead>Temperature</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((entry, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    {new Date(entry.timestamp).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {entry.heartRate} bpm
                      {getRiskBadge(entry.heartRate, 'heartRate')}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {entry.bloodGlucose} mg/dL
                      {getRiskBadge(entry.bloodGlucose, 'glucose')}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {entry.systolicBP}/{entry.diastolicBP} mmHg
                      {getRiskBadge(entry.systolicBP, 'systolic')}
                    </div>
                  </TableCell>
                  <TableCell>{entry.oxygenSaturation}%</TableCell>
                  <TableCell>{entry.temperature}°C</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataTable;
