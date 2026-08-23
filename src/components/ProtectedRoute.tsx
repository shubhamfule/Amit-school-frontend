import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { getCurrentUser, type Role } from "../lib/auth";

interface ProtectedRouteProps {
  role: Role;
  children: ReactNode;
}

export default function ProtectedRoute({ role, children }: ProtectedRouteProps) {
  const user = getCurrentUser();

  if (!user || user.role !== role) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
