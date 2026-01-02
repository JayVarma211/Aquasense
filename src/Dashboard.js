import React, { useEffect, useState, useRef } from "react";
import "./Dashboard.css";
import {
  FaMoon,
  FaSun,
  FaSignOutAlt,
  FaBars,
  FaBell
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

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        if (pushIntervalRef.current) {
          clearInterval(pushIntervalRef.current);
          pushIntervalRef.current = null;
        }
        currentUidRef.current = null;
        setData(null);
        return;
      }

      const uid = user.uid;

      if (currentUidRef.current && currentUidRef.current !== uid) {
        clearInterval(pushIntervalRef.current);
        pushIntervalRef.current = null;
      }

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
          const now = Date.now();

          const sensorData = {
            temp: Math.floor(20 + Math.random() * 10),
            humidity: Math.floor(40 + Math.random() * 20),
            soil: Math.floor(30 + Math.random() * 30),
            timestamp: now
          };

          set(ref(database, `users/${uid}/sensorData/latest`), sensorData);
          push(ref(database, `users/${uid}/sensorData/history`), sensorData);
        }, 5000);
      }

      return () => unsubDb();
    });

    return () => {
      if (pushIntervalRef.current) {
        clearInterval(pushIntervalRef.current);
      }
      unsubAuth();
    };
  }, []);

  const temp = data?.temp ?? 0;
  const humidity = data?.humidity ?? 0;
  const soil = data?.soil ?? 0;
  const rain = temp > 25 && humidity > 70; // Rain logic

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
    if (pushIntervalRef.current) {
      clearInterval(pushIntervalRef.current);
      pushIntervalRef.current = null;
    }
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

      <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <img src="logo192.png" alt="logo" />
          <div>
            <h2>AquaSense</h2>
            <p>Smart field insights</p>
          </div>
        </div>

        <ul className="sidebar-menu">
          <li className="active">Dashboard</li>
          <li onClick={() => setPage("analytics")}>Analytics</li>
        </ul>
      </aside>

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
          <SensorCard 
            title="Temperature" 
            value={`${temp}°C`} 
            percent={(temp / 50) * 100}
            isHot={temp > 28}
          />
          <SensorCard 
            title="Humidity" 
            value={`${humidity}%`} 
            percent={humidity}
            isHighHumidity={humidity > 70}
          />
          <SensorCard 
            title="Soil" 
            value={`${soil}%`} 
            percent={soil}
            isLowSoil={soil < 40}
          />
          <SensorCard 
            title="Rain" 
            value={rain ? "YES" : "NO"} 
            percent={rain ? 100 : 0}
            isRaining={rain}
          />
        </div>
      </main>
    </div>
  );
}

function SensorCard({ title, value, percent, isHot, isHighHumidity, isLowSoil, isRaining }) {
  let className = "sensor-card";
  
  if (isHot) className += " temp-hot";
  if (isHighHumidity) className += " humidity-high";
  if (isLowSoil) className += " soil-low";
  
  return (
    <div className={className}>
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
  const drops = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    animationDelay: Math.random() * 2,
    animationDuration: 0.5 + Math.random() * 0.5
  }));

  return (
    <div className="rain-effect">
      {drops.map((drop) => (
        <div
          key={drop.id}
          className="raindrop"
          style={{
            left: `${drop.left}%`,
            animationDelay: `${drop.animationDelay}s`,
            animationDuration: `${drop.animationDuration}s`
          }}
        />
      ))}
    </div>
  );
}