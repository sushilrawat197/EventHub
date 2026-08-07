import { buildApiUrl } from "@/lib/api/buildUrl";

export const ordersEndpoints = {
  my: (page: number, size: number) =>
    buildApiUrl("TICKETCORE", "/orders/my", { page, size }),

  detail: (bookingId: number) =>
    buildApiUrl("TICKETCORE", `/orders/${bookingId}`),

  download: (bookingId: number) =>
    buildApiUrl("TICKETCORE", `/orders/${bookingId}/download`),
} as const;

export const feedbackEndpoints = {
  submit: () => buildApiUrl("TICKETCORE", "/service-feedback"),
} as const;
