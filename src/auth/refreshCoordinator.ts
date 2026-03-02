import axios from "axios";
import { refresh as refreshCall } from "./authService";
import type { AuthTokens } from "./types";
import { clearTokens, initTokenLifecycleHandlers, scheduleProactiveRefresh, setTokens } from "./tokenManager";

export type RefreshReason = "bootstrap" | "proactive" | "401";

let refreshPromise: Promise<AuthTokens> | null = null;

function isUnauthorizedRefreshError(err: unknown): boolean {
  if (!axios.isAxiosError(err)) return false;
  const status = err.response?.status;
  return status === 401 || status === 403;
}

function isNetworkishError(err: unknown): boolean {
  if (!axios.isAxiosError(err)) return false;
  // No response usually means network/CORS/offline.
  return !err.response;
}

export function initAuthRuntime(maybeRefreshFn: () => void): void {
  initTokenLifecycleHandlers(maybeRefreshFn);
}

/**
 * Single-flight refresh:
 * - concurrent callers share one refresh HTTP call
 * - on 401/403, clears auth + forces login redirect (via auth event)
 * - on network failure, keeps current auth state (no forced logout)
 */
export async function refreshAccessTokenSingleFlight(reason: RefreshReason): Promise<AuthTokens> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const data = await refreshCall();
      const tokens: AuthTokens = {
        accessToken: data.data.accessToken,
        accessTokenExpiry: data.data.accessTokenExpiry,
      };

      setTokens(tokens);
      scheduleProactiveRefresh(tokens.accessTokenExpiry, () => refreshAccessTokenSingleFlight("proactive"));
      return tokens;
    })().finally(() => {
      refreshPromise = null;
    });
  }

  try {
    return await refreshPromise;
  } catch (err) {
    if (isUnauthorizedRefreshError(err)) {
      // If there's no session at boot, treat 401 as "not logged in" (no redirect).
      if (reason === "bootstrap") {
        clearTokens("manual");
      } else {
        clearTokens("refresh_unauthorized");
      }
    } else if (isNetworkishError(err)) {
      // Keep current tokens; callers can retry later.
    } else {
      // Other failures: do not hard-logout automatically.
    }
    throw err;
  }
}

