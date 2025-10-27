import { useState, useEffect } from "react";
import CreateGraph from "../components/graphs/CreateGraph";
import DashboardSidebarGroup from "../components/layout/DashboardSidebarGroup";
import InteractiveChartTabs from "../components/graphs/OverAllGraph";

const Visualization = () => {
  const [overallData, setOverallData] = useState([]); // For InteractiveChartTabs (historical)
  const [dailyData, setDailyData] = useState([]); // For CreateGraph (date-filtered)
  const [filterDate, setFilterDate] = useState("");
  const [filterTime, setFilterTime] = useState<string>("");
  const [selectedSensorSerial, setSelectedSensorSerial] = useState<string | null>(null);
  const [temperatureData, setTemperatureData] = useState([]); // For Temperature data
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dataType, setDataType] = useState("ACELERACION"); // 'ACELERACION' o 'VELOCIDAD'

  // Effect for fetching ALL data for the selected sensor (for InteractiveChartTabs)
  useEffect(() => {
    if (!selectedSensorSerial) {
      setOverallData([]);
        setTemperatureData([]);
      setFetchError(null);
      return;
    }

    const controller = new AbortController();
    const signal = controller.signal;

    (async () => {
      let url = '';
      if (dataType === 'ACELERACION' || dataType === 'VELOCIDAD') {
        url = `http://localhost:8080/api/measures/by-serial?serial=${encodeURIComponent(selectedSensorSerial)}`;
      } else if (dataType === 'TEMPERATURA') {
        url = `http://localhost:8080/api/temperature/serial/${encodeURIComponent(selectedSensorSerial)}`;
      }

      if (!url) return;
      try {
        const res = await fetch(url, { signal });
        if (!res.ok) throw new Error(`Error ${res.status}: No se pudieron cargar los datos históricos.`);
        const json = await res.json();
        if (dataType === 'TEMPERATURA') {
          setTemperatureData(Array.isArray(json) ? json : []);
        } else {
          setOverallData(Array.isArray(json) ? json : []);
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          setFetchError("Error al cargar el historial del sensor.");
        }
      }
    })();

    return () => controller.abort();
  }, [selectedSensorSerial, dataType]);

  // Effect for fetching data for a specific DATE (for CreateGraph)
  useEffect(() => {
    // No fetch if date is not selected, unless you want to show all data initially
    if (!filterDate) {
      setDailyData([]);
      return;
    }

    setFetchError(null);
    setIsLoading(true);
    const controller = new AbortController();
    const signal = controller.signal;

    (async () => {
      // Pass date to the API
      let url = `http://localhost:8080/api/measures/by-serial?serial=${encodeURIComponent(selectedSensorSerial!)}`;
      if (filterDate) {
        url += `&date=${filterDate}`;
      }
      console.log("Fetching:", url);
      try {
        const res = await fetch(url, { signal });
        if (!res.ok) {
          const text = await res.text().catch(() => "");
          console.error("Fetch failed:", res.status, res.statusText, text);
          setFetchError(`Error ${res.status}: No se pudieron cargar los datos.`);
          setDailyData([]); // Clear data on error
          return;
        }
        const json = await res.json();
        const safeParseArray = (v) => {
          if (Array.isArray(v)) return v;
          if (typeof v !== "string") return [];
          try {
            return JSON.parse(v);
          } catch {
            const nums = v.match(/-?\d+(\.\d+)?/g);
            return nums ? nums.map(n => Number(n)) : [];
          }
        };

        const normalize = (it) => ({
          ...it,
          X: safeParseArray(it.X),
          Y: safeParseArray(it.Y),
          Z: safeParseArray(it.Z),
          VelZ: safeParseArray(it.VelZ),
          VelY: safeParseArray(it.VelY),
          VelX: safeParseArray(it.VelX),
          Samples: Number(it.Samples) || it.Samples,
          Fs: Number(it.Fs) || it.Fs,
        });

        setDailyData(Array.isArray(json) ? json.map(normalize) : []);
      } catch (err) {
        if (err.name === "AbortError") return;
        console.error("Fetch error:", err.message);
        setFetchError("Error de conexión al intentar obtener los datos.");
        setDailyData([]);
      } finally {
        setIsLoading(false);
      }
    })();

    return () => controller.abort();
  }, [selectedSensorSerial, filterDate]); // This effect depends on both

  // The data is now pre-filtered by the backend based on `filterDate`.
  // `filteredData` is just `data`.
  const filteredData = dailyData;

  // Si filterTime contiene un timestamp (value del <option>), buscar por ese timestamp exacto.
  // Si no hay filterTime, no se selecciona ningún elemento (puedes cambiar a filteredData[0] si quieres mostrar el primero).
  const dataFilter = filterTime
    ? filteredData.find(item => {
        // Use the exact timestamp for matching
        const ts = item.Timestamp ?? item.Time; 
        return ts === filterTime;
      })
    : undefined;
  // console.log({ filterTime, dataFilter });


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
        <div className="w-full bg-white shadow-lg rounded-xl border">
          <div className="flex justify-end items-center p-2 border-b">
            {/* Selector para Aceleración/Velocidad movido aquí */}
            <div className="flex items-center gap-4">
              <label htmlFor="dataTypeSelect" className="font-medium text-gray-700">Tipo de Medida:</label>
              <select
                id="dataTypeSelect"
                value={dataType}
                onChange={e => setDataType(e.target.value)}
                className="border rounded px-2 py-1 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ACELERACION">Aceleración</option>
                <option value="VELOCIDAD">Velocidad</option>
                <option value="TEMPERATURA">Temperatura</option>
              </select>
            </div>
          </div>
           <InteractiveChartTabs 
            key={`${selectedSensorSerial}-${dataType}`} 
            data={dataType === 'TEMPERATURA' ? temperatureData : overallData} 
            dataType={dataType} 
          />
        </div>
        {/* Mostrar el serial seleccionado (opcional) */}
        <div className="p-2 text-sm text-gray-700">Sensor seleccionado: {selectedSensorSerial ?? "Ninguno"}</div>

        {dataType !== 'TEMPERATURA' && (
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
                    const ts = item.Timestamp ?? item.Time; // Use the exact timestamp as value
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
                onChange={(e) => {
                  setFilterDate(e.target.value);
                  setFilterTime(""); // Reset time when date changes
                }}
                className="p-2 h-10 border-gray-400 border-2 rounded"
              />
            </section>
              <section className="w-full h-60 py-10 flex justify-center">
                {/* Grafica de forma de onda en aceleracion */}
                {isLoading ? (
                  <p className="text-2xl">Cargando datos...</p>
                ) : fetchError ? (
                  <p className="text-2xl text-red-500">{fetchError}</p>
                ) : dataFilter?.X && dataFilter?.Y && dataFilter?.Z ? (
                  <CreateGraph 
                    data={dataFilter} 
                    Samples = {dataFilter.Samples} 
                    Fs = {dataFilter.Fs} 
                    
                  />
                ) : (
                  <p className="text-2xl">Selecciona un sensor y una fecha para ver los datos.</p>
                )}
              </section>
          </div>
        )}
      </div>
    </section>
  );
};

export default Visualization;
