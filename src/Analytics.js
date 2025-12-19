import React, { useEffect, useState } from "react";
import "./Analytics.css";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

export default function Analytics({ sensorHistory = [], setPage }) {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  );

  // Sync theme with Dashboard changes
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) setTheme(storedTheme);
  }, []);

  // Extract historical arrays
  const labels = sensorHistory.map((d) =>
    new Date(d.timestamp * 1000).toLocaleTimeString()
  );

  const tempData = sensorHistory.map((d) => d.temperature);
  const humidityData = sensorHistory.map((d) => d.humidity);
  const soilData = sensorHistory.map((d) => d.soil_moisture_level);

  return (
    <div className={`analytics-container ${theme === "dark" ? "dark-mode" : ""}`}>
      
      {/* HEADER BAR */}
      <div className="analytics-header">
        <button className="back-btn" onClick={() => setPage("dashboard")}>
          ⬅ Back
        </button>
        <div>
          <h1>Analytics</h1>
          <p>Historical trends & insights</p>
        </div>
      </div>

      {/* GRID OF GRAPHS */}
      <div className="charts-grid">

        {/* TEMPERATURE */}
        <div className="chart-card">
          <h2>🌡 Temperature Trends</h2>
          <Line
            data={{
              labels,
              datasets: [
                {
                  label: "Temperature (°C)",
                  data: tempData,
                  borderColor: "#ff7b00",
                  backgroundColor: "rgba(255, 123, 0, 0.25)",
                  tension: 0.35,
                  borderWidth: 3,
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
            }}
          />
        </div>

        {/* HUMIDITY */}
        <div className="chart-card">
          <h2>💧 Humidity Levels</h2>
          <Line
            data={{
              labels,
              datasets: [
                {
                  label: "Humidity (%)",
                  data: humidityData,
                  borderColor: "#2196f3",
                  backgroundColor: "rgba(33, 150, 243, 0.25)",
                  tension: 0.35,
                  borderWidth: 3,
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
            }}
          />
        </div>

        {/* SOIL */}
        <div className="chart-card">
          <h2>🌱 Soil Moisture</h2>
          <Line
            data={{
              labels,
              datasets: [
                {
                  label: "Soil Moisture (%)",
                  data: soilData,
                  borderColor: "#4caf50",
                  backgroundColor: "rgba(76, 175, 80, 0.25)",
                  tension: 0.35,
                  borderWidth: 3,
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
            }}
          />
        </div>

      </div>
    </div>
  );
}
