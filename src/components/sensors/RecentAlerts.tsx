
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, AlertCircle } from "lucide-react";

interface Alert {
  id: number;
  sensorId: number;
  message: string;
  severity: "warning" | "error";
  time: string;
}

interface RecentAlertsProps {
  alerts: Alert[];
}

const RecentAlerts = ({ alerts }: RecentAlertsProps) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Alertas Recientes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts.length === 0 ? (
            <p className="text-sm text-dashboard-secondaryText text-center py-4">
              No hay alertas recientes
            </p>
          ) : (
            alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-3 rounded-md ${
                  alert.severity === "error" ? "bg-red-50" : "bg-orange-50"
                }`}
              >
                <div className="flex items-center space-x-3">
                  {alert.severity === "error" ? (
                    <AlertCircle className="h-5 w-5 text-dashboard-danger" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-dashboard-warning" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-sm">
                      Sensor {alert.sensorId}: {alert.message}
                    </p>
                    <p className="text-xs text-dashboard-secondaryText">{alert.time}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentAlerts;
