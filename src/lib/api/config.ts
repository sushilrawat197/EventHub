export const API_SERVICES = {
  TICKETCORE: "ticketcore-api",
} as const;

export type ApiService = keyof typeof API_SERVICES;

export const API_VERSION = "v1";

/**
 * Host origin only (e.g. https://www.mytag.co.ls).
 * Strips a trailing /ticketcore-api/api/v1 if someone mistakenly set it in VITE_BASE_URL,
 * because buildApiUrl already appends that path.
 */
export function getBaseUrl(): string {
  const url = import.meta.env.VITE_BASE_URL;
  if (!url) {
    throw new Error("VITE_BASE_URL is not defined");
  }
  return url
    .trim()
    .replace(/\/$/, "")
    .replace(/\/ticketcore-api\/api\/v\d+$/i, "");
}
