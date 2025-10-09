import axios from "axios";
import type { AppDispatch } from "../../reducers/store";
import { apiConnector } from "../apiConnector";
import { setAllEventsBySearch, setEventsLoading, setSingleEvent } from "../../slices/eventSlice"; // yaha se import karo
import type { ApiResponse, OtherApiResponse } from "../../interfaces/country";
import type { EventResponse, EventResponseBySearch } from "../../interfaces/eventInterface/evnetInterFace";
import type { RootState } from "../../reducers/store"; // apna store path
import { setAvailableEventShows } from "../../slices/availabilitySlice";
const BASE_URL: string = import.meta.env.VITE_BASE_URL as string;




// export function listEventsBySearch() {
//   return async (dispatch: AppDispatch, getState: () => RootState): Promise<{ success: boolean }> => {
//     dispatch(setEventsLoading(true));

//     try {

//       const filters = getState().searchFilter; // 👈 redux filters state

//       console.log("Printing Filters Data", filters)

//       const response = await apiConnector<ApiResponse<EventResponseBySearch>>({
//         method: "POST",
//         url: `${BASE_URL}/ticketcore-api/api/v1/events/search`,
//         bodyData: filters,
//         headers: { "X-Client-Source": "WEB" },
//         withCredentials: true,
//       });

//       console.log("Search Data", response.data);

//       if (response.data.statusCode === 200) {
//         dispatch(setAllEventsBySearch(response.data.data));
//         return { success: true };
//       }

//       return { success: false };
//     } catch (error) {
//       if (axios.isAxiosError(error)) {
//         console.error("Axios error:", error.response);
//       } else {
//         console.error("Unknown error:", error);
//       }
//       return { success: false };
//     } finally {
//       dispatch(setEventsLoading(false));
//     }
//   };
// }


export function listEventsBySearch(page: number = 0) {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(setEventsLoading(true));
    try {
      const filters = getState().searchFilter;

      const response = await apiConnector<ApiResponse<EventResponseBySearch>>({
        method: "POST",
        url: `${BASE_URL}/ticketcore-api/api/v1/events/search?page=${page}&size=8`,
        bodyData: filters,
        headers: { "X-Client-Source": "WEB" },
        withCredentials: true,
      });

      if (response.data.statusCode === 200) {
        dispatch(setAllEventsBySearch(response.data.data));
        return { success: true };
      }

      return { success: false };
    } catch (error) {
      console.error("Error fetching events:", error);
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




export interface AvailableShow {
  showId: number;
  showDate: string;   // ISO date: "YYYY-MM-DD"
  startTime: string;  // "HH:mm:ss"
  venueName: string;
  soldOut: boolean;
}

export interface EventAvailableShows {
  shows: AvailableShow[];
  eventId: number;
  eventSoldOut: boolean;
}



export function checkEventAvailability(eventId: string) {
  return async (dispatch: AppDispatch): Promise<{ success: boolean; soldOut: boolean; data?: EventAvailableShows }> => {
    try {
      const response = await apiConnector<OtherApiResponse<EventAvailableShows>>({
        method: "GET",
        url: `${BASE_URL}/ticketcore-api/api/v1/events/${eventId}/availability`,
        headers: { "X-Client-Source": "WEB" },
        withCredentials: true,
      });

      console.log("CHECK EVENTS AVAILABILITY RESPONSE:", response.data);

      if (response.data.statusCode === 200) {
        
        const eventData = response.data.data;
        dispatch(setAvailableEventShows(eventData.shows));

        // if(eventData.eventSoldOut){
        //   console.log(eventData.eventSoldOut)
        //    dispatch(setEventsErrorMsg("All tickets are sold out for this event"));
        // }

        return { success: true, soldOut: eventData.eventSoldOut, data: eventData };
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




