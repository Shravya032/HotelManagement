import React, { useEffect, useState } from "react";
import { getAll } from "../services/api";

function MyReservations() {
  const [list, setList] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const res = await getAll();
     const user = JSON.parse(localStorage.getItem("currentUser"));

const filtered = res.data.filter(
  r => r.guestName === user.username
);

      setList(filtered);
    };
    fetch();
  }, []);

  return (
    <div>
      <h2>My Reservations</h2>
      {list.map(r => (
        <div className="card" key={r.reservationId}>
          {r.guestName} - Room {r.roomNumber}
        </div>
      ))}
    </div>
  );
}

export default MyReservations;

