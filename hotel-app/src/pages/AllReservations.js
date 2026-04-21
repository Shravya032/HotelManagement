import React, { useEffect, useState } from "react";
import { getAll } from "../services/api";

function AllReservations() {
  const [list, setList] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const res = await getAll();
      setList(res.data);
    };
    fetch();
  }, []);

  return (
    <div>
      <h2>All Reservations</h2>
      {list.map(r => (
        <div className="card" key={r.reservationId}>
          {r.guestName} - Room {r.roomNumber}
        </div>
      ))}
    </div>
  );
}

export default AllReservations;