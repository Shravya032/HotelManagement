import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Building, ShieldAlert, User, Sparkles, ArrowRight, CheckCircle } from "lucide-react";

function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="app-container">
      <Navbar />

      <main className="main-content" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "75vh" }}>
        <div 
          className="section-card" 
          style={{ 
            maxWidth: "750px", 
            width: "100%", 
            textAlign: "center", 
            padding: "48px 36px",
            border: "1px solid var(--border-gold)",
            background: "linear-gradient(180deg, rgba(21, 28, 44, 0.95), rgba(15, 23, 42, 0.95))"
          }}
        >
          <div className="brand-icon" style={{ width: "64px", height: "64px", margin: "0 auto 20px", borderRadius: "18px" }}>
            <Building size={36} />
          </div>

          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(245, 158, 11, 0.15)", color: "var(--primary-gold)", padding: "4px 12px", borderRadius: "999px", fontSize: "0.8rem", fontWeight: 700, marginBottom: "16px" }}>
            <Sparkles size={14} /> LUXURY HOTEL & SUITES
          </div>

          <h1 style={{ fontSize: "2.4rem", fontWeight: 800, marginBottom: "12px", lineHeight: 1.2 }}>
            Professional Hotel Operations & Reservation System
          </h1>

          <p style={{ color: "var(--text-muted)", fontSize: "1.05rem", maxWidth: "580px", margin: "0 auto 32px" }}>
            Experience an interactive portal designed for both Hotel Administrators and Guests with complete CRUD operations, room management, and document uploads.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", maxWidth: "500px", margin: "0 auto 36px" }}>
            <div 
              onClick={() => navigate("/admin")}
              style={{ 
                background: "rgba(245, 158, 11, 0.08)", 
                border: "1px solid var(--border-gold)", 
                padding: "20px", 
                borderRadius: "14px", 
                cursor: "pointer",
                transition: "var(--transition)"
              }}
              className="card-hover"
            >
              <ShieldAlert size={28} color="var(--primary-gold)" style={{ marginBottom: "8px" }} />
              <div style={{ fontWeight: 800, fontSize: "1.1rem" }}>Admin Module</div>
              <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "4px" }}>
                Full CRUD for Rooms & Reservations, Document Upload, & Metrics
              </div>
            </div>

            <div 
              onClick={() => navigate("/dashboard")}
              style={{ 
                background: "rgba(59, 130, 246, 0.08)", 
                border: "1px solid rgba(59, 130, 246, 0.3)", 
                padding: "20px", 
                borderRadius: "14px", 
                cursor: "pointer",
                transition: "var(--transition)"
              }}
              className="card-hover"
            >
              <User size={28} color="var(--primary-blue)" style={{ marginBottom: "8px" }} />
              <div style={{ fontWeight: 800, fontSize: "1.1rem" }}>User View</div>
              <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "4px" }}>
                Browse Rooms, Book Stays, Dynamic Price Calculator & My Bookings
              </div>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: "14px" }}>
            <button className="btn btn-gold" onClick={() => navigate("/login")}>
              Sign In <ArrowRight size={16} />
            </button>
            <button className="btn btn-outline" onClick={() => navigate("/signup")}>
              Create Account
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Welcome;