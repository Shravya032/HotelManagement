import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Building, ArrowRight, UserCheck } from "lucide-react";

function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "USER"
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem(formData.username, JSON.stringify(formData));
    login(formData);
    alert(`Account created successfully as ${formData.role}!`);
    navigate(formData.role === "ADMIN" ? "/admin" : "/dashboard");
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div className="section-card" style={{ width: "100%", maxWidth: "440px", border: "1px solid var(--border-color)" }}>
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div className="brand-icon" style={{ width: "48px", height: "48px", margin: "0 auto 14px", borderRadius: "14px" }}>
            <Building size={28} />
          </div>
          <h2 style={{ fontSize: "1.6rem", fontWeight: 800 }}>Create An Account</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", marginTop: "4px" }}>
            Join Grand Horizon Hotel System
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{ fontSize: "0.85rem", color: "var(--text-muted)", display: "block", marginBottom: "6px" }}>Username *</label>
            <input
              type="text"
              required
              placeholder="Your full name or username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
          </div>

          <div>
            <label style={{ fontSize: "0.85rem", color: "var(--text-muted)", display: "block", marginBottom: "6px" }}>Email Address</label>
            <input
              type="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label style={{ fontSize: "0.85rem", color: "var(--text-muted)", display: "block", marginBottom: "6px" }}>Password *</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <div>
            <label style={{ fontSize: "0.85rem", color: "var(--text-muted)", display: "block", marginBottom: "6px" }}>Account Role *</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <option value="USER">Guest User View</option>
              <option value="ADMIN">Hotel Administrator View</option>
            </select>
          </div>

          <button type="submit" className="btn btn-gold" style={{ marginTop: "6px", width: "100%" }}>
            Register & Continue <UserCheck size={16} />
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "20px", fontSize: "0.85rem", color: "var(--text-muted)" }}>
          Already have an account?{" "}
          <span 
            onClick={() => navigate("/login")}
            style={{ color: "var(--primary-gold)", cursor: "pointer", fontWeight: 700 }}
          >
            Sign In
          </span>
        </div>
      </div>
    </div>
  );
}

export default Signup;