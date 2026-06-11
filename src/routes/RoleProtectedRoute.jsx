import { Navigate } from "react-router-dom";
import { getUserRole, isAuthenticated } from "../helpers/authStorage";

export function RoleProtectedRoute({ children, allowedRoles }) {
  const role = getUserRole();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="*" replace />;
  }

  return children;
}
