import { client } from "@/lib/api/client";
import type { VenueResponse } from "../types/venueInterface";
import { venuesEndpoints } from "./endpoints";

export async function listVenuesByCityApi(
  cityId: number
): Promise<VenueResponse[]> {
  return client.get<VenueResponse[]>(venuesEndpoints.byCity(cityId));
}

export async function getVenueByIdApi(
  venueId: number
): Promise<VenueResponse> {
  return client.get<VenueResponse>(venuesEndpoints.byId(venueId));
}
