"use client";

import { useState, useEffect } from "react";
import {
  ChevronRight,
  ChevronDown,
  Cpu,
  Activity,
  Plus,
  Trash2,
  Edit3,
} from "lucide-react";

import sidebarData from "../data/sidebarData.json";

const DashboardSidebarGroup = () => {
  const [data, setData] = useState([]);
  const [openArea, setOpenArea] = useState(null);
  const [openMachine, setOpenMachine] = useState(null);
  const [editMode, setEditMode] = useState(false);

  // Estados para renombrar
  const [editing, setEditing] = useState({ id: null, type: null });
  const [editingValue, setEditingValue] = useState("");

  useEffect(() => {
    setData(sidebarData);
  }, []);

  useEffect(() => {
    localStorage.setItem("sidebarData", JSON.stringify(data));
  }, [data]);

  // ------------------- CRUD -------------------
  const addArea = () => {
    const newArea = { id: Date.now(), name: "Nueva Área", machines: [] };
    setData([...data, newArea]);
    setEditing({ id: newArea.id, type: "area" });
    setEditingValue(newArea.name);
  };

  const addMachine = (areaId) => {
    const newMachine = { id: Date.now(), name: "Nueva Máquina", sensors: [] };
    setData(
      data.map((area) =>
        area.id === areaId
          ? { ...area, machines: [...area.machines, newMachine] }
          : area
      )
    );
    setEditing({ id: newMachine.id, type: "machine" });
    setEditingValue(newMachine.name);
  };

  const addSensor = (areaId, machineId) => {
    const newSensor = "Nuevo Sensor";
    setData(
      data.map((area) =>
        area.id === areaId
          ? {
              ...area,
              machines: area.machines.map((m) =>
                m.id === machineId
                  ? { ...m, sensors: [...m.sensors, newSensor] }
                  : m
              ),
            }
          : area
      )
    );
    setEditing({ id: `${areaId}-${machineId}-${Date.now()}`, type: "sensor" });
    setEditingValue(newSensor);
  };

  const deleteArea = (areaId) => {
    setData(data.filter((area) => area.id !== areaId));
  };

  const deleteMachine = (areaId, machineId) => {
    setData(
      data.map((area) =>
        area.id === areaId
          ? { ...area, machines: area.machines.filter((m) => m.id !== machineId) }
          : area
      )
    );
  };

  const deleteSensor = (areaId, machineId, sensorIdx) => {
    setData(
      data.map((area) =>
        area.id === areaId
          ? {
              ...area,
              machines: area.machines.map((m) =>
                m.id === machineId
                  ? {
                      ...m,
                      sensors: m.sensors.filter((_, i) => i !== sensorIdx),
                    }
                  : m
              ),
            }
          : area
      )
    );
  };

  // Guardar edición
  const saveEditing = (areaId, machineId = null, sensorIdx = null) => {
    setData(
      data.map((area) => {
        if (editing.type === "area" && editing.id === areaId) {
          return { ...area, name: editingValue };
        }
        if (editing.type === "machine" && machineId) {
          return {
            ...area,
            machines: area.machines.map((m) =>
              m.id === machineId ? { ...m, name: editingValue } : m
            ),
          };
        }
        if (editing.type === "sensor" && sensorIdx !== null) {
          return {
            ...area,
            machines: area.machines.map((m) =>
              m.id === machineId
                ? {
                    ...m,
                    sensors: m.sensors.map((s, idx) =>
                      idx === sensorIdx ? editingValue : s
                    ),
                  }
                : m
            ),
          };
        }
        return area;
      })
    );
    setEditing({ id: null, type: null });
    setEditingValue("");
  };

  // ------------------- UI -------------------
  return (
    <div className="w-72 h-screen bg-gray-900 text-white p-4 overflow-y-auto">
      <h2 className="text-lg font-bold mb-4 flex justify-between items-center">
        Sistema de Vibraciones
        <div className="flex gap-2">
          <button
            onClick={() => setEditMode(!editMode)}
            className={`p-1 rounded hover:bg-gray-700 ${
              editMode ? "bg-gray-700 text-yellow-400" : ""
            }`}
            title="Modo edición"
          >
            <Edit3 size={18} />
          </button>
          {editMode && (
            <button
              onClick={addArea}
              className="p-1 rounded hover:bg-gray-700"
              title="Añadir área"
            >
              <Plus size={18} />
            </button>
          )}
        </div>
      </h2>

      <ul>
        {data.map((area) => (
          <li key={area.id} className="mb-2">
            <div className="flex items-center justify-between">
              <button
                onClick={() =>
                  setOpenArea(openArea === area.id ? null : area.id)
                }
                className="flex items-center justify-between w-full px-2 py-2 rounded hover:bg-gray-700"
              >
                <span className="flex items-center gap-2">
                  <Cpu size={18} />
                  {editMode && editing.id === area.id && editing.type === "area" ? (
                    <input
                      type="text"
                      value={editingValue}
                      autoFocus
                      onChange={(e) => setEditingValue(e.target.value)}
                      onBlur={() => saveEditing(area.id)}
                      onKeyDown={(e) => e.key === "Enter" && saveEditing(area.id)}
                      className="bg-gray-800 border-b border-gray-500 outline-none px-1"
                    />
                  ) : (
                    <span
                      onDoubleClick={() =>
                        editMode && setEditing({ id: area.id, type: "area" }) || setEditingValue(area.name)
                      }
                      className={editMode ? "cursor-text hover:underline" : ""}
                    >
                      {area.name}
                    </span>
                  )}
                </span>
                {openArea === area.id ? <ChevronDown /> : <ChevronRight />}
              </button>
              {editMode && (
                <button
                  onClick={() => deleteArea(area.id)}
                  className="p-1 text-red-400 hover:text-red-600"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>

            {openArea === area.id && (
              <ul className="ml-6 mt-1">
                {area.machines.map((machine) => (
                  <li key={machine.id} className="mb-1">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() =>
                          setOpenMachine(
                            openMachine === machine.id ? null : machine.id
                          )
                        }
                        className="flex items-center justify-between w-full px-2 py-1 rounded hover:bg-gray-700"
                      >
                        {editMode &&
                        editing.id === machine.id &&
                        editing.type === "machine" ? (
                          <input
                            type="text"
                            value={editingValue}
                            autoFocus
                            onChange={(e) => setEditingValue(e.target.value)}
                            onBlur={() => saveEditing(area.id, machine.id)}
                            onKeyDown={(e) =>
                              e.key === "Enter" && saveEditing(area.id, machine.id)
                            }
                            className="bg-gray-800 border-b border-gray-500 outline-none px-1"
                          />
                        ) : (
                          <span
                            onDoubleClick={() =>
                              editMode &&
                              setEditing({ id: machine.id, type: "machine" }) ||
                              setEditingValue(machine.name)
                            }
                            className={editMode ? "cursor-text hover:underline" : ""}
                          >
                            {machine.name}
                          </span>
                        )}
                        {openMachine === machine.id ? (
                          <ChevronDown size={16} />
                        ) : (
                          <ChevronRight size={16} />
                        )}
                      </button>
                      {editMode && (
                        <button
                          onClick={() => deleteMachine(area.id, machine.id)}
                          className="p-1 text-red-400 hover:text-red-600"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>

                    {openMachine === machine.id && (
                      <ul className="ml-6 mt-1 text-sm text-gray-300">
                        {machine.sensors.map((sensor, idx) => {
                          const sensorKey = `${area.id}-${machine.id}-${idx}`;
                          return (
                            <li
                              key={sensorKey}
                              className="flex items-center justify-between px-2 py-1 rounded hover:bg-gray-600 cursor-pointer"
                            >
                              <span className="flex items-center gap-2">
                                <Activity size={14} />
                                {editMode &&
                                editing.id === sensorKey &&
                                editing.type === "sensor" ? (
                                  <input
                                    type="text"
                                    value={editingValue}
                                    autoFocus
                                    onChange={(e) => setEditingValue(e.target.value)}
                                    onBlur={() =>
                                      saveEditing(area.id, machine.id, idx)
                                    }
                                    onKeyDown={(e) =>
                                      e.key === "Enter" &&
                                      saveEditing(area.id, machine.id, idx)
                                    }
                                    className="bg-gray-800 border-b border-gray-500 outline-none px-1"
                                  />
                                ) : (
                                  <span
                                    onDoubleClick={() =>
                                      editMode &&
                                      setEditing({
                                        id: sensorKey,
                                        type: "sensor",
                                      }) ||
                                      setEditingValue(sensor)
                                    }
                                    className={
                                      editMode ? "cursor-text hover:underline" : ""
                                    }
                                  >
                                    {sensor}
                                  </span>
                                )}
                              </span>
                              {editMode && (
                                <button
                                  onClick={() =>
                                    deleteSensor(area.id, machine.id, idx)
                                  }
                                  className="p-1 text-red-400 hover:text-red-600"
                                >
                                  <Trash2 size={14} />
                                </button>
                              )}
                            </li>
                          );
                        })}
                        {editMode && (
                          <li>
                            <button
                              onClick={() => addSensor(area.id, machine.id)}
                              className="flex items-center gap-1 text-green-400 hover:text-green-600 px-2 py-1"
                            >
                              <Plus size={14} /> Añadir Sensor
                            </button>
                          </li>
                        )}
                      </ul>
                    )}
                  </li>
                ))}
                {editMode && (
                  <li>
                    <button
                      onClick={() => addMachine(area.id)}
                      className="flex items-center gap-1 text-green-400 hover:text-green-600 px-2 py-1"
                    >
                      <Plus size={14} /> Añadir Máquina
                    </button>
                  </li>
                )}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DashboardSidebarGroup;
