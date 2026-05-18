// src/pages/Login.js

import { useState } from "react";
import { useNavigate } from "react-router-dom"; // ← ADD
import "./Login.css";

function Login() {
  const [loginType, setLoginType] = useState("employee");
  const navigate = useNavigate(); // ← ADD

  // ← ADD this handler
  const handleLogin = (e) => {
    e.preventDefault();
    if (loginType === "admin") {
      navigate("/admin/dashboard");
    } else {
      navigate("/employee/dashboard");
    }
  };

  return (
    <div className="login-page">
      <div className="overlay">
        <div className="login-card">

          <div className="login-header">
            <h3>
              <span className="arrow">ARROW</span>
              <span className="data"> DATA </span>
              <span className="tech">TECH</span>
            </h3>
            <p className="portal-text">
              🤝 Welcome Back to
              <span className="portal-highlight"> Production Portal </span>📝
            </p>
          </div>

          <div className="login-toggle">
            <button
              className={loginType === "admin" ? "active" : ""}
              onClick={() => setLoginType("admin")}
              type="button"
            >
              Admin Login
            </button>
            <button
              className={loginType === "employee" ? "active" : ""}
              onClick={() => setLoginType("employee")}
              type="button"
            >
              Employee Login
            </button>
          </div>

          {/* ↓ ONLY CHANGE — add onSubmit */}
          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label>Email / User ID</label>
              <input type="email" placeholder="Enter your email or user ID" />
            </div>
            <div className="input-group">
              <label>Password</label>
              <input type="password" placeholder="Enter your password" />
            </div>
            <button type="submit" className="login-btn">Login</button>
          </form>

        </div>
      </div>
    </div>
  );
}

export default Login;