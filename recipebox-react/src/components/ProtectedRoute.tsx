
import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";

type Props = {
  children: ReactNode;
};

function ProtectedRoute({ children }: Props) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "Admin") {
    return <Navigate to="/recipes" replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
