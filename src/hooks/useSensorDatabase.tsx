import { useState, useEffect } from "react";
import supabase from "@/lib/supabase"; 

interface Sensors {
  serial: number;
  place: string;
  state: boolean;
  mac: string;
  alertAlarm: number;
  dangerAlarm: number;
  lapse: number;
}

export function useSupabaseReadings() {
  const [sensors, setSensors] = useState<Sensors[]>([]);
 

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from<"sensorList", Sensors>("sensorList")
        .select("*")
        .order("Time", { ascending: true })
        .limit(100);
        setSensors(data);
    }
    fetchData();
  }, []);

  return { sensors};
}
