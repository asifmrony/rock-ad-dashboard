import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { canAccess, getDefaultPath, getRole } from "@/lib/roles";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const { pathname } = useLocation();
  const authenticated = localStorage.getItem("isAuthenticated") === "true";

  if (!isAuthenticated && !authenticated) {
    return <Navigate to="/login" replace />;
  }

  // Roles with limited access get bounced to their own landing page if they
  // hit a route they aren't allowed to see (e.g. by typing the URL).
  const role = getRole();
  if (!canAccess(pathname, role)) {
    return <Navigate to={getDefaultPath(role)} replace />;
  }

  return <>{children}</>;
};
