import { useState, useEffect } from "react";
import CreateGraph from "../components/graphs/CreateGraph";
import FFT from "fft.js";
import DashboardSidebarGroup from "../components/layout/DashboardSidebarGroup";
import InteractiveChartTabs from "../components/graphs/OverAllGraph";

const Visualization = () => {
  const [data, setData] = useState([]);
  const [filterDate, setFilterDate] = useState("");
  const [filterTime, setFilterTime] = useState("");
  const [selectedSensorSerial, setSelectedSensorSerial] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  console.log(selectedSensorSerial)

  useEffect(() => {
    if (!selectedSensorSerial) {
      setData([]);
      setFetchError(null);
      return;
    }

    setFetchError(null);
    const controller = new AbortController();
    const signal = controller.signal;

    (async () => {
      const url = `http://localhost:8080/api/measures/by-serial?serial=${encodeURIComponent(
        selectedSensorSerial
      )}`;
      console.log("Fetching:", url);
      try {
        const res = await fetch(url, { signal });
        if (!res.ok) {
          const text = await res.text().catch(() => "");
          console.error("Fetch failed:", res.status, res.statusText, text);
          setFetchError(`Error ${res.status}: ${res.statusText}`);
          setData([]);
          return;
        }
        const json = await res.json();
        const safeParseArray = (v) => {
          if (Array.isArray(v)) return v;
          if (typeof v !== "string") return [];
          try {
            return JSON.parse(v);
          } catch {
            // Hola
            const nums = v.match(/-?\d+(\.\d+)?/g);
            return nums ? nums.map(n => Number(n)) : [];
          }
        };

        const normalize = (it) => ({
          ...it,
          X: safeParseArray(it.X),
          Y: safeParseArray(it.Y),
          Z: safeParseArray(it.Z),
          Samples: Number(it.Samples) || it.Samples,
          Fs: Number(it.Fs) || it.Fs,
        });

        setData(Array.isArray(json) ? json.map(normalize) : []);
      } catch (err) {
        if (err.name === "AbortError") return;
        console.error("Fetch error:", err);
        setFetchError(String(err));
        setData([]);
      }
    })();

    return () => controller.abort();
  }, [selectedSensorSerial]);

  // Filtrado de los datos segun el form
  const filteredData = data.filter(item => {
    const itemDate = item.Timestamp ? item.Timestamp.split("T")[0] : item.Time?.split("T")[0];
    return !filterDate || itemDate === filterDate;
  });

  // Si filterTime contiene un timestamp (value del <option>), buscar por ese timestamp exacto.
  // Si no hay filterTime, no se selecciona ningún elemento (puedes cambiar a filteredData[0] si quieres mostrar el primero).
  const dataFilter = filterTime
    ? filteredData.find(item => {
        const ts = item.Timestamp ?? item.Time;
        return ts === filterTime;
      })
    : undefined;
  // console.log({ filterTime, dataFilter });

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

  useEffect(() => {
    // Si no hay fecha, limpiar la hora seleccionada
    if (!filterDate) {
      setFilterTime("");
    }
  }, [filterDate]);

  return (
    <section className="flex p-0 w-full h-screen">
      <DashboardSidebarGroup onSensorClick={(serial) => setSelectedSensorSerial(serial)} />
      <div className="w-full h-auto">
        <InteractiveChartTabs data={data} />
        {/* Mostrar el serial seleccionado (opcional) */}
        <div className="p-2 text-sm text-gray-700">Sensor seleccionado: {selectedSensorSerial ?? "Ninguno"}</div>
        
        <div className="w-auto min-h-[600px] p-4 bg-white shadow-lg rounded-lg flex flex-col">
          <section className=" flex gap-5">
            <select
              value={filterTime}
              onChange={(e) => setFilterTime(e.target.value)}
              disabled={!filterDate}
              className="mb-4 max-w-52 h-10 p-2 border-gray-400 border-2 rounded disabled:opacity-50"
            >
              <option value="">-- : -- --</option>
              {filterDate &&
                filteredData.map((item, index) => {
                  const ts = item.Timestamp ?? item.Time;
                  const hora = ts
                    ? new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                    : "";
                  return (
                    <option key={ts ?? index} value={ts ?? ""}>
                      {hora}
                    </option>
                  );
                })}
            </select>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="p-2 h-10 border-gray-400 border-2 rounded"
            />
          </section>
          <section className="w-full h-60 py-10 flex justify-center">
            {/* Grafica de forma de onda en aceleracion */}
            {dataFilter?.X && dataFilter?.Y && dataFilter?.Z ? (
              <CreateGraph data={dataFilter} Samples = {dataFilter.Samples} Fs = {dataFilter.Fs} />
            ) : (
              <p className="text-2xl">Selecciona datos validos en la parte superior</p>
            )}
          </section>
        </div>
      </div>
    </section>
  );
};

export default Visualization;
