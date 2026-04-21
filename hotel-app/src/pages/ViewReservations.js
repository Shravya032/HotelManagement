import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ViewReservations() {
  const navigate = useNavigate();
  const [list, setList] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8080/reservations")
      .then(res => setList(res.data));
  }, []);

  return (
    <div className="container">
      <h2>Reservations</h2>

      {list.map(r => (
        <div key={r.reservationId}>
          {r.guestName} - Room {r.roomNumber}
        </div>
      ))}

      <button onClick={() => navigate("/dashboard")}>Back</button>
    </div>
  );
}

export default ViewReservations;