import React, { useState, useEffect } from "react";
import { FaSave, FaToggleOn, FaToggleOff, FaClock, FaThermometerHalf, FaTint, FaSeedling, FaBell, FaWifi, FaTrash, FaPlus, FaMoon, FaSun, FaSignOutAlt } from "react-icons/fa";
import { Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Settings.css";

export default function Settings({ setPage, setUser, theme, setTheme }) {
  const [mode, setMode] = useState("auto");
  const [pumpStatus, setPumpStatus] = useState(false);
  const [thresholds, setThresholds] = useState({
    tempMax: 30,
    tempMin: 15,
    humidityMax: 80,
    humidityMin: 40,
    soilMin: 35,
    soilMax: 70
  });
  
  const [schedules, setSchedules] = useState([
    { id: 1, time: "06:00", duration: 15, enabled: true, days: ["Mon", "Wed", "Fri"] }
  ]);
  
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    lowSoil: true,
    highTemp: true,
    systemError: true
  });
  
  const [sensorCalibration, setSensorCalibration] = useState({
    tempOffset: 0,
    humidityOffset: 0,
    soilOffset: 0
  });
  
  const [wateringPreferences, setWateringPreferences] = useState({
    flowRate: 5, // liters per minute
    minInterval: 30, // minutes between watering cycles
    maxDuration: 30 // max minutes per session
  });
  
  const [logs] = useState([
    { id: 1, action: "Pump ON", reason: "Soil below threshold (32%)", time: "2026-01-02 08:15:23" },
    { id: 2, action: "Pump OFF", reason: "Soil reached target (50%)", time: "2026-01-02 08:25:10" },
    { id: 3, action: "Alert Sent", reason: "High temperature detected (32°C)", time: "2026-01-02 12:45:00" }
  ]);

  const handleSave = () => {
    alert("Settings saved successfully!");
  };

  const addSchedule = () => {
    const newSchedule = {
      id: Date.now(),
      time: "12:00",
      duration: 10,
      enabled: true,
      days: []
    };
    setSchedules([...schedules, newSchedule]);
  };

  const deleteSchedule = (id) => {
    setSchedules(schedules.filter(s => s.id !== id));
  };

  const updateSchedule = (id, field, value) => {
    setSchedules(schedules.map(s => 
      s.id === id ? { ...s, [field]: value } : s
    ));
  };

  const toggleDay = (scheduleId, day) => {
    setSchedules(schedules.map(s => {
      if (s.id === scheduleId) {
        const days = s.days.includes(day) 
          ? s.days.filter(d => d !== day)
          : [...s.days, day];
        return { ...s, days };
      }
      return s;
    }));
  };


  /* =========================
     THEME MANAGEMENT
  ========================= */
  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to sign out?")) {
      localStorage.clear();
      setUser(null);
      setPage("login");
    }
  };

  return (
    <div className={`settings-page ${theme === "dark" ? "dark" : ""}`}>
      <div className="settings-header">
        <h1>System Settings</h1>
        <div className="header-actions">
          <Button 
            className="icon-btn" 
            onClick={() => setTheme(t => (t === "dark" ? "light" : "dark"))}
          >
            {theme === "dark" ? <FaSun /> : <FaMoon />}
          </Button>
          <Button 
            className="save-btn-bootstrap"
            onClick={handleSave}
          >
            <FaSave /> Save All Changes
          </Button>
          <Button 
            className="back-btn-bootstrap" 
            onClick={() => setPage("dashboard")}
          >
            ← Back
          </Button>
          <Button 
            className="logout-btn-bootstrap" 
            onClick={handleLogout}
          >
            <FaSignOutAlt />
            <span> Sign out</span>
          </Button>
        </div>
      </div>

      <div className="settings-grid">
        {/* Control Mode */}
        <div className="settings-card">
          <h2>Control Mode</h2>
          <div className="mode-selector">
            <Button 
              className={`mode-btn-bootstrap ${mode === "auto" ? "active" : ""}`}
              onClick={() => setMode("auto")}
            >
              <FaToggleOn /> Auto Mode
            </Button>
            <Button 
              className={`mode-btn-bootstrap ${mode === "manual" ? "active" : ""}`}
              onClick={() => setMode("manual")}
            >
              <FaToggleOff /> Manual Mode
            </Button>
          </div>
          <p className="mode-description">
            {mode === "auto" 
              ? "System automatically controls pump based on thresholds and schedules"
              : "You have full manual control over the pump"}
          </p>
          
          {mode === "manual" && (
            <div className="manual-control">
              <Button 
                className={`pump-toggle-bootstrap ${pumpStatus ? "on" : "off"}`}
                onClick={() => setPumpStatus(!pumpStatus)}
              >
                {pumpStatus ? "Pump ON" : "Pump OFF"}
              </Button>
            </div>
          )}
        </div>

        {/* Threshold Settings */}
        <div className="settings-card wide">
          <h2><FaThermometerHalf /> Sensor Thresholds</h2>
          <div className="threshold-grid">
            <div className="threshold-item">
              <label><FaThermometerHalf /> Temperature Max (°C)</label>
              <input 
                type="number" 
                value={thresholds.tempMax}
                onChange={(e) => setThresholds({...thresholds, tempMax: parseFloat(e.target.value)})}
              />
            </div>
            <div className="threshold-item">
              <label><FaThermometerHalf /> Temperature Min (°C)</label>
              <input 
                type="number" 
                value={thresholds.tempMin}
                onChange={(e) => setThresholds({...thresholds, tempMin: parseFloat(e.target.value)})}
              />
            </div>
            <div className="threshold-item">
              <label><FaTint /> Humidity Max (%)</label>
              <input 
                type="number" 
                value={thresholds.humidityMax}
                onChange={(e) => setThresholds({...thresholds, humidityMax: parseFloat(e.target.value)})}
              />
            </div>
            <div className="threshold-item">
              <label><FaTint /> Humidity Min (%)</label>
              <input 
                type="number" 
                value={thresholds.humidityMin}
                onChange={(e) => setThresholds({...thresholds, humidityMin: parseFloat(e.target.value)})}
              />
            </div>
            <div className="threshold-item">
              <label><FaSeedling /> Soil Min (%)</label>
              <input 
                type="number" 
                value={thresholds.soilMin}
                onChange={(e) => setThresholds({...thresholds, soilMin: parseFloat(e.target.value)})}
              />
            </div>
            <div className="threshold-item">
              <label><FaSeedling /> Soil Max (%)</label>
              <input 
                type="number" 
                value={thresholds.soilMax}
                onChange={(e) => setThresholds({...thresholds, soilMax: parseFloat(e.target.value)})}
              />
            </div>
          </div>
        </div>

        {/* Watering Preferences */}
        <div className="settings-card">
          <h2><FaTint /> Watering Preferences</h2>
          <div className="threshold-grid">
            <div className="threshold-item">
              <label>Flow Rate (L/min)</label>
              <input 
                type="number" 
                value={wateringPreferences.flowRate}
                onChange={(e) => setWateringPreferences({...wateringPreferences, flowRate: parseFloat(e.target.value)})}
              />
            </div>
            <div className="threshold-item">
              <label>Min Interval (minutes)</label>
              <input 
                type="number" 
                value={wateringPreferences.minInterval}
                onChange={(e) => setWateringPreferences({...wateringPreferences, minInterval: parseInt(e.target.value)})}
              />
            </div>
            <div className="threshold-item">
              <label>Max Duration (minutes)</label>
              <input 
                type="number" 
                value={wateringPreferences.maxDuration}
                onChange={(e) => setWateringPreferences({...wateringPreferences, maxDuration: parseInt(e.target.value)})}
              />
            </div>
          </div>
        </div>

        {/* Sensor Calibration */}
        <div className="settings-card">
          <h2><FaWifi /> Sensor Calibration</h2>
          <p className="card-description">Fine-tune sensor readings with offset values</p>
          <div className="threshold-grid">
            <div className="threshold-item">
              <label>Temperature Offset (°C)</label>
              <input 
                type="number" 
                step="0.1"
                value={sensorCalibration.tempOffset}
                onChange={(e) => setSensorCalibration({...sensorCalibration, tempOffset: parseFloat(e.target.value)})}
              />
            </div>
            <div className="threshold-item">
              <label>Humidity Offset (%)</label>
              <input 
                type="number" 
                step="0.1"
                value={sensorCalibration.humidityOffset}
                onChange={(e) => setSensorCalibration({...sensorCalibration, humidityOffset: parseFloat(e.target.value)})}
              />
            </div>
            <div className="threshold-item">
              <label>Soil Offset (%)</label>
              <input 
                type="number" 
                step="0.1"
                value={sensorCalibration.soilOffset}
                onChange={(e) => setSensorCalibration({...sensorCalibration, soilOffset: parseFloat(e.target.value)})}
              />
            </div>
          </div>
        </div>

        {/* Time-Based Scheduling */}
        <div className="settings-card wide">
          <div className="card-header-with-action">
            <h2><FaClock /> Watering Schedules</h2>
            <Button 
              className="add-btn-bootstrap" 
              onClick={addSchedule}
            >
              <FaPlus /> Add Schedule
            </Button>
          </div>
          <div className="schedules-list">
            {schedules.map(schedule => (
              <div key={schedule.id} className="schedule-item">
                <div className="schedule-controls">
                  <input 
                    type="time" 
                    value={schedule.time}
                    onChange={(e) => updateSchedule(schedule.id, "time", e.target.value)}
                  />
                  <div className="input-group">
                    <label>Duration (min)</label>
                    <input 
                      type="number" 
                      value={schedule.duration}
                      onChange={(e) => updateSchedule(schedule.id, "duration", parseInt(e.target.value))}
                      min="1"
                      max="60"
                    />
                  </div>
                  <Button 
                    className="toggle-btn-bootstrap"
                    onClick={() => updateSchedule(schedule.id, "enabled", !schedule.enabled)}
                  >
                    {schedule.enabled ? "Enabled" : "Disabled"}
                  </Button>
                  <Button 
                    className="delete-btn-bootstrap"
                    onClick={() => deleteSchedule(schedule.id)}
                  >
                    <FaTrash />
                  </Button>
                </div>
                <div className="days-selector">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(day => (
                    <Button
                      key={day}
                      className={`day-btn-bootstrap ${schedule.days.includes(day) ? "selected" : ""}`}
                      onClick={() => toggleDay(schedule.id, day)}
                    >
                      {day}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="settings-card">
          <h2><FaBell /> Notification Preferences</h2>
          <div className="notifications-section">
            <div className="notification-group">
              <h3 className="notification-group-title">Notification Channels</h3>
              <div className="notification-items">
                <div className="notification-item">
                  <div className="notification-checkbox-wrapper">
                    <input 
                      type="checkbox" 
                      id="email-notif"
                      checked={notifications.email}
                      onChange={(e) => setNotifications({...notifications, email: e.target.checked})}
                    />
                    <label htmlFor="email-notif">Email Notifications</label>
                  </div>
                </div>
                <div className="notification-item">
                  <div className="notification-checkbox-wrapper">
                    <input 
                      type="checkbox" 
                      id="sms-notif"
                      checked={notifications.sms}
                      onChange={(e) => setNotifications({...notifications, sms: e.target.checked})}
                    />
                    <label htmlFor="sms-notif">SMS Alerts</label>
                  </div>
                </div>
                <div className="notification-item">
                  <div className="notification-checkbox-wrapper">
                    <input 
                      type="checkbox" 
                      id="push-notif"
                      checked={notifications.push}
                      onChange={(e) => setNotifications({...notifications, push: e.target.checked})}
                    />
                    <label htmlFor="push-notif">Push Notifications</label>
                  </div>
                </div>
              </div>
            </div>

            <div className="notification-group">
              <h3 className="notification-group-title">Alert Types</h3>
              <div className="notification-items">
                <div className="notification-item">
                  <div className="notification-checkbox-wrapper">
                    <input 
                      type="checkbox" 
                      id="low-soil-alert"
                      checked={notifications.lowSoil}
                      onChange={(e) => setNotifications({...notifications, lowSoil: e.target.checked})}
                    />
                    <label htmlFor="low-soil-alert">Low Soil Alerts</label>
                  </div>
                </div>
                <div className="notification-item">
                  <div className="notification-checkbox-wrapper">
                    <input 
                      type="checkbox" 
                      id="high-temp-alert"
                      checked={notifications.highTemp}
                      onChange={(e) => setNotifications({...notifications, highTemp: e.target.checked})}
                    />
                    <label htmlFor="high-temp-alert">High Temperature Alerts</label>
                  </div>
                </div>
                <div className="notification-item">
                  <div className="notification-checkbox-wrapper">
                    <input 
                      type="checkbox" 
                      id="system-error-alert"
                      checked={notifications.systemError}
                      onChange={(e) => setNotifications({...notifications, systemError: e.target.checked})}
                    />
                    <label htmlFor="system-error-alert">System Error Alerts</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Current Status */}
        <div className="settings-card">
          <h2>Current System Status</h2>
          <div className="status-display">
            <div className="status-item">
              <span className="label">Mode:</span>
              <span className={`value ${mode}`}>{mode.toUpperCase()}</span>
            </div>
            <div className="status-item">
              <span className="label">Pump:</span>
              <span className={`value ${pumpStatus ? "on" : "off"}`}>
                {pumpStatus ? "ON" : "OFF"}
              </span>
            </div>
            <div className="status-item">
              <span className="label">Last Action:</span>
              <span className="value">2 hours ago</span>
            </div>
            <div className="status-item">
              <span className="label">Next Schedule:</span>
              <span className="value">Tomorrow 6:00 AM</span>
            </div>
          </div>
        </div>

        {/* Action History */}
        <div className="settings-card wide">
          <h2>Action History</h2>
          <div className="logs-container">
            {logs.map(log => (
              <div key={log.id} className="log-item">
                <div className="log-main">
                  <span className="log-action">{log.action}</span>
                  <span className="log-reason">{log.reason}</span>
                </div>
                <span className="log-time">{log.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}