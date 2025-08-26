import axios from "axios";
import type { AppDispatch } from "../../reducers/store";
import { setLoading } from "../../slices/authSlice";
import { apiConnector } from "../apiConnector";
import { setEvents } from "../../slices/eventSlice";
import type { EventsApiResponse } from "../../interfaces/eventInterface/eventInterface"; // yaha se import karo



export function getEvents() {
  return async (dispatch: AppDispatch): Promise<void> => {
    try {
      dispatch(setLoading(true));

      const response = await apiConnector<EventsApiResponse>({
        method: "GET",
        url: "https://thedemonstrate.com/CMS/api/v1/contents?city=Mumbai",
        //  headers: {
        //   "X-Client-Source": "WEB",
        // },
        // withCredentials: true,
      });

      // console.log("GET EVENTS API RESPONSE............", response.data.data);

      dispatch(
        setEvents({
          contents: response.data.data.eventList,
          catogeryList: response.data.data.catogeryList,
          venueList: response.data.data.venueList,
        })
      );

  

    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("GET EVENTS ERROR RESPONSE............", error.response?.data);
      } else {
        console.log("GET EVENTS ERROR............", "An unknown error occurred.");
      }
    } finally {
      dispatch(setLoading(false));
    }
  };
}
