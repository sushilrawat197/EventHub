import { buildApiUrl } from "@/lib/api/buildUrl";

export const PAYMENT_INITIATE_TIMEOUT_MS = 15_000;

export const paymentEndpoints = {
  mpesaPay: () => buildApiUrl("TICKETCORE", "/payments/mpesa/pay"),
  econetPay: () => buildApiUrl("TICKETCORE", "/payments/econet/pay"),
  cpayCardInitiate: () => buildApiUrl("TICKETCORE", "/payments/cpay/card/initiate"),
  cpayInitiate: () => buildApiUrl("TICKETCORE", "/payments/cpay/initiate"),
  cpayPay: () => buildApiUrl("TICKETCORE", "/payments/cpay/pay"),
  status: (paymentId: number) =>
    buildApiUrl("TICKETCORE", `/payments/status/${paymentId}`),
  mpesaRefund: () => buildApiUrl("TICKETCORE", "/payments/mpesa/refund"),
} as const;
