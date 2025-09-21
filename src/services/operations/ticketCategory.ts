import axios from "axios";
import type { OtherApiResponse } from "../../interfaces/country";
import type { AppDispatch } from "../../reducers/store";
import { setTicketCategories, type TicketCategory } from "../../slices/ticketCategory";
import { apiConnector } from "../apiConnector";
import { setBooking } from "../../slices/reserveTicketSlice";
import type { BookingData } from "../../interfaces/reserveTicketInterface";
import { setTicketInfo } from "../../slices/ticketInfoSlice";
import type { NavigateFunction } from "react-router-dom";
import { setConfirmBooking } from "../../slices/confirmBookingSlice";
import type { BookingResponse } from "../../interfaces/confirmBookingInterface";
import { setLoading } from "../../slices/confirmBookingSlice";




// ---------------------- List All Ticket Categories ----------------------
export function listAllTicketCategoriesByShowId(showId: number) {
  return async (dispatch: AppDispatch): Promise<{ success: boolean }> => {
    try {
      const response = await apiConnector<OtherApiResponse<TicketCategory[]>>({
        method: "GET",
        url: `https://thedemonstrate.com/ticketcore-api/api/v1/shows/${showId}/ticketcategories`,
        headers: { "X-Client-Source": "WEB" },
        withCredentials: true,
      });

      console.log("TICKET CATEGORY RESPONSE  ", response);

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


export function reserveTicket(userId: number, categories: CategorySelection[]) {
  return async (dispatch: AppDispatch,): Promise<{ success: boolean }> => {
    try {
      const response = await apiConnector<OtherApiResponse<BookingData>>({
        method: "POST",
        url: `https://thedemonstrate.com/ticketcore-api/api/v1/bookings/reserve`,
        bodyData: { userId, categories },
        headers: { "X-Client-Source": "WEB" },
        withCredentials: true,
      });

      console.log("RESERVE TICKET  RESPONSE  ", response);

      if (response.data.statusCode === 201) {

        dispatch(setBooking(response.data.data));
        dispatch(setTicketInfo({ bookingId: response.data.data.bookingId }));
        return { success: true };
      }

      return { success: false };
    } catch (error) {

      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.data?.categories || error.response?.data?.message )
        
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
        url: `https://thedemonstrate.com/ticketcore-api/api/v1/bookings/${bookingId}/cancel`,
        headers: { "X-Client-Source": "WEB" },
        withCredentials: true,
      });

      console.log("Cancel TICKET Booking RESPONSE  ", response);

      if (response.data.statusCode === 200) {
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




export function confirmBooking(bookingId: number | null, navigate: NavigateFunction) {

  return async (dispatch:AppDispatch): Promise<{ success: boolean }> => {
    try {
       dispatch(setLoading(true));
      const response = await apiConnector<OtherApiResponse<BookingData>>({
        method: "POST",
        url: `https://thedemonstrate.com/ticketcore-api/api/v1/bookings/${bookingId}/confirm`,
        headers: { "X-Client-Source": "WEB" },
        withCredentials: true,
      });


        if (response.data.statusCode === 200) {
           dispatch(setBooking(response.data.data));
           navigate(`/bookingconfirmed/${response?.data?.data?.bookingId}`);

        return { success: true };
      }

      console.log("Confirm TICKET RESPONSE  ", response);

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



export function getOrderDetails(bookingId: number | null) {
  return async (dispatch:AppDispatch): Promise<{ success: boolean }> => {
    try {
     dispatch(setLoading(true));
      const response = await apiConnector<OtherApiResponse<BookingResponse>>({
        method: "GET",
        url: `https://thedemonstrate.com/ticketcore-api/api/v1/orders/${bookingId}`,
        headers: { "X-Client-Source": "WEB" },
        withCredentials: true,
      });

        if (response.data.statusCode === 200) {
           dispatch(setConfirmBooking(response.data.data));
        return { success: true };
      }

      console.log("GET ORDER RESPONSE  ", response);


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
      const response = await axios.get(
        `https://thedemonstrate.com/ticketcore-api/api/v1/orders/${bookingId}/download`,
        {
          headers: { "X-Client-Source": "WEB" },
          withCredentials: true,
          responseType: "blob", // important
        }
      );

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







