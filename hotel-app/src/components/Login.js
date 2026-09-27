import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../services/api";
import {
  Building,
  ArrowRight,
  AlertCircle,
  ShieldAlert,
  User
} from "lucide-react";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  /*
   * Determine which login was selected from Welcome page.
   *
   * ADMIN  -> Admin Module
   * USER   -> User View
   *
   * If someone directly opens /login without selecting
   * anything, USER login is used as the default.
   */
  const loginType = location.state?.loginType || "USER";

  const isAdminLogin = loginType === "ADMIN";

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

      /*
       * IMPORTANT:
       * Check the actual role returned by the backend.
       *
       * This prevents a normal USER account from entering
       * the Admin Module and prevents ADMIN from entering
       * through User View.
       */

      if (isAdminLogin && userData.role !== "ADMIN") {
        setError(
          "This account is not an administrator. Please use the User View."
        );
        setLoading(false);
        return;
      }

      if (!isAdminLogin && userData.role === "ADMIN") {
        setError(
          "Administrator account detected. Please use the Admin Module."
        );
        setLoading(false);
        return;
      }

      // Save authenticated user
      login(userData);

      // Redirect according to actual backend role
      if (userData.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }

    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError(
          "Unable to connect to the server. Please try again."
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
          border: isAdminLogin
            ? "1px solid var(--border-gold)"
            : "1px solid rgba(59, 130, 246, 0.4)"
        }}
      >

        {/* HEADER */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "28px"
          }}
        >

          {/* ICON */}
          <div
            className="brand-icon"
            style={{
              width: "48px",
              height: "48px",
              margin: "0 auto 14px",
              borderRadius: "14px"
            }}
          >
            {isAdminLogin ? (
              <ShieldAlert size={28} />
            ) : (
              <User size={28} />
            )}
          </div>

          {/* TITLE */}
          <h2
            style={{
              fontSize: "1.6rem",
              fontWeight: 800
            }}
          >
            {isAdminLogin ? "Admin Login" : "User Login"}
          </h2>

          {/* DESCRIPTION */}
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "0.88rem",
              marginTop: "4px"
            }}
          >
            {isAdminLogin
              ? "Access the Grand Horizon Administrator Portal"
              : "Access your Grand Horizon Hotel account"}
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
              placeholder={
                isAdminLogin
                  ? "Enter admin username or email"
                  : "Enter username or email"
              }
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
                {isAdminLogin ? "Admin Sign In" : "Sign In"}
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* USER SIGNUP */}
        {!isAdminLogin && (
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
        )}

        {/* BACK TO HOME */}
        <div
          style={{
            textAlign: "center",
            marginTop: "18px"
          }}
        >
          <button
            type="button"
            onClick={() => navigate("/")}
            style={{
              background: "none",
              border: "none",
              color: "var(--text-muted)",
              cursor: "pointer",
              fontSize: "0.82rem"
            }}
          >
            ← Back to Home
          </button>
        </div>

      </div>
    </div>
  );
}

export default Login;