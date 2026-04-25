import axios from "axios";
import type { AppDispatch } from "../app/store/store";
import { clearUser } from "../app/store/slices/userSlice";
import { initAuthRuntime, refreshAccessTokenSingleFlight } from "../auth/refreshCoordinator";
import { clearProactiveRefreshTimer, clearTokens } from "../auth/tokenManager";
import { getCurrentUser } from "./operations/userApi";
import { onSessionExpired } from "../auth/authEvents";

let initialized = false;

function ensureInit(dispatch: AppDispatch) {
  if (initialized) return;
  initialized = true;

  initAuthRuntime(() => {
    void refreshAccessTokenSingleFlight("proactive").catch(() => {
      // coordinator handles failures; keep app running
    });
  });

  onSessionExpired(() => {
    dispatch(clearUser());
    // Navigation should be handled inside React Router to avoid hard reloads
    // that can break base paths after OAuth redirects.
  });
}

/**
 * App bootstrap: restore session after reload.
 * Uses refresh cookie → gets new access token (in-memory) → fetch user.
 */
export function refreshAccessToken() {
  return async (dispatch: AppDispatch): Promise<boolean> => {
    ensureInit(dispatch);
    try {
      await refreshAccessTokenSingleFlight("bootstrap");
      await dispatch(getCurrentUser());
      return true;
    } catch (err) {
      if (axios.isAxiosError(err) && (err.response?.status === 401 || err.response?.status === 403)) {
        dispatch(clearUser());
        clearTokens("refresh_unauthorized");
      }
      return false;
    }
  };
}

/**
 * Kept for backward compatibility; scheduling is handled centrally now.
 */
export function scheduleTokenRefresh() {
  return (): void => {
    // no-op
  };
}

export function clearRefreshTimer() {
  clearProactiveRefreshTimer();
}