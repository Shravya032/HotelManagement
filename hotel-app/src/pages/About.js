import React from "react";
import { useNavigate } from "react-router-dom";

function About() {
  const navigate = useNavigate();

  return (
    <div className="container">
      <h2>About Hotel</h2>
      <p>This system manages reservations easily.</p>

      <button onClick={() => navigate("/dashboard")}>Back</button>
    </div>
  );
}

export default About;