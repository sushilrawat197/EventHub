import type { OtherApiResponse } from "../../interfaces/country";
import { apiConnector } from "../apiConnector";
const BASE_URL: string = import.meta.env.VITE_BASE_URL as string;

export function ratingAndReview(rating: number, comments: string) {
  return async (): Promise<{ success: boolean }> => {
    try {
      const response = await apiConnector<OtherApiResponse<null>>({
        method: "POST",
        url: `${BASE_URL}/ticketcore-api/api/v1/service-feedback`,
        bodyData: { rating, comments },
        headers: {
          "X-Client-Source": "WEB",
        },
        withCredentials: true,
      });

      console.log("RATING AND REVIEW RESPONSE:", response.data);

      if (response.data.statusCode === 201) {
        return { success: true };
      }

      return { success: false };
    } catch (error) {
      console.error("Error fetching shows:", error);
      return { success: false };
    }
  };
}




