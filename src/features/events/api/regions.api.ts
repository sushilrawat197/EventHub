import { client } from "@/lib/api/client";
import type { citiesResponse } from "../store/citySlice";
import { REGION_IDS, regionsEndpoints } from "./endpoints";

export async function listCitiesByRegionApi(
  regionId = REGION_IDS.DEFAULT
): Promise<citiesResponse[]> {
  return client.get<citiesResponse[]>(regionsEndpoints.cities(regionId));
}

export async function listVenueCitiesByRegionApi(
  regionId = REGION_IDS.VENUE_CITIES
): Promise<citiesResponse[]> {
  return client.get<citiesResponse[]>(regionsEndpoints.cities(regionId));
}
