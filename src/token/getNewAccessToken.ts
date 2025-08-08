// import { store } from "../reducers/store";
// import { refreshAccessToken } from "./refreshTokenAccess";
// import {
//   setAccessToken,
//   setRefreshToken,
//   setAccessTokenExpiry,
//   setRefreshTokenExpiry,
// } from "../slices/authSlice";
// // import { logout } from "../services/operations/authApi";

// let refreshTimer: NodeJS.Timeout | null = null;

// // 🔁 START AUTO TOKEN REFRESH
// export async function startAutoTokenRefresh(
//   accessTokenExpiry: string,
//   refreshToken: string
// ) {
//   try {
//     if (!accessTokenExpiry || !refreshToken) {
//       console.error("❌ Missing token parameters in startAutoTokenRefresh");
//       return;
//     }

//     const expiryTime = new Date(accessTokenExpiry).getTime();
//     if (isNaN(expiryTime)) {
//       console.error("❌ Invalid accessTokenExpiry date format");
//       return;
//     }

//     const currentTime = Date.now();
//     const timeUntilExpiry = expiryTime - currentTime;

//     console.log("🔍 Token Timing:");
//     console.log("→ Expiry:", new Date(expiryTime).toLocaleString());
//     console.log("→ Now:", new Date(currentTime).toLocaleString());
//     console.log("→ Time left:", Math.floor(timeUntilExpiry / 1000), "seconds");

//     const refreshTime = timeUntilExpiry - 30 * 1000;

//     if (refreshTimer) {
//       clearTimeout(refreshTimer);
//       refreshTimer = null;
//     }

//     if (refreshTime > 0) {
//       console.log("⏰ Scheduling refresh in", Math.floor(refreshTime / 1000), "seconds");
//       refreshTimer = setTimeout(() => {
//         console.log("timer")
//         refreshTokenAndReschedule(refreshToken);
//       }, refreshTime);
//     } else {
//       console.warn("⚠️ Token already expired or too close. Refreshing now...");
//       await refreshTokenAndReschedule(refreshToken);
//     }
//   } catch (err) {
//     console.error("❌ Error in startAutoTokenRefresh:", err);
//   }
// }



// // 🔄 REFRESH FUNCTION
// async function refreshTokenAndReschedule(refreshToken: string) {
//   try {
//     console.log("🔄 Refreshing token using refreshToken");

//     const newTokens = await refreshAccessToken(refreshToken);

//     if (
//       !newTokens ||
//       !newTokens.accessToken ||
//       !newTokens.refreshToken ||
//       !newTokens.accessTokenExpiry ||
//       !newTokens.refreshTokenExpiry
//     ) {
//       throw new Error("❌ Invalid token response from backend");
//     }

//     // Update Redux Store
//     store.dispatch(setAccessToken(newTokens.accessToken));
//     store.dispatch(setRefreshToken(newTokens.refreshToken));
//     store.dispatch(setAccessTokenExpiry(newTokens.accessTokenExpiry));
//     store.dispatch(setRefreshTokenExpiry(newTokens.refreshTokenExpiry));

//     // Update localStorage
//     localStorage.setItem("accessToken", newTokens.accessToken);
//     localStorage.setItem("refreshToken", newTokens.refreshToken);
//     localStorage.setItem("accessTokenExpiry", newTokens.accessTokenExpiry);
//     localStorage.setItem("refreshTokenExpiry", newTokens.refreshTokenExpiry);

//     console.log("✅ Tokens refreshed successfully");
//     console.log("→ AccessToken Expires At:", new Date(newTokens.accessTokenExpiry).toLocaleString());
//     console.log("→ RefreshToken Expires At:", new Date(newTokens.refreshTokenExpiry).toLocaleString());

//     // Reschedule next auto-refresh
//     await startAutoTokenRefresh(newTokens.accessTokenExpiry, newTokens.refreshToken);

//   } catch (error: any) {
//     console.error("❌ Token refresh failed:", error?.message || error);

//     if (refreshTimer) {
//       clearTimeout(refreshTimer);
//       refreshTimer = null;
//     }

//     if (error.message?.includes("401") || error.message?.includes("403")) {
//       console.error("🚨 Refresh token invalid/expired — logging out user...");
//       // store.dispatch(logout()); // Uncomment this when logout function is ready
//     } else {
//       console.warn("🔄 Refresh failed — will retry on next API call");
//     }
//   }
// }

// // 🛑 STOP AUTO REFRESH
// export function stopAutoTokenRefresh() {
//   console.log("🛑 Stopping auto token refresh");
//   if (refreshTimer) {
//     clearTimeout(refreshTimer);
//     refreshTimer = null;
//     console.log("✅ Timer cleared");
//   } else {
//     console.log("ℹ️ No active timer found");
//   }
// }
