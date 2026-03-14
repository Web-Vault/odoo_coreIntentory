import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Auth.css";
import "../styles/Dashboard.css";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};

    if (!form.name) newErrors.name = "Name is required";

    if (!form.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Invalid email";

    if (!form.password) newErrors.password = "Password required";
    else if (form.password.length < 6)
      newErrors.password = "Password must be 6 characters";

    if (form.confirmPassword !== form.password)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        const response = await fetch('http://localhost:8000/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            password: form.password,
            role: "Manager"
          })
        });
        
        if (response.ok) {
          navigate("/login");
        } else {
          const error = await response.json();
          setErrors({ auth: error.detail || "Registration failed. Try again." });
        }
      } catch (error) {
        console.error('Registration error:', error);
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
            Join the <span style={{ color: "var(--caramel)" }}>BrewIQ Community</span>
          </h1>
          <p className="auth-subtitle">
            Scale your coffee business with AI-powered inventory management and demand forecasting.
          </p>
          <button className="tb-btn" style={{ background: 'transparent', color: '#fff', borderColor: '#fff' }}>
            Learn More
          </button>
        </div>
      </div>

      {/* Right Section - Form */}
      <div className="auth-right">
        <div className="auth-card">
          <h2 className="auth-card-title">Create Account</h2>
          <p className="auth-card-subtitle">Sign up to start managing your inventory smarter</p>
          
          <form onSubmit={handleSubmit}>
            <div className="auth-form-group">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                className="auth-input"
                value={form.name}
                onChange={handleChange}
              />
              {errors.name && (
                <p className="auth-error">{errors.name}</p>
              )}
            </div>

            <div className="auth-form-group">
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                className="auth-input"
                value={form.email}
                onChange={handleChange}
              />
              {errors.email && (
                <p className="auth-error">{errors.email}</p>
              )}
            </div>

            <div className="auth-form-group">
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="auth-input"
                value={form.password}
                onChange={handleChange}
              />
              {errors.password && (
                <p className="auth-error">{errors.password}</p>
              )}
            </div>

            <div className="auth-form-group">
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                className="auth-input"
                value={form.confirmPassword}
                onChange={handleChange}
              />
              {errors.confirmPassword && (
                <p className="auth-error">{errors.confirmPassword}</p>
              )}
            </div>

            <button type="submit" className="auth-button">
              Register
            </button>

            <div className="auth-footer">
              Already have an account?{" "}
              <a href="/login" className="auth-link">Login here</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
