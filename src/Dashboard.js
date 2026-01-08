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
  const [theme, setTheme] = useState("dark");
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
  const [data, setData] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

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
        setCurrentUser(null);
        return;
      }

      const uid = user.uid;
      currentUidRef.current = uid;
      setCurrentUser(user);

      const latestRef = ref(database, `users/${uid}/sensorData/latest`);

      const unsubDb = onValue(latestRef, (snap) => {
        if (snap.exists()) {
          setData(snap.val());
        } else {
          setData({ temp: 26, humidity: 57, soil: 32, rain: false });
        }
      });

      if (!pushIntervalRef.current) {
        pushIntervalRef.current = setInterval(() => {
          const sensorData = {
            temp: Math.floor(20 + Math.random() * 10),
            humidity: Math.floor(40 + Math.random() * 35),
            soil: Math.floor(30 + Math.random() * 35),
            rain: Math.random() > 0.85,
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
  const rain = data?.rain ?? false;

  /* =========================
     UI CONTROLS
  ========================= */
  useEffect(() => {
    const resize = () => {
      if (window.innerWidth > 768) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const toggleTheme = () => {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  };

  const toggleSidebar = () => {
    setSidebarOpen((s) => !s);
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to sign out?")) {
      clearInterval(pushIntervalRef.current);
      localStorage.clear();
      setUser(null);
      setPage("login");
    }
  };

  if (!data) {
    return <div className="loading">Loading...</div>;
  }

  const isMobile = window.innerWidth <= 768;

  return (
    <div className={`dashboard-layout ${theme === "light" ? "light" : "dark"}`}>
      {/* SIDEBAR */}
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

        <div className="user-greeting">
          <div className="greeting-header">Welcome Back</div>
          <div className="greeting-user">
            {currentUser?.displayName || currentUser?.email?.split('@')[0] || 'MJ Gamer'}
          </div>
          <div className="greeting-status">
            <span className="status-dot"></span>
            System Active
          </div>
        </div>
      </aside>

      {/* OVERLAY FOR MOBILE */}
      {sidebarOpen && isMobile && (
        <div className="sidebar-overlay show" onClick={toggleSidebar}></div>
      )}

      {/* MAIN CONTENT */}
      <main className={`dashboard-main ${sidebarOpen && !isMobile ? "sidebar-open" : ""}`}>
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
              <span>Sign out</span>
            </button>
          </div>
        </header>

        {/* GLASSMORPHISM DASHBOARD */}
        <div className="glass-dashboard">
          
          {/* MAIN GRID LAYOUT */}
          <div className="dashboard-grid">
            
            {/* TEMPERATURE CARD */}
            <div className="sensor-card temperature-card">
              <div className="card-header">
                <h3>Temperature</h3>
                <span className="live-badge">LIVE</span>
              </div>
              
              <div className="card-icon-circle temp-circle">🌡️</div>
              
              <div className="card-value-section">
                <div className="large-value">{temp}°C</div>
                <div className="value-label">Current Reading</div>
                <div className="status-indicator">
                  {temp > 28 ? "⚠️ Hot" : temp < 18 ? "❄️ Cold" : "✓ Optimal"}
                </div>
              </div>
            </div>

            {/* HUMIDITY CARD */}
            <div className="sensor-card humidity-card">
              <div className="card-header">
                <h3>Humidity</h3>
                <span className="live-badge">LIVE</span>
              </div>
              
              <div className="card-icon-circle humidity-circle">💧</div>
              
              <div className="circular-progress-container">
                <CircularProgress value={humidity} max={100} color="cyan" />
              </div>
              
              <div className="card-value-section">
                <div className="large-value">{humidity}%</div>
                <div className="value-label">Moisture Level</div>
                <div className="range-text">Min: 32%  •  Max: 75%</div>
              </div>
            </div>

            {/* SOIL MOISTURE CARD */}
            <div className="sensor-card soil-card">
              <div className="card-header">
                <h3>Soil Moisture</h3>
                <span className="live-badge">LIVE</span>
              </div>
              
              <div className="card-icon-circle soil-circle">🌱</div>
              
              <div className="circular-progress-container">
                <CircularProgress value={soil} max={100} color="amber" />
              </div>
              
              <div className="card-value-section">
                <div className="large-value">{soil}%</div>
                <div className="value-label">Ground Status</div>
                <div className="status-indicator">
                  {soil < 35 ? "💧 Dry" : soil > 65 ? "💦 Wet" : "✓ Optimal"}
                </div>
              </div>
            </div>

            {/* RAIN CARD */}
            <div className="sensor-card rain-card">
              <div className="card-header">
                <h3>Rain</h3>
                <span className="live-badge">LIVE</span>
              </div>
              
              <div className="card-icon-circle rain-circle">☁️</div>
              
              <div className="card-value-section">
                <div className="large-value">{rain ? "YES" : "NO"}</div>
                <div className="value-label">Precipitation</div>
                <div className="status-indicator">
                  {rain ? "🌧️ Raining" : "No precipitation"}
                </div>
              </div>

              <div className="rain-status">
                <div className="rain-stat">
                  <div className="rain-stat-label">Chance of Rain</div>
                  <div className="rain-stat-value">{rain ? "95%" : "5%"}</div>
                </div>
                <div className="rain-stat">
                  <div className="rain-stat-label">Duration</div>
                  <div className="rain-stat-value">{rain ? "45 min" : "0 min"}</div>
                </div>
              </div>
            </div>

          </div>

          {/* FOOTER STATUS */}
          <div className="dashboard-footer">
            <div className="footer-item">
              <span className="footer-label">🔥 Air:</span>
              <span className="footer-value">Moderate</span>
              <span className="footer-accent">30°C</span>
            </div>
            <div className="footer-divider"></div>
            <div className="footer-item">
              <span className="footer-label">🔄 Updated</span>
              <span className="footer-value">3 mins ago</span>
            </div>
            <div className="footer-divider"></div>
            <div className="footer-item">
              <span className="footer-label">⏱️ Updated</span>
              <span className="footer-value">3 mins ago</span>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

/* CIRCULAR PROGRESS COMPONENT */
function CircularProgress({ value, max, color }) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / max) * circumference;
  
  const colorMap = {
    cyan: '#12d6c5',
    amber: '#ffc107'
  };
  
  const strokeColor = colorMap[color] || colorMap.cyan;

  return (
    <svg className="circular-progress-svg" width="130" height="130">
      <defs>
        <filter id={`progress-glow-${color}`}>
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <circle className="progress-circle-bg" cx="65" cy="65" r={radius} />
      <circle
        className="progress-circle-fill"
        cx="65"
        cy="65"
        r={radius}
        stroke={strokeColor}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        filter={`url(#progress-glow-${color})`}
      />
    </svg>
  );
}