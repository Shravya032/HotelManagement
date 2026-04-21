import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("currentUser"));

  const logout = () => {
    localStorage.removeItem("currentUser");
    navigate("/");
  };

  return (
    <div style={{ display: "flex", gap: "20px", padding: "10px", background: "#222" }}>
      
      <Link to="/about">About</Link>

      {user?.role === "USER" && (
        <>
          <Link to="/add">Add Reservation</Link>
          <Link to="/my">My Reservations</Link>
        </>
      )}

      {user?.role === "ADMIN" && (
        <>
          <Link to="/all">View Reservations</Link>
        </>
      )}

      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default Navbar;