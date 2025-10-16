import { useState, useEffect } from "react";
import CreateGraph from "../components/graphs/CreateGraph";
import FFT from "fft.js";
import DashboardSidebarGroup from "../components/layout/DashboardSidebarGroup";
import InteractiveChartTabs from "../components/graphs/OverAllGraph";

const Visualization = () => {
  const [data, setData] = useState([]);
  const [filterDate, setFilterDate] = useState("");
  const [filterTime, setFilterTime] = useState("");

  useEffect(() => {
    fetch("/data.json")
      .then(res => res.json())
      .then(json => setData(json));
  }, []);

  // Filtrado de los datos segun el form
  const filteredData = data.filter(item => {
    const itemDate = item.Time?.split("T")[0];
    return !filterDate || itemDate === filterDate;
  });

  const dataFilter = filteredData.find(item => {
    const hora = item.Time
      ? new Date(item.Time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : "";
    return hora === filterTime;
  });

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

  function integrar(aceleracion, dt) {
    const velocidad = [];
    let suma = 0;
    for (let i = 0; i < aceleracion.length; i++) {
      if (i === 0) {
        suma = 0;
      } else {
        suma += (((aceleracion[i] + aceleracion[i - 1])) / 2) * dt;
      }
      velocidad.push(suma * 9.8);
    }
    return velocidad;
  }

  return (
    <section className="flex p-0 w-full h-screen">
      <DashboardSidebarGroup />
      <div className="w-full h-auto">
      <InteractiveChartTabs data={data} />
      <div className="w-full h-[65rem] p-4 bg-white shadow-lg rounded-lg flex flex-col">
        <section className=" flex gap-5">
          <select onChange={(e) => setFilterTime(e.target.value)} className="mb-4 max-w-52 h-10 p-2 border-gray-400 border-2 rounded">
            <option>-- : -- --</option>
            {filteredData.map((item, index) => {
              const hora = item.Time
                ? new Date(item.Time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : "";
              return (
                <option key={index}>{hora}</option>
              );
            })}
          </select>
          <input type="date" onChange={(e) => setFilterDate(e.target.value)} className="p-2 h-10 border-gray-400 border-2 rounded" />
        </section>
        <section className="w-full h-60 py-10 flex justify-center">
          {/* Grafica de forma de onda en aceleracion */}
          {dataFilter?.X && dataFilter?.Y && dataFilter?.Z ? (
            <CreateGraph data={dataFilter} Samples = {dataFilter.Samples} Fs = {dataFilter.Fs} />
          ) : (
            <p className="text-2xl">Selecciona datos validos en la parte superior</p>
          )}
        </section>
         {/*<section className="w-full h-60 py-36 flex justify-center">
          {dataFilter?.X && dataFilter?.Y && dataFilter?.Z ? (
            <CreateGraph
              X={integrar(dataFilter.X, (1 / dataFilter.Fs))}
              Y={integrar(dataFilter.Y, (1 / dataFilter.Fs))}
              Z={integrar(dataFilter.Z, (1 / dataFilter.Fs))}
              Fs={dataFilter.Fs}
            />
          ) : (
            <p className="text-2xl">
              Selecciona datos válidos en la parte superior
            </p>
          )}
        </section>
        Grafica de FFT 
        <section className="w-full h-60 py-36 flex justify-center ">
          {dataFilter?.X ? (
            <CreateGraph
              X={computeFFT(dataFilter.X)}
              Y={computeFFT(dataFilter.Y)}
              Z={computeFFT(dataFilter.Z)}
              Fs={dataFilter.Fs}
              Samples={dataFilter.Samples}
            />
          ) : (
            <p className="text-2xl">FFT: Selecciona datos válidos</p>
          )}
        </section>*/}
      </div>
    </div>
    </section>
  );
};

export default Visualization;
