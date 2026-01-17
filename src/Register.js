import React, { useState, useRef } from "react";
import { auth, provider } from "./firebase";
import { createUserWithEmailAndPassword, signInWithPopup, sendEmailVerification, signInWithPhoneNumber, RecaptchaVerifier } from "firebase/auth";
import { FaEnvelope, FaPhone, FaLock, FaEye, FaEyeSlash, FaGoogle, FaCheck, FaArrowLeft, FaUser } from "react-icons/fa";
import "./Login.css";

export default function Register({ setUser, setPage }) {
  const theme = "dark";
  const [signupMethod, setSignupMethod] = useState(null);
  const [step, setStep] = useState(1);
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+1");
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const confirmationResult = useRef(null);

  const handleEmailSignup = async () => {
    setError("");

    if (!name || !email || !password || !confirmPassword) {
      return setError("Please fill all fields");
    }

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    if (password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return setError("Please enter a valid email address");
    }

    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      await sendEmailVerification(result.user);
      setMessage("Verification email sent! Please check your inbox.");
      setStep(3);
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setName("");
    } catch (e) {
      console.error("Registration error:", e);
      if (e.code === "auth/email-already-in-use") {
        setError("Email already registered. Please login.");
      } else if (e.code === "auth/weak-password") {
        setError("Password is too weak. Use at least 6 characters.");
      } else {
        setError("Registration failed. Please try again.");
      }
    }
  };

  const handlePhoneSignup = async () => {
    setError("");
    setMessage("");

    if (!phoneNumber) {
      return setError("Please enter your phone number");
    }

    // Validate phone number format (7-15 digits)
    const cleanPhone = phoneNumber.replace(/\D/g, "");
    if (!/^\d{7,15}$/.test(cleanPhone)) {
      return setError("Please enter a valid phone number (7-15 digits)");
    }

    try {
      // Setup reCAPTCHA verifier
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
          size: "invisible",
          callback: (token) => {
            console.log("reCAPTCHA token received");
          }
        });
      }

      const fullPhoneNumber = countryCode + cleanPhone;
      const result = await signInWithPhoneNumber(auth, fullPhoneNumber, window.recaptchaVerifier);
      
      confirmationResult.current = result;
      setMessage(`SMS sent to ${countryCode} ${phoneNumber}. Enter the 6-digit code.`);
      setShowOtpInput(true);
    } catch (e) {
      console.error("Phone signup error:", e);
      if (e.code === "auth/invalid-phone-number") {
        setError("Invalid phone number format. Please check and try again.");
      } else if (e.code === "auth/too-many-requests") {
        setError("Too many requests. Please try again later.");
      } else {
        setError("Failed to send SMS. Please check your phone number and try again.");
      }
      // Clear reCAPTCHA verifier on error
      window.recaptchaVerifier = null;
    }
  };

  const handleOtpVerification = async () => {
    setError("");

    if (!otp) {
      return setError("Please enter the OTP");
    }

    if (!confirmationResult.current) {
      return setError("SMS verification session expired. Please try again.");
    }

    try {
      const result = await confirmationResult.current.confirm(otp);
      
      localStorage.setItem("userName", `User_${phoneNumber}`);
      localStorage.setItem("userEmail", `${countryCode}${phoneNumber.replace(/\D/g, "")}`);
      localStorage.setItem("phoneVerified", "true");
      
      setUser(result.user);
      setPage("dashboard");
    } catch (e) {
      console.error("OTP verification error:", e);
      if (e.code === "auth/invalid-verification-code") {
        setError("Invalid OTP. Please check and try again.");
      } else if (e.code === "auth/code-expired") {
        setError("OTP expired. Please request a new one.");
      } else {
        setError("Verification failed. Please try again.");
      }
    }
  };

  const handleGoogleSignup = async () => {
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
      console.error("Google signup error:", error);
      setError("Google signup failed. Please try again.");
    }
  };

  const handleKeyPress = (e, action) => {
    if (e.key === 'Enter') {
      action();
    }
  };

  return (
    <div className={`auth-page ${theme}`}>
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <img src="logo192.png" alt="AquaSense" className="auth-logo" />
            <h1>AquaSense</h1>
            <p>Smart Field Insights</p>
          </div>

          {step === 1 && (
            <div className="auth-form">
              <h2>Create Your Account</h2>
              <p className="auth-subtitle">Choose your preferred signup method</p>

              {error && <div className="error-alert">⚠ {error}</div>}

              <div className="method-selector">
                <button
                  className="method-btn"
                  onClick={() => {
                    setSignupMethod("email");
                    setStep(2);
                    setError("");
                  }}
                >
                  <FaEnvelope />
                  <span>Email</span>
                  <p>Sign up with email and password</p>
                </button>

                <button
                  className="method-btn"
                  onClick={() => {
                    setSignupMethod("phone");
                    setStep(2);
                    setError("");
                  }}
                >
                  <FaPhone />
                  <span>Phone</span>
                  <p>Sign up with OTP verification</p>
                </button>
              </div>

              <div className="divider">OR</div>

              <button className="auth-btn google" onClick={handleGoogleSignup}>
                <FaGoogle /> Sign up with Google
              </button>

              <div className="auth-footer">
                <p>Already have an account? <span className="auth-link" onClick={() => setPage("login")}>Sign in</span></p>
              </div>
            </div>
          )}

          {step === 2 && signupMethod === "email" && (
            <div className="auth-form">
              <button className="back-btn" onClick={() => setStep(1)}>
                <FaArrowLeft /> Back
              </button>

              <h2>Create Your Account</h2>
              <p className="auth-subtitle">Sign up with email</p>

              {error && <div className="error-alert">⚠ {error}</div>}

              <div className="form-group">
                <label>Full Name</label>
                <div className="input-wrapper">
                  <FaUser className="input-icon" />
                  <input
                    type="text"
                    placeholder="Your full name"
                    className="form-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

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
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Password</label>
                <div className="input-wrapper">
                  <FaLock className="input-icon" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    className="form-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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

              <div className="form-group">
                <label>Confirm Password</label>
                <div className="input-wrapper">
                  <FaLock className="input-icon" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    className="form-input"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, handleEmailSignup)}
                  />
                  <button
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    type="button"
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <button className="auth-btn primary" onClick={handleEmailSignup}>
                Create Account
              </button>

              <div className="auth-footer">
                <p>Already have an account? <span className="auth-link" onClick={() => setPage("login")}>Sign in</span></p>
              </div>
            </div>
          )}

          {step === 2 && signupMethod === "phone" && (
            <div className="auth-form">
              <button className="back-btn" onClick={() => setStep(1)}>
                <FaArrowLeft /> Back
              </button>

              <h2>Phone Verification</h2>
              <p className="auth-subtitle">Enter your phone number to get started</p>

              {error && <div className="error-alert">⚠ {error}</div>}
              {message && <div className="success-alert">✓ {message}</div>}

              {!showOtpInput ? (
                <>
                  <div className="form-group">
                    <label>Country Code</label>
                    <select
                      className="form-input country-code-select"
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                    >
                      <option value="+1">🇺🇸 USA/Canada (+1)</option>
                      <option value="+44">🇬🇧 United Kingdom (+44)</option>
                      <option value="+91">🇮🇳 India (+91)</option>
                      <option value="+86">🇨🇳 China (+86)</option>
                      <option value="+81">🇯🇵 Japan (+81)</option>
                      <option value="+33">🇫🇷 France (+33)</option>
                      <option value="+49">🇩🇪 Germany (+49)</option>
                      <option value="+39">🇮🇹 Italy (+39)</option>
                      <option value="+34">🇪🇸 Spain (+34)</option>
                      <option value="+61">🇦🇺 Australia (+61)</option>
                      <option value="+55">🇧🇷 Brazil (+55)</option>
                      <option value="+27">🇿🇦 South Africa (+27)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Phone Number</label>
                    <div className="input-wrapper">
                      <FaPhone className="input-icon" />
                      <input
                        type="tel"
                        placeholder="1234567890"
                        className="form-input"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                        onKeyPress={(e) => handleKeyPress(e, handlePhoneSignup)}
                      />
                    </div>
                    <p className="form-hint">Enter digits only (7-15 digits)</p>
                  </div>

                  <button className="auth-btn primary" onClick={handlePhoneSignup}>
                    Send OTP
                  </button>

                  <div id="recaptcha-container"></div>
                </>
              ) : (
                <>
                  <div className="form-group">
                    <label>Enter OTP</label>
                    <div className="input-wrapper">
                      <input
                        type="text"
                        placeholder="000000"
                        className="form-input otp-input"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        onKeyPress={(e) => handleKeyPress(e, handleOtpVerification)}
                        maxLength="6"
                        autoFocus
                      />
                    </div>
                    <p className="form-hint">Enter the 6-digit code sent to {countryCode} {phoneNumber}</p>
                  </div>

                  <button className="auth-btn primary" onClick={handleOtpVerification}>
                    Verify OTP
                  </button>

                  <button 
                    className="auth-btn secondary" 
                    onClick={() => {
                      setShowOtpInput(false);
                      setOtp("");
                      setPhoneNumber("");
                      setMessage("");
                      window.recaptchaVerifier = null;
                    }}
                  >
                    Use Different Number
                  </button>
                </>
              )}

              <div className="auth-footer">
                <p>Already have an account? <span className="auth-link" onClick={() => setPage("login")}>Sign in</span></p>
              </div>
            </div>
          )}

          {step === 3 && signupMethod === "email" && (
            <div className="auth-form verification-view">
              <div className="verification-icon">
                <FaCheck />
              </div>

              <h2>Verify Your Email</h2>
              <p className="auth-subtitle">We've sent a verification link to your inbox</p>

              <div className="verification-message">
                <p>Please check your email and click the verification link to complete your account setup.</p>
                <p>After verification, you can sign in with your account.</p>
              </div>

              <button className="auth-btn primary" onClick={() => setPage("login")}>
                Go to Login
              </button>

              <div className="auth-footer">
                <p><span className="auth-link" onClick={() => { setStep(1); setSignupMethod(null); }}>Create different account</span></p>
              </div>
            </div>
          )}

          <div className="auth-decoration"></div>
        </div>
      </div>
    </div>
  );
}