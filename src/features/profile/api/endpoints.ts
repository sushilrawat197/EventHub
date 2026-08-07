import { buildApiUrl } from "@/lib/api/buildUrl";

export const profileEndpoints = {
  me: () => buildApiUrl("TICKETCORE", "/users/me/profile"),
  picture: () => buildApiUrl("TICKETCORE", "/users/me/picture"),
} as const;
