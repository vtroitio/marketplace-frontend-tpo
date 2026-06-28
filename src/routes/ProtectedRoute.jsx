import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUserRoleCode } from "../features/auth";

export function ProtectedRoute({ children, allowedRoles }) {
  const location = useLocation();

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const userRole = useSelector(selectUserRoleCode);

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
