
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
import { useSupabaseReadings } from "@/hooks/useSupabaseReadings";
import CreateGraph from "../components/graphs/CreateGraph"

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
  const [peakOrRms, setPeakOrRms] = useState("pk");
  const [sensor, setSensor] = useState("all");
  const [eje, setEje] = useState("X")
  const { readings, loading, error } = useSupabaseReadings();
  const muestra = eje.concat(peakOrRms)

  const maxXpk = Math.max(...readings.map(item => item.Xpk));
  const maxZpk = Math.max(...readings.map(item => item.Zpk));
  const maxYpk = Math.max(...readings.map(item => item.Ypk));
  const maxXrms = Math.max(...readings.map(item => item.Xrms));
  const maxZrms = Math.max(...readings.map(item => item.Zrms));
  const maxYrms = Math.max(...readings.map(item => item.Yrms));

  
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
            <Select value={peakOrRms} onValueChange={setPeakOrRms}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Periodo de tiempo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pk">Valor Maximo</SelectItem>
                <SelectItem value="rms">Valor Promedio</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sensor} onValueChange={setSensor}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Seleccionar sensor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" >Todos sensores</SelectItem>
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
              <TabsTrigger value="line" onClick={() => setEje("X")}>Eje X</TabsTrigger>
              <TabsTrigger value="area" onClick={() => setEje("Y")}>Eje Y</TabsTrigger>
              <TabsTrigger value="bar" onClick={() => setEje("Z")}>Eje Z</TabsTrigger>
            </TabsList>
            
            <TabsContent value="line" className="pt-4" >
              <div className="h-[400px]">
                <CreateGraph sensor={sensor} eje="X" peakOrRms={peakOrRms}/>
              </div>
            </TabsContent>
            
            <TabsContent value="area" className="pt-4">
              <div className="h-[400px]">
                <CreateGraph sensor={sensor} peakOrRms={peakOrRms} eje="Y" />
              </div>
            </TabsContent>
            
            <TabsContent value="bar" className="pt-4">
              <div className="h-[400px]">
               <CreateGraph sensor={sensor} peakOrRms={peakOrRms} eje="Z" />
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
                  <div className="text-sm text-muted-foreground">Valor PK promedio</div>
                  <div className="text-2xl font-bold">X: {maxXpk} mm/s</div>
                  <div className="text-2xl font-bold">Y: {maxYpk} mm/s</div>
                  <div className="text-2xl font-bold">Z: {maxZpk} mm/s</div>
                </div>
                <div className="bg-muted p-4 rounded-md">
                  <div className="text-sm text-muted-foreground">Valor RMS promedio</div>
                  <div className="text-2xl font-bold">X: {maxXrms} mm/s</div>
                  <div className="text-2xl font-bold">Y: {maxYrms} mm/s</div>
                  <div className="text-2xl font-bold">Z: {maxZrms} mm/s</div>
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
