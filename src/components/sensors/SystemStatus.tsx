
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ServerIcon, Gauge, Database, Wifi } from "lucide-react";

const SystemStatus = () => {
  // Mock system status data
  const systemStatus = {
    server: "Normal",
    database: "Normal",
    mqtt: "Normal",
    network: "Normal",
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Estado del Sistema</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ServerIcon className="h-4 w-4 text-dashboard-secondaryText" />
              <span className="text-sm">Servidor</span>
            </div>
            <div className="flex items-center">
              <span className="inline-block w-2 h-2 rounded-full bg-dashboard-success mr-2"></span>
              <span className="text-sm font-medium">{systemStatus.server}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Database className="h-4 w-4 text-dashboard-secondaryText" />
              <span className="text-sm">Base de Datos</span>
            </div>
            <div className="flex items-center">
              <span className="inline-block w-2 h-2 rounded-full bg-dashboard-success mr-2"></span>
              <span className="text-sm font-medium">{systemStatus.database}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Wifi className="h-4 w-4 text-dashboard-secondaryText" />
              <span className="text-sm">MQTT Broker</span>
            </div>
            <div className="flex items-center">
              <span className="inline-block w-2 h-2 rounded-full bg-dashboard-success mr-2"></span>
              <span className="text-sm font-medium">{systemStatus.mqtt}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Gauge className="h-4 w-4 text-dashboard-secondaryText" />
              <span className="text-sm">Red</span>
            </div>
            <div className="flex items-center">
              <span className="inline-block w-2 h-2 rounded-full bg-dashboard-success mr-2"></span>
              <span className="text-sm font-medium">{systemStatus.network}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemStatus;
