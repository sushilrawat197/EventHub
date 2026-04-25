import axios from "axios";
import { api } from "../../api/axios";
import type { OtherApiResponse } from "../../interfaces/country";
import type { AppDispatch } from "../../app/store/store";
import { setTicketCategories, type TicketCategory } from "../../app/store/slices/ticketCategory";
import { apiConnector } from "../apiConnector";
import { setBooking } from "../../app/store/slices/reserveTicketSlice";
import type { BookingData } from "../../interfaces/reserveTicketInterface";
import { setTicketInfo } from "../../app/store/slices/ticketInfoSlice";
import { type NavigateFunction } from "react-router-dom";
import { setConfirmBooking } from "../../app/store/slices/confirmBookingSlice";
import type { BookingResponse } from "../../interfaces/confirmBookingInterface";
import { setLoading } from "../../app/store/slices/confirmBookingSlice";
import { setEventsErrorMsg } from "../../app/store/slices/eventSlice";
const BASE_URL: string = import.meta.env.VITE_BASE_URL as string;



// ---------------------- List All Ticket Categories ----------------------
export function listAllTicketCategoriesByShowId(showId: number) {
  return async (dispatch: AppDispatch): Promise<{ success: boolean }> => {
    try {
      const response = await apiConnector<OtherApiResponse<TicketCategory[]>>({
        method: "GET",
        url: `${BASE_URL}/ticketcore-api/api/v1/shows/${showId}/ticketcategories`,
        headers: { "X-Client-Source": "WEB" },
        withCredentials: true,
      });

      // console.log("TICKET CATEGORY RESPONSE  ", response);

      if (response.data.statusCode === 200) {
        dispatch(setTicketCategories(response.data.data));
        return { success: true };
      }

      return { success: false };
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




export interface CategorySelection {
  categoryId: number;
  count: number;
}


export function reserveTicket(categories: CategorySelection[]) {
  return async (dispatch: AppDispatch,): Promise<{ success: boolean }> => {
    try {
      const response = await apiConnector<OtherApiResponse<BookingData>>({
        method: "POST",
        url: `${BASE_URL}/ticketcore-api/api/v1/bookings/reserve`,
        bodyData: { categories },
        headers: { "X-Client-Source": "WEB" },
        withCredentials: true,
      });

      // console.log("RESERVE TICKET  RESPONSE  ", response);

      if (response.data.statusCode === 201) {

        dispatch(setBooking(response.data.data));
        dispatch(setTicketInfo({ bookingId: response.data.data.bookingId }));
        return { success: true };
      }

      return { success: false };
    } catch (error) {

      if (axios.isAxiosError(error)) {
          dispatch(setEventsErrorMsg(error.response?.data?.data?.categories || error.response?.data?.message))
        // alert(error.response?.data?.data?.categories || error.response?.data?.message)

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
      
      const response = await apiConnector<OtherApiResponse<BookingData>>({
        method: "POST",
        url: `${BASE_URL}/ticketcore-api/api/v1/bookings/${bookingId}/cancel`,
        headers: { "X-Client-Source": "WEB" },
        withCredentials: true,
      });

      console.log("Cancel TICKET Booking RESPONSE  ", response);

      if (response.data.statusCode === 200 || response.data.statusCode === 409) {
        return { success: true };
      }

      return { success: false };
    } catch (error) {

      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.response);
        if (error.response?.status === 409) {
          return { success: true };
        }

      } else {
        console.error("Unknown error:", error);
      }
      return { success: false };
    }
  };
}




export function confirmBooking(bookingId: number | null, navigate: NavigateFunction) {

  return async (dispatch: AppDispatch): Promise<{ success: boolean }> => {
    try {
      dispatch(setLoading(true));
      const response = await apiConnector<OtherApiResponse<BookingData>>({
        method: "POST",
        url: `${BASE_URL}/ticketcore-api/api/v1/bookings/${bookingId}/confirm`,
        headers: { "X-Client-Source": "WEB" },
        withCredentials: true,
      });


      if (response.data.statusCode === 200) {
        dispatch(setBooking(response.data.data));
        navigate(`/bookingconfirmed/${response?.data?.data?.bookingId}`);

        return { success: true };
      }

      // console.log("Confirm TICKET RESPONSE  ", response);

      return { success: false };
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
  }
}



export function getOrderDetails(bookingId: number | null, navigate: NavigateFunction) {
  return async (dispatch: AppDispatch): Promise<{ success: boolean }> => {
    try {
      dispatch(setLoading(true));
      const response = await apiConnector<OtherApiResponse<BookingResponse>>({
        method: "GET",
        url: `${BASE_URL}/ticketcore-api/api/v1/orders/${bookingId}`,
        headers: { "X-Client-Source": "WEB" },
        withCredentials: true,
      });

      //  console.log("GET ORDER RESPONSE  ", response);

      if (response.data.statusCode === 200) {
        dispatch(setConfirmBooking(response.data.data));
        navigate(`/order/${bookingId}`)
        return { success: true };
      }

      return { success: false };
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
    try {

      const response = await api.get(`${BASE_URL}/ticketcore-api/api/v1/orders/${bookingId}/download`, {
        withCredentials: true,
        responseType: "blob", // important
        skipRefresh: false,
      });

      // console.log(response);

      if (response.status === 200) {
        // create a blob url
        const blob = new Blob([response.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);

        // create a temporary link element
        const link = document.createElement("a");
        link.href = url;
        link.download = `ticket-${bookingId}.pdf`; // filename
        document.body.appendChild(link);
        link.click();

        // cleanup
        link.remove();
        window.URL.revokeObjectURL(url);

        return { success: true };
      }

      return { success: false };
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
