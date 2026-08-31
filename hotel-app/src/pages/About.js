import React from "react";
import Navbar from "../components/Navbar";
import { CheckCircle, ShieldAlert, Upload, Key, FileText, Sparkles } from "lucide-react";

function About() {
  return (
    <div className="app-container">
      <Navbar />

      <main className="main-content">
        <div className="section-card">
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
            <Sparkles size={24} color="var(--primary-gold)" />
            <h1 style={{ fontSize: "1.8rem", fontWeight: 800 }}>About Grand Horizon Hotel Management</h1>
          </div>

          <p style={{ color: "var(--text-muted)", fontSize: "1rem", lineHeight: 1.6, marginBottom: "24px" }}>
            This application is an enterprise-ready, full-stack Hotel Management platform built with Spring Boot REST Services and a React interactive frontend.
          </p>

          <h2 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "16px" }}>System Capabilities & Features</h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px", marginBottom: "28px" }}>
            <div style={{ background: "rgba(15,23,42,0.6)", padding: "18px", borderRadius: "10px", border: "1px solid var(--border-color)" }}>
              <ShieldAlert size={24} color="var(--primary-gold)" style={{ marginBottom: "8px" }} />
              <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "6px" }}>Admin CRUD Operations</h3>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                Full Create, Read, Update, and Delete capabilities for both Hotel Rooms and Guest Reservations with live metric analytics.
              </p>
            </div>

            <div style={{ background: "rgba(15,23,42,0.6)", padding: "18px", borderRadius: "10px", border: "1px solid var(--border-color)" }}>
              <Upload size={24} color="var(--primary-blue)" style={{ marginBottom: "8px" }} />
              <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "6px" }}>File & Document Uploads</h3>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                Local multipart file storage for room images, guest ID proofs (Passports/Aadhaar), and downloadable PDF receipts.
              </p>
            </div>

            <div style={{ background: "rgba(15,23,42,0.6)", padding: "18px", borderRadius: "10px", border: "1px solid var(--border-color)" }}>
              <Key size={24} color="#34d399" style={{ marginBottom: "8px" }} />
              <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "6px" }}>User Portal & Booking</h3>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                Guest portal for room browsing with live price calculation, date selection, booking management, and invoice printing.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default About;