import React from "react";
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { useSupabaseReadings } from "@/hooks/useSupabaseReadings"; // ruta según tu proyecto

const CreateGraph = (props) => {
  const { readings, loading, error } = useSupabaseReadings();
  const colors = {
    sensor1: "#e91a2f",
    sensor2: "#2d3748",
    sensor3: "#38a169",
    sensor4: "#f6ad55",
  };

  if (loading) return <p>Cargando datos...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={readings} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Time" />
        <YAxis label={{ value: "Vibración (mm/s)", angle: -90, position: "insideLeft" }} />
        <Tooltip />
        <Legend />
        {(props.sensor === "all" || props.sensor === "sensor1") && (
          <Line type="monotone" dataKey="Xpk" name="Sensor 1" stroke={colors.sensor1} activeDot={{ r: 8 }} />
        )}
        {(props.sensor === "all" || props.sensor === "sensor2") && (
          <Line type="monotone" dataKey="Ypk" name="Sensor 2" stroke={colors.sensor2} />
        )}
        {(props.sensor === "all" || props.sensor === "sensor3") && (
          <Line type="monotone" dataKey="Zpk" name="Sensor 3" stroke={colors.sensor3} />
        )}
        {/* Si quieres agregar más sensores, ajusta aquí */}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default CreateGraph;
