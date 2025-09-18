import axios from "axios";
import type { OtherApiResponse } from "../../interfaces/country";
import type { AppDispatch } from "../../reducers/store";
import { setTicketCategories, type TicketCategory } from "../../slices/ticketCategory";
import { apiConnector } from "../apiConnector";
import { setBooking } from "../../slices/reserveTicketSlice";
import type { BookingData } from "../../interfaces/reserveTicketInterface";




// ---------------------- List All Ticket Categories ----------------------
export function listAllTicketCategoriesByShowId(showId:number) {
  return async (dispatch: AppDispatch): Promise<{ success: boolean }> => {
    try {
      const response = await apiConnector<OtherApiResponse<TicketCategory[]>>({
        method: "GET",
        url: `https://thedemonstrate.com/ticketcore-api/api/v1/shows/${showId}/ticketcategories`,
        headers: { "X-Client-Source": "WEB" },
        withCredentials: true,
      });

      console.log("TICKET CATEGORY RESPONSE  ",response);

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




export function reserveTicket(categoryId:number,userId:number,count:number) {
  return async (dispatch: AppDispatch): Promise<{ success: boolean }> => {
    try {
      const response = await apiConnector<OtherApiResponse<BookingData>>({
        method: "POST",
        url: `https://thedemonstrate.com/ticketcore-api/api/v1/bookings/reserve`,
        bodyData:{categoryId,userId,count},
        headers: { "X-Client-Source": "WEB" },
        withCredentials: true,
      });

      console.log("RESERVE TICKET  RESPONSE  ",response);

      if (response.data.statusCode === 201) {
        dispatch(setBooking(response.data.data));
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




export function cancelBooking(bookingId:number) {
  return async (): Promise<{ success: boolean }> => {
    try {
      const response = await apiConnector({
        method: "POST",
        url: `https://thedemonstrate.com/ticketcore-api/api/v1/bookings/${bookingId}/cancel`,
        headers: { "X-Client-Source": "WEB" },
        withCredentials: true,
      });

      console.log("Cancel TICKET Booking RESPONSE  ",response);


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



