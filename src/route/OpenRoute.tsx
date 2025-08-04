// OpenRoute.tsx
import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAppSelector } from "../reducers/hooks";

interface OpenRouteProps {
  children: ReactNode;
}

function OpenRoute({ children }: OpenRouteProps) {
const token=useAppSelector((state)=>state.auth.accessToken);

  if (token === null) {
    return children;
  } else {
    return <Navigate to="/" />;
  }
}

export default OpenRoute;
