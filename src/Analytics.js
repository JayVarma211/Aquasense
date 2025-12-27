import React, { useState, useMemo, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Area
} from "recharts";
import {
  collection,
  addDoc,
  getDocs,
  orderBy,
  limit,
  query,
  serverTimestamp
} from "firebase/firestore";
import { firestore } from "./firebase";
import "./Analytics.css";

/* ===== ALERT THRESHOLDS ===== */
const TEMP_WARNING = 25;
const TEMP_DANGER = 28;
const SOIL_DRY = 40;

export default function Analytics({ setPage }) {
  alert("About to write to Firestore");
  const [range, setRange] = useState(30);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [alertHistory, setAlertHistory] = useState([]);

  /* ===== DUMMY DATA ===== */
  const rawData = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 30 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - (29 - i));
      return {
        date: d.toISOString().split("T")[0],
        label: d.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short"
        }),
        temp: 20 + Math.random() * 10,
        humidity: 40 + Math.random() * 15,
        soil: 35 + Math.random() * 20
      };
    });
  }, []);

  /* ===== FILTERED DATA ===== */
  const chartData = useMemo(() => {
    if (fromDate && toDate) {
      return rawData.filter(
        d => d.date >= fromDate && d.date <= toDate
      );
    }
    return rawData.slice(-range);
  }, [range, fromDate, toDate, rawData]);

  /* ===== ALERT LOGIC ===== */
  const avgTemp =
    chartData.reduce((s, d) => s + d.temp, 0) / chartData.length;

  const avgSoil =
    chartData.reduce((s, d) => s + d.soil, 0) / chartData.length;

  const tempAlert =
    avgTemp >= TEMP_DANGER
      ? { label: "Heat Warning", type: "danger" }
      : avgTemp >= TEMP_WARNING
      ? { label: "Warm Conditions", type: "warning" }
      : { label: "Temperature Normal", type: "good" };

  const soilAlert =
    avgSoil <= SOIL_DRY
      ? { label: "Dry Soil Alert", type: "danger" }
      : { label: "Soil Moisture Normal", type: "good" };

  /* ===== LOAD ALERT HISTORY ===== */
  useEffect(() => {
    const loadAlerts = async () => {
      const q = query(
        collection(firestore, "users", "demoUser", "alerts"),
        orderBy("createdAt", "desc"),
        limit(5)
      );
      const snap = await getDocs(q);
      setAlertHistory(snap.docs.map(d => d.data()));
    };
    loadAlerts();
  }, []);

  /* ===== SAVE ALERT (TEMP FORCE WRITE) ===== */
  useEffect(() => {
    if (!chartData.length) return;

    const saveAlert = async () => {
      const rangeLabel =
        fromDate && toDate
          ? `${fromDate} → ${toDate}`
          : `Last ${range} days`;

      const newEntry = {
        temp: `${tempAlert.label} (${avgTemp.toFixed(1)}°C)`,
        soil: `${soilAlert.label} (${avgSoil.toFixed(1)}%)`,
        severity:
          tempAlert.type === "danger" || soilAlert.type === "danger"
            ? "danger"
            : tempAlert.type === "warning"
            ? "warning"
            : "good",
        range: rangeLabel,
        time: new Date().toLocaleString("en-GB", {
          day: "2-digit",
          month: "short",
          hour: "2-digit",
          minute: "2-digit"
        })
      };

      setAlertHistory(prev => [newEntry, ...prev.slice(0, 4)]);

      try {
        alert("STEP 3A: About to write to Firestore");

        await addDoc(
          collection(firestore, "users", "demoUser", "alerts"),
          { ...newEntry, createdAt: serverTimestamp() }
        );
        alert("STEP 3B: Firestore write SUCCESS ✅");
        console.log("🔥 Firestore write SUCCESS");
      } catch (e) {
        alert("STEP 3C: Firestore write FAILED ❌");
        console.error("❌ Firestore error:", e);
      }
    };

    saveAlert();
  }, [
    range,
    fromDate,
    toDate,
    avgTemp,
    avgSoil,
    chartData.length,
    tempAlert.type,
    soilAlert.type
  ]);

  return (
    <div className="analytics-page">
      {/* ===== TOP BAR ===== */}
      <div className="analytics-top">
        <h1>Analytics</h1>

        <div className="analytics-filters">
          <button
            className={`filter-btn ${range === 7 && !fromDate ? "active" : ""}`}
            onClick={() => {
              setRange(7);
              setFromDate("");
              setToDate("");
            }}
          >
            7 Days
          </button>

          <button
            className={`filter-btn ${range === 30 && !fromDate ? "active" : ""}`}
            onClick={() => {
              setRange(30);
              setFromDate("");
              setToDate("");
            }}
          >
            30 Days
          </button>

          <div className="date-range">
            <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} />
            <span>to</span>
            <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} />
          </div>
        </div>

        <button className="back-btn" onClick={() => setPage("dashboard")}>
          ← Back
        </button>
      </div>

      {/* ===== ALERT HISTORY ===== */}
      <div className="alert-history">
        <h3>Alert History</h3>
        {alertHistory.map((a, i) => (
          <div key={i} className={`alert-history-item ${a.severity}`}>
            <div>
              <strong>🌡 {a.temp}</strong>
              <br />
              <span>🌱 {a.soil}</span>
            </div>
            <div className="alert-meta">
              <span>{a.range}</span>
              <small>{a.time}</small>
            </div>
          </div>
        ))}
      </div>

      {/* ===== CHARTS ===== */}
      <div className="analytics-charts">
        {/* Temperature */}
        <div className="chart-card wide">
          <h3>Temperature Trend</h3>
          <div className="chart-wrapper large">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="label" />
                <YAxis domain={["dataMin - 2", "dataMax + 2"]} />
                <Tooltip />
                <Area dataKey="temp" fill="#12d6c5" fillOpacity={0.25} />
                <Line dataKey="temp" stroke="#12d6c5" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Humidity */}
        <div className="chart-card">
          <h3>Humidity Trend</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Line dataKey="humidity" stroke="#0bbcd6" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Soil */}
        <div className="chart-card">
          <h3>Soil Moisture</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Line dataKey="soil" stroke="#2ecc71" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
