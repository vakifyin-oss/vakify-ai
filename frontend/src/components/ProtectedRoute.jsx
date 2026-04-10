import { Navigate } from "react-router-dom";
import { useUser } from "@clerk/react";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedRoute({ children, adminOnly = false, userOnly = false }) {
  const { isLoaded, isSignedIn } = useUser();
  const { user, loading } = useAuth();

  if (!isLoaded || loading) return <div className="container py-5">Loading...</div>;
  if (!isSignedIn || !user) return <Navigate to="/" replace />;
  if (adminOnly && !user.is_admin) return <Navigate to="/dashboard" replace />;
  if (userOnly && user.is_admin) return <Navigate to="/admin" replace />;

  return children;
}
