import { client } from "@/lib/api/client";
import type { ShowResponse } from "../store/showSlice";
import { showsEndpoints } from "./endpoints";

export async function listShowsByEventApi(
  eventId: string
): Promise<ShowResponse[]> {
  return client.get<ShowResponse[]>(showsEndpoints.byEvent(eventId));
}

export async function listShowsByVenueApi(
  venueId: string
): Promise<ShowResponse[]> {
  return client.get<ShowResponse[]>(showsEndpoints.byVenue(venueId));
}
