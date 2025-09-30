
"use client";

import { useState, useEffect } from "react";
import { ChevronRight, ChevronDown, Cpu, Activity } from "lucide-react";

const DashboardSidebarGroup = () => {
  const [data, setData] = useState([]);
  const [openArea, setOpenArea] = useState<string | null>(null);
  const [openMachine, setOpenMachine] = useState<string | null>(null);

  useEffect(() => {
    fetch("/data/sidebarData.json")
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => console.error("Error cargando JSON:", err));
  }, []);

  return (
    <div className="w-72 h-screen bg-gray-900 text-white p-4 overflow-y-auto">
      <h2 className="text-lg font-bold mb-4">Sistema de Vibraciones</h2>
      <ul>
        {data.map((area: any) => (
          <li key={area.id} className="mb-2">
            <button
              onClick={() => setOpenArea(openArea === area.id ? null : area.id)}
              className="flex items-center justify-between w-full px-2 py-2 rounded hover:bg-gray-700"
            >
              <span className="flex items-center gap-2">
                <Cpu size={18} />
                {area.name}
              </span>
              {openArea === area.id ? <ChevronDown /> : <ChevronRight />}
            </button>

            {openArea === area.id && (
              <ul className="ml-6 mt-1">
                {area.machines.map((machine: any) => (
                  <li key={machine.id} className="mb-1">
                    <button
                      onClick={() =>
                        setOpenMachine(openMachine === machine.id ? null : machine.id)
                      }
                      className="flex items-center justify-between w-full px-2 py-1 rounded hover:bg-gray-700"
                    >
                      <span>{machine.name}</span>
                      {openMachine === machine.id ? (
                        <ChevronDown size={16} />
                      ) : (
                        <ChevronRight size={16} />
                      )}
                    </button>

                    {openMachine === machine.id && (
                      <ul className="ml-6 mt-1 text-sm text-gray-300">
                        {machine.sensors.map((sensor: string, idx: number) => (
                          <li
                            key={idx}
                            className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-600 cursor-pointer"
                          >
                            <Activity size={14} />
                            {sensor}
                          </li>
                        ))}
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

