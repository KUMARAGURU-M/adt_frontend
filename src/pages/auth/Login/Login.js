// src/pages/Login.js

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

// ── Generates a random 6-char alphanumeric CAPTCHA string ──
function generateCaptcha() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  return Array.from({ length: 6 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join("");
}

function Login() {
  const [loginType, setLoginType] = useState("employee");
  const [captchaText, setCaptchaText] = useState("");
  const [userCaptcha, setUserCaptcha] = useState("");
  const [captchaError, setCaptchaError] = useState("");
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  // ── Draw CAPTCHA on canvas ──
  const drawCaptcha = (text) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;

    // Background
    ctx.clearRect(0, 0, W, H);
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, "rgba(19,198,223,0.08)");
    bg.addColorStop(1, "rgba(255,59,92,0.08)");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Noise lines
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.moveTo(Math.random() * W, Math.random() * H);
      ctx.lineTo(Math.random() * W, Math.random() * H);
      ctx.strokeStyle = `rgba(${Math.random() > 0.5 ? "19,198,223" : "255,59,92"},0.25)`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Noise dots
    for (let i = 0; i < 30; i++) {
      ctx.beginPath();
      ctx.arc(Math.random() * W, Math.random() * H, 1, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,0.15)";
      ctx.fill();
    }

    // Draw each character with slight rotation & offset
    const colors = ["#13c6df", "#ff3b5c", "#ffffff", "#9b9b9b", "#4de7ff", "#ff7a9a"];
    const fonts = ["bold 22px 'Courier New'", "bold 20px 'Arial Black'", "bold 21px monospace"];
    text.split("").forEach((char, i) => {
      ctx.save();
      const x = 14 + i * 26;
      const y = H / 2 + 7;
      ctx.translate(x, y);
      ctx.rotate(((Math.random() - 0.5) * Math.PI) / 6);
      ctx.font = fonts[i % fonts.length];
      ctx.fillStyle = colors[i % colors.length];
      ctx.shadowColor = colors[i % colors.length];
      ctx.shadowBlur = 4;
      ctx.fillText(char, 0, 0);
      ctx.restore();
    });
  };

  const refreshCaptcha = () => {
    const text = generateCaptcha();
    setCaptchaText(text);
    setUserCaptcha("");
    setCaptchaError("");
    // Draw after state updates
    setTimeout(() => drawCaptcha(text), 0);
  };

  // Generate on mount
  useEffect(() => {
    refreshCaptcha();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Redraw whenever captchaText changes
  useEffect(() => {
    if (captchaText) drawCaptcha(captchaText);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [captchaText]);

  const handleLogin = (e) => {
    e.preventDefault();

    // CAPTCHA validation
    if (userCaptcha.trim() !== captchaText) {
      setCaptchaError("Incorrect CAPTCHA. Please try again.");
      refreshCaptcha();
      return;
    }

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

          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label>Email / User ID</label>
              <input type="email" placeholder="Enter your email or user ID" />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input type="password" placeholder="Enter your password" />
            </div>

            {/* ── CAPTCHA SECTION ── */}
            <div className="captcha-group">
              <label className="captcha-label">Verification Code</label>

              <div className="captcha-display">
                <canvas
                  ref={canvasRef}
                  width={170}
                  height={48}
                  className="captcha-canvas"
                />
                <button
                  type="button"
                  className="captcha-refresh"
                  onClick={refreshCaptcha}
                  title="Refresh CAPTCHA"
                >
                  ↻
                </button>
              </div>

              <input
                type="text"
                className="captcha-input"
                placeholder="Enter the code above"
                value={userCaptcha}
                onChange={(e) => {
                  setUserCaptcha(e.target.value);
                  setCaptchaError("");
                }}
                maxLength={6}
                autoComplete="off"
                spellCheck={false}
              />

              {captchaError && (
                <span className="captcha-error">{captchaError}</span>
              )}
            </div>
            {/* ── END CAPTCHA ── */}

            <button type="submit" className="login-btn">Login</button>
          </form>

        </div>
      </div>
    </div>
  );
}

export default Login;