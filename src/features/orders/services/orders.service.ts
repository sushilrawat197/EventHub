import axios from "axios";
import type { NavigateFunction } from "react-router-dom";
import type { AppDispatch } from "@/app/store/store";
import { setConfirmBooking, setLoading } from "@/features/booking/store/confirmBookingSlice";
import { getApiErrorMessage } from "@/lib/api/errors";
import {
  downloadOrderTicketApi,
  getOrderDetailApi,
} from "../api/orders.api";
import { submitServiceFeedbackApi } from "../api/feedback.api";

export function getOrderDetails(
  bookingId: number | null,
  navigate: NavigateFunction,
  options?: { redirectToOrder?: boolean }
) {
  return async (dispatch: AppDispatch): Promise<{ success: boolean }> => {
    if (bookingId == null) return { success: false };

    try {
      dispatch(setLoading(true));
      const data = await getOrderDetailApi(bookingId);
      dispatch(setConfirmBooking(data));

      const targetPath = `/order/${bookingId}`;
      const allowRedirect = options?.redirectToOrder !== false;
      if (allowRedirect && window.location.pathname !== targetPath) {
        navigate(targetPath);
      }

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

export function downloadTicket(bookingId: number | null) {
  return async (): Promise<{ success: boolean }> => {
    if (bookingId == null) return { success: false };

    try {
      const blob = await downloadOrderTicketApi(bookingId);
      const url = window.URL.createObjectURL(
        new Blob([blob], { type: "application/pdf" })
      );

      const link = document.createElement("a");
      link.href = url;
      link.download = `ticket-${bookingId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      return { success: true };
    } catch (error) {
      console.error("Download error:", getApiErrorMessage(error, "Download failed"));
      return { success: false };
    }
  };
}

export function ratingAndReview(rating: number, comments: string) {
  return async (): Promise<{ success: boolean }> => {
    try {
      await submitServiceFeedbackApi(rating, comments);
      return { success: true };
    } catch (error) {
      console.error("Feedback error:", getApiErrorMessage(error, "Feedback failed"));
      return { success: false };
    }
  };
}
