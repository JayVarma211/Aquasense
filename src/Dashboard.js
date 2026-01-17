import React, { useEffect, useState, useRef } from "react";
import "./Dashboard.css";
import {
  FaSignOutAlt,
  FaBars,
  FaBell,
  FaCog,
  FaChartLine,
  FaHome
} from "react-icons/fa";
import { ref, onValue, set, push } from "firebase/database";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, database } from "./firebase";
import Weather from "./Weather";

const WEATHER_API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;
const CITY = process.env.REACT_APP_WEATHER_CITY || process.env.REACT_APP_CITY || "Mumbai";

export default function Dashboard({ setUser, setPage }) {
  const theme = "dark";
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [data, setData] = useState({
    temp: 0,
    humidity: 0,
    soil: 0,
    rain: false,
    timestamp: Date.now()
  });
  const [currentUser, setCurrentUser] = useState(null);

  const pushIntervalRef = useRef(null);

  /* =========================
     AUTH + SENSOR DATA
  ========================= */
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        clearInterval(pushIntervalRef.current);
        setCurrentUser(null);
        return;
      }

      setCurrentUser(user);
      const uid = user.uid;

      const latestRef = ref(database, `users/${uid}/sensorData/latest`);

      const unsubDb = onValue(latestRef, (snap) => {
        if (snap.exists()) {
          setData(snap.val());
        }
      });

      return () => unsubDb();
    });

    return () => unsubAuth();
  }, []);

  /* =========================
     SAFE VALUES
  ========================= */
  const temp = data?.temp ?? 0;
  const humidity = data?.humidity ?? 0;
  const soil = data?.soil ?? 0;
  const rain = data?.rain ?? false;

  /* =========================
     UI CONTROLS
  ========================= */
  useEffect(() => {
    const onResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) {
        setSidebarOpen(true); // Keep sidebar open on desktop
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setSidebarOpen(s => !s);
    }
  };

  const handleLogout = () => {
    signOut(auth).catch((e) => console.error("Sign out error:", e));
    localStorage.clear();
    setUser(null);
    setPage("login");
  };

  // Close sidebar when navigating on mobile
  const handleNavigation = (page) => {
    setPage(page);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className={`dashboard-layout ${theme}`}>
      <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <img src="logo192.png" alt="logo" />
          <div>
            <h2>AquaSense</h2>
            <p>Smart field insights</p>
          </div>
        </div>

        <ul className="sidebar-menu">
          <li onClick={() => handleNavigation("dashboard")} className="active">
            <FaHome /> Dashboard
          </li>
          <li onClick={() => handleNavigation("analytics")}>
            <FaChartLine /> Analytics
          </li>
          <li onClick={() => handleNavigation("settings")}>
            <FaCog /> Settings
          </li>
        </ul>
      </aside>

      {isMobile && sidebarOpen && (
        <div className="sidebar-overlay show" onClick={() => setSidebarOpen(false)}></div>
      )}

      <main className="dashboard-main">
        <header className="dashboard-header">
          <button className="menu-btn" onClick={toggleSidebar}><FaBars /></button>
          <h1>AquaSense Dashboard</h1>
          <div className="header-right">
            <button className="icon-btn"><FaBell /></button>
            <button className="logout-btn" onClick={handleLogout}>
              <FaSignOutAlt /> Sign out
            </button>
          </div>
        </header>

        <Weather onWeatherUpdate={(weatherData) => {
          setData(prev => ({ ...prev, ...weatherData }));
        }} />

        <div className="sensor-grid">
          <SensorCard title="Temperature" value={`${temp}°C`} />
          <SensorCard title="Humidity" value={`${humidity}%`} />
          <SensorCard title="Soil Moisture" value={`${soil}%`} />
          <SensorCard title="Rain" value={rain ? "YES" : "NO"} />
        </div>
      </main>
    </div>
  );
}

function SensorCard({ title, value }) {
  const getIcon = () => {
    if (title === "Temperature") return "🌡️";
    if (title === "Humidity") return "💧";
    if (title === "Soil Moisture") return "🌱";
    if (title === "Rain") return "🌧️";
    return "📊";
  };

  return (
    <div className="sensor-card">
      <div style={{ fontSize: "28px", marginBottom: "12px" }}>{getIcon()}</div>
      <div className="sensor-card-header">{title}</div>
      <div className="sensor-value">{value}</div>
    </div>
  );
}
