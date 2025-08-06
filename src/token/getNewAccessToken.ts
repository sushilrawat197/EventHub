import { store } from "../reducers/store";
import { refreshAccessToken } from "./refreshTokenAccess";
import {
  setAccessToken,
  setRefreshToken,
  setAccessTokenExpiry,
} from "../slices/authSlice";
// import { logout } from "../services/operations/authApi";

let refreshTimer: NodeJS.Timeout | null = null;

export function startAutoTokenRefresh(
  accessTokenExpiry: string,
  refreshToken: string
) {
  const expiryTime = new Date(accessTokenExpiry).getTime();
  const currentTime = new Date().getTime();

  const timeUntilExpiry = expiryTime - currentTime;

  console.log("Token expires in ms:", timeUntilExpiry);

  // Refresh 30 seconds before expiry
  const refreshTime = timeUntilExpiry - 30 * 1000;

  if (refreshTime > 0) {
    refreshTimer = setTimeout(async () => {
      try {
        console.log("⏳ Refreshing token now...");
        const newTokens = await refreshAccessToken(refreshToken);

        store.dispatch(setAccessToken(newTokens.accessToken));
        store.dispatch(setRefreshToken(newTokens.refreshToken));
        store.dispatch(setAccessTokenExpiry(newTokens.accessTokenExpiry)); // Set new expiry

        localStorage.setItem("accessToken", newTokens.accessToken);
        localStorage.setItem("refreshToken", newTokens.refreshToken);
        localStorage.setItem("accessTokenExpiry", newTokens.accessTokenExpiry);

        console.log("NEW accessToken: ",newTokens.accessToken)
        console.log("NEW refreshToken: ",newTokens.refreshToken)
        console.log("NEW accessTokenExpiry: ",newTokens.accessTokenExpiry)

        // ✅ Call again for next cycle
        startAutoTokenRefresh(newTokens.accessTokenExpiry, newTokens.refreshToken);
      } catch (error) {
        console.error("Token refresh failed:", error);
        // store.dispatch(logout());
        // Optional: logout or redirect
      }
    }, refreshTime);
  } else {
    console.warn("Token already expired or too close to expiry");
  }
}


export function stopAutoTokenRefresh() {
  if (refreshTimer) {
    clearTimeout(refreshTimer);
    refreshTimer = null;
  }
}
