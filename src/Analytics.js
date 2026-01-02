import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from "recharts";
import "./Analytics.css";

const UPDATE_INTERVAL = 10000; // 10 seconds
const MAX_POINTS = 20; // Keep last 20 data points

export default function Analytics({ setPage }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Initialize with some historical data
    const now = Date.now();
    const initialData = Array.from({ length: 10 }, (_, i) => ({
      time: now - (10 - i) * UPDATE_INTERVAL,
      temp: 20 + Math.random() * 10,
      humidity: 40 + Math.random() * 20,
      soil: 30 + Math.random() * 30
    }));
    setData(initialData);

    // Update data every 10 seconds
    const interval = setInterval(() => {
      const newPoint = {
        time: Date.now(),
        temp: 20 + Math.random() * 10,
        humidity: 40 + Math.random() * 20,
        soil: 30 + Math.random() * 30
      };

      setData(prev => {
        const updated = [...prev, newPoint];
        // Keep only last MAX_POINTS
        return updated.slice(-MAX_POINTS);
      });
    }, UPDATE_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
  };

  return (
    <div className="analytics-page">
      <div className="analytics-top">
        <h1>Real-Time Analytics</h1>
        <button className="back-btn" onClick={() => setPage("dashboard")}>
          <span className="back-icon">←</span> Back
        </button>
      </div>

      <div className="analytics-charts">
        <Chart 
          title="Temperature (°C)" 
          dataKey="temp" 
          color="#ff6b6b"
          data={data}
          formatTime={formatTime}
          domain={[15, 35]}
        />
        <Chart 
          title="Humidity (%)" 
          dataKey="humidity" 
          color="#0bbcd6"
          data={data}
          formatTime={formatTime}
          domain={[30, 70]}
        />
        <Chart 
          title="Soil Moisture (%)" 
          dataKey="soil" 
          color="#2ecc71"
          data={data}
          formatTime={formatTime}
          domain={[20, 70]}
          wide
        />
      </div>
    </div>
  );
}

function Chart({ title, dataKey, color, data, formatTime, domain, wide }) {
  return (
    <div className={`chart-card ${wide ? "wide" : ""}`}>
      <h3>{title}</h3>
      <div className={`chart-wrapper ${wide ? "large" : ""}`}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
            <XAxis
              dataKey="time"
              tickFormatter={formatTime}
              stroke="#666"
              style={{ fontSize: "0.75rem" }}
            />
            <YAxis 
              domain={domain}
              stroke="#666"
              style={{ fontSize: "0.75rem" }}
            />
            <Tooltip
              labelFormatter={formatTime}
              contentStyle={{
                background: "white",
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "8px 12px"
              }}
              formatter={(value) => [value.toFixed(2), title.split(" ")[0]]}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              strokeWidth={3}
              dot={{ fill: color, r: 4 }}
              activeDot={{ r: 6 }}
              animationDuration={800}
              animationEasing="ease-in-out"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}