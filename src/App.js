import React, { useState, useEffect, useCallback } from "react";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";
import Analytics from "./Analytics";
import Settings from "./Settings";
import "./App.css";

// Main App Component
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
        // Check if user has verified their email (for email/password signups)
        // If email is verified OR user signed in with Google (which auto-verifies)
        const isEmailVerified = currentUser.emailVerified;
        const isGoogleUser = currentUser.providerData.some(provider => provider.providerId === 'google.com');
        
        // Allow access to dashboard only if email is verified or user is Google login
        if (isEmailVerified || isGoogleUser) {
          setUser(currentUser);
          // Restore the previously visited page if it exists in localStorage
          const savedPage = localStorage.getItem("currentPage");
          const pageToSet = savedPage && ["dashboard", "analytics", "settings"].includes(savedPage) 
            ? savedPage 
            : "dashboard";
          setPage(pageToSet);
        } else {
          // Email not verified yet - stay on verification page
          setUser(null);
          setPage("register");
          localStorage.removeItem("currentPage");
        }
      } else {
        // No user logged in - always go to login page
        setUser(null);
        setPage("login");
        localStorage.removeItem("currentPage");
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Save current page to localStorage when it changes
  useEffect(() => {
    if (user && page !== "login") {
      localStorage.setItem("currentPage", page);
    }
  }, [page, user]);

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

  // Unauthenticated users can only see login or register page
  if (!user && page !== "login" && page !== "register") {
    return <Login setUser={setUser} setPage={setPage} />;
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
          currentUser={user}
        />
      )}

      {page === "analytics" && (
        <Analytics setPage={setPage} setUser={setUser} sensor={sensor} currentUser={user} />
      )}

      {page === "settings" && <Settings setPage={setPage} setUser={setUser} currentUser={user} />}

    </div>
  );
}

export default App;
