// OpenRoute.tsx
import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAppSelector } from "../reducers/hooks";
// import SpinnerLoading from "../UI/Components/common/SpinnerLoading";


interface OpenRouteProps {
  children: ReactNode;
}


function OpenRoute({ children }: OpenRouteProps) {
  const user = useAppSelector((state) => state.user.user);


  if (user === null) {
    return children; // login/signup pages 
  } else {
    return <Navigate to="/my-profile/edit-profile" />; // already logged-in to redirect to my profile
  }
}


export default OpenRoute;
