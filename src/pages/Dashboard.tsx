
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, AlertTriangle, CheckCircle, Gauge } from "lucide-react";
import SensorStatusCard from "@/components/sensors/SensorStatusCard";
import RecentAlerts from "@/components/sensors/RecentAlerts";
import SystemStatus from "@/components/sensors/SystemStatus";

// Mock data for sensors
const mockSensors = [
  { id: 1, name: "Sensor 1", location: "Área A", status: "online", value: 23.5, unit: "Hz" },
  { id: 2, name: "Sensor 2", location: "Área B", status: "warning", value: 46.2, unit: "Hz" },
  { id: 3, name: "Sensor 3", location: "Área C", status: "offline", value: 0, unit: "Hz" },
  { id: 4, name: "Sensor 4", location: "Área D", status: "online", value: 18.7, unit: "Hz" },
  { id: 5, name: "Sensor 5", location: "Área E", status: "online", value: 31.4, unit: "Hz" },
  { id: 6, name: "Sensor 6", location: "Área F", status: "online", value: 27.8, unit: "Hz" },
];

// Mock data for alerts
const mockAlerts = [
  { id: 1, sensorId: 2, message: "Vibración excesiva detectada", severity: "warning", time: "Hace 30 min" },
  { id: 2, sensorId: 3, message: "Pérdida de conexión", severity: "error", time: "Hace 2 horas" },
  { id: 3, sensorId: 2, message: "Umbral de vibración superado", severity: "warning", time: "Hace 1 día" },
];

const Dashboard = () => {
  // Count sensors by status
  const onlineSensors = mockSensors.filter(sensor => sensor.status === "online").length;
  const warningSensors = mockSensors.filter(sensor => sensor.status === "warning").length;
  const offlineSensors = mockSensors.filter(sensor => sensor.status === "offline").length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Sensores Totales</CardTitle>
            <Gauge className="h-4 w-4 text-dashboard-secondaryText" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockSensors.length}</div>
            <p className="text-xs text-dashboard-secondaryText">Sensores registrados</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Sensores Activos</CardTitle>
            <CheckCircle className="h-4 w-4 text-dashboard-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{onlineSensors}</div>
            <p className="text-xs text-dashboard-secondaryText">Funcionando correctamente</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Alertas</CardTitle>
            <AlertTriangle className="h-4 w-4 text-dashboard-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{warningSensors}</div>
            <p className="text-xs text-dashboard-secondaryText">Requieren atención</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Desconectados</CardTitle>
            <Activity className="h-4 w-4 text-dashboard-danger" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{offlineSensors}</div>
            <p className="text-xs text-dashboard-secondaryText">Sin conexión</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Estado de Sensores</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockSensors.map((sensor) => (
              <SensorStatusCard key={sensor.id} sensor={sensor} />
            ))}
          </CardContent>
        </Card>
        
        <div className="space-y-6">
          <RecentAlerts alerts={mockAlerts} />
          <SystemStatus />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
