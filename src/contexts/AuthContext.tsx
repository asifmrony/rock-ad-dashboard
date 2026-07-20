import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ROLE_STORAGE_KEYS } from "@/lib/roles";

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
    localStorage.clear();
    if (email === "asif@rockstreamer.com" && password === "asdf@1234") {
      setIsAuthenticated(true);
      localStorage.setItem("isAuthenticated", "true");
      // localStorage.setItem("bingePlusAdmin", "false");
      navigate("/");
      toast.success("Successfully logged in!");
    } else if (email === "vast_admin@binge" && password === "bingeAD@6776") {
      setIsAuthenticated(true);
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("bingePlusAdmin", "true");
      navigate("/");
      toast.success("Successfully logged in!");
    } else if (email === "ads_admin@pran" && password === "pranAD@6776") {
      setIsAuthenticated(true);
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("isPranAdmin", "true");
      navigate("/");
      toast.success("Successfully logged in!");
    } else if (email === "ads_admin@bkash" && password === "bkashAD@6776") {
      setIsAuthenticated(true);
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("isBkashAdmin", "true");
      navigate("/");
      toast.success("Successfully logged in!");
    } else if (email === "ads_admin@mtb" && password === "mtbAD@6776") {
      setIsAuthenticated(true);
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("isMtbAdmin", "true");
      navigate("/");
      toast.success("Successfully logged in!");
    } else {
      toast.error("Invalid credentials");
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("isAuthenticated");
    // Clear every role flag so a stale one can't leak into the next session.
    ROLE_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
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
