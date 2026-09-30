import { buildApiUrl } from "@/lib/api/buildUrl";

export const ordersEndpoints = {
  my: (page: number, size: number) =>
    buildApiUrl("TICKETCORE", "/orders/my", { page, size }),

  detail: (bookingId: number) =>
    buildApiUrl("TICKETCORE", `/orders/${bookingId}`),

  download: (bookingId: number) =>
    buildApiUrl("TICKETCORE", `/orders/${bookingId}/download`),

  packageDetail: (bookingId: number) =>
    buildApiUrl("TICKETCORE", `/orders/${bookingId}/package`),

  packageVoucher: (bookingId: number) =>
    buildApiUrl("TICKETCORE", `/booking/package/${bookingId}/voucher`),
} as const;

export const feedbackEndpoints = {
  submit: () => buildApiUrl("TICKETCORE", "/service-feedback"),
} as const;
