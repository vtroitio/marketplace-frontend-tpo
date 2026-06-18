import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export function RoleProtectedRoute({ children, allowedRoles }) {
  const location = useLocation();
  const { isAuthenticated, currentUser } = useAuth();

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  if (!allowedRoles.includes(currentUser?.role.code)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
