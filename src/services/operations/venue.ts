import axios from "axios";
import type { OtherApiResponse } from "../../interfaces/country";
import type { VenueResponse } from "../../interfaces/venueInterface";
import type { AppDispatch } from "../../reducers/store";
import { setVenues } from "../../slices/venueSlice";
import { apiConnector } from "../apiConnector";


export function listDetailsByCityId(cityId:number | null) {
  return async (dispatch: AppDispatch): Promise<{ success: boolean }> => {

    try {
      const response = await apiConnector<OtherApiResponse<VenueResponse[]>>({
        method: "GET",
        url: `https://thedemonstrate.com/ticketcore-api/api/v1/venues/city/${cityId}`,
        headers: {
          "X-Client-Source": "WEB",
        },
        withCredentials: true,
      });

      // console.log("LIST VENUE BY VENUE RESPONSE...", response.data);

      if (response.data.statusCode === 200) {
        dispatch(setVenues(response.data.data));
        return { success: true };
      }

      return { success: false };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.response);
      } else {
        console.error("Unknown error:", error);
      }
      return { success: false }; // ❌ error case
    }
  };
}
 
