// ProtectedRoute.tsx
import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { useAppSelector } from "../reducers/hooks";

interface OpenRouteProps {
  children: ReactNode;
}

function ProtectedRoute({ children }: OpenRouteProps) {
  const user = useAppSelector((state) => state.user.user);
  const location = useLocation(); // current path

  if (user !== null) {
    return children;
  } else {
    // redirect to login with `from` state
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
}

export default ProtectedRoute;
