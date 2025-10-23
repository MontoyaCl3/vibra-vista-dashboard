import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings, Edit, Trash2, PlusCircle } from "lucide-react";
import AlarmPanel from "../components/configPanel/AlarmPanel";
import MachineLocationPanel from "../components/configPanel/MachineLocationPanel";

type Sensor = {
  Name: string;
  Serial: string;
  Location: string;
  Range: number;
};

type Machine = {
  Name: string;
  Location: string;
};

type Location = {
  Name: string;
};

interface Alarm {
  Name: string | null;
  Serial_sensor: string;
  Type: number;
  Message: string;
  ID: number;
  Value?: number; // Added Value field
}

const Configuration = () => {
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [machines, setMachines] = useState<Machine[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedMachine, setSelectedMachine] = useState("");
  const [addSensorSelectedLocation, setAddSensorSelectedLocation] = useState<string | null>(null);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentSensor, setCurrentSensor] = useState<Sensor | null>(null);
  const [newSensor, setNewSensor] = useState<Sensor>({
    Name: "",
    Serial: "",
    Location: "",
    Range: 0
  });

  const [newAlarm, setNewAlarm] = useState<Partial<Alarm>>({
    Name: "",
    Serial_sensor: "",
    Type: 1,
    Message: "",
    Value: 0, // Initialize Value
  });
  const [isAddAlarmDialogOpen, setIsAddAlarmDialogOpen] = useState(false);

  const API_BASE = "http://localhost:8080/api/sensors";
  const API_MACHINES_BASE = "http://localhost:8080/api/machines";
  const API_LOCATIONS_BASE = "http://localhost:8080/api/locations";

  const fetchSensors = async () => {
    try {
      const res = await fetch(`${API_BASE}/`);
      if (!res.ok) throw new Error(`Fetch error: ${res.status}`);
      const data: Sensor[] = await res.json();
      setSensors(data);
    } catch (err) {
      console.error("Error loading sensors:", err);
    }
  };

  const fetchMachines = async () => {
    try {
      const res = await fetch(`${API_MACHINES_BASE}/`);
      if (!res.ok) throw new Error(`Error al cargar máquinas: ${res.status}`);
      const data: Machine[] = await res.json();
      setMachines(data);
    } catch (err) {
      console.error("Error loading machines:", err);
    }
  };

  const fetchLocations = async () => {
    try {
      const res = await fetch(`${API_LOCATIONS_BASE}/`);
      if (!res.ok) throw new Error(`Error al cargar lugares: ${res.status}`);
      const data: Location[] = await res.json();
      setLocations(data);
    } catch (err) {
      console.error("Error loading locations:", err);
    }
  };

  useEffect(() => {
    fetchSensors();
    fetchMachines();
    fetchLocations();
  }, []);

  const handleAddSensor = async () => {
    try {
      const res = await fetch(`${API_BASE}/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSensor),
      });
      if (!res.ok) throw new Error(`Create error: ${res.status}`);
      // reload list after create
      await fetchSensors();
      setNewSensor({ Name: "", Serial: "", Location: "", Range: 0 });
      setIsAddDialogOpen(false);
    } catch (err) {
      console.error("Error creating sensor:", err);
    }
  };

  const handleEditSensor = async () => {
    // No update endpoint specified. Update local state only for now.
    if (currentSensor) {
      setSensors(sensors.map(s => s.Serial === currentSensor.Serial ? currentSensor : s));
      setIsEditDialogOpen(false);
      // TODO: call update endpoint when available
    }
  };

  const handleDeleteSensor = async (serial: string) => {
    try {
      const url = `${API_BASE}/delete?serial=${encodeURIComponent(serial)}`;
      const res = await fetch(url, { method: "DELETE" });
      if (!res.ok) throw new Error(`Delete error: ${res.status}`);
      await fetchSensors();
    } catch (err) {
      console.error("Error deleting sensor:", err);
    }
  };

  const openEditDialog = (sensor: Sensor) => {
    setCurrentSensor({ ...sensor });
    setIsEditDialogOpen(true);
  };

  const handleCreateAlarm = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/alarms/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAlarm),
      });
      if (response.ok) {
        setNewAlarm({ Name: "", Serial_sensor: "", Type: 1, Message: "" });
        setIsAddAlarmDialogOpen(false);
      }
    } catch (error) {
      console.error("Error creating alarm:", error);
    }
  };

  const openAddDialog = () => {
    setAddSensorSelectedLocation(null);
    setIsAddDialogOpen(true);
  };

  const handleLocationChange = (locationName: string) => {
    setSelectedLocation(locationName === "all" ? "" : locationName);
    setSelectedMachine(""); // Reset machine filter when location changes
  };

  // Create a map for quick lookup of a machine's location
  const machineToLocationMap = new Map(machines.map(m => [m.Name, m.Location]));

  // Filter machines based on the selected location
  const filteredMachinesForTable = selectedLocation && selectedLocation !== "all"
    ? machines.filter(m => m.Location === selectedLocation)
    : [];

  // Filter sensors based on selected location and machine
  const filteredSensors = sensors.filter(sensor => {
    const sensorLocation = machineToLocationMap.get(sensor.Location);
    const locationMatch = !selectedLocation || selectedLocation === "all" || sensorLocation === selectedLocation;
    const machineMatch = !selectedMachine || sensor.Location === selectedMachine;
    return locationMatch && machineMatch;
  });

  // Reset filters
  const resetFilters = () => {
    setSelectedLocation("all");
    setSelectedMachine("");
  };

  const machinesForAddDialog = addSensorSelectedLocation
    ? machines.filter(m => m.Location === addSensorSelectedLocation)
    : [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Configuración de Sensores</CardTitle>
            <CardDescription>
              Administre y configure sus sensores de vibración inalámbricos
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="list">
            <TabsList>
              <TabsTrigger value="list">Lista de Sensores</TabsTrigger>
              <TabsTrigger value="mqtt">Configuración MQTT</TabsTrigger>
              <TabsTrigger value="system">Configuración del Sistema</TabsTrigger>
              <TabsTrigger value="alarm">Configuración de alarmas</TabsTrigger>
              <TabsTrigger value="machines">Máquinas y Lugares</TabsTrigger>
            </TabsList>
            <TabsContent value="list">
              <div className="flex items-center justify-between gap-4 mb-4 p-4 border-b">
                <div className="flex items-center gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="filter-location">Filtrar por Lugar</Label>
                    <Select onValueChange={handleLocationChange} value={selectedLocation || "all"}>
                      <SelectTrigger id="filter-location" className="w-[180px]">
                        <SelectValue placeholder="Todos los lugares" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los lugares</SelectItem>
                        {locations.map((loc) => (
                          <SelectItem key={loc.Name} value={loc.Name}>{loc.Name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="filter-machine">Filtrar por Máquina</Label>
                    <Select
                      onValueChange={(value) => setSelectedMachine(value)}
                      value={selectedMachine || "all"}
                      disabled={!selectedLocation || selectedLocation === "all"}
                    >
                      <SelectTrigger id="filter-machine" className="w-[180px]">
                        <SelectValue placeholder="Todas las máquinas" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas las máquinas</SelectItem>
                        {filteredMachinesForTable.map((machine) => (
                          <SelectItem key={machine.Name} value={machine.Name}>{machine.Name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="self-end">
                    <Button variant="outline" onClick={resetFilters}>Limpiar Filtros</Button>
                  </div>
                </div>
                <div className="self-end">
                  <Dialog open={isAddDialogOpen} onOpenChange={(open) => { if (!open) { setIsAddDialogOpen(false); setAddSensorSelectedLocation(null); } else { openAddDialog(); }}}>
                    <DialogTrigger asChild>
                      <Button className="bg-blue-600 hover:bg-brand-dark">
                        <PlusCircle className="w-4 h-4 mr-2" />
                        Agregar Sensor
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Agregar Nuevo Sensor</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="name">Nombre</Label>
                          <Input
                            id="name"
                            value={newSensor.Name}
                            onChange={(e) => setNewSensor({ ...newSensor, Name: e.target.value })}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="serial">Número serial</Label>
                          <Input
                            id="serial"
                            value={newSensor.Serial}
                            onChange={(e) => setNewSensor({ ...newSensor, Serial: e.target.value })}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="add-location">Lugar</Label>
                          <Select onValueChange={(value) => {
                              setAddSensorSelectedLocation(value);
                              setNewSensor({ ...newSensor, Location: "" }); // Reset machine selection
                            }}
                            value={addSensorSelectedLocation || ""}
                          >
                            <SelectTrigger id="add-location">
                              <SelectValue placeholder="Seleccione un lugar" />
                            </SelectTrigger>
                            <SelectContent>
                              {locations.map((loc) => (
                                <SelectItem key={loc.Name} value={loc.Name}>{loc.Name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="add-machine">Máquina</Label>
                          <Select
                            onValueChange={(value) => setNewSensor({ ...newSensor, Location: value })}
                            value={newSensor.Location}
                            disabled={!addSensorSelectedLocation}
                          >
                            <SelectTrigger id="add-machine">
                              <SelectValue placeholder="Seleccione una máquina" />
                            </SelectTrigger>
                            <SelectContent>
                              {machinesForAddDialog.map((machine) => (
                                <SelectItem key={machine.Name} value={machine.Name}>{machine.Name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="range">Rango</Label>
                          <Input
                            id="range"
                            type="number"
                            value={newSensor.Range}
                            onChange={(e) => setNewSensor({ ...newSensor, Range: parseFloat(e.target.value || "0") })}
                          />
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button variant="outline" className="mr-2" onClick={() => setIsAddDialogOpen(false)}>
                          Cancelar
                        </Button>
                        <Button className="bg-blue-600 hover:bg-brand-dark" onClick={handleAddSensor}>
                          Guardar
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Lugar</TableHead>
                    <TableHead>Máquina</TableHead>
                    <TableHead>Serial</TableHead>
                    <TableHead>Rango</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSensors.map((sensor) => {
                    const placeName = machineToLocationMap.get(sensor.Location) || 'N/A';
                    return (
                      <TableRow key={sensor.Serial}>
                        <TableCell>{sensor.Name}</TableCell>
                        <TableCell>{placeName}</TableCell>
                        <TableCell>{sensor.Location}</TableCell>
                        <TableCell className="font-mono text-sm">{sensor.Serial}</TableCell>
                        <TableCell>{sensor.Range} minutos</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(sensor)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteSensor(sensor.Serial)}
                          >
                            <Trash2 className="h-4 w-4 text-dashboard-danger" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value="mqtt">
              <Card>
                <CardHeader>
                  <CardTitle>Configuración de MQTT</CardTitle>
                  <CardDescription>Configure los ajustes del broker MQTT para la comunicación con los sensores</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="broker-address">Dirección del Broker</Label>
                      <Input id="broker-address" defaultValue="mqtt.example.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="broker-port">Puerto</Label>
                      <Input id="broker-port" defaultValue="1883" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Usuario</Label>
                      <Input id="username" defaultValue="sensors_user" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Contraseña</Label>
                      <Input id="password" type="password" defaultValue="********" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="topic-prefix">Prefijo de Tópico</Label>
                    <Input id="topic-prefix" defaultValue="sensors/vibration/" />
                  </div>
                  <div className="flex justify-end">
                    <Button className="bg-brand-DEFAULT hover:bg-brand-dark">
                      <Settings className="w-4 h-4 mr-2" />
                      Guardar Configuración
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="system">
              <Card>
                <CardHeader>
                  <CardTitle>Configuración del Sistema</CardTitle>
                  <CardDescription>Ajustes globales del sistema de monitoreo</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="alert-emails">Correos para Alertas</Label>
                    <Input id="alert-emails" defaultValue="alertas@ejemplo.com, soporte@ejemplo.com" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="data-retention">Retención de Datos</Label>
                      <Select defaultValue="90">
                        <SelectTrigger>
                          <SelectValue placeholder="Periodo de retención" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">30 días</SelectItem>
                          <SelectItem value="60">60 días</SelectItem>
                          <SelectItem value="90">90 días</SelectItem>
                          <SelectItem value="180">180 días</SelectItem>
                          <SelectItem value="365">365 días</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sampling-rate">Tasa de Muestreo</Label>
                      <Select defaultValue="medium">
                        <SelectTrigger>
                          <SelectValue placeholder="Tasa de muestreo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Baja (1 Hz)</SelectItem>
                          <SelectItem value="medium">Media (5 Hz)</SelectItem>
                          <SelectItem value="high">Alta (10 Hz)</SelectItem>
                          <SelectItem value="ultra">Ultra (20 Hz)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button className="bg-brand-DEFAULT hover:bg-brand-dark">
                      <Settings className="w-4 h-4 mr-2" />
                      Aplicar Configuración
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="alarm">
                  <AlarmPanel sensors={sensors}/>
            </TabsContent>
            <TabsContent value="machines">
              <MachineLocationPanel />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Sensor</DialogTitle>
          </DialogHeader>
          {currentSensor && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Nombre</Label>
                <Input
                  id="edit-name"
                  value={currentSensor.Name}
                  onChange={(e) => setCurrentSensor({ ...currentSensor, Name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-serial">Número serial</Label>
                <Input
                  id="edit-serial"
                  value={currentSensor.Serial}
                  onChange={(e) => setCurrentSensor({ ...currentSensor, Serial: e.target.value })}
                />
              </div>
               <div className="grid gap-2">
                <Label htmlFor="edit-dialog-location">Lugar</Label>
                <Select
                  onValueChange={(value) => {
                    setCurrentSensor({ ...currentSensor, Location: "" }); // Reset machine on location change
                    setAddSensorSelectedLocation(value);
                  }}
                  value={addSensorSelectedLocation || machineToLocationMap.get(currentSensor.Location) || ""}
                >
                  <SelectTrigger id="edit-dialog-location">
                    <SelectValue placeholder="Seleccione un lugar" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((loc) => (
                      <SelectItem key={loc.Name} value={loc.Name}>{loc.Name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-dialog-machine">Máquina</Label>
                <Select
                  onValueChange={(value) => setCurrentSensor({ ...currentSensor, Location: value, })}
                  value={currentSensor.Location || ""}
                  disabled={!addSensorSelectedLocation && !machineToLocationMap.get(currentSensor.Location)}
                >
                  <SelectTrigger id="edit-dialog-machine">
                    <SelectValue placeholder="Seleccione una máquina" />
                  </SelectTrigger>
                  <SelectContent>
                    {(addSensorSelectedLocation ? machines.filter(m => m.Location === addSensorSelectedLocation) : machines)
                      .map((machine) => (
                        <SelectItem key={machine.Name} value={machine.Name}>{machine.Name}</SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-range">Rango</Label>
                <Input
                  id="edit-range"
                  type="number"
                  value={currentSensor.Range}
                  onChange={(e) => setCurrentSensor({ ...currentSensor, Range: parseFloat(e.target.value || "0") })}
                />
              </div>
            </div>
          )}
          <div className="flex justify-end">
            <Button variant="outline" className="mr-2" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button className="bg-brand-DEFAULT hover:bg-brand-dark" onClick={handleEditSensor}>
              Guardar Cambios
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Configuration;
