
import React, {
  createContext,
  useContext,
  useState,
  useEffect
} from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  // Restore the previously authenticated user
  // only if one exists in localStorage.
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("currentUser");

    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (error) {
        localStorage.removeItem("currentUser");
        return null;
      }
    }

    // IMPORTANT:
    // No default user.
    // No automatic Admin login.
    return null;
  });

  // Keep authenticated user in localStorage
  useEffect(() => {

    if (user) {
      localStorage.setItem(
        "currentUser",
        JSON.stringify(user)
      );
    } else {
      localStorage.removeItem("currentUser");
    }

  }, [user]);

  // Login
  const login = (userData) => {
    setUser(userData);
  };

  // Logout
  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        isAuthenticated: !!user,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

