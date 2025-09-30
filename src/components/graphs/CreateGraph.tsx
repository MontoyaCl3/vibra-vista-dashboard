import React from "react";
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";

const CreateGraph = ({ Z, X, Y,Fs = null, Samples = null }) => {
  
  // Resolucion de la frecuencia para la FTT
  const df = (Fs && Samples) ? Fs / Samples : null;

  //Formatea la entrada para Rechart
  const chartData = Z.map((zValue, index) => ({
    name: df ? (index + 1) * df : index + 1, // Si df existe usa frecuencia, si no índice
    zValue: zValue,
    xValue: X?.[index],
    yValue: Y?.[index]
  }));

  //Dibuja la grafica
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="zValue" stroke="#8884d8" name="Eje Z" dot={false}/>
        <Line type="monotone" dataKey="xValue" stroke="#82ca9d" name="Eje X" dot={false}/>
        <Line type="monotone" dataKey="yValue" stroke="#ff7300" name="Eje Y" dot={false}/>
      </LineChart>
    </ResponsiveContainer>
  );
};

export default CreateGraph;
