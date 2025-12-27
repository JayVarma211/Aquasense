import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import {
  FaMoon,
  FaSun,
  FaSignOutAlt,
  FaBars,
  FaBell
} from "react-icons/fa";

export default function Dashboard({ sensor, setUser, setPage }) {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light"
  );
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 900);
  const [raindrops, setRaindrops] = useState([]);

  /* =========================
     SENSOR DATA NORMALIZATION
  ========================= */
  const data = sensor?.sensor_data ?? sensor ?? {};

  const temp = parseFloat(data.temperature) || 0;
  const humidity = parseFloat(data.humidity) || 0;
  const soil = parseFloat(data.soil_moisture_level) || 0;
  const rain = Boolean(data.is_rain);

  /* =========================
     THEME PERSISTENCE
  ========================= */
  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  /* =========================
     SIDEBAR RESPONSIVE CONTROL
  ========================= */
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 900) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* =========================
     RAIN EFFECT GENERATION
  ========================= */
  useEffect(() => {
    if (rain) {
      const drops = Array.from({ length: 80 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        height: 40 + Math.random() * 30,
        duration: 1.2 + Math.random(),
        delay: Math.random() * 0.5
      }));
      setRaindrops(drops);
    } else {
      setRaindrops([]);
    }
  }, [rain]);

  /* =========================
     ACTIONS
  ========================= */
  const toggleTheme = () =>
    setTheme((t) => (t === "dark" ? "light" : "dark"));

  const toggleSidebar = () =>
    setSidebarOpen((s) => !s);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setPage("login");
  };

  if (!sensor) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className={`dashboard-layout ${theme === "dark" ? "dark" : ""}`}>

      {/* =========================
         FULL PAGE RAIN EFFECT
      ========================= */}
      {rain && (
        <div className="full-page-rain">
          {raindrops.map((d) => (
            <div
              key={d.id}
              className="full-page-raindrop"
              style={{
                left: `${d.left}%`,
                height: `${d.height}px`,
                animationDuration: `${d.duration}s`,
                animationDelay: `${d.delay}s`
              }}
            />
          ))}
        </div>
      )}

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
          <li className="active">Dashboard</li>
          <li onClick={() => setPage("analytics")}>Analytics</li>
          <li>Reports</li>
          <li>Settings</li>
        </ul>
      </aside>

      {/* =========================
         MOBILE OVERLAY
      ========================= */}
      {sidebarOpen && window.innerWidth <= 900 && (
        <div
          className="sidebar-overlay show"
          onClick={toggleSidebar}
        />
      )}

      {/* =========================
         MAIN CONTENT
      ========================= */}
      <main
        className={`dashboard-main ${
          sidebarOpen && window.innerWidth > 900 ? "sidebar-open" : ""
        }`}
      >
        {/* =========================
           HEADER
        ========================= */}
        <header className="dashboard-header">
          {/* ☰ MENU BUTTON — KEPT */}
          <button className="menu-btn" onClick={toggleSidebar}>
            <FaBars />
          </button>

          <h1>AquaSense Dashboard</h1>

          <div className="header-right">
            <span className="update-badge">Updated N/A</span>

            <button className="icon-btn">
              <FaBell />
            </button>

            <button className="icon-btn" onClick={toggleTheme}>
              {theme === "dark" ? <FaSun /> : <FaMoon />}
            </button>

            {/* ⚠️ SETTINGS BUTTON REMOVED (AS REQUESTED) */}

            <button className="logout-btn" onClick={handleLogout}>
              <FaSignOutAlt />
              <span> Sign out</span>
            </button>
          </div>
        </header>

        {/* =========================
           SENSOR CARDS
        ========================= */}
        <div className="sensor-grid">
          <div className="sensor-card">
            <div className="sensor-card-header">
              <span className="sensor-icon">🌡️</span>
              <span>Temperature</span>
            </div>
            <div className="sensor-value">{temp}°C</div>
            <div className="sensor-progress">
              <div
                className="sensor-progress-bar"
                style={{
                  width: `${Math.min((temp / 50) * 100, 100)}%`
                }}
              />
            </div>
          </div>

          <div className="sensor-card">
            <div className="sensor-card-header">
              <span className="sensor-icon">💧</span>
              <span>Humidity</span>
            </div>
            <div className="sensor-value">{humidity}%</div>
            <div className="sensor-progress">
              <div
                className="sensor-progress-bar"
                style={{ width: `${humidity}%` }}
              />
            </div>
          </div>

          <div className="sensor-card">
            <div className="sensor-card-header">
              <span className="sensor-icon">🌱</span>
              <span>Soil</span>
            </div>
            <div className="sensor-value">{soil}%</div>
            <div className="sensor-progress">
              <div
                className="sensor-progress-bar"
                style={{ width: `${soil}%` }}
              />
            </div>
          </div>

          <div className="sensor-card">
            <div className="sensor-card-header">
              <span className="sensor-icon">☁️</span>
              <span>Rain</span>
            </div>
            <div className="sensor-value">{rain ? "YES" : "NO"}</div>
            <div className="sensor-progress">
              <div
                className="sensor-progress-bar"
                style={{ width: rain ? "100%" : "0%" }}
              />
            </div>
          </div>
        </div>

        {/* =========================
           OVERVIEW
        ========================= */}
        <div className="overview-section">
          <h2 className="overview-title">Overview</h2>

          <div className="overview-grid">
            <div className="overview-card">
              <h3>System Status</h3>
              <p>All sensors connected</p>
            </div>

            <div className="overview-card">
              <h3>Last reading</h3>
              <p>
                Temp: {temp}°C · Humidity: {humidity}% · Soil: {soil}%
              </p>
            </div>

            <div className="overview-card">
              <h3>Rain</h3>
              <p>{rain ? "Precipitation detected" : "No precipitation"}</p>
            </div>

            <div className="overview-card">
              <h3>Quick actions</h3>
              <button
                className="quick-action-btn"
                onClick={() => setPage("analytics")}
              >
                Open Analytics
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
