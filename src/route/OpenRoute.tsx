// OpenRoute.tsx
import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAppSelector } from "../reducers/hooks";

interface OpenRouteProps {
  children: ReactNode;
}

function OpenRoute({ children }: OpenRouteProps) {
const user=useAppSelector((state)=>state.user.user);

  if (user === null) {
    return children;
  } else {
    return <Navigate to="/" />;
  }
}

export default OpenRoute;
