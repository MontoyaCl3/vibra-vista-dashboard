
import { useState } from "react";
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

// Mock data for sensors
const initialSensors = [
  { id: 1, name: "Sensor 1", location: "Área A", macAddress: "AA:BB:CC:DD:EE:01", threshold: 6.2, interval: 5 },
  { id: 2, name: "Sensor 2", location: "Área B", macAddress: "AA:BB:CC:DD:EE:02", threshold: 6.2, interval: 10 },
  { id: 3, name: "Sensor 3", location: "Área C", macAddress: "AA:BB:CC:DD:EE:03", threshold: 6.2, interval: 5 },
  { id: 4, name: "Sensor 4", location: "Área D", macAddress: "AA:BB:CC:DD:EE:04", threshold: 6.2, interval: 15 },
  { id: 5, name: "Sensor 5", location: "Área E", macAddress: "AA:BB:CC:DD:EE:05", threshold: 6.2, interval: 10 },
  { id: 6, name: "Sensor 6", location: "Área F", macAddress: "AA:BB:CC:DD:EE:06", threshold: 6.2, interval: 5 },
];

const Configuration = () => {
  const [sensors, setSensors] = useState(initialSensors);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentSensor, setCurrentSensor] = useState<any>(null);
  const [newSensor, setNewSensor] = useState({
    name: "",
    location: "",
    macAddress: "",
    threshold: 50,
    interval: 5
  });

  const handleAddSensor = () => {
    const id = sensors.length > 0 ? Math.max(...sensors.map(s => s.id)) + 1 : 1;
    setSensors([...sensors, { id, ...newSensor }]);
    setNewSensor({
      name: "",
      location: "",
      macAddress: "",
      threshold: 50,
      interval: 5
    });
    setIsAddDialogOpen(false);
  };

  const handleEditSensor = () => {
    if (currentSensor) {
      setSensors(sensors.map(sensor => 
        sensor.id === currentSensor.id ? currentSensor : sensor
      ));
      setIsEditDialogOpen(false);
    }
  };

  const handleDeleteSensor = (id: number) => {
    setSensors(sensors.filter(sensor => sensor.id !== id));
  };

  const openEditDialog = (sensor: any) => {
    setCurrentSensor({ ...sensor });
    setIsEditDialogOpen(true);
  };

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
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-brand-DEFAULT hover:bg-brand-dark">
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
                    value={newSensor.name}
                    onChange={(e) => setNewSensor({ ...newSensor, name: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="location">Ubicación</Label>
                  <Input
                    id="location"
                    value={newSensor.location}
                    onChange={(e) => setNewSensor({ ...newSensor, location: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="macAddress">Dirección MAC</Label>
                  <Input
                    id="macAddress"
                    value={newSensor.macAddress}
                    onChange={(e) => setNewSensor({ ...newSensor, macAddress: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="threshold">Umbral de Alerta (Hz)</Label>
                  <Input
                    id="threshold"
                    type="number"
                    value={newSensor.threshold}
                    onChange={(e) => setNewSensor({ ...newSensor, threshold: parseInt(e.target.value) })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="interval">Intervalo de Lectura (min)</Label>
                  <Select 
                    value={newSensor.interval.toString()}
                    onValueChange={(value) => setNewSensor({ ...newSensor, interval: parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar intervalo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 minuto</SelectItem>
                      <SelectItem value="5">5 minutos</SelectItem>
                      <SelectItem value="10">10 minutos</SelectItem>
                      <SelectItem value="15">15 minutos</SelectItem>
                      <SelectItem value="30">30 minutos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end">
                <Button variant="outline" className="mr-2" onClick={() => setIsAddDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button className="bg-brand-DEFAULT hover:bg-brand-dark" onClick={handleAddSensor}>
                  Guardar
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="list">
            <TabsList>
              <TabsTrigger value="list">Lista de Sensores</TabsTrigger>
              <TabsTrigger value="mqtt">Configuración MQTT</TabsTrigger>
              <TabsTrigger value="system">Configuración del Sistema</TabsTrigger>
            </TabsList>
            <TabsContent value="list">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Ubicación</TableHead>
                    <TableHead>Dirección MAC</TableHead>
                    <TableHead>Umbral (Hz)</TableHead>
                    <TableHead>Intervalo</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sensors.map((sensor) => (
                    <TableRow key={sensor.id}>
                      <TableCell>{sensor.name}</TableCell>
                      <TableCell>{sensor.location}</TableCell>
                      <TableCell className="font-mono text-sm">{sensor.macAddress}</TableCell>
                      <TableCell>{sensor.threshold} Hz</TableCell>
                      <TableCell>{sensor.interval} min</TableCell>
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
                          onClick={() => handleDeleteSensor(sensor.id)}
                        >
                          <Trash2 className="h-4 w-4 text-dashboard-danger" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
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
                  value={currentSensor.name}
                  onChange={(e) => setCurrentSensor({ ...currentSensor, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-location">Ubicación</Label>
                <Input
                  id="edit-location"
                  value={currentSensor.location}
                  onChange={(e) => setCurrentSensor({ ...currentSensor, location: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-macAddress">Dirección MAC</Label>
                <Input
                  id="edit-macAddress"
                  value={currentSensor.macAddress}
                  onChange={(e) => setCurrentSensor({ ...currentSensor, macAddress: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-threshold">Umbral de Alerta (Hz)</Label>
                <Input
                  id="edit-threshold"
                  type="number"
                  value={currentSensor.threshold}
                  onChange={(e) => setCurrentSensor({ ...currentSensor, threshold: parseInt(e.target.value) })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-interval">Intervalo de Lectura (min)</Label>
                <Select 
                  value={currentSensor.interval.toString()}
                  onValueChange={(value) => setCurrentSensor({ ...currentSensor, interval: parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar intervalo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 minuto</SelectItem>
                    <SelectItem value="5">5 minutos</SelectItem>
                    <SelectItem value="10">10 minutos</SelectItem>
                    <SelectItem value="15">15 minutos</SelectItem>
                    <SelectItem value="30">30 minutos</SelectItem>
                  </SelectContent>
                </Select>
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
