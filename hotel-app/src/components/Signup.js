import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    username: "",
    password: "",
    role: "USER"
  });

  const handleSubmit = () => {
    localStorage.setItem(user.username, JSON.stringify(user));
    alert("Signup successful!");

    navigate("/login"); // 🔥 go to login
  };

  return (
    <div className="container">
      <h2>Signup</h2>

      <input placeholder="Username"
        onChange={e => setUser({...user, username: e.target.value})} />

      <input type="password" placeholder="Password"
        onChange={e => setUser({...user, password: e.target.value})} />

      <select onChange={e => setUser({...user, role: e.target.value})}>
        <option value="USER">User</option>
        <option value="ADMIN">Admin</option>
      </select>

      <button onClick={handleSubmit}>Signup</button>
    </div>
  );
}

export default Signup;