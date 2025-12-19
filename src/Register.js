import React, { useState } from "react";
import { auth, provider } from "./firebase";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import "./Login.css";

export default function Register({ setUser, setPage }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async () => {
    setError("");

    if (!name || !email || !password || !confirmPassword)
      return setError("Please fill all fields");

    if (password !== confirmPassword)
      return setError("Passwords do not match");

    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      localStorage.setItem("userName", name);
      localStorage.setItem("userEmail", email);
      setUser(result.user);
      setPage("dashboard");
    } catch (e) {
      setError("Registration failed");
    }
  };

  const handleGoogle = async () => {
    try {
      provider.setCustomParameters({
        prompt: "select_account"
      });
      await auth.signOut();
      const result = await signInWithPopup(auth, provider);
      localStorage.setItem("userName", result.user.displayName || "User");
      localStorage.setItem("userEmail", result.user.email);
      setUser(result.user);
      setPage("dashboard");
    } catch (error) {
      setError("Google signup failed");
    }
  };

  return (
    <div className="auth-container">
        <span className="leaf">🍃</span>
        <span className="leaf">🍂</span>
        <span className="leaf">🍃</span>
        <span className="leaf">🍂</span>
      <div className="auth-card">
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Sign up to get started</p>

        {error && <div className="error-message">{error}</div>}

        {/* NAME */}
        <label className="auth-label">
          Full Name <span className="required">*</span>
        </label>
        <input
          type="text"
          placeholder="Your name"
          className="auth-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* EMAIL */}
        <label className="auth-label">
          Email <span className="required">*</span>
        </label>
        <input
          type="email"
          placeholder="Email"
          className="auth-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* PASSWORD WITH EYE */}
        <label className="auth-label">
          Password <span className="required">*</span>
        </label>
        <div className="password-input-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="auth-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "👁️" : "👁️‍🗨️"}
          </button>
        </div>

        {/* CONFIRM PASSWORD WITH EYE */}
        <label className="auth-label">
          Confirm Password <span className="required">*</span>
        </label>
        <div className="password-input-wrapper">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm password"
            className="auth-input"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
          </button>
        </div>

        {/* REGISTER BUTTON */}
        <button className="submit-btn" onClick={handleRegister}>
          Sign Up
        </button>

        <div className="auth-divider">or continue with</div>

        {/* GOOGLE SIGNUP */}
        <button className="google-btn" onClick={handleGoogle}>
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
          />
          Google
        </button>

        <p className="auth-switch">
          Already have an account?{" "}
          <span className="auth-link" onClick={() => setPage("login")}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
}