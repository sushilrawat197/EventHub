import { emitSessionExpired } from "./authEvents";
import type { AuthTokens } from "./types";

let accessToken: string | null = null;
let accessTokenExpiryMs: number | null = null;

let proactiveTimer: ReturnType<typeof setTimeout> | null = null;
let lifecycleInitialized = false;

export function getAccessToken(): string | null {
  return accessToken;
}

export function getAccessTokenExpiryMs(): number | null {
  return accessTokenExpiryMs;
}

export function setTokens(tokens: AuthTokens): void {
  accessToken = tokens.accessToken;
  accessTokenExpiryMs = Date.parse(tokens.accessTokenExpiry);
}

export function clearTokens(reason: "refresh_unauthorized" | "logout" | "manual" = "manual"): void {
  accessToken = null;
  accessTokenExpiryMs = null;
  clearProactiveRefreshTimer();

  if (reason === "refresh_unauthorized" || reason === "logout") {
    emitSessionExpired({ reason });
  }
}

export function isExpiringSoon(withinMs = 60_000): boolean {
  if (!accessTokenExpiryMs) return false;
  return accessTokenExpiryMs - Date.now() <= withinMs;
}

export function clearProactiveRefreshTimer(): void {
  if (proactiveTimer) {
    clearTimeout(proactiveTimer);
    proactiveTimer = null;
  }
}

export function scheduleProactiveRefresh(
  expiryISO: string,
  refreshFn: () => Promise<unknown>,
  refreshSkewMs = 60_000
): void {
  const expiryMs = Date.parse(expiryISO);
  if (!Number.isFinite(expiryMs)) return;

  clearProactiveRefreshTimer();

  const msUntilRefresh = expiryMs - Date.now() - refreshSkewMs;
  const delay = Math.max(0, msUntilRefresh);

  proactiveTimer = setTimeout(() => {
    void refreshFn();
  }, delay);
}

/**
 * Handles background-tab throttling by "catching up" on focus/visibility/online.
 * Call once from app bootstrap (we do it from `services/tokenManager.ts`).
 */
export function initTokenLifecycleHandlers(maybeRefreshFn: () => void): void {
  if (lifecycleInitialized) return;
  lifecycleInitialized = true;

  const onWake = () => {
    // If the tab was throttled and we're near/over expiry, refresh.
    if (isExpiringSoon(60_000)) maybeRefreshFn();
  };

  window.addEventListener("focus", onWake);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") onWake();
  });
  window.addEventListener("online", onWake);
}

