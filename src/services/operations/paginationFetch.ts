// import axios from "axios";
// import type { ApiResponse } from "../../interfaces/country";
// import { apiConnector } from "../apiConnector";
// import type { EventResponseBySearch } from "../../interfaces/eventInterface/evnetInterFace";
// const BASE_URL: string = import.meta.env.VITE_BASE_URL as string;



// export function eventPagination(pageNumber:number) {
//   return async (): Promise<{ success: boolean }> => {

//     try {
//       const response = await apiConnector<ApiResponse<EventResponseBySearch>>({
//         method: "POST",
//         url: `${BASE_URL}/ticketcore-api/api/v1/events/search?page=${pageNumber}`,
//         headers: { "X-Client-Source": "WEB" },
//         withCredentials: true,
//       });

//       console.log("Search Data", response.data);

//       if (response.data.statusCode === 200) {
//         return { success: true };
//       }

//       return { success: false };
//     } catch (error) {
//       if (axios.isAxiosError(error)) {
//         console.error("Axios error:", error.response);
//       } else {
//         console.error("Unknown error:", error);
//       }
//       return { success: false };
//     }
//   };
// }