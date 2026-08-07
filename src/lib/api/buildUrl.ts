import { API_SERVICES, API_VERSION, getBaseUrl, type ApiService } from "./config";

type QueryValue = string | number | boolean | undefined | null;

export function buildApiUrl(
  service: ApiService,
  path: string,
  query?: Record<string, QueryValue>
): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const base = `${getBaseUrl()}/${API_SERVICES[service]}/api/${API_VERSION}${normalizedPath}`;

  if (!query) return base;

  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null) {
      params.set(key, String(value));
    }
  }

  const qs = params.toString();
  return qs ? `${base}?${qs}` : base;
}

/** OAuth and other non-versioned ticketcore routes */
export function buildTicketcoreUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getBaseUrl()}/${API_SERVICES.TICKETCORE}${normalizedPath}`;
}
