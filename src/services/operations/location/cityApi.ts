import axios from "axios";
import type { OtherApiResponse } from "../../../interfaces/country";
import type { AppDispatch } from "../../../reducers/store";
import { setCities, type citiesResponse } from "../../../slices/citySlice";
import { apiConnector } from "../../apiConnector";
const BASE_URL: string = import.meta.env.VITE_BASE_URL as string;

// export function listAllCities() {
//   return async (dispatch: AppDispatch): Promise<{ success: boolean }> => {
//     try {
//       const response = await apiConnector<ApiResponse<citiesResponse>>({
//         method: "GET",
//         url: `${BASE_URL}/ticketcore-api/api/v1/cities?mode=all`,
//         headers: {
//           "X-Client-Source": "WEB",
//         },
//         withCredentials: true,
//       });

//       console.log("LIST ALL CITIES RESPONSE:", response);

//       if (response.data.statusCode === 200) {
//         dispatch(setCities(response.data.data));
//         // dispatch(listAllRegions());
//         return { success: true };
//       }

//       return { success: false };
//     } catch (error) {
//       if (axios.isAxiosError(error)) {
//         // const fieldErrors: RegionError | null = error.response?.data?.data || null;
//         // dispatch(setRegionError(fieldErrors));
//         console.error("Axios error:", error.response);
//       } else {
//         console.error("Unknown error:", error);
//       }
//       return { success: false }; // ❌ error case
//     }
//   };
// }




export function listCitiesByRegion() {
  return async (dispatch: AppDispatch): Promise<{ success: boolean }> => {
    try {
      const response = await apiConnector<OtherApiResponse<citiesResponse[]>>({
        method: "GET",
        url: `${BASE_URL}/ticketcore-api/api/v1/regions/1/cities`,
        headers: {
          "X-Client-Source": "WEB",
        },
        withCredentials: true,
      });

      console.log("LIST ALL CITIES RESPONSE:", response);

      if (response.data.statusCode === 200) {
        dispatch(setCities(response.data.data));
        return { success: true };
      }

      return { success: false };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // const fieldErrors: RegionError | null = error.response?.data?.data || null;
        // dispatch(setRegionError(fieldErrors));
        console.error("Axios error:", error.response);
      } else {
        console.error("Unknown error:", error);
      }
      return { success: false }; // ❌ error case
    }
  };
}


export function listVenueByCityId() {
  return async (dispatch: AppDispatch): Promise<{ success: boolean }> => {
    try {
      const response = await apiConnector<OtherApiResponse<citiesResponse[]>>({
        method: "GET",
        url: `${BASE_URL}/ticketcore-api/api/v1/regions/20/cities`,
        headers: {
          "X-Client-Source": "WEB",
        },
        withCredentials: true,
      });

      console.log("LIST ALL CITIES RESPONSE:", response);

      if (response.data.statusCode === 200) {
        dispatch(setCities(response.data.data));
        return { success: true };
      }

      return { success: false };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // const fieldErrors: RegionError | null = error.response?.data?.data || null;
        // dispatch(setRegionError(fieldErrors));
        console.error("Axios error:", error.response);
      } else {
        console.error("Unknown error:", error);
      }
      return { success: false }; // ❌ error case
    }
  };
}

