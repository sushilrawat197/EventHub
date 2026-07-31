import axios from "axios";
import type { AppDispatch } from "../../../app/store/store";
import { apiConnector } from "../../../services/apiConnector";
import type { ApiResponse, OtherApiResponse, PageData } from "../../../interfaces/country";
import type { EventResponse, EventResponseBySearch } from "../types/evnetInterFace";
import type { EventSearchFilters } from "../store/filter_Slice";
import { setAvailableEventShows } from "../../payment/store/availabilitySlice";

const BASE_URL: string = import.meta.env.VITE_BASE_URL as string;

export const EVENTS_PAGE_SIZE = 8;

function buildSearchRequestBody(filters: EventSearchFilters): EventSearchFilters {
  const body: EventSearchFilters = { ...filters };
  if (body.cityId == null) {
    delete body.cityId;
  }
  return body;
}

export async function searchEventsApi(
  filters: EventSearchFilters,
  page = 0,
  size = EVENTS_PAGE_SIZE
): Promise<PageData<EventResponseBySearch>> {
  const response = await apiConnector<ApiResponse<EventResponseBySearch>>({
    method: "POST",
    url: `${BASE_URL}/ticketcore-api/api/v1/events/search?page=${page}&size=${size}`,
    bodyData: buildSearchRequestBody(filters),
    headers: { "X-Client-Source": "WEB" },
    withCredentials: true,
  });

  if (response.data.statusCode === 200) {
    return response.data.data;
  }

  throw new Error(response.data.message || "Failed to fetch events");
}

export async function getEventByIdApi(eventId: string): Promise<EventResponse> {
  const response = await apiConnector<OtherApiResponse<EventResponse>>({
    method: "GET",
    url: `${BASE_URL}/ticketcore-api/api/v1/events/search/${eventId}`,
    headers: { "X-Client-Source": "WEB" },
    withCredentials: true,
  });

  if (response.data.statusCode === 200) {
    return response.data.data;
  }

  throw new Error(response.data.message || "Failed to fetch event");
}

export interface AvailableShow {
  showId: number;
  showDate: string;
  startTime: string;
  venueName: string;
  soldOut: boolean;
}

export interface EventAvailableShows {
  shows: AvailableShow[];
  eventId: number;
  eventSoldOut: boolean;
}

export async function getEventAvailabilityApi(
  eventId: string
): Promise<EventAvailableShows> {
  const response = await apiConnector<OtherApiResponse<EventAvailableShows>>({
    method: "GET",
    url: `${BASE_URL}/ticketcore-api/api/v1/events/${eventId}/availability`,
    headers: { "X-Client-Source": "WEB" },
    withCredentials: true,
  });

  if (response.data.statusCode === 200) {
    return response.data.data;
  }

  throw new Error(response.data.message || "Failed to check availability");
}

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
