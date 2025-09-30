import { useState, useEffect } from "react";

type UseMeasuresAPIParams = {
  from?: string;
  to?: string;
  getTimes?: boolean;
};

export function useMeasuresAPI({ from, to, getTimes }: UseMeasuresAPIParams) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let url = "";

    if (getTimes) {
      url = "http://localhost:8080/api/measures/history?limit=1000";
    } else if (from && to) {
      url = `http://localhost:8080/api/measures/range?from=${encodeURIComponent(
        from
      )}&to=${encodeURIComponent(to)}`;
    } else {
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Error ${response.status}`);
        }

        const result = await response.json();

        if (getTimes) {
          // extraemos solo las fechas
          const times = result.map((row: any) => row.Time);
          setData(times);
        } else {
          setData(result);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [from, to, getTimes]);

  return { data, loading, error };
}
