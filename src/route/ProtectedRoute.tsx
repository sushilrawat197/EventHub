// OpenRoute.tsx
import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAppSelector } from "../reducers/hooks";

interface OpenRouteProps {
  children: ReactNode;
}

function ProtectedRoute({ children }: OpenRouteProps) {

const token=useAppSelector((state)=>state.auth.accessToken);

  if (token === null) {
    return <Navigate to="/" />;
  } else{
    return children;
  }
}

export default ProtectedRoute;
