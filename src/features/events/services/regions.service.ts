import axios from "axios";
import type { AppDispatch } from "@/app/store/store";
import { setCities } from "../store/citySlice";
import {
  listCitiesByRegionApi,
  listVenueCitiesByRegionApi,
} from "../api/regions.api";
import { REGION_IDS } from "../api/endpoints";

export function listCitiesByRegion() {
  return async (dispatch: AppDispatch): Promise<{ success: boolean }> => {
    try {
      const cities = await listCitiesByRegionApi(REGION_IDS.DEFAULT);
      dispatch(setCities(cities));
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

export function listVenueByCityId() {
  return async (dispatch: AppDispatch): Promise<{ success: boolean }> => {
    try {
      const cities = await listVenueCitiesByRegionApi(REGION_IDS.VENUE_CITIES);
      dispatch(setCities(cities));
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
