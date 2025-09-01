import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import type { JSX } from "react";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, token } = useAuth();

  if (!user || !token) return <Navigate to="/login" replace />;

  return children;
}
