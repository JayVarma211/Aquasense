import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import { FaMoon, FaSun, FaSignOutAlt, FaBars, FaBell } from "react-icons/fa";

export default function Dashboard({ sensor, user, setUser, setPage }) {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // WEATHER STATES
  const [weather, setWeather] = useState(null);
  const [aqi, setAqi] = useState(null);

  const API_KEY = "6f5e2c8e7d5a43a3b9eb3b2a0cd7b8ff";

  // THEME PERSISTENCE
  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  // ------------------------------------------------------------
  // WEATHER FETCHER
  // ------------------------------------------------------------
  useEffect(() => {
    async function fetchWeather() {
      try {
        const locRes = await fetch("https://ipapi.co/json");
        const loc = await locRes.json();
        const city = loc.city || "Delhi";

        const weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;
        const res = await fetch(weatherURL);
        const w = await res.json();

        setWeather({
          temp: w.main.temp,
          humidity: w.main.humidity,
          condition: w.weather[0].main,
          icon: w.weather[0].icon,
          city,
          lat: w.coord.lat,
          lon: w.coord.lon,
        });

        const airURL = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${w.coord.lat}&lon=${w.coord.lon}&appid=${API_KEY}`;
        const airRes = await fetch(airURL);
        const aqiData = await airRes.json();
        setAqi(aqiData.list[0].main.aqi);
      } catch (err) {
        console.log("Weather fetch failed");
      }
    }

    fetchWeather();
  }, []);

  // ------------------------------------------------------------
  // NORMALIZING SENSOR INPUT
  // ------------------------------------------------------------
  if (!sensor) return <div className="loading">Loading...</div>;

  const data = sensor.sensor_data ?? sensor;

  const temp = data.temperature ?? data.temp ?? 0;
  const humidity = data.humidity ?? data.hum ?? 0;
  const soil = data.soil_moisture_level ?? data.soil ?? 0;
  const rain = data.rain ?? data.is_rain ?? 0;

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));
  const toggleSidebar = () => setSidebarOpen((s) => !s);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setPage("login");
  };

  function aqiText(level) {
    switch (level) {
      case 1: return "Good 😊";
      case 2: return "Fair 🙂";
      case 3: return "Moderate 😐";
      case 4: return "Poor 😣";
      case 5: return "Very Poor 😷";
      default: return "N/A";
    }
  }

  // Calculate progress percentages
  const tempProgress = Math.min((temp / 50) * 100, 100);
  const humidityProgress = humidity;
  const soilProgress = soil;

  // Generate rain drops dynamically
const rainDrops = Array.from({ length: 80 }).map((_, i) => ({
  left: Math.random() * 100,      // random X position
  delay: Math.random() * 2,       // random start delay
  duration: 0.4 + Math.random() * 0.8  // random speed
}));


  return (
    <div className={`dashboard-layout ${theme === "dark" ? "dark-mode" : ""}`}>

      {/* RAIN EFFECT ONLY WHEN raining */}
      {rain === true && (
        <div className="rain-overlay">
          {rainDrops.map((d, i) => (
            <div
              key={i}
              className="rain-drop"
              style={{
                left: `${d.left}vw`,
                animationDelay: `${d.delay}s`,
                animationDuration: `${d.duration}s`
              }}
            />
          ))}
        </div>
      )}

      {/* HEAT WAVE (Temp > 30°C) */}
      {temp > 30 && (
        <div className="heat-overlay">
          <div className="heat-wave"></div>
          <div className="heat-wave"></div>
          <div className="heat-wave"></div>
        </div>
      )}

      {/* SNOW (Temp < 10°C) */}
      {temp < 10 && (
        <div className="snow-overlay">
          {Array.from({ length: 40 }).map((_, i) => (
            <div
              key={i}
              className="snowflake"
              style={{
                left: Math.random() * 100 + "vw",
                fontSize: Math.random() * 10 + 8 + "px",
                animationDuration: Math.random() * 5 + 5 + "s",
              }}
            >
              ❄
            </div>
          ))}
        </div>
      )}

      {/* FOG EFFECT (Humidity > 70%) */}
      {humidity > 70 && (
        <div className="fog-overlay">
          <div className="fog-layer"></div>
          <div className="fog-layer"></div>
        </div>
      )}

      {/* DUST EFFECT (Soil < 30%) */}
      {soil < 30 && (
        <div className="dust-overlay">
          {Array.from({ length: 40 }).map((_, i) => (
            <div
              key={i}
              className="dust-particle"
              style={{
                left: Math.random() * 100 + "vw",
                top: Math.random() * 100 + "vh",
                animationDuration: Math.random() * 6 + 6 + "s",
              }}
            ></div>
          ))}
        </div>
      )}


      {/* SIDEBAR */}
      <aside className={`sidebar ${sidebarOpen ? "" : "collapsed"}`}>
        <img src="logo192.png" className="sidebar-logo" alt="logo" />

        {sidebarOpen && (
          <div className="sidebar-title">
            <h2>AquaSense</h2>
            <p>Smart field insights</p>
          </div>
        )}

        <ul className="sidebar-menu">
          <li className="active">Dashboard</li>
          <li onClick={() => setPage("analytics")}>Analytics</li>
          <li>Reports</li>
          <li>Settings</li>
        </ul>
      </aside>

      {/* MAIN SECTION */}
      <main className="dashboard-main">

        {/* HEADER */}
        <header className="dashboard-header">
          <button className="menu-btn" onClick={toggleSidebar}><FaBars /></button>

          <div className="header-title">
            <h1>AquaSense Dashboard</h1>
          </div>

          <div className="header-right">
            <div className="updated-box">
              <span>Updated</span>
              <strong>N/A</strong>
            </div>

            <button className="icon-btn">
              <FaBell />
            </button>

            <button className="icon-btn" onClick={toggleTheme}>
              {theme === "dark" ? <FaSun /> : <FaMoon />}
            </button>

            <button className="logout-btn" onClick={handleLogout}>
              Sign out
            </button>
          </div>
        </header>

        {/* SENSOR CARDS */}
        <div className="sensor-grid">
          <div className={`sensor-card 
                ${temp > 30 ? "hot-card" : ""} 
                ${temp < 10 ? "cold-card" : ""}`}
              >

            <div className="sensor-header">
              <h3>🌡 Temperature</h3>
              <h2 className="sensor-value">{temp}°C</h2>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${tempProgress}%` }}
              ></div>
            </div>
          </div>

          <div className={`sensor-card 
            ${humidity > 70 ? "humid-card" : ""}`}
          >

            <div className="sensor-header">
              <h3>💧 Humidity</h3>
              <h2 className="sensor-value">{humidity}%</h2>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${humidityProgress}%` }}
              ></div>
            </div>
          </div>

          <div className={`sensor-card 
            ${soil < 30 ? "dry-card" : ""}`}
          >

            <div className="sensor-header">
              <h3>🌱 Soil</h3>
              <h2 className="sensor-value">{soil}%</h2>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${soilProgress}%` }}
              ></div>
            </div>
          </div>

          <div className={`sensor-card 
            ${rain === 1 ? "rain-card" : ""}`}
          >

            <div className="sensor-header">
              <h3>☁ Rain</h3>
              <h2 className="sensor-value">{rain ? "YES" : "NO"}</h2>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: rain ? "100%" : "0%" }}
              ></div>
            </div>
          </div>
        </div>

        {/* OVERVIEW SECTION */}
        <div className="overview-section">
          <h2 className="section-title">Overview</h2>
          
          <div className="overview-grid">
            <div className="overview-card">
              <h3>System Status</h3>
              <p>All sensors connected</p>
            </div>

            <div className="overview-card">
              <h3>Last reading</h3>
              <p>Temp: {temp}°C · Humidity: {humidity}% · Soil: {soil}%</p>
            </div>

            <div className="overview-card">
              <h3>Rain</h3>
              <p>{rain ? "Precipitation detected" : "No precipitation"}</p>
            </div>

            <div className="overview-card">
              <h3>Quick actions</h3>
              <button 
                className="action-btn" 
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