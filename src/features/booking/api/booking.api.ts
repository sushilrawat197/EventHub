import axios from "axios";
import { client } from "@/lib/api/client";
import { ApiError } from "@/lib/api/errors";
import type { BookingData } from "../types/reserveTicketInterface";
import { bookingEndpoints } from "./endpoints";

export interface CategorySelection {
  categoryId: number;
  count: number;
}

interface ReserveTicketPayload {
  categories: CategorySelection[];
  registrationId?: number;
}

export async function reserveBookingApi(
  categories: CategorySelection[],
  registrationId?: number
): Promise<BookingData> {
  const payload: ReserveTicketPayload = registrationId
    ? { categories, registrationId }
    : { categories };

  return client.post<BookingData, ReserveTicketPayload>(
    bookingEndpoints.reserve(),
    payload
  );
}

export async function cancelBookingApi(bookingId: number): Promise<boolean> {
  try {
    await client.post<BookingData>(bookingEndpoints.cancel(bookingId));
    return true;
  } catch (error) {
    if (error instanceof ApiError && error.statusCode === 409) return true;
    if (axios.isAxiosError(error) && error.response?.status === 409) return true;
    throw error;
  }
}

export async function confirmBookingApi(bookingId: number): Promise<BookingData> {
  return client.post<BookingData>(bookingEndpoints.confirm(bookingId));
}
