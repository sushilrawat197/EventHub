import type { ApiResponse } from "../../interfaces/country";
import type { AppDispatch } from "../../reducers/store";
import { setOrderDetails, type OrderDetails } from "../../slices/orderDetails";
import { apiConnector } from "../apiConnector";




export function listAllOrders() {
  return async (dispatch: AppDispatch): Promise<{ success: boolean }> => {
    try {
      const response = await apiConnector<ApiResponse<OrderDetails>>({
        method: "GET",
        url: `https://thedemonstrate.com/ticketcore-api/api/v1/orders/my`,
        headers: {
          "X-Client-Source": "WEB",
        },
        withCredentials: true,
      });

      console.log("LIST ALL Orders RESPONSE:", response.data);

      if (response.data.statusCode === 200) {
        dispatch(setOrderDetails(response.data.data));
        return { success: true };
      }

      return { success: false };
    } catch (error) {
      console.error("Error fetching shows:", error);
      return { success: false };
    }
  };
}