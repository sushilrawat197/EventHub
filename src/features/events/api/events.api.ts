import { client } from "@/lib/api/client";
import type { PageData } from "@/lib/api/types";
import type { EventResponse, EventResponseBySearch } from "../types/evnetInterFace";
import type { EventSearchFilters } from "../store/filter_Slice";
import type { EventAvailableShows } from "../types/availability";
import { EVENTS_PAGE_SIZE, eventsEndpoints } from "./endpoints";

export { EVENTS_PAGE_SIZE } from "./endpoints";
export type { AvailableShow, EventAvailableShows } from "../types/availability";

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
  return client.postPaginated<EventResponseBySearch>(
    eventsEndpoints.search(page, size),
    buildSearchRequestBody(filters)
  );
}

export async function getEventByIdApi(eventId: string): Promise<EventResponse> {
  return client.get<EventResponse>(eventsEndpoints.byId(eventId));
}

export async function getEventAvailabilityApi(
  eventId: string
): Promise<EventAvailableShows> {
  return client.get<EventAvailableShows>(eventsEndpoints.availability(eventId));
}
