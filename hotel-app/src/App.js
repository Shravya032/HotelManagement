import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Welcome from "./pages/Welcome";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import ReservationForm from "./pages/ReservationForm";
import ViewReservations from "./pages/ViewReservations";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/about" element={<About />} />
        <Route path="/add" element={<ReservationForm />} />
        <Route path="/view" element={<ViewReservations />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;