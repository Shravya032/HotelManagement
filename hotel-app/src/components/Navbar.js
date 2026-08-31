import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { 
  Building, 
  ShieldAlert, 
  User, 
  LogOut, 
  Calendar, 
  Key, 
  Sparkles 
} from "lucide-react";

function Navbar() {
  const { user, role, logout, switchRole } = useAuth();
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
        <Link to="/" className="brand-logo">
          <div className="brand-icon">
            <Building size={20} />
          </div>
          <div>
            <span style={{ color: "var(--primary-gold)", letterSpacing: "1px" }}>GRAND HORIZON</span>
            <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase" }}>
              Luxury Hotel Management
            </div>
          </div>
        </Link>

        <nav className="nav-links">
          {role === "ADMIN" ? (
            <>
              <Link to="/admin" className={`nav-link ${isActive("/admin") ? "active" : ""}`}>
                <ShieldAlert size={16} inline="true" style={{ marginRight: 6 }} /> Admin Dashboard
              </Link>
              <Link to="/admin/rooms" className={`nav-link ${isActive("/admin/rooms") ? "active" : ""}`}>
                <Key size={16} inline="true" style={{ marginRight: 6 }} /> Room Catalog (CRUD)
              </Link>
              <Link to="/admin/reservations" className={`nav-link ${isActive("/admin/reservations") ? "active" : ""}`}>
                <Calendar size={16} inline="true" style={{ marginRight: 6 }} /> Reservations (CRUD)
              </Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" className={`nav-link ${isActive("/dashboard") ? "active" : ""}`}>
                <User size={16} inline="true" style={{ marginRight: 6 }} /> User Dashboard
              </Link>
              <Link to="/user/browse" className={`nav-link ${isActive("/user/browse") ? "active" : ""}`}>
                <Key size={16} inline="true" style={{ marginRight: 6 }} /> Browse Rooms
              </Link>
              <Link to="/user/my-bookings" className={`nav-link ${isActive("/user/my-bookings") ? "active" : ""}`}>
                <Calendar size={16} inline="true" style={{ marginRight: 6 }} /> My Bookings
              </Link>
            </>
          )}
          <Link to="/about" className={`nav-link ${isActive("/about") ? "active" : ""}`}>
            About
          </Link>
        </nav>

        <div className="nav-controls">
          {/* ⚡ Quick Demo Role Switcher Toggle */}
          <div 
            style={{
              background: "rgba(255,255,255,0.06)",
              padding: "4px 8px",
              borderRadius: "20px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              border: "1px solid var(--border-color)"
            }}
          >
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", paddingLeft: "4px" }}>Role:</span>
            <button
              onClick={() => {
                const nextRole = role === "ADMIN" ? "USER" : "ADMIN";
                switchRole(nextRole);
                navigate(nextRole === "ADMIN" ? "/admin" : "/dashboard");
              }}
              className={`btn btn-sm ${role === "ADMIN" ? "btn-gold" : "btn-outline"}`}
              style={{ padding: "4px 10px", borderRadius: "14px", fontSize: "0.75rem" }}
              title="Click to toggle between Admin View and User View instantly!"
            >
              <Sparkles size={12} /> {role === "ADMIN" ? "ADMIN VIEW" : "USER VIEW"}
            </button>
          </div>

          {user && (
            <button onClick={handleLogout} className="btn btn-outline btn-sm" title="Log out">
              <LogOut size={14} /> Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;