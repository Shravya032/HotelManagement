
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../services/api";
import { Building, ArrowRight, AlertCircle } from "lucide-react";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [credentials, setCredentials] = useState({
    username: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await loginUser({
        usernameOrEmail: credentials.username.trim(),
        password: credentials.password
      });

      const userData = response.data;

      login(userData);

      if (userData.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }

    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Unable to connect to the server. Please try again.");
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
          border: "1px solid var(--border-gold)"
        }}
      >
        {/* HEADER */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "28px"
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
            Welcome Back
          </h2>

          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "0.88rem",
              marginTop: "4px"
            }}
          >
            Access Grand Horizon Hotel Portal
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

        {/* LOGIN FORM */}
        <form
          onSubmit={handleLogin}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px"
          }}
        >
          {/* USERNAME / EMAIL */}
          <div>
            <label
              style={{
                fontSize: "0.85rem",
                color: "var(--text-muted)",
                display: "block",
                marginBottom: "6px"
              }}
            >
              Username or Email
            </label>

            <input
              type="text"
              required
              placeholder="Enter username or email"
              value={credentials.username}
              onChange={(e) => {
                setCredentials({
                  ...credentials,
                  username: e.target.value
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
              Password
            </label>

            <input
              type="password"
              required
              placeholder="Enter your password"
              value={credentials.password}
              onChange={(e) => {
                setCredentials({
                  ...credentials,
                  password: e.target.value
                });
                setError("");
              }}
            />
          </div>

          {/* LOGIN BUTTON */}
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
              "Signing In..."
            ) : (
              <>
                Sign In <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* SIGNUP */}
        <div
          style={{
            textAlign: "center",
            marginTop: "20px",
            fontSize: "0.85rem",
            color: "var(--text-muted)"
          }}
        >
          Don't have an account?{" "}

          <span
            onClick={() => navigate("/signup")}
            style={{
              color: "var(--primary-gold)",
              cursor: "pointer",
              fontWeight: 700
            }}
          >
            Create Account
          </span>
        </div>
      </div>
    </div>
  );
}

export default Login;

