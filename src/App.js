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

  const fetchSensorData = useCallback(async () => {
    // Primary (observed) DB endpoint and key name
    const urls = [
      // canonical shown in DB console (uses asia-southeast1 domain)
      "https://aquasense-81c33-default-rtdb.asia-southeast1.firebasedatabase.app/sensor_data.json",
      // alternate key casing / naming variants sometimes used
      "https://aquasense-81c33-default-rtdb.asia-southeast1.firebasedatabase.app/sensorData.json",
      // legacy / other project fallback
      "https://aquasense-2024-default-rtdb.firebaseio.com/sensorData.json",
    ];

    for (const url of urls) {
      try {
        const res = await fetch(url);
        if (!res.ok) {
          // try next URL if 404 or other non-OK
          console.warn(`fetch(${url}) returned status ${res.status}`);
          continue;
        }
        const data = await res.json();
        if (data) {
          setSensor(data);
          return;
        }
      } catch (err) {
        console.warn(`fetch(${url}) failed:`, err.message || err);
        // try next url
      }
    }

    console.error("All sensor fetch attempts failed");
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

  useEffect(() => {
    if (user && page === "dashboard") {
      fetchSensorData();
      const interval = setInterval(fetchSensorData, 5000);
      return () => clearInterval(interval);
    }
  }, [user, page, fetchSensorData]);

  if (loading) {
    return <div className="app-loading">Loading AquaSense...</div>;
  }

  return (
    <div className="App">
      {page === "login" && <Login setUser={setUser} setPage={setPage} />}
      {page === "register" && <Register setUser={setUser} setPage={setPage} />}

      {page === "dashboard" && (
        <Dashboard
          sensor={sensor}
          user={user}
          setUser={setUser}
          setPage={setPage}
        />
      )}

      {page === "analytics" && (
        <Analytics setPage={setPage} sensor={sensor} />
      )}

      {page === "settings" && <Settings setPage={setPage} />}

    </div>
  );
}

export default App;
