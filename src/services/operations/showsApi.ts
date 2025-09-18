import type { OtherApiResponse } from "../../interfaces/country";
import type { AppDispatch } from "../../reducers/store";
import { setShows, type ShowResponse } from "../../slices/showSlice";
import { apiConnector } from "../apiConnector";



  // ✅ List all shows
export function listAllShowsByEvent(eventId:string | undefined) {
  return async (dispatch: AppDispatch): Promise<{ success: boolean }> => {
    try {
      const response = await apiConnector<OtherApiResponse<ShowResponse[]>>({
        method: "GET",
        url: `https://thedemonstrate.com/ticketcore-api/api/v1/shows/event/${eventId}`,
        headers: {
          "X-Client-Source": "WEB",
        },
        withCredentials: true,
      });

      console.log("LIST ALL SHOWS RESPONSE:", response.data);

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



export function listAllShowsByVenue(venueId:string|null) {
  return async (dispatch: AppDispatch): Promise<{ success: boolean }> => {
    try {
      const response = await apiConnector<OtherApiResponse<ShowResponse[]>>({
        method: "GET",
        url: `https://thedemonstrate.com/ticketcore-api/api/v1/shows/venue/${venueId}`,
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
