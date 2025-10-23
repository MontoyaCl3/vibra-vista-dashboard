"use client";

import { useState, useEffect } from "react";
import { ChevronRight, ChevronDown, Cpu, Activity } from "lucide-react";

type Props = {
  onSensorClick?: (serial: string) => void;
};

type Sensor = {
  Name: string;
  Serial: string;
};

type Machine = {
  Name: string;
  sensors: Sensor[];
};

type Location = {
  Name: string;
  machines: Machine[];
};

const DashboardSidebarGroup = ({ onSensorClick }: Props) => {
  const [data, setData] = useState<Location[]>([]);
  const [openLocation, setOpenLocation] = useState<string | null>(null);
  const [openMachine, setOpenMachine] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [locationsRes, machinesRes, sensorsRes] = await Promise.all([
          fetch("http://localhost:8080/api/locations/"),
          fetch("http://localhost:8080/api/machines/"),
          fetch("http://localhost:8080/api/sensors/"),
        ]);

        if (!locationsRes.ok || !machinesRes.ok || !sensorsRes.ok) {
          console.error("Error fetching data");
          return;
        }

        const locations: { Name: string }[] = await locationsRes.json();
        const machines: { Name: string; Location: string }[] = await machinesRes.json();
        const sensors: { Name: string; Serial: string; Location: string }[] = await sensorsRes.json();

        const sensorsByMachine: Record<string, Sensor[]> = {};
        for (const sensor of sensors) {
          if (!sensorsByMachine[sensor.Location]) {
            sensorsByMachine[sensor.Location] = [];
          }
          sensorsByMachine[sensor.Location].push({ Name: sensor.Name, Serial: sensor.Serial });
        }

        const machinesByLocation: Record<string, Machine[]> = {};
        for (const machine of machines) {
          if (!machinesByLocation[machine.Location]) {
            machinesByLocation[machine.Location] = [];
          }
          machinesByLocation[machine.Location].push({
            Name: machine.Name,
            sensors: sensorsByMachine[machine.Name] || [],
          });
        }

        const structuredData: Location[] = locations.map(loc => ({
          Name: loc.Name,
          machines: machinesByLocation[loc.Name] || [],
        }));

        setData(structuredData);
      } catch (error) {
        console.error("Failed to process sidebar data:", error);
      }
    };

    fetchData();
  }, []);

  // ------------------- UI -------------------
  return (
    <div className="w-72 h-[1040px] min-h-full bg-gray-900 text-white p-4 overflow-y-auto">
      <h2 className="text-lg font-bold mb-4 flex justify-between items-center">
        Sistema de Vibraciones
      </h2>

      <ul>
        {data.map((location) => (
          <li key={location.Name} className="mb-2">
            <div className="flex items-center justify-between">
              <button
                onClick={() =>
                  setOpenLocation(openLocation === location.Name ? null : location.Name)
                }
                className="flex items-center justify-between w-full px-2 py-2 rounded hover:bg-gray-700"
              >
                <span className="flex items-center gap-2">
                  <Cpu size={18} />
                  <span>{location.Name}</span>
                </span>
                {openLocation === location.Name ? <ChevronDown /> : <ChevronRight />}
              </button>
            </div>

            {openLocation === location.Name && (
              <ul className="ml-6 mt-1">
                {location.machines.map((machine) => (
                  <li key={machine.Name} className="mb-1">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() =>
                          setOpenMachine(
                            openMachine === machine.Name ? null : machine.Name
                          )
                        }
                        className="flex items-center justify-between w-full px-2 py-1 rounded hover:bg-gray-700"
                      >
                        <span>{machine.Name}</span>
                        {openMachine === machine.Name ? (
                          <ChevronDown size={16} />
                        ) : (
                          <ChevronRight size={16} />
                        )}
                      </button>
                    </div>

                    {openMachine === machine.Name && (
                      <ul className="ml-6 mt-1 text-sm text-gray-300">
                        {machine.sensors.map((sensor, idx) => {
                          const sensorKey = `${location.Name}-${machine.Name}-${idx}`;
                          return (
                            <li
                              key={sensorKey}
                              className="flex items-center justify-between px-2 py-1 rounded hover:bg-gray-600 cursor-pointer"
                            >
                              <span className="flex items-center gap-2">
                                <Activity size={14} />
                                <span
                                  onClick={() => onSensorClick?.(sensor.Serial)}
                                  className="cursor-pointer hover:underline"
                                  title="Seleccionar sensor"
                                >
                                  {sensor.Name} ({sensor.Serial})
                                </span>
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DashboardSidebarGroup;
