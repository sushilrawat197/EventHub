import { buildApiUrl } from "@/lib/api/buildUrl";

export const EVENTS_PAGE_SIZE = 8;

/** Region IDs used by the locations API */
export const REGION_IDS = {
  DEFAULT: 2,
  VENUE_CITIES: 20,
} as const;

export const eventsEndpoints = {
  search: (page: number, size: number) =>
    buildApiUrl("TICKETCORE", "/events/search", { page, size }),

  byId: (eventId: string) =>
    buildApiUrl("TICKETCORE", `/events/search/${eventId}`),

  availability: (eventId: string) =>
    buildApiUrl("TICKETCORE", `/events/${eventId}/availability`),
} as const;

export const showsEndpoints = {
  byEvent: (eventId: string) =>
    buildApiUrl("TICKETCORE", `/shows/liveshows/${eventId}`),

  byVenue: (venueId: string) =>
    buildApiUrl("TICKETCORE", `/shows/venue/${venueId}`),
} as const;

export const venuesEndpoints = {
  byCity: (cityId: number) =>
    buildApiUrl("TICKETCORE", `/venues/city/${cityId}`),

  byId: (venueId: number) =>
    buildApiUrl("TICKETCORE", `/venues/${venueId}`),
} as const;

export const regionsEndpoints = {
  cities: (regionId: number) =>
    buildApiUrl("TICKETCORE", `/regions/${regionId}/cities`),
} as const;
