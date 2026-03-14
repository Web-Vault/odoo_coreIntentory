import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Auth.css";
import "../styles/Dashboard.css"; // Ensure root variables are available

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Invalid email";

    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        const response = await fetch('http://localhost:8000/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        
        if (response.ok) {
          const user = await response.json();
          // Save user info to localStorage if needed
          localStorage.setItem('user', JSON.stringify(user));
          navigate("/dashboard");
        } else {
          const error = await response.json();
          setErrors({
            auth: error.detail || "Invalid email or password. Hint: admin@brewiq.com / password123"
          });
        }
      } catch (error) {
        console.error('Login error:', error);
        setErrors({ auth: "Connection error. Is the backend running?" });
      }
    }
  };

  return (
    <div className="auth-shell">
      {/* Left Section - Hero */}
      <div className="auth-left">
        <div className="auth-left-content">
          <div className="auth-brand">
            <span className="auth-logo-icon">☕</span>
            <span className="auth-logo-text">BrewIQ</span>
          </div>
          <h1 className="auth-title">
            Coffee <span style={{ color: "var(--caramel)" }}>Build Your Mind</span>
          </h1>
          <p className="auth-subtitle">
            Start your day with a cup of inspiration. Join our community of
            coffee lovers and get exclusive updates!
          </p>
          <button className="tb-btn" style={{ background: 'transparent', color: '#fff', borderColor: '#fff' }}>
            Get Started
          </button>
        </div>
      </div>

      {/* Right Section - Form */}
      <div className="auth-right">
        <div className="auth-card">
          <h2 className="auth-card-title">Member Login</h2>
          <p className="auth-card-subtitle">Enter your credentials to access your inventory</p>
          
          {errors.auth && (
            <div className="auth-error" style={{ textAlign: 'center', marginBottom: '16px', padding: '8px', background: 'rgba(192, 57, 43, 0.1)', borderRadius: '4px' }}>
              {errors.auth}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="auth-form-group">
              <div className="auth-input-wrapper">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="auth-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              {errors.email && (
                <p className="auth-error">{errors.email}</p>
              )}
            </div>

            <div className="auth-form-group">
              <div className="auth-input-wrapper">
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="auth-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {errors.password && (
                <p className="auth-error">{errors.password}</p>
              )}
            </div>

            <div className="auth-options">
              <label className="auth-checkbox-label">
                <input type="checkbox" /> Remember me
              </label>
              <a href="/" className="auth-link">Forgot Password?</a>
            </div>

            <button type="submit" className="auth-button">
              Login
            </button>

            <div className="auth-footer">
              Not a member?{" "}
              <a href="/register" className="auth-link">Sign up now</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
