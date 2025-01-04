import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  console.log("IsAuthenticated State in Authprovider", isAuthenticated);

  // Mock login function - replace with real authentication later
  const login = (email: string, password: string) => {
    if (email === "asif@rockstreamer.com" && password === "asdf@1234") {
      setIsAuthenticated(true);
      localStorage.setItem("isAuthenticated", "true");
      navigate("/");
      toast.success("Successfully logged in!");
    } else {
      toast.error("Invalid credentials");
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("isAuthenticated");
    navigate("/login");
    toast.success("Successfully logged out!");
  };

  useEffect(() => {
    const authenticated = localStorage.getItem("isAuthenticated") === "true";
    setIsAuthenticated(authenticated);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
