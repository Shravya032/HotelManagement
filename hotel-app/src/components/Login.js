import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [login, setLogin] = useState({
    username: "",
    password: ""
  });

  const handleLogin = () => {
    const user = JSON.parse(localStorage.getItem(login.username));

    if (user && user.password === login.password) {
      localStorage.setItem("currentUser", JSON.stringify(user));

      navigate("/dashboard"); // 🔥 go to dashboard
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>

      <input placeholder="Username"
        onChange={e => setLogin({...login, username: e.target.value})} />

      <input type="password" placeholder="Password"
        onChange={e => setLogin({...login, password: e.target.value})} />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;