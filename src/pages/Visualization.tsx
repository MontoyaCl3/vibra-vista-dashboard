
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import useMqttStore from '../store/useMqttStore';
import mqtt from "mqtt";
import CreateGraph from "../components/graphs/CreateGraph"

// Generate mock data for visualizations
const generateMockData = (dataPoints = 24) => {
  const data = [];
  const now = new Date();
  
  for (let i = dataPoints - 1; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 3600000); // hourly data
    const hour = time.getHours().toString().padStart(2, '0');
    
    data.push({
      time: `${hour}:00`,
      sensor1: Math.random() * 2 + 2, // 20-40 mm/s
    });
  }
  
  return data;
};


// Mock data for visualizations
const hourlyData = generateMockData();
const weeklyData = generateMockData();

// Colors for charts
const colors = {
  sensor1: "#e91a2f",
  sensor2: "#2d3748",
  sensor3: "#38a169",
  sensor4: "#f6ad55",
};

// Pie chart data
const pieData = [
  { name: "0-20 mm/s", value: 35 },
  { name: "20-40 mm/s", value: 45 },
  { name: "40-60 mm/s", value: 15 },
  { name: "60+ mm/s", value: 5 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const Visualization = () => {
  const [timeframe, setTimeframe] = useState("24h");
  const [sensor, setSensor] = useState("all");
  
  const displayData = timeframe === "24h" ? hourlyData : weeklyData;
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Visualización de Datos</CardTitle>
            <CardDescription>
              Analice los datos de vibración recopilados por sus sensores
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Periodo de tiempo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Últimas 24 horas</SelectItem>
                <SelectItem value="7d">Últimos 7 días</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sensor} onValueChange={setSensor}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Seleccionar sensor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos sensores</SelectItem>
                <SelectItem value="sensor1">Sensor 1</SelectItem>
                <SelectItem value="sensor2">Sensor 2</SelectItem>
                <SelectItem value="sensor3">Sensor 3</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="line">
            <TabsList>
              <TabsTrigger value="line">Todos los ejes</TabsTrigger>
              <TabsTrigger value="area">Eje X</TabsTrigger>
              <TabsTrigger value="bar">Eje Y</TabsTrigger>
              <TabsTrigger value="pie">Eje Z</TabsTrigger>
            </TabsList>
            
            <TabsContent value="line" className="pt-4">
              <div className="h-[400px]">
                <CreateGraph sensor={sensor} />
              </div>
            </TabsContent>
            
            <TabsContent value="area" className="pt-4">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={displayData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis label={{ value: 'Vibración (mm/s)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    {(sensor === "all" || sensor === "sensor1") && (
                      <Area 
                        type="monotone" 
                        dataKey="sensor1" 
                        name="Sensor 1" 
                        fill={colors.sensor1} 
                        stroke={colors.sensor1} 
                        fillOpacity={0.3} 
                      />
                    )}
                    {(sensor === "all" || sensor === "sensor2") && (
                      <Area 
                        type="monotone" 
                        dataKey="sensor2" 
                        name="Sensor 2" 
                        fill={colors.sensor2} 
                        stroke={colors.sensor2} 
                        fillOpacity={0.3} 
                      />
                    )}
                    {(sensor === "all" || sensor === "sensor3") && (
                      <Area 
                        type="monotone" 
                        dataKey="sensor3" 
                        name="Sensor 3" 
                        fill={colors.sensor3} 
                        stroke={colors.sensor3} 
                        fillOpacity={0.3} 
                      />
                    )}
                    {(sensor === "all" || sensor === "sensor4") && (
                      <Area 
                        type="monotone" 
                        dataKey="sensor4" 
                        name="Sensor 4" 
                        fill={colors.sensor4} 
                        stroke={colors.sensor4} 
                        fillOpacity={0.3} 
                      />
                    )}
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            
            <TabsContent value="bar" className="pt-4">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={displayData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis label={{ value: 'Vibración (mm/s)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    {(sensor === "all" || sensor === "sensor1") && (
                      <Bar 
                        dataKey="sensor1" 
                        name="Sensor 1" 
                        fill={colors.sensor1} 
                      />
                    )}
                    {(sensor === "all" || sensor === "sensor2") && (
                      <Bar 
                        dataKey="sensor2" 
                        name="Sensor 2" 
                        fill={colors.sensor2} 
                      />
                    )}
                    {(sensor === "all" || sensor === "sensor3") && (
                      <Bar 
                        dataKey="sensor3" 
                        name="Sensor 3" 
                        fill={colors.sensor3} 
                      />
                    )}
                    {(sensor === "all" || sensor === "sensor4") && (
                      <Bar 
                        dataKey="sensor4" 
                        name="Sensor 4" 
                        fill={colors.sensor4} 
                      />
                    )}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            
            <TabsContent value="pie" className="pt-4">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Estadísticas Generales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted p-4 rounded-md">
                  <div className="text-sm text-muted-foreground">Promedio</div>
                  <div className="text-2xl font-bold">3.2 mm/s</div>
                </div>
                <div className="bg-muted p-4 rounded-md">
                  <div className="text-sm text-muted-foreground">Máximo</div>
                  <div className="text-2xl font-bold">5.8 mm/s</div>
                </div>
                <div className="bg-muted p-4 rounded-md">
                  <div className="text-sm text-muted-foreground">Mínimo</div>
                  <div className="text-2xl font-bold">0.2 mm/s</div>
                </div>
                <div className="bg-muted p-4 rounded-md">
                  <div className="text-sm text-muted-foreground">Desviación</div>
                  <div className="text-2xl font-bold">±1.2 mm/s</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Análisis de Tendencias</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground">Tendencia General</div>
                  <div className="text-xl font-medium">Estable</div>
                </div>
                <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                  Normal
                </div>
              </div>
              
              <div className="bg-muted p-4 rounded-md">
                <div className="text-sm text-muted-foreground">Últimas 24 horas vs Semana anterior</div>
                <div className="flex items-center">
                  <span className="text-xl font-medium">-2.3%</span>
                  <span className="text-green-500 ml-2 text-sm">▼ Reducción de vibración</span>
                </div>
              </div>
              
              <div className="bg-muted p-4 rounded-md">
                <div className="text-sm text-muted-foreground">Predicción 24h</div>
                <div className="flex items-center">
                  <span className="text-xl font-medium">+1.5%</span>
                  <span className="text-yellow-500 ml-2 text-sm">▲ Aumento de vibración</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Visualization;
