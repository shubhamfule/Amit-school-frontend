import { useEffect, useState, type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { getCurrentUser, verifySession, type Role } from "../lib/auth";

interface ProtectedRouteProps {
  role: Role;
  children: ReactNode;
}

export default function ProtectedRoute({ role, children }: ProtectedRouteProps) {
  const [user, setUser] = useState(getCurrentUser());

  useEffect(() => {
    verifySession().then(setUser);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!user || user.role !== role) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
