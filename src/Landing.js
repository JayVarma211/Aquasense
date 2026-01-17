import React, { useState, useEffect } from "react";
import { 
  FaArrowRight, 
  FaChartLine, 
  FaTint, 
  FaBell, 
  FaMobileAlt, 
  FaCloudSun, 
  FaCog 
} from "react-icons/fa";
import "./Landing.css";

export default function Landing({ setPage }) {
  const theme = "dark";
  
  useEffect(() => {
    // Intersection Observer for scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe all feature cards and other elements with animation class
    const cards = document.querySelectorAll('.feature-card, .hero-section');
    cards.forEach(card => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="landing-page dark">

      <div className="landing-content">
        {/* Header/Navbar */}
        <header className="landing-header">
          <div className="landing-logo">
            <img src="logo192.png" alt="AquaSense Logo" />
            <h1>AquaSense</h1>
          </div>
          <nav className="landing-nav">
            <button className="nav-btn login" onClick={() => setPage("login")}>
              <span>Login</span>
            </button>
            <button className="nav-btn signup" onClick={() => setPage("register")}>
              <span>Get Started</span>
            </button>
          </nav>
        </header>

        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <div className="hero-badge">
              <span>🌱</span>
              <span>Smart Irrigation Technology</span>
            </div>
            
            <h1 className="hero-title">
              Transform Your Field Monitoring
            </h1>
            
            <p className="hero-subtitle">
              Real-time sensor data, intelligent automation, and comprehensive analytics 
              to optimize your irrigation system and maximize crop yield with cutting-edge AI technology.
            </p>
            
            <div className="hero-buttons">
              <button className="hero-btn primary" onClick={() => setPage("register")}>
                <span>Start Free Trial</span>
                <FaArrowRight />
              </button>
              <button className="hero-btn secondary" onClick={() => setPage("login")}>
                <span>Sign In</span>
              </button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <div className="features-header">
            <h2>Powered by Advanced Technology</h2>
            <p>Next-generation features for intelligent farming</p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <FaChartLine style={{ color: "#00d9ff" }} />
              </div>
              <h3>Real-Time Analytics</h3>
              <p>
                Monitor temperature, humidity, soil moisture, and rain status with 
                live data visualization powered by AI-driven insights and predictive analytics.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <FaTint style={{ color: "#00fff5" }} />
              </div>
              <h3>Smart Automation</h3>
              <p>
                Automated irrigation based on sensor thresholds and custom schedules. 
                Machine learning optimizes water usage and energy consumption automatically.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <FaBell style={{ color: "#39ff14" }} />
              </div>
              <h3>Instant Alerts</h3>
              <p>
                Get notified via email, SMS, or push notifications when critical 
                thresholds are reached. AI-powered anomaly detection prevents system failures.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <FaMobileAlt style={{ color: "#fbbf24" }} />
              </div>
              <h3>Mobile Access</h3>
              <p>
                Monitor and control your irrigation system from anywhere using our 
                responsive interface. Real-time sync across all your devices.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <FaCloudSun style={{ color: "#00d9ff" }} />
              </div>
              <h3>Weather Integration</h3>
              <p>
                Real-time weather data integration with predictive forecasting to optimize 
                irrigation schedules based on rainfall and temperature predictions.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <FaCog style={{ color: "#00fff5" }} />
              </div>
              <h3>Advanced Settings</h3>
              <p>
                Fine-tune sensor calibration with precision controls, set custom thresholds, 
                create complex watering schedules, and configure AI-driven automation rules.
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="landing-footer">
          <p>
            © 2026 <span className="footer-highlight">AquaSense</span> - Powered by AI. 
            All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}