import React, { useState } from "react";
import Plot from "react-plotly.js";

const InteractiveChartTabs = ({
  data,
}) => {
  const [activeTab, setActiveTab] = useState("RMS");
  const [axis, setAxis] = useState("Z");

  const axisMap = {
    X: { rms: "Xrms", pk: "Xpk", pp: "Xpp" },
    Y: { rms: "Yrms", pk: "Ypk", pp: "Ypp" },
    Z: { rms: "Zrms", pk: "Zpk", pp: "Zpp" },
  };

  const tabKeyMap = {
    RMS: "rms",
    PEAK: "pk",
    PEAKTOPEAK: "pp",
  };

  const getChartData = () => {
    const key = tabKeyMap[activeTab];
    if (axis === "Todos") {
      return {
        y: [
          { axis: "X", values: data.map(item => item[axisMap.X[key]]) },
          { axis: "Y", values: data.map(item => item[axisMap.Y[key]]) },
          { axis: "Z", values: data.map(item => item[axisMap.Z[key]]) },
        ],
        title: `Aceleración ${activeTab} (Todos los ejes)`,
        yLabel: "Amplitud",
      };
    }
    const axisKeys = axisMap[axis];
    return {
      y: data.map(item => item[axisKeys[key]]),
      title: `Aceleración ${activeTab} (${axis})`,
      yLabel: "Amplitud",
    };
  };

  const { y, title, yLabel } = getChartData();
  // usar timestamps como eje x (fallback a índice si no hay timestamp)
  const x = data.map(item => item.Timestamp ?? item.Time ?? null);
  // si todos x son null, usar índices
  const allNull = x.every(v => v === null);
  const xFinal = allNull ? x.map((_, idx) => idx + 1) : x;

  // Ordenar por fecha cuando haya timestamps válidos para evitar saltos en la línea
  let xSorted = xFinal;
  let ySorted = y;
  if (!allNull) {
    // construir array de índices ordenados por fecha (null => +Infinity)
    const idxs = x.map((val, i) => {
      const t = val ? Date.parse(val) : Infinity;
      return { i, t };
    }).sort((a, b) => a.t - b.t).map(o => o.i);

    xSorted = idxs.map(i => xFinal[i]);

    if (axis === "Todos") {
      // y es [{axis: 'X', values: [...]}, ...]
      ySorted = y.map(series => ({
        axis: series.axis,
        values: idxs.map(i => series.values[i]),
      }));
    } else {
      // y es array simple paralelo a x
      ySorted = idxs.map(i => y[i]);
    }
  }
  
  return (
    <div className="w-full h-[400px] mx-auto bg-white shadow-lg rounded-xl border">
      {/* Tabs */}
      <div className="flex items-center gap-4 px-4 pt-3 border-b">
        <button
          onClick={() => setActiveTab("RMS")}
          className={`pb-2 font-medium ${
            activeTab === "RMS"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500"
          }`}
        >
         RMS
        </button>
        <button
          onClick={() => setActiveTab("PEAK")}
          className={`pb-2 font-medium ${
            activeTab === "PEAK"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500"
          }`}
        >
          PEAK 
        </button>
        <button
          onClick={() => setActiveTab("PEAKTOPEAK")}
          className={`pb-2 font-medium ${
            activeTab === "PEAKTOPEAK"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500"
          }`}
        >
          PEAK TO PEAK
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
                    x: xSorted,
                    y: ySorted[0].values,
                    type: "scatter",
                    mode: "lines+markers",
                    name: "X",
                    marker: { size: 6 },
                    line: { width: 1.2 },
                  },
                  {
                    x: xSorted,
                    y: ySorted[1].values,
                    type: "scatter",
                    mode: "lines+markers",
                    name: "Y",
                    marker: { size: 6 },
                    line: { width: 1.2 },
                  },
                  {
                    x: xSorted,
                    y: ySorted[2].values,
                    type: "scatter",
                    mode: "lines+markers",
                    name: "Z",
                    marker: { size: 6 },
                    line: { width: 1.2 },
                  },
                ]
              : [
                  {
                    x: xSorted,
                    y: ySorted,
                    type: "scatter",
                    mode: "lines+markers",
                    marker: { size: 6 },
                    line: { width: 1.2 },
                  },
                ]
          }
          layout={{
            title: { text: title, font: { size: 18 } },
            xaxis: { title: "Tiempo", type: allNull ? "linear" : "date" },
            // Mostrar unidad G para indicar que los valores son en gravedades
            yaxis: { title: { text: `${yLabel} (G)` } },
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

export default InteractiveChartTabs;
