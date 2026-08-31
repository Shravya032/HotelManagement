import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Building, ShieldAlert, User, ArrowRight, Sparkles } from "lucide-react";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [credentials, setCredentials] = useState({
    username: "",
    password: ""
  });

  const handleLogin = (e) => {
    e.preventDefault();
    const stored = localStorage.getItem(credentials.username);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.password === credentials.password) {
        login(parsed);
        navigate(parsed.role === "ADMIN" ? "/admin" : "/dashboard");
        return;
      }
    }

    // Fallback default login check
    if (credentials.username.toLowerCase().includes("admin")) {
      login({ username: credentials.username || "Admin User", email: "admin@grandhotel.com", role: "ADMIN" });
      navigate("/admin");
    } else {
      login({ username: credentials.username || "Guest User", email: "guest@example.com", role: "USER" });
      navigate("/dashboard");
    }
  };

  const quickDemoLogin = (roleType) => {
    if (roleType === "ADMIN") {
      login({ username: "Admin Console", email: "admin@grandhotel.com", role: "ADMIN" });
      navigate("/admin");
    } else {
      login({ username: "Sarah Jenkins", email: "sarah.j@example.com", role: "USER" });
      navigate("/dashboard");
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div className="section-card" style={{ width: "100%", maxWidth: "440px", border: "1px solid var(--border-gold)" }}>
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div className="brand-icon" style={{ width: "48px", height: "48px", margin: "0 auto 14px", borderRadius: "14px" }}>
            <Building size={28} />
          </div>
          <h2 style={{ fontSize: "1.6rem", fontWeight: 800 }}>Welcome Back</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", marginTop: "4px" }}>
            Access Grand Horizon Hotel Portal
          </p>
        </div>

        {/* 1-Click Quick Demo Login Shortcuts */}
        <div style={{ background: "rgba(245, 158, 11, 0.08)", border: "1px dashed var(--border-gold)", padding: "14px", borderRadius: "10px", marginBottom: "24px" }}>
          <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--primary-gold)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
            <Sparkles size={14} /> Quick Demo One-Click Access
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <button
              onClick={() => quickDemoLogin("ADMIN")}
              className="btn btn-gold btn-sm"
              style={{ padding: "8px" }}
            >
              <ShieldAlert size={14} /> Login Admin
            </button>
            <button
              onClick={() => quickDemoLogin("USER")}
              className="btn btn-outline btn-sm"
              style={{ padding: "8px" }}
            >
              <User size={14} /> Login Guest
            </button>
          </div>
        </div>

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{ fontSize: "0.85rem", color: "var(--text-muted)", display: "block", marginBottom: "6px" }}>Username or Email</label>
            <input
              type="text"
              required
              placeholder="e.g. admin or guest"
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
            />
          </div>

          <div>
            <label style={{ fontSize: "0.85rem", color: "var(--text-muted)", display: "block", marginBottom: "6px" }}>Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            />
          </div>

          <button type="submit" className="btn btn-gold" style={{ marginTop: "6px", width: "100%" }}>
            Sign In <ArrowRight size={16} />
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "20px", fontSize: "0.85rem", color: "var(--text-muted)" }}>
          Don't have an account?{" "}
          <span 
            onClick={() => navigate("/signup")}
            style={{ color: "var(--primary-gold)", cursor: "pointer", fontWeight: 700 }}
          >
            Create Account
          </span>
        </div>
      </div>
    </div>
  );
}

export default Login;