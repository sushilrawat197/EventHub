// tokenManager.ts - Fixed version

import axios from "axios";
import { clearUser } from "../slices/userSlice";
import { apiConnector } from "./apiConnector";
import type { AppDispatch } from "../reducers/store";
import { getCurrentUser } from "./operations/userApi";
import { endpoints } from "./apis";
const { REFRESH_ACCESS_TOKEN } = endpoints;

let refreshTimer: NodeJS.Timeout | null = null;

type RefreshTokenResponse = {
  statusCode: number;
  data: {
    accessTokenExpiry: string;
  };
  message?: string;
};


// ✅ NEW: Separate function to schedule refresh
export function scheduleTokenRefresh(expiryISO: string) {
  return (dispatch: AppDispatch): void => {
    if (!expiryISO) {
      console.warn("No expiry time provided");
      return;
    }

    const expiryTime = new Date(expiryISO).getTime();
    const now = Date.now();
    const diffMs = expiryTime - now;

    // Refresh 1 min before expiry
    const timeToRefresh = diffMs - 60 * 1000;

    // Clear old timer
    if (refreshTimer) {
      clearTimeout(refreshTimer);
      refreshTimer = null;
    }

    console.log(
      `Token expires in ${Math.floor(diffMs / 1000)}s, will refresh in ${Math.floor(timeToRefresh / 1000)}s`
    );

    if (timeToRefresh > 0) {
      refreshTimer = setTimeout(() => {
        console.log("Auto-refreshing token...");
        dispatch(refreshAccessToken());
      }, timeToRefresh);
    } else if (diffMs > 0) {
      // Token expiring very soon, refresh immediately
      console.warn("Token expiring soon, refreshing immediately");
      dispatch(refreshAccessToken());
    } else {
      // Token already expired
      console.error("Token already expired");
      dispatch(clearUser());
    }
  };
}

// ✅ FIXED: Added flag to prevent recursive calls
let isRefreshing = false;


export function refreshAccessToken() {
  return async (dispatch: AppDispatch): Promise<boolean> => {
    // ✅ Prevent multiple simultaneous refresh calls
    if (isRefreshing) {
      console.log("Refresh already in progress, skipping...");
      return false;
    }

    isRefreshing = true;

    try {
      const response = await apiConnector<RefreshTokenResponse>({
        method: "POST",
        url: REFRESH_ACCESS_TOKEN,
        withCredentials: true,
        headers: {
                    "X-Client-Source": "WEB",
                }
      });

      console.log("REFRESH TOKEN RESPONSE...",response);

      if (response.status === 200) {
        
        const expiryISO = response.data.data.accessTokenExpiry;
        console.log("New AccessToken Expiry:", expiryISO);

        // ✅ Fetch user data after successful refresh
        await dispatch(getCurrentUser());

        // ✅ Schedule next refresh
        if (expiryISO) {
          dispatch(scheduleTokenRefresh(expiryISO));
        }

        return true;
      }

      return false;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        
        if (status === 401 || status === 403) {
          console.error("Refresh token expired or invalid");
          dispatch(clearUser());

          // ✅ Clear timer on auth failure
          clearRefreshTimer();
        } else {
          console.error("Refresh token error:", error.response?.data);
        }
      }
      return false;
    } finally {
      // ✅ Reset flag after completion
      isRefreshing = false;
    }
  };
}


// ✅ Cleanup function for logout
export function clearRefreshTimer() {
  if (refreshTimer) {
    clearTimeout(refreshTimer);
    refreshTimer = null;
    console.log("Refresh timer cleared");
  }
}