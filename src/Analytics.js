import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";
import { ref, onValue } from "firebase/database";
import { auth, database } from "./firebase";
import { FaMoon, FaSun } from "react-icons/fa";
import "./Analytics.css";

export default function Analytics({ setPage, theme, setTheme }) {
  const [data, setData] = useState([]);

  /* =========================
     THEME PERSISTENCE
  ========================= */
  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  /* =========================
     FETCH SENSOR HISTORY
  ========================= */
  useEffect(() => {
    const unsub = auth.onAuthStateChanged(user => {
      if (!user) return;

      const historyRef = ref(database, `users/${user.uid}/sensorData/history`);

      onValue(historyRef, snap => {
        if (!snap.exists()) return;

        const values = Object.values(snap.val())
          .slice(-20)
          .map(item => ({
            time: new Date(item.timestamp).toLocaleTimeString(),
            temp: item.temp,
            humidity: item.humidity,
            soil: item.soil
          }));

        setData(values);
      });
    });

    return () => unsub();
  }, []);

  return (
    <div className={`analytics-page ${theme === "dark" ? "dark" : ""}`}>
      {/* HEADER */}
      <div className="analytics-header">
        <h1>Real-Time Analytics</h1>

        <div className="header-actions">
          {/* THEME TOGGLE */}
          <button
            className="icon-btn"
            onClick={() => setTheme(t => (t === "dark" ? "light" : "dark"))}
          >
            {theme === "dark" ? <FaSun /> : <FaMoon />}
          </button>

          {/* BACK BUTTON (SAME AS SETTINGS) */}
          <button
            className="back-btn-bootstrap"
            onClick={() => setPage("dashboard")}
          >
            ← Back
          </button>
        </div>
      </div>

      {/* CHARTS */}
      <div className="analytics-charts">
        <Chart title="Temperature (°C)" dataKey="temp" color="#ff6b6b" data={data} />
        <Chart title="Humidity (%)" dataKey="humidity" color="#0bbcd6" data={data} />
        <Chart title="Soil Moisture (%)" dataKey="soil" color="#2ecc71" data={data} />
      </div>
    </div>
  );
}

/* =========================
   CHART COMPONENT
========================= */
function Chart({ title, dataKey, color, data }) {
  return (
    <div className="chart-card">
      <h3>{title}</h3>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={3}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
  