import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllReservations } from "../services/api";

function ViewReservations() {
  const navigate = useNavigate();
  const [list, setList] = useState([]);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const res = await getAllReservations();
        setList(res.data || []);
      } catch (err) {
        console.error("Error loading reservations:", err);
      }
    };
    fetchReservations();
  }, []);

  return (
    <div className="container">
      <h2>Reservations</h2>

      {list.map(r => (
        <div key={r.reservationId || r.id}>
          {r.guestName} - Room {r.roomNumber}
        </div>
      ))}

      <button onClick={() => navigate("/dashboard")}>Back</button>
    </div>
  );
}

export default ViewReservations;