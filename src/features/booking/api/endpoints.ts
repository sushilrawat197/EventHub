import { buildApiUrl } from "@/lib/api/buildUrl";

export const bookingEndpoints = {
  ticketCategories: (showId: number) =>
    buildApiUrl("TICKETCORE", `/shows/${showId}/ticketcategories`),

  reserve: () => buildApiUrl("TICKETCORE", "/bookings/reserve"),

  cancel: (bookingId: number) =>
    buildApiUrl("TICKETCORE", `/bookings/${bookingId}/cancel`),

  confirm: (bookingId: number) =>
    buildApiUrl("TICKETCORE", `/bookings/${bookingId}/confirm`),
} as const;

export const marathonEndpoints = {
  check: () => buildApiUrl("TICKETCORE", "/marathon-registrations/check"),

  submit: () => buildApiUrl("TICKETCORE", "/marathon-registrations"),

  byUser: (userId: number) =>
    buildApiUrl("TICKETCORE", `/marathon-registrations/booking/${userId}`),

  activeCorporates: () => buildApiUrl("TICKETCORE", "/corporates/active"),
} as const;
