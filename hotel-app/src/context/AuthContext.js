import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("currentUser");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return null; }
    }
    // Default demo user if none exists
    return {
      username: "Admin User",
      email: "admin@grandhotel.com",
      role: "ADMIN"
    };
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user));
    } else {
      localStorage.removeItem("currentUser");
    }
  }, [user]);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  const switchRole = (newRole) => {
    setUser((prev) => ({
      username: prev?.username || (newRole === "ADMIN" ? "Admin User" : "Guest User"),
      email: prev?.email || (newRole === "ADMIN" ? "admin@grandhotel.com" : "guest@example.com"),
      role: newRole,
    }));
  };

  return (
    <AuthContext.Provider value={{ user, role: user?.role || "GUEST", login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
