import { useEffect, useState } from "react";

interface GeoLocation {
  country: string;
  regionName: string;
  city: string;
  lat: number;
  lon: number;
  query: string; // IP address
}

export function useGetGeoLocation() {
  const [geoData, setGeoData] = useState<GeoLocation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGeoData = async () => {
      try {
        // Get IP
        const ipRes = await fetch("https://api.ipify.org?format=json");
        const ipData = await ipRes.json();

        // Get GeoLocation
        const geoRes = await fetch(`http://ip-api.com/json/${ipData.ip}`);
        const geoJson = await geoRes.json();

        setGeoData(geoJson);
      } catch (err: any) {
        setError(err.message || "Failed to fetch geo location");
      } finally {
        setLoading(false);
      }
    };

    fetchGeoData();
  }, []);

  return { geoData, loading, error };
}
