import React, { useState } from "react";
import { auth, provider } from "./firebase";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  sendPasswordResetEmail
} from "firebase/auth";
import "./Login.css";

export default function Login({ setUser, setPage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleGoogleLogin = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    localStorage.setItem("userName", result.user.displayName || "User");
    localStorage.setItem("userEmail", result.user.email);
    setUser(result.user);
    setPage("dashboard");
  } catch (error) {
    console.error("Login error:", error);
    setError("Google login failed");
  }
};

  const handleEmailLogin = async () => {
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
          setError("User not found");
          break;
        case "auth/wrong-password":
          setError("Incorrect password");
          break;
        case "auth/invalid-email":
          setError("Invalid email address");
          break;
        default:
          setError("Login failed");
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
      setMessage("Password reset link sent to your email");
    } catch (err) {
      console.error("Reset error:", err);
      setError("Failed to send reset email");
    }
  };

  return (
    <div className="auth-container">
      <span className="leaf">🍃</span>
      <span className="leaf">🍂</span>
      <span className="leaf">🍃</span>
      <span className="leaf">🍂</span>

      <div className="auth-card">
        <h2 className="auth-title">AquaSense Login</h2>

        {/* SUCCESS MESSAGE */}
        {message && <div className="success-message">{message}</div>}

        {/* ERROR MESSAGE */}
        {error && <div className="error-message">{error}</div>}

        <label className="auth-label">Email <span className="required">*</span></label>
        <input
          type="email"
          placeholder="Enter your email"
          className="auth-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="auth-label">Password <span className="required">*</span></label>
        <div className="password-input-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter password"
            className="auth-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* EYE ICON */}
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "👁️" : "👁️‍🗨️"}
          </button>
        </div>

        {/* LOGIN BUTTON */}
        <button className="submit-btn" onClick={handleEmailLogin}>
          Login
        </button>

        {/* FORGOT PASSWORD */}
        <p className="forgot-password" onClick={handleForgotPassword}>
          Forgot Password?
        </p>

        <div className="auth-divider">OR</div>

        {/* GOOGLE LOGIN BUTTON (UNCHANGED) */}
        <button className="google-btn" onClick={handleGoogleLogin}>
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
          />
          Login with Google
        </button>

        <p className="auth-switch">
          Don't have an account?{" "}
          <span className="auth-link" onClick={() => setPage("register")}>
            Register
          </span>
        </p>
      </div>
    </div>
  );
}
