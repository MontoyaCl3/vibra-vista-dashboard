import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle, Trash2 } from "lucide-react";

type Machine = {
  Name: string;
  Location: string;
};

type Location = {
  Name: string;
};

const MachineLocationPanel = () => {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [isAddMachineDialogOpen, setIsAddMachineDialogOpen] = useState(false);
  const [newMachine, setNewMachine] = useState<Partial<Machine>>({ Name: "", Location: "" });

  const [locations, setLocations] = useState<Location[]>([]);
  const [isAddLocationDialogOpen, setIsAddLocationDialogOpen] = useState(false);
  const [newLocation, setNewLocation] = useState<Partial<Location>>({ Name: "" });

  const API_MACHINES_BASE = "http://localhost:8080/api/machines";
  const API_LOCATIONS_BASE = "http://localhost:8080/api/locations";

  const fetchMachines = async () => {
    try {
      const res = await fetch(`${API_MACHINES_BASE}/`);
      if (!res.ok) throw new Error(`Error al cargar máquinas: ${res.status}`);
      const data: Machine[] = await res.json();
      setMachines(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchLocations = async () => {
    try {
      const res = await fetch(`${API_LOCATIONS_BASE}/`);
      if (!res.ok) throw new Error(`Error al cargar lugares: ${res.status}`);
      const data: Location[] = await res.json();
      setLocations(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMachines();
    fetchLocations();
  }, []);

  const handleAddLocation = async () => {
    try {
      const res = await fetch(`${API_LOCATIONS_BASE}/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newLocation),
      });
      if (!res.ok) throw new Error(`Error al crear lugar: ${res.status}`);
      await fetchLocations();
      setNewLocation({ Name: "" });
      setIsAddLocationDialogOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteLocation = async (name: string) => {
    try {
      const res = await fetch(`${API_LOCATIONS_BASE}/delete?name=${encodeURIComponent(name)}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(`Error al eliminar lugar: ${res.status}`);
      await fetchLocations();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddMachine = async () => {
    try {
      const res = await fetch(`${API_MACHINES_BASE}/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMachine),
      });
      if (!res.ok) throw new Error(`Error al crear máquina: ${res.status}`);
      await fetchMachines();
      setNewMachine({ Name: "", Location: "" });
      setIsAddMachineDialogOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteMachine = async (name: string) => {
    try {
      const res = await fetch(`${API_MACHINES_BASE}/delete?name=${encodeURIComponent(name)}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(`Error al eliminar máquina: ${res.status}`);
      await fetchMachines();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Locations Card */}
      <Card>
        <CardHeader>
          <CardTitle>Lugares</CardTitle>
          <CardDescription>Administre los lugares donde se encuentran las máquinas.</CardDescription>
        </CardHeader>
        <CardContent>
          <Dialog open={isAddLocationDialogOpen} onOpenChange={setIsAddLocationDialogOpen}>
            <DialogTrigger asChild>
              <Button className="mb-4 bg-blue-600 hover:bg-brand-dark">
                <PlusCircle className="w-4 h-4 mr-2" />
                Agregar Lugar
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Agregar Nuevo Lugar</DialogTitle></DialogHeader>
              <div className="grid gap-4 py-4">
                <Label htmlFor="location-name">Nombre del Lugar</Label>
                <Input id="location-name" value={newLocation.Name} onChange={(e) => setNewLocation({ ...newLocation, Name: e.target.value })} />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddLocationDialogOpen(false)}>Cancelar</Button>
                <Button className="bg-blue-600 hover:bg-brand-dark" onClick={handleAddLocation}>Guardar</Button>
              </div>
            </DialogContent>
          </Dialog>
          <Table>
            <TableHeader><TableRow><TableHead>Nombre</TableHead><TableHead className="text-right">Acciones</TableHead></TableRow></TableHeader>
            <TableBody>
              {locations.map((loc) => (
                <TableRow key={loc.Name}>
                  <TableCell>{loc.Name}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteLocation(loc.Name)}>
                      <Trash2 className="h-4 w-4 text-dashboard-danger" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Machines Card */}
      <Card>
        <CardHeader>
          <CardTitle>Máquinas</CardTitle>
          <CardDescription>Administre las máquinas y su ubicación.</CardDescription>
        </CardHeader>
        <CardContent>
          <Dialog open={isAddMachineDialogOpen} onOpenChange={setIsAddMachineDialogOpen}>
            <DialogTrigger asChild>
              <Button className="mb-4 bg-blue-600 hover:bg-brand-dark">
                <PlusCircle className="w-4 h-4 mr-2" />
                Agregar Máquina
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Agregar Nueva Máquina</DialogTitle></DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="machine-name">Nombre de la Máquina</Label>
                  <Input id="machine-name" value={newMachine.Name} onChange={(e) => setNewMachine({ ...newMachine, Name: e.target.value })} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="machine-location">Lugar</Label>
                  <Select onValueChange={(value) => setNewMachine({ ...newMachine, Location: value })} value={newMachine.Location}>
                    <SelectTrigger><SelectValue placeholder="Seleccione un lugar" /></SelectTrigger>
                    <SelectContent>
                      {locations.map((loc) => (
                        <SelectItem key={loc.Name} value={loc.Name}>{loc.Name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddMachineDialogOpen(false)}>Cancelar</Button>
                <Button className="bg-blue-600 hover:bg-brand-dark" onClick={handleAddMachine}>Guardar</Button>
              </div>
            </DialogContent>
          </Dialog>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Lugar</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {machines.map((machine) => (
                <TableRow key={machine.Name}>
                  <TableCell>{machine.Name}</TableCell>
                  <TableCell>{machine.Location}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteMachine(machine.Name)}>
                      <Trash2 className="h-4 w-4 text-dashboard-danger" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default MachineLocationPanel;