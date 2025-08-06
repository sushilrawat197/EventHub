import { store } from "../reducers/store";
import { refreshAccessToken } from "./refreshTokenAccess";
import {
  setAccessToken,
  setRefreshToken,
  setAccessTokenExpiry,
} from "../slices/authSlice";
// import { logout } from "../services/operations/authApi";


let refreshTimer: NodeJS.Timeout | null = null;


//START AUTO TOKEN REFRESH FUNCTION 🏃‍♂️

export function startAutoTokenRefresh( accessTokenExpiry: string,  refreshToken: string ) {
  
  const expiryTime = new Date(accessTokenExpiry).getTime();
  const currentTime = new Date().getTime();
  const timeUntilExpiry = expiryTime - currentTime;

  console.log("expiryTime:", expiryTime);
  console.log("Current Time:", currentTime);
  console.log("Token expires in ms:", timeUntilExpiry);

  const refreshTime = timeUntilExpiry - 30 * 1000;

  // ✅ Clear any existing timer
  if (refreshTimer) {
    clearTimeout(refreshTimer);
    refreshTimer = null;
  }


  // ✅ 1. If still time left before expiry
  if (refreshTime > 0) {

    refreshTimer = setTimeout(async () => {
      await refreshTokenAndReschedule(refreshToken);
      
    }, refreshTime);

  }

  // ✅ 2. If already expired or too close, refresh immediately
  else {
    console.warn("Token already expired or too close to expiry, refreshing now...");
    refreshTokenAndReschedule(refreshToken);
  }
}

async function refreshTokenAndReschedule(refreshToken: string) {
  try {

    const newTokens = await refreshAccessToken(refreshToken);

    store.dispatch(setAccessToken(newTokens.accessToken));
    store.dispatch(setRefreshToken(newTokens.refreshToken));
    store.dispatch(setAccessTokenExpiry(newTokens.accessTokenExpiry));

    localStorage.setItem("accessToken", newTokens.accessToken);
    localStorage.setItem("refreshToken", newTokens.refreshToken);
    localStorage.setItem("accessTokenExpiry", newTokens.accessTokenExpiry);

    // 🔁 Reschedule next auto-refresh with new expiry
    startAutoTokenRefresh(newTokens.accessTokenExpiry, newTokens.refreshToken);
  } catch (error) {
    console.error("Token refresh failed:", error);
    // store.dispatch(logout());
  }
}


export function stopAutoTokenRefresh() {
  if (refreshTimer) {
    clearTimeout(refreshTimer);
    refreshTimer = null;
  }
}
