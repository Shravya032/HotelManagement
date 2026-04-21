import React from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="container">
      <h1>Dashboard</h1>

      <button onClick={() => navigate("/about")}>About</button>
      <button onClick={() => navigate("/add")}>Add Reservation</button>
      <button onClick={() => navigate("/view")}>View Reservations</button>
      <button onClick={() => {
        localStorage.removeItem("currentUser");
        navigate("/");
      }}>
        Logout
      </button>
    </div>
  );
}

export default Dashboard;