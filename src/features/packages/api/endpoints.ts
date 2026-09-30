import { buildApiUrl } from "@/lib/api/buildUrl";
import type { PackageSearchFilters } from "../types/package";
import { PACKAGE_PAGE_SIZE } from "../types/package";

export const packagesEndpoints = {
  list: (filters: PackageSearchFilters, page: number, size = PACKAGE_PAGE_SIZE) =>
    buildApiUrl("TICKETCORE", "/public/packages", {
      city: filters.city,
      category: filters.category,
      departureDate: filters.departureDate,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      page,
      size,
    }),

  byId: (packageId: string) =>
    buildApiUrl("TICKETCORE", `/public/packages/${packageId}`),

  preview: () => buildApiUrl("TICKETCORE", "/public/packages/preview"),

  reserve: () => buildApiUrl("TICKETCORE", "/package-reservations"),

  quoteRequest: () => buildApiUrl("TICKETCORE", "/package-quote-requests"),

  myQuotes: (page = 0, size = 10) =>
    buildApiUrl("TICKETCORE", "/package-quote-requests/my", { page, size }),

  quoteDetail: (quoteRequestId: number | string) =>
    buildApiUrl("TICKETCORE", `/package-quote-requests/${quoteRequestId}`),
} as const;

export const packagePaymentEndpoints = {
  mpesaPay: () => buildApiUrl("TICKETCORE", "/package-payments/mpesa/pay"),
  econetPay: () => buildApiUrl("TICKETCORE", "/package-payments/econet"),
  cpayInitiate: () => buildApiUrl("TICKETCORE", "/package-payments/cpay/initiate"),
  cpayPay: () => buildApiUrl("TICKETCORE", "/package-payments/cpay/pay"),
  cpayCardInitiate: () => buildApiUrl("TICKETCORE", "/package-payments/cpay/card/initiate"),
  /** No package-specific status endpoint was provided; card polling uses the shared one. */
  status: (paymentId: number) => buildApiUrl("TICKETCORE", `/payments/status/${paymentId}`),
} as const;
