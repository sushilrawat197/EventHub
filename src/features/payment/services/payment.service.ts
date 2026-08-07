import axios from "axios";
import type { NavigateFunction } from "react-router-dom";
import type { AppDispatch } from "@/app/store/store";
import { setCancelTicketLoading } from "@/features/booking/store/confirmBookingSlice";
import { getOrderDetails } from "@/features/orders/services/orders.service";
import { isTimeoutError } from "@/lib/api/errors";
import { setPayMessage, setPayTicketLoading } from "../store/payTicketSlice";
import {
  cpayCardInitiateApi,
  cpayInitiateApi,
  cpayPayApi,
  econetPayApi,
  getPaymentStatusApi,
  mpesaPayApi,
  mpesaRefundApi,
} from "../api/payment.api";

type PaymentActionResult = {
  success: boolean;
  timedOut?: boolean;
};

function navigateToOrder(navigate: NavigateFunction, bookingId?: number) {
  if (bookingId) {
    localStorage.setItem("navigateContext", "confirmBooking");
    navigate(`/order/${bookingId}`, { replace: true });
  }
}

export function ticketPay(
  bookingId: number | null,
  phoneNumber: string | null,
  navigate: NavigateFunction
) {
  return async (dispatch: AppDispatch): Promise<PaymentActionResult> => {
    try {
      dispatch(setPayTicketLoading(true));
      const data = await mpesaPayApi({ bookingId, phoneNumber });
      navigateToOrder(navigate, data.bookingId);
      return { success: true };
    } catch (error) {
      if (isTimeoutError(error)) return { success: false, timedOut: true };
      if (axios.isAxiosError(error)) {
        dispatch(setPayMessage(error.response?.data?.message));
        console.error("Axios error:", error.response);
      }
      return { success: false };
    } finally {
      dispatch(setPayTicketLoading(false));
    }
  };
}

export function ecoCashPay(
  bookingId: number | null,
  phoneNumber: string | null,
  navigate: NavigateFunction
) {
  return async (dispatch: AppDispatch): Promise<PaymentActionResult> => {
    try {
      dispatch(setPayTicketLoading(true));
      const data = await econetPayApi({ bookingId, phoneNumber });
      navigateToOrder(navigate, data.bookingId);
      return { success: true };
    } catch (error) {
      if (isTimeoutError(error)) return { success: false, timedOut: true };
      if (axios.isAxiosError(error)) {
        dispatch(setPayMessage(error.response?.data?.message));
        console.error("Axios error:", error.response);
      }
      return { success: false };
    } finally {
      dispatch(setPayTicketLoading(false));
    }
  };
}

export function cardPay(bookingId: number | null, phoneNumber: string | null) {
  return async (
    dispatch: AppDispatch
  ): Promise<{
    success: boolean;
    timedOut?: boolean;
    iframeHtml?: string;
    paymentId?: number;
    extTransactionId?: string;
  }> => {
    try {
      dispatch(setPayTicketLoading(true));
      const data = await cpayCardInitiateApi({ bookingId, phoneNumber });
      return {
        success: true,
        iframeHtml: data.iframeHtml,
        paymentId: data.paymentId,
        extTransactionId: data.extTransactionId,
      };
    } catch (error) {
      if (isTimeoutError(error)) return { success: false, timedOut: true };
      if (axios.isAxiosError(error)) {
        dispatch(setPayMessage(error.response?.data?.message));
      }
      return { success: false };
    } finally {
      dispatch(setPayTicketLoading(false));
    }
  };
}

export async function getPaymentStatus(paymentId: number) {
  return getPaymentStatusApi(paymentId);
}

export async function normalCPayInitiate(
  bookingId: number | null,
  phoneNumber: string | null,
  dispatch: AppDispatch
): Promise<{ success: boolean; timedOut?: boolean; message?: string }> {
  try {
      const message = await cpayInitiateApi({ bookingId, phoneNumber });
      return { success: true, message };
  } catch (error) {
    if (isTimeoutError(error)) return { success: false, timedOut: true };
    if (axios.isAxiosError(error)) {
      dispatch(setPayMessage(error.response?.data?.message));
      return {
        success: false,
        message: error.response?.data?.message || "Request failed",
      };
    }
    return { success: false, message: "Unknown error occurred" };
  }
}

export async function cPayPayment(
  bookingId: number | null,
  phoneNumber: string | null,
  otp: string,
  navigate: NavigateFunction,
  dispatch: AppDispatch
): Promise<{ success: boolean; message?: string }> {
  try {
    const data = await cpayPayApi({ bookingId, phoneNumber, otp });
    navigateToOrder(navigate, data.bookingId);
    return { success: true };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      dispatch(setPayMessage(error.response?.data?.message));
      return {
        success: false,
        message: error.response?.data?.message || "Request failed",
      };
    }
    return { success: false, message: "Unknown error occurred" };
  }
}

export function cancelBookingTicket(bookingId: number, navigate: NavigateFunction) {
  return async (dispatch: AppDispatch): Promise<{ success: boolean }> => {
    try {
      dispatch(setCancelTicketLoading(true));
      await mpesaRefundApi(bookingId);
      dispatch(getOrderDetails(bookingId, navigate));
      return { success: true };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        dispatch(setPayMessage(error.response?.data?.message));
        console.error("Axios error:", error.response);
      }
      return { success: false };
    } finally {
      dispatch(setCancelTicketLoading(false));
    }
  };
}
