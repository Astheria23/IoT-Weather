import { useEffect, useState, useRef } from "react";
import { fetchDashboardStats } from "../services/api.js";

const FALLBACK_INTERVAL = 5000;

export const useDashboardData = (interval = FALLBACK_INTERVAL) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errorCount, setErrorCount] = useState(0);
  const wsRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    let timerId;

    const load = async () => {
      try {
        const response = await fetchDashboardStats();
        const payload = Array.isArray(response.data)
          ? [...response.data].reverse()
          : [];
        if (mounted) {
          setData(payload);
          setError(null);
          setErrorCount(0);
          setLoading(false);
        }
      } catch (err) {
        if (!mounted) return;

        // Naikkan counter error untuk membedakan error sesaat dan error permanen
        setErrorCount((prev) => prev + 1);

        // Jika belum pernah ada data dan ini masih error awal (mis. 1-2x pertama),
        // anggap saja masih dalam proses loading supaya UX lebih halus.
        if (data.length === 0 && errorCount < 2) {
          setLoading(true);
          return;
        }

        // Jika error berulang, baru tampilkan error ke UI
        setError(err);
        setLoading(false);
      }
    };

  load();
  timerId = setInterval(load, interval);

    // setup websocket for realtime updates
    // normalize base URL so we don't end up with double slashes when appending /ws
    const rawBase = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const httpBase = rawBase.replace(/\/+$/, "");
    const wsBase = httpBase.replace(/^http/, "ws");
    const wsUrl = `${wsBase}/ws`;
    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;
      ws.addEventListener("message", (evt) => {
        try {
          const payload = JSON.parse(evt.data);
          // append newest item, keep max 20
          setData((prev) => {
            const next = [...prev, payload];
            if (next.length > 20) return next.slice(next.length - 20);
            return next;
          });
        } catch (e) {
          // ignore malformed messages
        }
      });
      ws.addEventListener("error", () => {
        // ignore; fallback polling remains
      });
    } catch (e) {
      // ignore websocket failures in dev; polling will work
    }

    return () => {
      mounted = false;
      clearInterval(timerId);
      if (wsRef.current) {
        try {
          wsRef.current.close();
        } catch (e) {}
      }
    };
  }, [interval]);

  return { data, loading, error };
};
