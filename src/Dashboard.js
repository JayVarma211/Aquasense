import React, { useEffect, useState, useRef } from "react";
import "./Dashboard.css";
import {
  FaMoon,
  FaSun,
  FaSignOutAlt,
  FaBars,
  FaBell,
  FaCog,
  FaChartLine,
  FaHome
} from "react-icons/fa";
import { ref, onValue, set, push } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import { auth, database } from "./firebase";

export default function Dashboard({ setUser, setPage }) {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light"
  );
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 900);
  const [data, setData] = useState(null);

  const pushIntervalRef = useRef(null);
  const currentUidRef = useRef(null);

  /* =========================
     AUTH + LIVE SENSOR DATA
  ========================= */
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        clearInterval(pushIntervalRef.current);
        pushIntervalRef.current = null;
        currentUidRef.current = null;
        setData(null);
        return;
      }

      const uid = user.uid;
      currentUidRef.current = uid;

      const latestRef = ref(database, `users/${uid}/sensorData/latest`);

      const unsubDb = onValue(latestRef, (snap) => {
        if (snap.exists()) {
          setData(snap.val());
        } else {
          setData({ temp: 0, humidity: 0, soil: 0 });
        }
      });

      if (!pushIntervalRef.current) {
        pushIntervalRef.current = setInterval(() => {
          const sensorData = {
            temp: Math.floor(20 + Math.random() * 10),
            humidity: Math.floor(40 + Math.random() * 20),
            soil: Math.floor(30 + Math.random() * 30),
            timestamp: Date.now()
          };

          set(ref(database, `users/${uid}/sensorData/latest`), sensorData);
          push(ref(database, `users/${uid}/sensorData/history`), sensorData);
        }, 5000);
      }

      return () => unsubDb();
    });

    return () => {
      clearInterval(pushIntervalRef.current);
      unsubAuth();
    };
  }, []);

  /* =========================
     SAFE VALUES
  ========================= */
  const temp = data?.temp ?? 0;
  const humidity = data?.humidity ?? 0;
  const soil = data?.soil ?? 0;
  const rain = temp > 25 && humidity > 70;

  /* =========================
     UI CONTROLS
  ========================= */
  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const resize = () => setSidebarOpen(window.innerWidth > 900);
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const toggleTheme = () =>
    setTheme((t) => (t === "dark" ? "light" : "dark"));

  const toggleSidebar = () =>
    setSidebarOpen((s) => !s);

  const handleLogout = () => {
    clearInterval(pushIntervalRef.current);
    localStorage.clear();
    setUser(null);
    setPage("login");
  };

  if (!data) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className={`dashboard-layout ${theme === "dark" ? "dark" : ""}`}>
      {rain && <RainEffect />}

      {/* =========================
         SIDEBAR
      ========================= */}
      <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <img src="logo192.png" alt="logo" />
          <div>
            <h2>AquaSense</h2>
            <p>Smart field insights</p>
          </div>
        </div>

        <ul className="sidebar-menu">
          <li className="active" onClick={() => setPage("dashboard")}>
            <FaHome /> Dashboard
          </li>

          <li onClick={() => setPage("analytics")}>
            <FaChartLine /> Analytics
          </li>

          <li onClick={() => setPage("settings")}>
            <FaCog /> Settings
          </li>
        </ul>
      </aside>

      {/* =========================
         MAIN
      ========================= */}
      <main
        className={`dashboard-main ${
          sidebarOpen && window.innerWidth > 900 ? "sidebar-open" : ""
        }`}
      >
        <header className="dashboard-header">
          <button className="menu-btn" onClick={toggleSidebar}>
            <FaBars />
          </button>

          <h1>AquaSense Dashboard</h1>

          <div className="header-right">
            <button className="icon-btn">
              <FaBell />
            </button>

            <button className="icon-btn" onClick={toggleTheme}>
              {theme === "dark" ? <FaSun /> : <FaMoon />}
            </button>

            <button className="logout-btn" onClick={handleLogout}>
              <FaSignOutAlt />
              <span> Sign out</span>
            </button>
          </div>
        </header>

        <div className="sensor-grid">
          <SensorCard title="Temperature" value={`${temp}°C`} percent={(temp / 50) * 100} />
          <SensorCard title="Humidity" value={`${humidity}%`} percent={humidity} />
          <SensorCard title="Soil" value={`${soil}%`} percent={soil} />
          <SensorCard title="Rain" value={rain ? "YES" : "NO"} percent={rain ? 100 : 0} />
        </div>
      </main>
    </div>
  );
}

/* =========================
   COMPONENTS
========================= */
function SensorCard({ title, value, percent }) {
  return (
    <div className="sensor-card">
      <div className="sensor-card-header">{title}</div>
      <div className="sensor-value">{value}</div>
      <div className="sensor-progress">
        <div
          className="sensor-progress-bar"
          style={{ width: `${Math.min(percent, 100)}%` }}
        />
      </div>
    </div>
  );
}

function RainEffect() {
  return (
    <div className="rain-effect">
      {Array.from({ length: 50 }).map((_, i) => (
        <div key={i} className="raindrop" />
      ))}
    </div>
  );
}
