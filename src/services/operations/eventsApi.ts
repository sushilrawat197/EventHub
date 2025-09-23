import axios from "axios";
import type { AppDispatch } from "../../reducers/store";
import { apiConnector } from "../apiConnector";
import { setAllEventsBySearch, setEventsLoading, setSingleEvent } from "../../slices/eventSlice"; // yaha se import karo
import type { ApiResponse, OtherApiResponse } from "../../interfaces/country";
import type { EventResponse, EventResponseBySearch } from "../../interfaces/eventInterface/evnetInterFace";
import type { RootState } from "../../reducers/store"; // apna store path
const BASE_URL: string = import.meta.env.VITE_BASE_URL as string;


export function listEventsBySearch() {
  return async (dispatch: AppDispatch, getState: () => RootState): Promise<{ success: boolean }> => {
    dispatch(setEventsLoading(true));

    try {

      const filters = getState().searchFilter; // 👈 redux filters state

      console.log("Printing Filters Data", filters)

      const response = await apiConnector<ApiResponse<EventResponseBySearch>>({
        method: "POST",
        url: `${BASE_URL}/ticketcore-api/api/v1/events/search`,
        bodyData: filters,
        headers: { "X-Client-Source": "WEB" },
        withCredentials: true,
      });

      console.log("Search Data", response.data);

      if (response.data.statusCode === 200) {
        dispatch(setAllEventsBySearch(response.data.data));
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
      dispatch(setEventsLoading(false));
    }
  };
}




export function listEventById(eventId: string) {
  return async (dispatch: AppDispatch): Promise<{ success: boolean }> => {
    dispatch(setEventsLoading(true));
    try {
      const response = await apiConnector<OtherApiResponse<EventResponse>>({
        method: "GET",
        url: `${BASE_URL}/ticketcore-api/api/v1/events/search/${eventId}`,
        headers: { "X-Client-Source": "WEB" },
        withCredentials: true,
      });

      //   console.log("LIST ALL EVENTS RESPONSE:", response.data);

      if (response.data.statusCode === 200) {
        dispatch(setSingleEvent(response.data.data));
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
      dispatch(setEventsLoading(false));
    }
  };
}



export interface Show {
  showId: number;
  showDate: string;   // ISO date: "YYYY-MM-DD"
  startTime: string;  // "HH:mm:ss"
  venueName: string;
  soldOut: boolean;
}

export interface EventShows {
  shows: Show[];
  eventId: number;
  eventSoldOut: boolean;
}


export function checkEventAvailability(eventId: string) {
  return async (): Promise<{ success: boolean; soldOut: boolean }> => {
    try {
      const response = await apiConnector<OtherApiResponse<EventShows>>({
        method: "GET",
        url: `${BASE_URL}/ticketcore-api/api/v1/events/${eventId}/availability`,
        headers: { "X-Client-Source": "WEB" },
        withCredentials: true,
      });

      console.log("CHECK EVENTS AVAILABILITY RESPONSE:", response.data);

      if (response.data.statusCode === 200) {
        const eventData = response.data.data;

        if (eventData.eventSoldOut) {
          return { success: true, soldOut: true };
        }

        return { success: true, soldOut: false };
      }

      return { success: false, soldOut: false };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.response);
      } else {
        console.error("Unknown error:", error);
      }
      return { success: false, soldOut: false };
    }
  };
}


