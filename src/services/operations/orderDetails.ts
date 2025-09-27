import type { ApiResponse, PageData, } from "../../interfaces/country";

import { type OrderDetails } from "../../slices/orderDetails";
import { apiConnector } from "../apiConnector";
const BASE_URL: string = import.meta.env.VITE_BASE_URL as string;




// export function listAllOrders() {
//   return async (dispatch: AppDispatch): Promise<{ success: boolean }> => {
//     try {
//       const response = await apiConnector<ApiResponse<OrderDetails>>({
//         method: "GET",
//         url: `${BASE_URL}/ticketcore-api/api/v1/orders/my?page=0&size=8`,
//         headers: {
//           "X-Client-Source": "WEB",
//         },
//         withCredentials: true,
//       });

//       console.log("LIST ALL Orders RESPONSE:", response.data);

//       if (response.data.statusCode === 200) {
//         dispatch(setOrderDetails(response.data.data));
//         return { success: true };
//       }

//       return { success: false };
//     } catch (error) {
//       console.error("Error fetching shows:", error);
//       return { success: false };
//     }
//   };
// }



export async function listAllOrdersApi(page = 0, size = 8): Promise<PageData<OrderDetails>> {
  const response = await apiConnector<ApiResponse<OrderDetails>>({
    method: "GET",
    url: `${BASE_URL}/ticketcore-api/api/v1/orders/my?page=${page}&size=${size}`,
    headers: {
      "X-Client-Source": "WEB",
    },
    withCredentials: true,
  });

  if (response.data.statusCode !== 200) {
    throw new Error(response.data.message || "Failed to fetch orders");
  }

  return response.data.data; // returns PageData<OrderDetails>
}



// export function listAllOrders(page = 0, size = 8) {
//   return async (dispatch: AppDispatch): Promise<{ success: boolean }> => {
//     try {
//       const response = await apiConnector<ApiResponse<OrderDetails>>({
//         method: "GET",
//         url: `${BASE_URL}/ticketcore-api/api/v1/orders/my?page=${page}&size=${size}`,
//         headers: {
//           "X-Client-Source": "WEB",
//         },
//         withCredentials: true,
//       });

//       console.log("LIST ALL Orders RESPONSE:", response.data);

//       if (response.data.statusCode === 200) {
//         dispatch(setOrderDetails(response.data.data));
//         return { success: true };
//       }

//       return { success: false };
//     } catch (error) {
//       console.error("Error fetching orders:", error);
//       return { success: false };
//     }
//   };
// }
