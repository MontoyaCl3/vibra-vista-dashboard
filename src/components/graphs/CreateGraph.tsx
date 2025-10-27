import React, { useState } from "react";
import Plot from "react-plotly.js";
import FFT from "fft.js";

const CreateGraph = ({
  data, Samples, Fs
}) => {
  const [tab, setTab] = useState("ACELERACION");
  const [axis, setAxis] = useState("Z");
  const df = Fs/Samples
  console.log(df)

  // Calcula FFT
  function nextPowerOfTwo(n) {
    return Math.pow(2, Math.ceil(Math.log2(n)));
  }
  function computeFFT(arr) {
    if (!arr || arr.length === 0) return [];
    const N = nextPowerOfTwo(arr.length);
    const fft = new FFT(N);
    const input = new Array(N).fill(0);
    const output = new Array(N).fill(0);
    for (let i = 0; i < arr.length; i++) input[i] = arr[i];
    fft.realTransform(output, input);
    fft.completeSpectrum(output);
    const mag = [];
    for (let i = 0; i < N / 2; i++) {
      const re = output[2 * i];
      const im = output[2 * i + 1];
      mag.push(Math.sqrt(re * re + im * im));
    }
    return mag;
  }

  const velocityAxisMap = {
    X: "VelX",
    Y: "VelY",
    Z: "VelZ",
  };

  // Obtiene los datos para graficar según pestaña y eje
  const getChartData = () => {
    let values;
    let title = "";
    let yLabel = "";
    if (tab === "ACELERACION") {
      if (axis === "Todos") {
        return {
          series: [
            { axis: "X", values: data.X },
            { axis: "Y", values: data.Y },
            { axis: "Z", values: data.Z },
          ],
          title: `Aceleración (Todos los ejes)`,
          yLabel: "Aceleración (m/s²)",
        };
      }
      values = data[axis];
      title = `Aceleración (${axis})`;
      yLabel = "Aceleración (m/s²)";
    } else if (tab === "VELOCIDAD") {
      if (axis === "Todos") {
        return {
          series: [
            { axis: "X", values: data.VelX },
            { axis: "Y", values: data.VelY },
            { axis: "Z", values: data.VelZ },
          ],
          title: `Velocidad (Todos los ejes)`,
          yLabel: "Velocidad (m/s)",
        };
      }
      values = data[velocityAxisMap[axis]];
      title = `Velocidad (${axis})`;
      yLabel = "Velocidad (m/s)";
    } else if (tab === "FFT") {
      if (axis === "Todos") {
        return {
          series: [
            { axis: "X", values: computeFFT(data.X) },
            { axis: "Y", values: computeFFT(data.Y) },
            { axis: "Z", values: computeFFT(data.Z) },
          ],
          title: `FFT (Todos los ejes)`,
          yLabel: "Magnitud FFT",
        };
      }
      values = computeFFT(data[axis]);
      title = `FFT (${axis})`;
      yLabel = "Magnitud FFT";
    }
    return { values, title, yLabel };
  };

  const chartData = getChartData();

  // Decide comportamiento gráfico según cantidad de puntos
  const pointCount =
    tab === "FFT"
      ? axis === "Todos"
        ? (chartData.series?.[0]?.values?.length || 0)
        : (chartData.values?.length || 0)
      : axis === "Todos"
      ? (chartData.series?.[0]?.values?.length || 0)
      : (chartData.values?.length || 0);

  // Si hay muchos puntos, no mostrar markers y hacer la línea más delgada
  const showMarkers = pointCount <= 500;
  const markerSize = showMarkers ? 5 : 1.5;
  const lineWidth = pointCount > 4000 ? 0.6 : pointCount > 2000 ? 1 : 1.6;
  const plotMode = showMarkers ? "lines+markers" : "lines";

  const x =
    tab === "FFT"
      ? axis === "Todos"
        ? chartData.series[0].values.map((_, idx) => idx * df)
        : chartData.values.map((_, idx) => (idx+1) * df)
      : axis === "Todos"
      ? chartData.series[0].values.map((_, idx) => idx + 1)
      : chartData.values.map((_, idx) => idx + 1);

  return (
    <div className="w-full h-[400px] mx-auto bg-white shadow-lg rounded-xl border">
      {/* Tabs */}
      <div className="flex items-center gap-4 px-4 pt-3 border-b">
        <button
          onClick={() => setTab("ACELERACION")}
          className={`pb-2 font-medium ${
            tab === "ACELERACION"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500"
          }`}
        >
          ACELERACION
        </button>
        <button
          onClick={() => setTab("VELOCIDAD")}
          className={`pb-2 font-medium ${
            tab === "VELOCIDAD"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500"
          }`}
        >
          VELOCIDAD
        </button>
        <button
          onClick={() => setTab("FFT")}
          className={`pb-2 font-medium ${
            tab === "FFT"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500"
          }`}
        >
          FFT
        </button>
        {/* Dropdown para elegir el eje */}
        <div className="ml-auto">
          <select
            value={axis}
            onChange={e => setAxis(e.target.value)}
            className="border rounded px-2 py-1 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="X">Eje X</option>
            <option value="Y">Eje Y</option>
            <option value="Z">Eje Z</option>
            <option value="Todos">Todos</option>
          </select>
        </div>
      </div>
      {/* Plot */}
      <div className="p-4">
        <Plot
          data={
            axis === "Todos"
              ? [
                  {
                    x: x,
                    y: chartData.series[0].values,
                    type: "scatter",
                    mode: plotMode,
                    name: "X",
                    marker: { size: markerSize, opacity: 0.7 },
                    line: { width: lineWidth },
                  },
                  {
                    x: x,
                    y: chartData.series[1].values,
                    type: "scatter",
                    mode: plotMode,
                    name: "Y",
                    marker: { size: markerSize, opacity: 0.7 },
                    line: { width: lineWidth },
                  },
                  {
                    x: x,
                    y: chartData.series[2].values,
                    type: "scatter",
                    mode: plotMode,
                    name: "Z",
                    marker: { size: markerSize, opacity: 0.7 },
                    line: { width: lineWidth },
                  },
                ]
              : [
                  {
                    x: x,
                    y: chartData.values,
                    type: "scatter",
                    mode: plotMode,
                    name: axis,
                    marker: { size: markerSize, opacity: 0.8 },
                    line: { width: lineWidth },
                  },
                ]
          }
          layout={{
            title: { text: chartData.title, font: { size: 18 } },
            xaxis: {
              title: tab === "FFT" ? "Frecuencia (Hz)" : "Número de muestra",
              type: tab === "FFT" ? "linear" : "linear",
            },
            yaxis: {
              title: {
                text:
                  tab === "ACELERACION"
                    ? `${chartData.yLabel} (G)`
                    : tab === "VELOCIDAD"
                    ? `${chartData.yLabel}`
                    : chartData.yLabel,
              },
            },
            autosize: true,
            margin: { l: 60, r: 30, b: 50, t: 50 },
          }}
          config={{
            responsive: true,
            scrollZoom: true,
            displayModeBar: true,
          }}
          style={{ width: "100%", height: "300px" }}
        />
      </div>
    </div>
  );
};

export default CreateGraph;
