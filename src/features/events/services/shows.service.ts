import type { AppDispatch } from "@/app/store/store";
import { setShows, type ShowResponse } from "../store/showSlice";
import {
  listShowsByEventApi,
  listShowsByVenueApi,
} from "../api/shows.api";
import { checkEventAvailability } from "./events.service";

export function listAllShowsByEvent(eventId: string | undefined) {
  return async (dispatch: AppDispatch): Promise<ShowResponse[] | null> => {
    if (!eventId) return null;

    try {
      const shows = await listShowsByEventApi(eventId);
      dispatch(setShows(shows));
      return shows;
    } catch (error) {
      console.error("Error fetching shows:", error);
      return null;
    }
  };
}

export function listAllShowsByVenue(venueId: string | null) {
  return async (dispatch: AppDispatch): Promise<{ success: boolean }> => {
    if (!venueId) return { success: false };

    try {
      const shows = await listShowsByVenueApi(venueId);
      dispatch(setShows(shows));
      return { success: true };
    } catch (error) {
      console.error("Error fetching shows:", error);
      return { success: false };
    }
  };
}

export function fetchFilteredShows(eventId: string) {
  return async (dispatch: AppDispatch) => {
    try {
      const allShows = await dispatch(listAllShowsByEvent(eventId));
      const availableRes = await dispatch(checkEventAvailability(eventId));
      const availableShows = availableRes.data;

      const filteredShows = (allShows ?? []).filter((show) =>
        availableShows?.shows.some(
          (av) => av.showId === show.showId && !av.soldOut
        )
      );

      dispatch(setShows(filteredShows));
    } catch (err) {
      console.error("Error fetching filtered shows:", err);
      dispatch(setShows([]));
    }
  };
}
