import axios from "axios";
import type { AppDispatch } from "@/app/store/store";
import { setAvailableEventShows } from "@/features/payment/store/availabilitySlice";
import type { EventAvailableShows } from "../types/availability";
import { getEventAvailabilityApi } from "../api/events.api";

export function checkEventAvailability(eventId: string) {
  return async (dispatch: AppDispatch): Promise<{
    success: boolean;
    soldOut: boolean;
    data?: EventAvailableShows;
  }> => {
    try {
      const eventData = await getEventAvailabilityApi(eventId);
      dispatch(setAvailableEventShows(eventData.shows));
      return { success: true, soldOut: eventData.eventSoldOut, data: eventData };
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
