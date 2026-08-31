import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import "./App.css";
import Welcome from "./pages/Welcome";
import Login from "./components/Login";
import Signup from "./components/Signup";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import About from "./pages/About";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/rooms" element={<AdminDashboard />} />
          <Route path="/admin/reservations" element={<AdminDashboard />} />

          {/* User Routes */}
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/user/browse" element={<UserDashboard />} />
          <Route path="/user/my-bookings" element={<UserDashboard />} />

          {/* About */}
          <Route path="/about" element={<About />} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;