// OpenRoute.tsx
import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { useAppSelector } from "../reducers/hooks";

interface OpenRouteProps {
  children: ReactNode;
}

function OpenRoute({ children }: OpenRouteProps) {
  const user = useAppSelector((state) => state.user.user);
  const location = useLocation();

  // `from` path, agar /ticketing prefix hai to remove, warna default profile
  const from = (location.state?.from as string)?.replace(/^\/ticketing/, "") || "/my-profile/edit-profile";

  if (user === null) {
    return children; // login/signup page
  } else {
    // user already logged-in → redirect to from
    return <Navigate to={from} replace />;
  }
}

export default OpenRoute;
