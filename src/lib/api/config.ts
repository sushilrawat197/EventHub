export const API_SERVICES = {
  TICKETCORE: "ticketcore-api",
} as const;

export type ApiService = keyof typeof API_SERVICES;

export const API_VERSION = "v1";

export function getBaseUrl(): string {
  const url = import.meta.env.VITE_BASE_URL;
  if (!url) {
    throw new Error("VITE_BASE_URL is not defined");
  }
  return url.replace(/\/$/, "");
}
