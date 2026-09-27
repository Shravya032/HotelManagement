
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Building,
  ShieldAlert,
  User,
  LogOut,
  Calendar,
  Key
} from "lucide-react";

function Navbar() {
  const { user, role, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="navbar">
      <div className="navbar-inner">

        {/* Brand */}
        <Link to="/" className="brand-logo">
          <div className="brand-icon">
            <Building size={20} />
          </div>

          <div>
            <span
              style={{
                color: "var(--primary-gold)",
                letterSpacing: "1px"
              }}
            >
              GRAND HORIZON
            </span>

            <div
              style={{
                fontSize: "0.7rem",
                color: "var(--text-muted)",
                textTransform: "uppercase"
              }}
            >
              Luxury Hotel Management
            </div>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="nav-links">

          {role === "ADMIN" ? (
            <>
              <Link
                to="/admin"
                className={`nav-link ${
                  isActive("/admin") ? "active" : ""
                }`}
              >
                <ShieldAlert
                  size={16}
                  style={{ marginRight: 6 }}
                />
                Admin Dashboard
              </Link>

              <Link
                to="/admin/rooms"
                className={`nav-link ${
                  isActive("/admin/rooms") ? "active" : ""
                }`}
              >
                <Key
                  size={16}
                  style={{ marginRight: 6 }}
                />
                Room Catalog (CRUD)
              </Link>

              <Link
                to="/admin/reservations"
                className={`nav-link ${
                  isActive("/admin/reservations") ? "active" : ""
                }`}
              >
                <Calendar
                  size={16}
                  style={{ marginRight: 6 }}
                />
                Reservations (CRUD)
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/dashboard"
                className={`nav-link ${
                  isActive("/dashboard") ? "active" : ""
                }`}
              >
                <User
                  size={16}
                  style={{ marginRight: 6 }}
                />
                User Dashboard
              </Link>

              <Link
                to="/user/browse"
                className={`nav-link ${
                  isActive("/user/browse") ? "active" : ""
                }`}
              >
                <Key
                  size={16}
                  style={{ marginRight: 6 }}
                />
                Browse Rooms
              </Link>

              <Link
                to="/user/my-bookings"
                className={`nav-link ${
                  isActive("/user/my-bookings") ? "active" : ""
                }`}
              >
                <Calendar
                  size={16}
                  style={{ marginRight: 6 }}
                />
                My Bookings
              </Link>
            </>
          )}

          <Link
            to="/about"
            className={`nav-link ${
              isActive("/about") ? "active" : ""
            }`}
          >
            About
          </Link>

        </nav>

        {/* Controls */}
        <div className="nav-controls">

          {/* Role Toggle Removed */}

          {user && (
            <button
              onClick={handleLogout}
              className="btn btn-outline btn-sm"
              title="Log out"
            >
              <LogOut size={14} />
              Logout
            </button>
          )}

        </div>

      </div>
    </header>
  );
}

export default Navbar;

