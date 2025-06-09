
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, AlertCircle } from "lucide-react";
import { useSupabaseReadings } from "@/hooks/useSupabaseReadings";

interface SensorProps {
  sensor: {
    id: number;
    name: string;
    location: string;
    status: "online" | "offline" | "warning";
    value: number;
    unit: string;
  };
}

const SensorStatusCard = ({ sensor }: SensorProps) => {
  const { readings, loading, error } = useSupabaseReadings();
  if(readings[readings.length-1].Zrms !== undefined ){
  const valor = readings[readings.length-1].Zrms
  }
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "online":
        return {
          icon: <CheckCircle className="h-5 w-5 text-dashboard-success" />,
          label: "En línea",
          bgColor: "bg-green-50",
          textColor: "text-dashboard-success",
          ringColor: "ring-dashboard-success",
        };
      case "warning":
        return {
          icon: <AlertTriangle className="h-5 w-5 text-dashboard-warning" />,
          label: "Alerta",
          bgColor: "bg-orange-50",
          textColor: "text-dashboard-warning",
          ringColor: "ring-dashboard-warning",
        };
      case "offline":
        return {
          icon: <AlertCircle className="h-5 w-5 text-dashboard-danger" />,
          label: "Desconectado",
          bgColor: "bg-red-50",
          textColor: "text-dashboard-danger",
          ringColor: "ring-dashboard-danger",
        };
      default:
        return {
          icon: <CheckCircle className="h-5 w-5 text-dashboard-success" />,
          label: "En línea",
          bgColor: "bg-green-50",
          textColor: "text-dashboard-success",
          ringColor: "ring-dashboard-success",
        };
    }
  };

  const statusInfo = getStatusInfo(sensor.status);

  return (
    <Card className={cn("overflow-hidden", statusInfo.bgColor)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-medium text-lg">{sensor.name}</h3>
            <p className="text-sm text-dashboard-secondaryText">{sensor.location}</p>
            
            <div className="flex items-center mt-2">
              <div className={cn("mt-1 flex items-center gap-1.5", statusInfo.textColor)}>
                {statusInfo.icon}
                <span className="text-sm font-medium">{statusInfo.label}</span>
              </div>
            </div>
          </div>
          
          {sensor.status !== "offline" && (
            <div className="text-right">
              <div className="text-2xl font-bold">{sensor.value}</div>
              <div className="text-sm">{sensor.unit}</div>
            </div>
          )}
          
          {sensor.status === "online" && (
            <div className="absolute bottom-3 right-3">
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full rounded-full bg-dashboard-success opacity-75 animate-ping"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-dashboard-success"></span>
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SensorStatusCard;
