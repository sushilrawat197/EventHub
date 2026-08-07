import axios from "axios";
import type { AppDispatch } from "@/app/store/store";
import { clearUser } from "@/features/profile/store/userSlice";
import { getCurrentUser } from "@/features/profile/services/user.service";
import {
  initAuthRuntime,
  refreshAccessTokenSingleFlight,
} from "@/auth/refreshCoordinator";
import { clearProactiveRefreshTimer, clearTokens } from "@/auth/tokenManager";
import { onSessionExpired } from "@/auth/authEvents";

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
  });
}

/** App bootstrap: restore session after reload. */
export function refreshAccessToken() {
  return async (dispatch: AppDispatch): Promise<boolean> => {
    ensureInit(dispatch);
    try {
      await refreshAccessTokenSingleFlight("bootstrap");
      await dispatch(getCurrentUser());
      return true;
    } catch (err) {
      if (
        axios.isAxiosError(err) &&
        (err.response?.status === 401 || err.response?.status === 403)
      ) {
        dispatch(clearUser());
        clearTokens("refresh_unauthorized");
      }
      return false;
    }
  };
}

/** Kept for backward compatibility; scheduling is handled centrally now. */
export function scheduleTokenRefresh() {
  return (): void => {
    // no-op
  };
}

export function clearRefreshTimer() {
  clearProactiveRefreshTimer();
}
