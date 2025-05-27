import { useState, useEffect } from "react";
import supabase from "@/lib/supabase"; // tu cliente supabase configurado

interface Reading {
  ID: number;
  Serial: number;
  Time: string;
  Xpk: number;
  Xpp: number;
  Xrms: number;
  Ypk: number;
  Ypp: number;
  Yrms: number;
  Zpk: number;
  Zpp: number;
  Zrms: number;
}

export function useSupabaseReadings() {
  const [readings, setReadings] = useState<Reading[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const { data, error } = await supabase
        .from<"vibration_data", Reading>("vibration_data")
        .select("*")
        .order("Time", { ascending: true })
        .limit(100);

      if (error) {
        setError(error.message);
      } else if (data) {
        setReadings(data);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  return { readings, loading, error };
}
