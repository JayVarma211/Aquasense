import React, { useState } from "react";
import { auth, provider } from "./firebase";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  sendPasswordResetEmail
} from "firebase/auth";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaGoogle, FaMoon, FaSun } from "react-icons/fa";
import "./Login.css";

export default function Login({ setUser, setPage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      localStorage.setItem("userName", result.user.displayName || "User");
      localStorage.setItem("userEmail", result.user.email);
      setUser(result.user);
      setPage("dashboard");
    } catch (error) {
      console.error("Login error:", error);
      setError("Google login failed. Please try again.");
    }
  };

  const handleEmailLogin = async (e) => {
    e?.preventDefault();
    setError("");
    setMessage("");

    if (!email || !password) {
      return setError("Please fill all required fields");
    }

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      localStorage.setItem("userEmail", email);
      localStorage.setItem("userName", email.split("@")[0]);
      setUser(result.user);
      setPage("dashboard");
    } catch (err) {
      console.error("Email login error:", err);

      switch (err.code) {
        case "auth/user-not-found":
          setError("No account found with this email");
          break;
        case "auth/wrong-password":
          setError("Incorrect password");
          break;
        case "auth/invalid-email":
          setError("Invalid email address");
          break;
        case "auth/invalid-credential":
          setError("Invalid email or password");
          break;
        default:
          setError("Login failed. Please try again.");
      }
    }
  };

  const handleForgotPassword = async () => {
    setError("");
    setMessage("");

    if (!email) {
      return setError("Please enter your email first");
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset link sent! Check your email.");
    } catch (err) {
      console.error("Reset error:", err);
      if (err.code === "auth/user-not-found") {
        setError("No account found with this email");
      } else {
        setError("Failed to send reset email");
      }
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleEmailLogin(e);
    }
  };

  return (
    <div className={`auth-page ${theme}`}>
      <div className="theme-toggle" onClick={toggleTheme}>
        {theme === "dark" ? <FaSun /> : <FaMoon />}
      </div>

      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <img src="logo192.png" alt="AquaSense" className="auth-logo" />
            <h1>AquaSense</h1>
            <p>Smart Field Insights</p>
          </div>

          <div className="auth-form">
            <h2>Welcome Back</h2>
            <p className="auth-subtitle">Sign in to continue monitoring your fields</p>

            {message && <div className="success-alert">✓ {message}</div>}
            {error && <div className="error-alert">⚠ {error}</div>}

            <div className="form-group">
              <label>Email Address</label>
              <div className="input-wrapper">
                <FaEnvelope className="input-icon" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="input-wrapper">
                <FaLock className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <button
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  type="button"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button className="forgot-password-btn" onClick={handleForgotPassword}>
              Forgot Password?
            </button>

            <button className="auth-btn primary" onClick={handleEmailLogin}>
              Sign In
            </button>

            <div className="divider">OR</div>

            <button className="auth-btn google" onClick={handleGoogleLogin}>
              <FaGoogle /> Sign in with Google
            </button>

            <div className="auth-footer">
              <p>Don't have an account? <span className="auth-link" onClick={() => setPage("register")}>Create one</span></p>
            </div>
          </div>

          <div className="auth-decoration"></div>
        </div>
      </div>
    </div>
  );
}