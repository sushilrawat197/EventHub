import { store } from "../reducers/store";
import { refreshAccessToken } from "./refreshTokenAccess";
import {
  setAccessToken,
  setRefreshToken,
  setAccessTokenExpiry,
  setRefreshTokenExpiry,
} from "../slices/authSlice";
// import { logout } from "../services/operations/authApi";

let refreshTimer: NodeJS.Timeout | null = null;

// START AUTO TOKEN REFRESH FUNCTION 🏃‍♂️
export async function startAutoTokenRefresh(
  accessTokenExpiry: string,
  refreshToken: string
) {
  // Input validation
  if (!accessTokenExpiry || !refreshToken) {
    console.error("❌ Invalid parameters provided to startAutoTokenRefresh");
    return;
  }

  const expiryTime = new Date(accessTokenExpiry).getTime();
  
  // Invalid date check
  if (isNaN(expiryTime)) {
    console.error("❌ Invalid accessTokenExpiry date format");
    return;
  }

  const currentTime = new Date().getTime();
  const timeUntilExpiry = expiryTime - currentTime;

  console.log("🔍 Token refresh analysis:");
  console.log("- Expiry Time:", new Date(expiryTime).toLocaleString());
  console.log("- Current Time:", new Date(currentTime).toLocaleString());
  console.log("- Time until expiry:", Math.floor(timeUntilExpiry / 1000), "seconds");

  const refreshTime = timeUntilExpiry - 30 * 1000; // 30 seconds before expiry

  // ✅ Clear any existing timer
  if (refreshTimer) {
    clearTimeout(refreshTimer);
    refreshTimer = null;
  }

  // ✅ 1. If still time left before expiry
  if (refreshTime > 0) {
    console.log("⏰ Scheduling token refresh in", Math.floor(refreshTime / 1000), "seconds");
    
    refreshTimer = setTimeout(async () => {
      await refreshTokenAndReschedule(refreshToken);
    }, refreshTime);
  }
  // ✅ 2. If already expired or too close, refresh immediately
  else {
    console.warn("⚠️ Token already expired or too close to expiry, refreshing now...");
    await refreshTokenAndReschedule(refreshToken);
  }
}

// REFRESH TOKEN AND RESCHEDULE
async function refreshTokenAndReschedule(refreshToken: string) {
  try {
    console.log("🔄 Starting token refresh...");
    
    const newTokens = await refreshAccessToken(refreshToken);
    
    // Validate received tokens
    if (!newTokens.accessToken || !newTokens.refreshToken) {
      throw new Error('Invalid tokens received from server');
    }

    // Redux store update
    store.dispatch(setAccessToken(newTokens.accessToken));
    store.dispatch(setRefreshToken(newTokens.refreshToken));
    store.dispatch(setAccessTokenExpiry(newTokens.accessTokenExpiry));
    store.dispatch(setRefreshTokenExpiry(newTokens.refreshTokenExpiry));

    // localStorage update
    localStorage.setItem("accessToken", newTokens.accessToken);
    localStorage.setItem("refreshToken", newTokens.refreshToken);
    localStorage.setItem("accessTokenExpiry", newTokens.accessTokenExpiry);
    localStorage.setItem("refreshTokenExpiry", newTokens.refreshTokenExpiry);

    console.log("✅ Tokens refreshed successfully");
    console.log("📅 Access token expires at:", new Date(newTokens.accessTokenExpiry).toLocaleString());
    console.log("📅 Refresh token expires at:", new Date(newTokens.refreshTokenExpiry).toLocaleString());

    // 🔁 Reschedule next auto-refresh with new expiry
    await startAutoTokenRefresh(newTokens.accessTokenExpiry, newTokens.refreshToken);
    
  } catch (error) {
    console.error("❌ Token refresh failed:", error);
    
    // Clear timer on failure
    if (refreshTimer) {
      clearTimeout(refreshTimer);
      refreshTimer = null;
    }
    
    // Handle different types of errors
    if (error instanceof Error) {
      if (error.message.includes('401') || error.message.includes('403')) {
        console.error("🚨 Refresh token expired or invalid - user needs to login again");
        // Uncomment when logout function is ready
        // store.dispatch(logout());
      } else {
        console.error("🔄 Token refresh will be retried on next API call");
      }
    }
    
    // Optional: Show user notification
    // toast.error("Session will expire soon. Please save your work.");
  }
}

// STOP AUTO TOKEN REFRESH
export function stopAutoTokenRefresh() {
  console.log("🛑 Stopping auto token refresh...");
  if (refreshTimer) {
    clearTimeout(refreshTimer);
    refreshTimer = null;
    console.log("✅ Auto refresh timer cleared successfully");
  } else {
    console.log("ℹ️ No active refresh timer found");
  }
}


// UTILITY: Check if token is close to expiry
export function isTokenCloseToExpiry(tokenExpiry: string, bufferMinutes: number = 2): boolean {
  const expiryTime = new Date(tokenExpiry).getTime();
  const currentTime = new Date().getTime();
  const bufferTime = bufferMinutes * 60 * 1000; // Convert minutes to milliseconds
  
  return (expiryTime - currentTime) <= bufferTime;
}


// UTILITY: Get time until token expires
export function getTimeUntilExpiry(tokenExpiry: string): { minutes: number; seconds: number } {
  const expiryTime = new Date(tokenExpiry).getTime();
  const currentTime = new Date().getTime();
  const timeLeft = Math.max(0, expiryTime - currentTime);
  
  const minutes = Math.floor(timeLeft / (60 * 1000));
  const seconds = Math.floor((timeLeft % (60 * 1000)) / 1000);
  
  return { minutes, seconds };
}