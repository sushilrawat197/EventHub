import { client } from "@/lib/api/client";
import { apiConnector } from "@/lib/api/connector";
import { ApiError, extractApiFailureMessage } from "@/lib/api/errors";
import type { PageData } from "@/lib/api/types";
import type { BookingResponse } from "@/features/booking/types/confirmBookingInterface";
import type { OrderDetails } from "../store/orderDetails";
import type { PackageOrder } from "../types/packageOrder";
import { ordersEndpoints } from "./endpoints";

export async function listAllOrdersApi(
  page = 0,
  size = 8
): Promise<PageData<OrderDetails>> {
  return client.getPaginated<OrderDetails>(ordersEndpoints.my(page, size));
}

export async function getOrderDetailApi(
  bookingId: number
): Promise<BookingResponse> {
  return client.get<BookingResponse>(ordersEndpoints.detail(bookingId));
}

export async function downloadOrderTicketApi(bookingId: number): Promise<Blob> {
  return client.getBlob(ordersEndpoints.download(bookingId));
}

function packageOrderFromBody(body: unknown): PackageOrder {
  if (!body || typeof body !== "object") {
    throw new ApiError("We couldn't load this booking.");
  }
  const record = body as { status?: unknown; statusCode?: unknown; data?: unknown };
  const code = typeof record.statusCode === "number" ? record.statusCode : undefined;
  const ok =
    (code != null && code >= 200 && code < 300) ||
    record.status === "OK" ||
    record.status === "SUCCESS";
  if (ok && record.data && typeof record.data === "object") return record.data as PackageOrder;
  throw new ApiError(extractApiFailureMessage(body, "We couldn't load this booking."), code);
}

export async function getPackageOrderApi(bookingId: number): Promise<PackageOrder> {
  const response = await apiConnector<unknown>({
    method: "GET",
    url: ordersEndpoints.packageDetail(bookingId),
  });
  return packageOrderFromBody(response.data);
}

export async function downloadPackageVoucherApi(bookingId: number): Promise<Blob> {
  return client.getBlob(ordersEndpoints.packageVoucher(bookingId));
}
