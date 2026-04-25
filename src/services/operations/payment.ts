import axios from "axios";
import type { NavigateFunction } from "react-router-dom";
import { apiConnector } from "../apiConnector";
import type { OtherApiResponse } from "../../interfaces/country";
import type { payTickeResponse } from "../../interfaces/payTicketInterface";
import type { AppDispatch } from "../../app/store/store";
import { setCancelTicketLoading } from "../../app/store/slices/confirmBookingSlice";
import { setPayMessage, setPayTicketLoading } from "../../app/store/slices/payTicketSlice";
import { getOrderDetails } from "./ticketCategory";

const BASE_URL: string = import.meta.env.VITE_BASE_URL as string;
const PAYMENT_INITIATE_TIMEOUT_MS = 15000;

type PaymentActionResult = {
  success: boolean;
  timedOut?: boolean;
};

export function ticketPay(bookingId: number | null, phoneNumber: string | null, navigate: NavigateFunction) {
  return async (dispatch: AppDispatch): Promise<PaymentActionResult> => {
    try {
      dispatch(setPayTicketLoading(true));
      const response = await apiConnector<OtherApiResponse<payTickeResponse>>({
        method: "POST",
        url: `${BASE_URL}/ticketcore-api/api/v1/payments/mpesa/pay`,
        bodyData: { bookingId, phoneNumber },
        headers: { "X-Client-Source": "WEB" },
        withCredentials: true,
        timeout: PAYMENT_INITIATE_TIMEOUT_MS,
        suppressTimeoutPopup: true,
      });

      if (response.data.statusCode === 200) {
        localStorage.setItem("navigateContext", "confirmBooking");
        navigate(`/order/${response?.data?.data?.bookingId}`, { replace: true });
        return { success: true };
      }

      return { success: false };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === "ERR_CANCELED" || error.code === "ECONNABORTED") {
          return { success: false, timedOut: true };
        }
        dispatch(setPayMessage(error?.response?.data.message));
        console.error("Axios error:", error.response);
      } else {
        console.error("Unknown error:", error);
      }
      return { success: false };
    } finally {
      dispatch(setPayTicketLoading(false));
    }
  };
}

export function ecoCashPay(bookingId: number | null, phoneNumber: string | null, navigate: NavigateFunction) {
  return async (dispatch: AppDispatch): Promise<PaymentActionResult> => {
    try {
      dispatch(setPayTicketLoading(true));
      const response = await apiConnector<OtherApiResponse<payTickeResponse>>({
        method: "POST",
        url: `${BASE_URL}/ticketcore-api/api/v1/payments/econet/pay`,
        bodyData: { bookingId, phoneNumber },
        headers: { "X-Client-Source": "WEB" },
        withCredentials: true,
        timeout: PAYMENT_INITIATE_TIMEOUT_MS,
        suppressTimeoutPopup: true,
      });

      if (response.data.statusCode === 200) {
        localStorage.setItem("navigateContext", "confirmBooking");
        navigate(`/order/${response?.data?.data?.bookingId}`, { replace: true });
        return { success: true };
      }

      return { success: false };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === "ERR_CANCELED" || error.code === "ECONNABORTED") {
          return { success: false, timedOut: true };
        }
        dispatch(setPayMessage(error?.response?.data.message));
        console.error("Axios error:", error.response);
      } else {
        console.error("Unknown error:", error);
      }
      return { success: false };
    } finally {
      dispatch(setPayTicketLoading(false));
    }
  };
}

export function cardPay(
  bookingId: number | null,
  phoneNumber: string | null
) {
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

      const response = await apiConnector<
        OtherApiResponse<{
          iframeHtml: string;
          paymentId: number;
          extTransactionId: string;
        }>
      >({
        method: "POST",
        url: `${BASE_URL}/ticketcore-api/api/v1/payments/cpay/card/initiate`,
        bodyData: { bookingId, phoneNumber },
        headers: { "X-Client-Source": "WEB" },
        withCredentials: true,
        timeout: PAYMENT_INITIATE_TIMEOUT_MS,
        suppressTimeoutPopup: true,
      });

      if (response.data.statusCode === 200) {
        return {
          success: true,
          iframeHtml: response.data.data.iframeHtml,
          paymentId: response.data.data.paymentId,
          extTransactionId: response.data.data.extTransactionId,
        };
      }

      return { success: false };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === "ERR_CANCELED" || error.code === "ECONNABORTED") {
          return { success: false, timedOut: true };
        }
        dispatch(setPayMessage(error?.response?.data.message));
      }
      return { success: false };
    } finally {
      dispatch(setPayTicketLoading(false));
    }
  };
}

export async function getPaymentStatus(paymentId: number) {
  return apiConnector<OtherApiResponse<payTickeResponse>>({
    method: "GET",
    url: `${BASE_URL}/ticketcore-api/api/v1/payments/status/${paymentId}`,
    withCredentials: true,
  });
}

export async function normalCPayInitiate(
  bookingId: number | null,
  phoneNumber: string | null,
  dispatch: AppDispatch
): Promise<{ success: boolean; timedOut?: boolean; message?: string }> {
  try {
    const response = await apiConnector<OtherApiResponse<payTickeResponse>>({
      method: "POST",
      url: `${BASE_URL}/ticketcore-api/api/v1/payments/cpay/initiate`,
      bodyData: { bookingId, phoneNumber },
      headers: { "X-Client-Source": "WEB" },
      withCredentials: true,
      timeout: PAYMENT_INITIATE_TIMEOUT_MS,
      suppressTimeoutPopup: true,
    });

    if (response?.data?.statusCode === 200) {
      return { success: true, message: response.data.message };
    }

    return {
      success: false,
      message: response?.data?.message || "Something went wrong",
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.code === "ERR_CANCELED" || error.code === "ECONNABORTED") {
        return { success: false, timedOut: true };
      }
      dispatch(setPayMessage(error?.response?.data.message));
      console.error("Axios Error:", error.response);
      return {
        success: false,
        message: error?.response?.data?.message || "Request failed",
      };
    } else {
      console.error("Unknown Error:", error);
      return { success: false, message: "Unknown error occurred" };
    }
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
    const response = await apiConnector<OtherApiResponse<payTickeResponse>>({
      method: "POST",
      url: `${BASE_URL}/ticketcore-api/api/v1/payments/cpay/pay`,
      bodyData: { bookingId, phoneNumber, otp },
      headers: { "X-Client-Source": "WEB" },
      withCredentials: true,
    });

    if (response?.data?.statusCode === 200) {
      localStorage.setItem("navigateContext", "confirmBooking");
      navigate(`/order/${response?.data?.data?.bookingId}`, { replace: true });
      return { success: true };
    }

    return {
      success: false,
      message: response?.data?.message || "Something went wrong",
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      dispatch(setPayMessage(error?.response?.data.message));
      console.error("Axios Error:", error.response);
      return {
        success: false,
        message: error?.response?.data?.message || "Request failed",
      };
    } else {
      console.error("Unknown Error:", error);
      return { success: false, message: "Unknown error occurred" };
    }
  }
}

export function cancelBookingTicket(bookingId: number, navigate: NavigateFunction) {
  return async (dispatch: AppDispatch): Promise<{ success: boolean }> => {
    try {
      dispatch(setCancelTicketLoading(true));
      const response = await apiConnector<OtherApiResponse<payTickeResponse>>({
        method: "POST",
        url: `${BASE_URL}/ticketcore-api/api/v1/payments/mpesa/refund`,
        bodyData: { bookingId },
        headers: { "X-Client-Source": "WEB" },
        withCredentials: true,
      });

      if (response.data.statusCode === 200) {
        dispatch(getOrderDetails(bookingId, navigate));
        return { success: true };
      }

      return { success: false };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        dispatch(setPayMessage(error?.response?.data.message));
        console.error("Axios error:", error.response);
      } else {
        console.error("Unknown error:", error);
      }
      return { success: false };
    } finally {
      dispatch(setCancelTicketLoading(false));
    }
  };
}
