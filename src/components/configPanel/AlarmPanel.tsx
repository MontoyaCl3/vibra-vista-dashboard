import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle } from "lucide-react";


interface Alarm {
  Name: string | null;
  Serial_sensor: string;
  Type: number;
  Message: string;
  Value?: number; // Added Value field
  ID: number;
}

interface Sensor {
  Name: string;
  Serial: string;
}

interface AlarmPanelProps {
  sensors: Sensor[];
}

const AlarmPanel = ({ sensors }: AlarmPanelProps) => {
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [newAlarm, setNewAlarm] = useState<Partial<Alarm>>({
    Name: "",
    Serial_sensor: "",
    Type: 1,
    Message: "",
    Value: 0, // Initialize Value
  });
  const [isAddAlarmDialogOpen, setIsAddAlarmDialogOpen] = useState(false);

  // Map for displaying alarm types
  const alarmTypeMap: { [key: number]: string } = {
    1: "Temperatura",
    2: "Vibración Overall",
    3: "Vibración por Bandas",
    4: "Batería",
  };

  // Config for dynamic labels and notes for the 'Value' field
  const alarmValueConfig: { [key: number]: { label: string; note: string } } = {
    1: { label: "Grados (°C)", note: "La alarma se activará cuando suba de este valor." },
    2: { label: "Valor de alarma (mm/s²)", note: "La alarma se activará cuando suba de este valor." },
    3: { label: "Valor de alarma (mm/s²)", note: "La alarma se activará cuando suba de este valor." },
    4: { label: "Porcentaje batería (%)", note: "La alarma se activará cuando baje de este valor." },
  };

  const normalizeAlarm = (it: any): Alarm => {
    return {
      Name: it.Name == null ? null : String(it.Name),
      Serial_sensor: it.Serial_sensor == null ? "" : String(it.Serial_sensor),
      Type: Number(it.Type ?? 0),
      Message: it.Message == null ? "" : String(it.Message),
      ID: Number(it.ID ?? 0),
      Value: Number(it.Value ?? 0), // New field
    };
  };

  const fetchAlarms = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/alarms/last");
      const data = await response.json();
      // Normalize every item so columns always map correctly
      const normalized = Array.isArray(data) ? data.map(normalizeAlarm) : [];
      setAlarms(normalized);
    } catch (error) {
      console.error("Error fetching alarms:", error);
    }
  };

  useEffect(() => {
    fetchAlarms();
  }, []);

  const handleCreateAlarm = async () => {
    if (!newAlarm.Name || !newAlarm.Serial_sensor || newAlarm.Value === undefined || newAlarm.Message === undefined || newAlarm.Message === null || newAlarm.Message.trim() === "") {
      alert("Por favor, complete todos los campos obligatorios (Nombre, Sensor Vinculado, Valor de Alarma, Mensaje).");
      return;
    }

    if (isNaN(newAlarm.Value)) {
      alert("El valor de alarma debe ser un número válido.");
      return;
    }
    try {
      const response = await fetch("http://localhost:8080/api/alarms/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAlarm),
      });
      if (response.ok) {
        fetchAlarms();
        setIsAddAlarmDialogOpen(false); // Close dialog
        setNewAlarm({ Name: "", Serial_sensor: "", Type: 1, Message: "", Value: 0 }); // Reset form
      }
    } catch (error) {
      console.error("Error creating alarm:", error);
    }
  };

  const handleDeleteAlarm = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8080/api/alarms/delete?ID=${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchAlarms();
      }
    } catch (error) {
      console.error("Error deleting alarm:", error);
    }
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Dialog open={isAddAlarmDialogOpen} onOpenChange={setIsAddAlarmDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-brand-dark">
              <PlusCircle className="w-4 h-4 mr-2" />
              Agregar Alarma
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Agregar Nueva Alarma</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="alarm-name">Nombre</Label>
                <Input
                  id="alarm-name"
                  value={newAlarm.Name || ""}
                  onChange={(e) => setNewAlarm({ ...newAlarm, Name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="alarm-sensor">Sensor Vinculado</Label>
                <Select 
                  onValueChange={(value) => setNewAlarm({ ...newAlarm, Serial_sensor: value })}
                  value={newAlarm.Serial_sensor}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione un sensor" />
                  </SelectTrigger>
                  <SelectContent>
                    {sensors.map((sensor) => (
                      <SelectItem key={sensor.Serial} value={sensor.Serial}>
                        {sensor.Name} ({sensor.Serial})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="alarm-type">Tipo</Label>
                <Select
                  onValueChange={(value) => setNewAlarm({ ...newAlarm, Type: parseInt(value) })}
                  value={String(newAlarm.Type)} // Select expects string value
                  id="alarm-type"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione un tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Temperatura</SelectItem>
                    <SelectItem value="2">Vibración Overall</SelectItem>
                    <SelectItem value="3">Vibración por Bandas</SelectItem>
                    <SelectItem value="4">Batería</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="alarm-value">
                  {alarmValueConfig[newAlarm.Type || 1]?.label || "Valor de Alarma"}
                </Label>
                <Input id="alarm-value" type="number" step="0.01" value={newAlarm.Value || ""} onChange={(e) => setNewAlarm({ ...newAlarm, Value: parseFloat(e.target.value) })} />
                <p className="text-sm text-muted-foreground">
                  {alarmValueConfig[newAlarm.Type || 1]?.note}
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="alarm-message">Mensaje</Label>
                <Input
                  id="alarm-message"
                  value={newAlarm.Message || ""}
                  onChange={(e) => setNewAlarm({ ...newAlarm, Message: e.target.value })}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button variant="outline" className="mr-2" onClick={() => setIsAddAlarmDialogOpen(false)}>
                Cancelar
              </Button>
              <Button className="bg-blue-600 hover:bg-brand-dark" onClick={handleCreateAlarm}>
                Guardar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Reverted table to the previous simpler layout */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="text-left">
              <th className="px-4 py-2">Nombre</th>
              <th className="px-4 py-2">Sensor vinculado</th>
              <th className="px-4 py-2">Tipo</th>
              <th className="px-4 py-2">Valor</th>
              <th className="px-4 py-2">Mensaje</th>
              <th className="px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {alarms.map((alarm) => (
              <tr key={alarm.ID} className="border-t">
                <td className="px-4 py-3">{alarm.Name || "Sin nombre"}</td>
                <td className="px-4 py-3">{alarm.Serial_sensor}</td>
                <td className="px-4 py-3">{alarmTypeMap[alarm.Type] || "Desconocido"}</td>
                <td className="px-4 py-3">{alarm.Value ?? "N/A"}</td>
                <td className="px-4 py-3">{alarm.Message}</td>
                <td className="px-4 py-3">
                  <Button onClick={() => handleDeleteAlarm(alarm.ID)} variant="destructive" size="sm">
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AlarmPanel;