import { Navigate, Outlet } from "react-router-dom";
import { useAuth, ROLE_HOME } from "../context/AuthContext";

export default function RoleRoute({ role }) {
  const { user } = useAuth();

  if (user.role !== role) {
    return <Navigate to={ROLE_HOME[user.role] || "/login"} replace />;
  }

  return <Outlet />;
}
