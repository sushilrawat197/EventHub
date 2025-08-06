import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../reducers/hooks";
import {
  setAccessToken,
  setRefreshToken,
  setAccessTokenExpiry,
} from "../slices/authSlice";
import { startAutoTokenRefresh } from "./getNewAccessToken";

export const useAuthRestore = () => {
  
  const dispatch = useAppDispatch();
  
  const refreshToken = useAppSelector((state) => state.auth.refreshToken);
  const accessTokenExpiry = useAppSelector((state) => state.auth.accessTokenExpiry);

  useEffect(() => {
    const savedAccessToken = localStorage.getItem("accessToken");
    const savedRefreshToken = localStorage.getItem("refreshToken");
    const savedAccessTokenExpiry = localStorage.getItem("accessTokenExpiry");

    if (savedAccessToken) {
      dispatch(setAccessToken(savedAccessToken));
    }
    if (savedRefreshToken) {
      dispatch(setRefreshToken(savedRefreshToken));
    }
    if (savedAccessTokenExpiry) {
      dispatch(setAccessTokenExpiry(savedAccessTokenExpiry));
    }
  }, [dispatch]);

//   const allTokenAvailable=refreshToken && accessTokenExpiry;

useEffect(() => {
  console.log("👀 refreshToken or accessTokenExpiry changed");
  if (refreshToken && accessTokenExpiry) {
    startAutoTokenRefresh(accessTokenExpiry, refreshToken);
  }
}, [refreshToken, accessTokenExpiry]);
};
