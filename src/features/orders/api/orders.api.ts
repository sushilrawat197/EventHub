import { client } from "@/lib/api/client";
import type { PageData } from "@/lib/api/types";
import type { BookingResponse } from "@/features/booking/types/confirmBookingInterface";
import type { OrderDetails } from "../store/orderDetails";
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
