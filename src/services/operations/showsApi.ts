import type { OtherApiResponse } from "../../interfaces/country";
import type { AppDispatch } from "../../reducers/store";
import { setShows, type ShowResponse } from "../../slices/showSlice";
import { apiConnector } from "../apiConnector";
import { checkEventAvailability } from "./eventsApi";
const BASE_URL: string = import.meta.env.VITE_BASE_URL as string;




  // ✅ List all shows
export function listAllShowsByEvent(eventId: string | undefined) {
  return async (dispatch: AppDispatch): Promise<ShowResponse[] | null> => {
    try {
      const response = await apiConnector<OtherApiResponse<ShowResponse[]>>({
        method: "GET",
        url: `${BASE_URL}/ticketcore-api/api/v1/shows/liveshows/${eventId}`,
        headers: {
          "X-Client-Source": "WEB",
        },
        withCredentials: true,
      });

      // console.log("LIST ALL SHOWS RESPONSE:", response.data);

      if (response.data.statusCode === 200) {
        dispatch(setShows(response.data.data));
        return response.data.data; // ✅ return shows array
      }

      // if statusCode not 200 → return null
      return null;

    } catch (error) {
      console.error("Error fetching shows:", error);
      return null; // ✅ ensure catch also returns something
    }
  };
}




export function listAllShowsByVenue(venueId:string|null) {
  return async (dispatch: AppDispatch): Promise<{ success: boolean }> => {
    try {
      const response = await apiConnector<OtherApiResponse<ShowResponse[]>>({
        method: "GET",
        url: `${BASE_URL}/ticketcore-api/api/v1/shows/venue/${venueId}`,
        headers: {
          "X-Client-Source": "WEB",
        },
        withCredentials: true,
      });

      // console.log("LIST ALL SHOWS BY Venue RESPONSE:", response.data);

      if (response.data.statusCode === 200) {
        dispatch(setShows(response.data.data));
        return { success: true };
      }

      return { success: false };
    } catch (error) {
      console.error("Error fetching shows:", error);
      return { success: false };
    }
  };
}


export function fetchFilteredShows(eventId: string) {
  return async (dispatch: AppDispatch) => {
    try {
      // 1️⃣ Fetch all shows
      const allShows = await dispatch(listAllShowsByEvent(eventId));
      
      // 2️⃣ Fetch availability
      const availableRes = await dispatch(checkEventAvailability(eventId));
      
      // (if you return { success, soldOut, data } from checkEventAvailability)
      const availableShows = availableRes.data;

      // console.log("AVAILABLE SHOWSSS IN API....",availableShows)

      // 3️⃣ Filter
      const filteredShows = (allShows ?? []).filter(show =>
        availableShows?.shows.some(av => av.showId === show.showId && !av.soldOut)
      );

      // 4️⃣ Dispatch filtered shows
      dispatch(setShows(filteredShows));
    } catch (err) {
      console.error("Error fetching filtered shows:", err);
      dispatch(setShows([])); // fallback
    }
  };
}



