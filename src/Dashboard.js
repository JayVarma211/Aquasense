import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import { FaMoon, FaSun, FaSignOutAlt, FaBars, FaBell, FaCog } from "react-icons/fa";

export default function Dashboard({ sensor, setUser, setPage }) {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light"
  );
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 900);
  const [raindrops, setRaindrops] = useState([]);

  // Extract data early to avoid conditional hook calls
  const data = sensor?.sensor_data ?? sensor ?? {};
  
  // Parse all sensor values properly using exact database field names
  const temp = parseFloat(data.temperature) || 0;
  const humidity = parseFloat(data.humidity) || 0;
  const soil = parseFloat(data.soil_moisture_level) || 0;
  const rain = Boolean(data.is_rain);

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Handle window resize for sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 900) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Generate full-page raindrops immediately when rain status changes
  useEffect(() => {
    if (rain) {
      // Generate more raindrops for full page coverage (80 drops)
      const drops = Array.from({ length: 80 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        duration: 1.2 + Math.random() * 1,
        delay: Math.random() * 0.5, // Reduced delay for immediate start
        height: 40 + Math.random() * 30
      }));
      setRaindrops(drops);
    } else {
      setRaindrops([]);
    }
  }, [rain]);

  const toggleTheme = () =>
    setTheme((t) => (t === "dark" ? "light" : "dark"));

  const toggleSidebar = () => setSidebarOpen((s) => !s);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setPage("login");
  };

  // Show loading only after all hooks have been called
  if (!sensor) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className={`dashboard-layout ${theme === "dark" ? "dark" : ""}`}>
      
      {/* FULL PAGE RAIN ANIMATION */}
      {rain && (
        <div className="full-page-rain">
          {raindrops.map((drop) => (
            <div
              key={drop.id}
              className="full-page-raindrop"
              style={{
                left: `${drop.left}%`,
                height: `${drop.height}px`,
                animationDuration: `${drop.duration}s`,
                animationDelay: `${drop.delay}s`
              }}
            />
          ))}
        </div>
      )}

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
          <li className="active">Dashboard</li>
          <li onClick={() => setPage("analytics")}>Analytics</li>
          <li>Reports</li>
          <li>Settings</li>
        </ul>
      </aside>

      {/* OVERLAY (for mobile/tablet click-out) */}
      {sidebarOpen && window.innerWidth <= 900 && (
        <div className="sidebar-overlay show" onClick={toggleSidebar} />
      )}

      {/* MAIN */}
      <main className={`dashboard-main ${sidebarOpen && window.innerWidth > 900 ? "sidebar-open" : ""}`}>
        <header className="dashboard-header">
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

            <button className="icon-btn">
              <FaCog />
            </button>

            <button className="logout-btn" onClick={handleLogout}>
              <FaSignOutAlt /> <span>Sign out</span>
            </button>
          </div>
        </header>

        {/* SENSOR CARDS */}
        <div className="sensor-grid">
          {/* Temperature Card */}
          <div className="sensor-card">
            <div className="sensor-card-header">
              <span className="sensor-icon">🌡️</span>
              <span>Temperature</span>
            </div>
            <div className="sensor-value">{temp}°C</div>
            <div className="sensor-progress">
              <div 
                className="sensor-progress-bar" 
                style={{ width: `${Math.min((temp / 50) * 100, 100)}%` }}
              />
            </div>
          </div>

          {/* Humidity Card */}
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

          {/* Soil Card */}
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

          {/* Rain Card */}
          <div className="sensor-card">
            <div className="sensor-card-header">
              <span className="sensor-icon">☁️</span>
              <span>Rain</span>
            </div>
            <div className="sensor-value">{rain ? "YES" : "NO"}</div>
            <div className="sensor-progress">
              <div 
                className="sensor-progress-bar" 
                style={{ width: rain ? '100%' : '0%' }}
              />
            </div>
          </div>
        </div>

        {/* OVERVIEW SECTION */}
        <div className="overview-section">
          <h2 className="overview-title">Overview</h2>
          
          <div className="overview-grid">
            {/* System Status */}
            <div className="overview-card">
              <h3>System Status</h3>
              <p>All sensors connected</p>
            </div>

            {/* Last Reading */}
            <div className="overview-card">
              <h3>Last reading</h3>
              <p>
                Temp: {temp}°C · Humidity: {humidity}% · Soil: {soil}%
              </p>
            </div>

            {/* Rain Status */}
            <div className="overview-card">
              <h3>Rain</h3>
              <p>{rain ? "Precipitation detected" : "No precipitation"}</p>
            </div>

            {/* Quick Actions */}
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