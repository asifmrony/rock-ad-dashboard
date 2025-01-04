import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  // const isAuthenticated = true;
  const authenticated = localStorage.getItem("isAuthenticated") === "true";
  console.log("Is User Authenticated in ProtectedRoute", isAuthenticated);

  if (!isAuthenticated && !authenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
