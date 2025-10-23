import { useEffect, useState } from "react";
import { type AuthResponse, type User } from "../types";
import { isTokenExpired } from "../utils/authU";
import { AuthContext } from "../context/AuthContext";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(() => {
    try {
      const storedToken = localStorage.getItem("token");
      return storedToken;
    } catch (error) {
      console.error("Error reading token from localStorage:", error);
      return null;
    }
  });
  const [user, setUser] = useState<User | null>(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Error reading user from localStorage:", error);
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token && isTokenExpired(token)) {
      logout();
    }
    setLoading(false);
  }, [token, user]);

  const login = (data: AuthResponse) => {
    try {
      localStorage.setItem("token", data.token);

      localStorage.setItem("user", JSON.stringify(data.data));

      setToken(data.token);
      setUser(data.data);
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } catch (error) {
      console.error("Error clearing localStorage:", error);
    }
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
