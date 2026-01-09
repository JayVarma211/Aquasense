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
import { FaMoon, FaSun, FaSignOutAlt } from "react-icons/fa";
import "./Analytics.css";

export default function Analytics({ setPage, theme, setTheme }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

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
    <div className={`analytics-layout ${theme}`}>
      <div className="analytics-header">
        <h1>Real-Time Analytics</h1>
        <div className="header-right">
          <button className="icon-btn" onClick={() => setTheme(t => (t === "dark" ? "light" : "dark"))}>
            {theme === "dark" ? <FaSun /> : <FaMoon />}
          </button>
          <button className="back-btn" onClick={() => setPage("dashboard")}>
            ← Back to Dashboard
          </button>
        </div>
      </div>

      <div className="analytics-charts">
        <Chart title="Temperature (°C)" dataKey="temp" color="#ff6b6b" data={data} />
        <Chart title="Humidity (%)" dataKey="humidity" color="#0bbcd6" data={data} />
        <Chart title="Soil Moisture (%)" dataKey="soil" color="#2ecc71" data={data} />
      </div>
    </div>
  );
}

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
          <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
