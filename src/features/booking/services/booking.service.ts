import axios from "axios";
import type { NavigateFunction } from "react-router-dom";
import type { AppDispatch } from "@/app/store/store";
import { setEventsErrorMsg } from "@/features/events/store/eventSlice";
import {
  setTicketCategories,
  setTicketCategoriesError,
  setTicketCategoriesLoading,
} from "../store/ticketCategory";
import { setBooking } from "../store/reserveTicketSlice";
import { setTicketInfo } from "../store/ticketInfoSlice";
import { setLoading } from "../store/confirmBookingSlice";
import {
  cancelBookingApi,
  confirmBookingApi,
  reserveBookingApi,
  type CategorySelection,
} from "../api/booking.api";
import { listTicketCategoriesByShowIdApi } from "../api/tickets.api";

export type { CategorySelection } from "../api/booking.api";

export function listAllTicketCategoriesByShowId(showId: number) {
  return async (dispatch: AppDispatch): Promise<{ success: boolean }> => {
    try {
      dispatch(setTicketCategoriesLoading(true));
      dispatch(setTicketCategoriesError(null));
      const categories = await listTicketCategoriesByShowIdApi(showId);
      dispatch(setTicketCategories(categories));
      return { success: true };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        dispatch(
          setTicketCategoriesError({
            description:
              error.response?.data?.message || "Failed to fetch tickets",
          })
        );
        console.error("Axios error:", error.response);
      } else {
        console.error("Unknown error:", error);
      }
      return { success: false };
    } finally {
      dispatch(setTicketCategoriesLoading(false));
    }
  };
}

export function reserveTicket(
  categories: CategorySelection[],
  registrationId?: number
) {
  return async (dispatch: AppDispatch): Promise<{ success: boolean }> => {
    try {
      const data = await reserveBookingApi(categories, registrationId);
      dispatch(setBooking(data));
      dispatch(setTicketInfo({ bookingId: data.bookingId }));
      return { success: true };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        dispatch(
          setEventsErrorMsg(
            error.response?.data?.data?.categories || error.response?.data?.message
          )
        );
        console.error("Axios error:", error.response);
      } else {
        console.error("Unknown error:", error);
      }
      return { success: false };
    }
  };
}

export function cancelBooking(bookingId: number) {
  return async (): Promise<{ success: boolean }> => {
    try {
      const ok = await cancelBookingApi(bookingId);
      return { success: ok };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.response);
      } else {
        console.error("Unknown error:", error);
      }
      return { success: false };
    }
  };
}

export function confirmBooking(
  bookingId: number | null,
  navigate: NavigateFunction
) {
  return async (dispatch: AppDispatch): Promise<{ success: boolean }> => {
    if (bookingId == null) return { success: false };

    try {
      dispatch(setLoading(true));
      const data = await confirmBookingApi(bookingId);
      dispatch(setBooking(data));
      navigate(`/bookingconfirmed/${data.bookingId}`);
      return { success: true };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.response);
      } else {
        console.error("Unknown error:", error);
      }
      return { success: false };
    } finally {
      dispatch(setLoading(false));
    }
  };
}
