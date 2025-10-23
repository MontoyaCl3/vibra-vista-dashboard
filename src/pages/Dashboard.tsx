
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, AlertTriangle, CheckCircle, Gauge, Sidebar } from "lucide-react";
import SensorStatusCard from "@/components/sensors/SensorStatusCard";
import RecentAlerts from "@/components/sensors/RecentAlerts";
import SystemStatus from "@/components/sensors/SystemStatus";
import { useSupabaseReadings } from "@/hooks/useSupabaseReadings";


// Mock data for sensors with proper typing
const mockAlerts = [
  { id: 1, sensorId: 2, message: "Vibración excesiva detectada", severity: "warning" as const, time: "Hace 30 min" },
  { id: 2, sensorId: 3, message: "Pérdida de conexión", severity: "error" as const, time: "Hace 2 horas" },
  { id: 3, sensorId: 2, message: "Umbral de vibración superado", severity: "warning" as const, time: "Hace 1 día" },
];

// Mock data for alerts with proper typing
const DataCard = () =>{
        return(
        <div className="bg-slate-700 rounded-lg p-4 text-white">
          <h1>Sensor ---</h1>
          <br/>
          <p>
            Xrms: ---
            <br/>
            Yrms: ---
            <br/>
            Zrms: ---
            <br/>
            Bateria: ---
            <br/>
            Tiempo de lectura: ---
          </p>
        </div>
        
        )
}


const Dashboard = () => {
  return (
    <main className="flex-1 bg-white shadow-lg rounded-md p-4 flex gap-5">
      <section></section>

      <section className="flex flex-row gap-3 h-72 w-2/3 justify-center bg-slate-300 p-6 rounded-xl">
        <DataCard />
        <div className="w-60 h-60 bg-cover bg-[url('/engine-motor.svg')]"></div>
        <DataCard />
      </section>

      <div className="w-1/3 space-y-6">
        <RecentAlerts alerts={mockAlerts} />
      </div>
    </main>
);

}




const standby = () => {

  const { readings, loading, error } = useSupabaseReadings();
  const maxZrms = Math.max(...readings.map(item => item.Zrms));
  
  const mockSensors = [
  { id: 1, name: "WS300", location: "Área A", status: "online" as const, value: 2.3, unit: "mm/s" },
  { id: 2, name: "WS100", location: "Área B", status: "offline" as const, value: 3.2, unit: "mm/s" },
  { id: 3, name: "Sensor 3", location: "TBD", status: "offline" as const, value: 0, unit: "mm/s" },
  { id: 4, name: "Sensor 4", location: "TBD", status: "offline" as const, value: 4.2, unit: "mm/s" },
  ];
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
