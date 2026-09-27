
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building, UserCheck, AlertCircle } from "lucide-react";
import { registerUser } from "../services/api";
import { useAuth } from "../context/AuthContext";

function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await registerUser({
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password
      });

      const userData = response.data;

      // Backend always creates normal registrations as USER
      login(userData);

      alert("Account created successfully!");

      navigate("/dashboard");

    } catch (err) {

      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError(
          "Unable to create account. Please try again."
        );
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px"
      }}
    >
      <div
        className="section-card"
        style={{
          width: "100%",
          maxWidth: "440px",
          border: "1px solid var(--border-color)"
        }}
      >

        {/* HEADER */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "24px"
          }}
        >
          <div
            className="brand-icon"
            style={{
              width: "48px",
              height: "48px",
              margin: "0 auto 14px",
              borderRadius: "14px"
            }}
          >
            <Building size={28} />
          </div>

          <h2
            style={{
              fontSize: "1.6rem",
              fontWeight: 800
            }}
          >
            Create An Account
          </h2>

          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "0.88rem",
              marginTop: "4px"
            }}
          >
            Join Grand Horizon Hotel System
          </p>
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 14px",
              marginBottom: "18px",
              borderRadius: "8px",
              background: "rgba(239, 68, 68, 0.10)",
              border: "1px solid rgba(239, 68, 68, 0.35)",
              color: "#ef4444",
              fontSize: "0.85rem"
            }}
          >
            <AlertCircle size={17} />
            <span>{error}</span>
          </div>
        )}

        {/* SIGNUP FORM */}
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px"
          }}
        >

          {/* USERNAME */}
          <div>
            <label
              style={{
                fontSize: "0.85rem",
                color: "var(--text-muted)",
                display: "block",
                marginBottom: "6px"
              }}
            >
              Username *
            </label>

            <input
              type="text"
              required
              minLength={3}
              placeholder="Choose a username"
              value={formData.username}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  username: e.target.value
                });
                setError("");
              }}
            />
          </div>

          {/* EMAIL */}
          <div>
            <label
              style={{
                fontSize: "0.85rem",
                color: "var(--text-muted)",
                display: "block",
                marginBottom: "6px"
              }}
            >
              Email Address *
            </label>

            <input
              type="email"
              required
              placeholder="name@example.com"
              value={formData.email}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  email: e.target.value
                });
                setError("");
              }}
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label
              style={{
                fontSize: "0.85rem",
                color: "var(--text-muted)",
                display: "block",
                marginBottom: "6px"
              }}
            >
              Password *
            </label>

            <input
              type="password"
              required
              minLength={6}
              placeholder="At least 6 characters"
              value={formData.password}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  password: e.target.value
                });
                setError("");
              }}
            />
          </div>

          {/* ROLE INFORMATION */}
          <div
            style={{
              padding: "12px 14px",
              borderRadius: "8px",
              background: "rgba(245, 158, 11, 0.08)",
              border: "1px solid var(--border-gold)",
              fontSize: "0.82rem",
              color: "var(--text-muted)",
              lineHeight: 1.5
            }}
          >
            <strong style={{ color: "var(--primary-gold)" }}>
              Guest Account
            </strong>
            <br />
            New accounts are registered as Guest Users.
            Administrator accounts are created separately
            by the hotel system.
          </div>

          {/* REGISTER BUTTON */}
          <button
            type="submit"
            className="btn btn-gold"
            disabled={loading}
            style={{
              marginTop: "6px",
              width: "100%",
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer"
            }}
          >
            {loading ? (
              "Creating Account..."
            ) : (
              <>
                Register & Continue
                <UserCheck size={16} />
              </>
            )}
          </button>
        </form>

        {/* LOGIN LINK */}
        <div
          style={{
            textAlign: "center",
            marginTop: "20px",
            fontSize: "0.85rem",
            color: "var(--text-muted)"
          }}
        >
          Already have an account?{" "}

          <span
            onClick={() => navigate("/login")}
            style={{
              color: "var(--primary-gold)",
              cursor: "pointer",
              fontWeight: 700
            }}
          >
            Sign In
          </span>
        </div>

      </div>
    </div>
  );
}

export default Signup;
