import axios from "axios";
import type { AppDispatch } from "@/app/store/store";
import { setVenueDetails, setVenues } from "../store/venueSlice";
import { getVenueByIdApi, listVenuesByCityApi } from "../api/venues.api";

export function listDetailsByCityId(cityId: number | null) {
  return async (dispatch: AppDispatch): Promise<{ success: boolean }> => {
    if (cityId == null) return { success: false };

    try {
      const venues = await listVenuesByCityApi(cityId);
      dispatch(setVenues(venues));
      return { success: true };
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

export function getVenueByVenueId(venueId: number | null) {
  return async (dispatch: AppDispatch): Promise<{ success: boolean }> => {
    if (venueId == null) return { success: false };

    try {
      const venue = await getVenueByIdApi(venueId);
      dispatch(setVenueDetails(venue));
      return { success: true };
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
