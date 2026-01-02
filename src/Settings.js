import React, { useState, useEffect } from "react";
import { FaSave, FaToggleOn, FaToggleOff, FaClock, FaThermometerHalf, FaTint, FaSeedling, FaBell, FaWifi, FaTrash, FaPlus } from "react-icons/fa";

export default function Settings({ setPage }) {
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
  
  const [logs, setLogs] = useState([
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

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1>System Settings</h1>
        <div className="header-actions">
          <button className="save-btn" onClick={handleSave}>
            <FaSave /> Save All Changes
          </button>
          <button className="back-btn" onClick={() => setPage("dashboard")}>
            ← Back
          </button>
        </div>
      </div>

      <div className="settings-grid">
        {/* Control Mode */}
        <div className="settings-card">
          <h2>Control Mode</h2>
          <div className="mode-selector">
            <button 
              className={`mode-btn ${mode === "auto" ? "active" : ""}`}
              onClick={() => setMode("auto")}
            >
              <FaToggleOn /> Auto Mode
            </button>
            <button 
              className={`mode-btn ${mode === "manual" ? "active" : ""}`}
              onClick={() => setMode("manual")}
            >
              <FaToggleOff /> Manual Mode
            </button>
          </div>
          <p className="mode-description">
            {mode === "auto" 
              ? "System automatically controls pump based on thresholds and schedules"
              : "You have full manual control over the pump"}
          </p>
          
          {mode === "manual" && (
            <div className="manual-control">
              <button 
                className={`pump-toggle ${pumpStatus ? "on" : "off"}`}
                onClick={() => setPumpStatus(!pumpStatus)}
              >
                {pumpStatus ? "Pump ON" : "Pump OFF"}
              </button>
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
            <button className="add-btn" onClick={addSchedule}>
              <FaPlus /> Add Schedule
            </button>
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
                  <button 
                    className={`toggle-btn ${schedule.enabled ? "enabled" : "disabled"}`}
                    onClick={() => updateSchedule(schedule.id, "enabled", !schedule.enabled)}
                  >
                    {schedule.enabled ? "Enabled" : "Disabled"}
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => deleteSchedule(schedule.id)}
                  >
                    <FaTrash />
                  </button>
                </div>
                <div className="days-selector">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(day => (
                    <button
                      key={day}
                      className={`day-btn ${schedule.days.includes(day) ? "selected" : ""}`}
                      onClick={() => toggleDay(schedule.id, day)}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="settings-card">
          <h2><FaBell /> Notification Preferences</h2>
          <div className="toggle-list">
            <label className="toggle-item">
              <span>Email Notifications</span>
              <input 
                type="checkbox" 
                checked={notifications.email}
                onChange={(e) => setNotifications({...notifications, email: e.target.checked})}
              />
            </label>
            <label className="toggle-item">
              <span>SMS Alerts</span>
              <input 
                type="checkbox" 
                checked={notifications.sms}
                onChange={(e) => setNotifications({...notifications, sms: e.target.checked})}
              />
            </label>
            <label className="toggle-item">
              <span>Push Notifications</span>
              <input 
                type="checkbox" 
                checked={notifications.push}
                onChange={(e) => setNotifications({...notifications, push: e.target.checked})}
              />
            </label>
            <hr />
            <label className="toggle-item">
              <span>Low Soil Alerts</span>
              <input 
                type="checkbox" 
                checked={notifications.lowSoil}
                onChange={(e) => setNotifications({...notifications, lowSoil: e.target.checked})}
              />
            </label>
            <label className="toggle-item">
              <span>High Temperature Alerts</span>
              <input 
                type="checkbox" 
                checked={notifications.highTemp}
                onChange={(e) => setNotifications({...notifications, highTemp: e.target.checked})}
              />
            </label>
            <label className="toggle-item">
              <span>System Error Alerts</span>
              <input 
                type="checkbox" 
                checked={notifications.systemError}
                onChange={(e) => setNotifications({...notifications, systemError: e.target.checked})}
              />
            </label>
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

      <style>{`
        .settings-page {
          padding: 32px 40px;
          background: #ecfffd;
          min-height: 100vh;
          font-family: "Segoe UI", sans-serif;
        }

        .settings-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 35px;
          flex-wrap: wrap;
          gap: 20px;
        }

        .settings-header h1 {
          margin: 0;
          font-size: 2rem;
          font-weight: 700;
          color: #062826;
        }

        .header-actions {
          display: flex;
          gap: 12px;
        }

        .save-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #12d6c5;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(18, 214, 197, 0.35);
          transition: all 0.2s;
        }

        .save-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(18, 214, 197, 0.5);
        }

        .back-btn {
          background: white;
          border: 2px solid #12d6c5;
          color: #12d6c5;
          padding: 12px 24px;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .back-btn:hover {
          background: #12d6c5;
          color: white;
        }

        .settings-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
        }

        .settings-card {
          background: white;
          border-radius: 20px;
          padding: 28px;
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.1);
        }

        .settings-card.wide {
          grid-column: span 2;
        }

        .settings-card h2 {
          margin: 0 0 20px;
          font-size: 1.3rem;
          font-weight: 700;
          color: #062826;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .card-description {
          margin: -10px 0 20px;
          opacity: 0.7;
          font-size: 0.9rem;
        }

        .mode-selector {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 16px;
        }

        .mode-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 16px;
          border: 2px solid #e6fffb;
          background: white;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .mode-btn:hover {
          border-color: #12d6c5;
        }

        .mode-btn.active {
          background: #12d6c5;
          border-color: #12d6c5;
          color: white;
        }

        .mode-description {
          padding: 12px;
          background: #f0fffe;
          border-radius: 8px;
          font-size: 0.9rem;
          margin: 0;
        }

        .manual-control {
          margin-top: 16px;
        }

        .pump-toggle {
          width: 100%;
          padding: 16px;
          border: none;
          border-radius: 12px;
          font-weight: 700;
          font-size: 1.1rem;
          cursor: pointer;
          transition: all 0.3s;
        }

        .pump-toggle.on {
          background: #2ecc71;
          color: white;
          box-shadow: 0 6px 20px rgba(46, 204, 113, 0.4);
        }

        .pump-toggle.off {
          background: #e74c3c;
          color: white;
          box-shadow: 0 6px 20px rgba(231, 76, 60, 0.4);
        }

        .threshold-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }

        .threshold-item {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .threshold-item label {
          font-weight: 600;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          gap: 6px;
          color: #062826;
        }

        .threshold-item input {
          padding: 12px;
          border: 2px solid #e6fffb;
          border-radius: 10px;
          font-size: 1rem;
          transition: all 0.2s;
        }

        .threshold-item input:focus {
          outline: none;
          border-color: #12d6c5;
          box-shadow: 0 0 0 3px rgba(18, 214, 197, 0.1);
        }

        .schedules-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .schedule-item {
          padding: 20px;
          background: #f0fffe;
          border-radius: 12px;
          border: 2px solid #e6fffb;
        }

        .schedule-controls {
          display: flex;
          gap: 12px;
          align-items: center;
          flex-wrap: wrap;
          margin-bottom: 12px;
        }

        .schedule-controls input[type="time"] {
          padding: 10px 14px;
          border: 2px solid #e6fffb;
          border-radius: 8px;
          font-size: 1rem;
        }

        .input-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .input-group label {
          font-size: 0.85rem;
          font-weight: 600;
        }

        .input-group input {
          width: 80px;
          padding: 10px;
          border: 2px solid #e6fffb;
          border-radius: 8px;
        }

        .toggle-btn {
          padding: 10px 20px;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .toggle-btn.enabled {
          background: #2ecc71;
          color: white;
        }

        .toggle-btn.disabled {
          background: #e0e0e0;
          color: #666;
        }

        .delete-btn {
          padding: 10px 14px;
          background: #ff4d4f;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .delete-btn:hover {
          background: #e03e3e;
        }

        .days-selector {
          display: flex;
          gap: 8px;
        }

        .day-btn {
          flex: 1;
          padding: 8px;
          border: 2px solid #e6fffb;
          background: white;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .day-btn.selected {
          background: #12d6c5;
          border-color: #12d6c5;
          color: white;
        }

        .card-header-with-action {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .card-header-with-action h2 {
          margin: 0;
        }

        .add-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 10px 16px;
          background: #12d6c5;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .add-btn:hover {
          background: #0fa89a;
        }

        .toggle-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .toggle-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 16px;
          background: #f0fffe;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .toggle-item:hover {
          background: #e6fffb;
        }

        .toggle-item span {
          font-weight: 600;
        }

        .toggle-item input[type="checkbox"] {
          width: 48px;
          height: 24px;
          cursor: pointer;
        }

        .toggle-list hr {
          border: none;
          border-top: 1px solid #e6fffb;
          margin: 8px 0;
        }

        .status-display {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .status-item {
          display: flex;
          justify-content: space-between;
          padding: 12px 16px;
          background: #f0fffe;
          border-radius: 10px;
        }

        .status-item .label {
          font-weight: 600;
          color: #062826;
        }

        .status-item .value {
          font-weight: 700;
        }

        .status-item .value.auto {
          color: #2ecc71;
        }

        .status-item .value.manual {
          color: #f39c12;
        }

        .status-item .value.on {
          color: #2ecc71;
        }

        .status-item .value.off {
          color: #e74c3c;
        }

        .logs-container {
          display: flex;
          flex-direction: column;
          gap: 12px;
          max-height: 400px;
          overflow-y: auto;
        }

        .log-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          background: #f0fffe;
          border-radius: 10px;
          border-left: 4px solid #12d6c5;
        }

        .log-main {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .log-action {
          font-weight: 700;
          color: #062826;
        }

        .log-reason {
          font-size: 0.85rem;
          opacity: 0.8;
        }

        .log-time {
          font-size: 0.8rem;
          opacity: 0.7;
          text-align: right;
        }

        @media (max-width: 1200px) {
          .settings-grid {
            grid-template-columns: 1fr;
          }

          .settings-card.wide {
            grid-column: span 1;
          }
        }

        @media (max-width: 600px) {
          .settings-page {
            padding: 20px;
          }

          .settings-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .header-actions {
            width: 100%;
          }

          .save-btn, .back-btn {
            flex: 1;
          }

          .mode-selector {
            grid-template-columns: 1fr;
          }

          .threshold-grid {
            grid-template-columns: 1fr;
          }

          .schedule-controls {
            flex-direction: column;
            align-items: stretch;
          }

          .days-selector {
            flex-wrap: wrap;
          }
        }
      `}</style>
    </div>
  );
}