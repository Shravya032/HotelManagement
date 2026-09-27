import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createReservation } from "../services/api";

function ReservationForm() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("currentUser"));

  const [data, setData] = useState({
  guestName: user ? user.username : "",
  guestEmail: user ? user.username : "",
  roomNumber: "",
  contactNumber: ""
});

  const handleSubmit = async () => {
    try {
      if (!data.guestName || !data.roomNumber || !data.contactNumber) {
        alert("All fields are required");
        return;
      }

      await createReservation({
        guestName: data.guestName,
        roomNumber: parseInt(data.roomNumber),
        contactNumber: data.contactNumber
      });

      alert("Reservation added successfully!");

      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Error while adding reservation");
    }
  };

  return (
    <div className="container">
      <h2>Add Reservation</h2>

      {/* Guest Name */}
      <input
        placeholder="Guest Name"
        value={data.guestName}
        onChange={(e) =>
          setData({ ...data, guestName: e.target.value })
        }
      />

      {/* Room Number */}
      <input
        placeholder="Room Number"
        value={data.roomNumber}
        onChange={(e) =>
          setData({ ...data, roomNumber: e.target.value })
        }
      />

      {/* Contact Number */}
      <input
        placeholder="Contact Number"
        value={data.contactNumber}
        onChange={(e) =>
          setData({ ...data, contactNumber: e.target.value })
        }
      />

      <button onClick={handleSubmit}>Submit</button>

      <button onClick={() => navigate("/dashboard")}>
        Back
      </button>
    </div>
  );
}

export default ReservationForm;