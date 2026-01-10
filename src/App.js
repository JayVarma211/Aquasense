import React, { useState, useEffect, useCallback } from "react";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";
import Analytics from "./Analytics";
import Settings from "./Settings";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("login");
  const [sensor, setSensor] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ✅ GLOBAL THEME STATE */
  const [theme, setTheme] = useState(
  localStorage.getItem("theme") || "light"
);

  const fetchSensorData = useCallback(async () => {
    const urls = [
      "https://aquasense-81c33-default-rtdb.asia-southeast1.firebasedatabase.app/sensor_data.json",
      "https://aquasense-81c33-default-rtdb.asia-southeast1.firebasedatabase.app/sensorData.json",
      "https://aquasense-2024-default-rtdb.firebaseio.com/sensorData.json",
    ];

    for (const url of urls) {
      try {
        const res = await fetch(url);
        if (!res.ok) continue;
        const data = await res.json();
        if (data) {
          setSensor(data);
          return;
        }
      } catch (err) {
        console.warn(err);
      }
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setPage("dashboard");
      } else {
        setUser(null);
        setPage("login");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="app-loading">Loading AquaSense...</div>;
  }

  return (
    <div className={`App ${theme}`}>
      {page === "login" && <Login setUser={setUser} setPage={setPage} />}
      {page === "register" && <Register setUser={setUser} setPage={setPage} />}

      {page === "dashboard" && (
        <Dashboard
          sensor={sensor}
          user={user}
          setUser={setUser}
          setPage={setPage}
          theme={theme}
          setTheme={setTheme}
        />
      )}

      {page === "analytics" && (
        <Analytics
          sensor={sensor}
          user={user}
          setUser={setUser}
          setPage={setPage}
          theme={theme}
          setTheme={setTheme}
        />
      )}

      {page === "settings" && (
        <Settings
          sensor={sensor}
          user={user}
          setUser={setUser}
          setPage={setPage}
          theme={theme}
          setTheme={setTheme}
        />
      )}
    </div>
  );
}

export default App;
