
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ admin: isAdmin = false }) {
  const { user, admin } = useAuth();

  // Admin Protected Routes
  if (isAdmin) {
    if (!admin) {
      return <Navigate to="/admin-login" replace />;
    }

    return <Outlet />;
  }

  // Normal User Protected Routes
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
