import { apiConnector } from "../apiConnector";
import { clearUser, setUser } from "../../slices/userSlice";
import { toast } from "react-hot-toast";
import { type Dispatch } from "@reduxjs/toolkit";
import axios from "axios";
import { userEndpoint } from "../apis";

const { GET_USER_API } = userEndpoint;

type GetUserApiResponse = {
  status: "SUCCESS" | "FAILED";
  data: {
    userId: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  gender: string;
  address: string;
  city: string;
  state: string;
  country: string;
  msisdn: string | null;
  profilePicUrl: string;
  allowEmailNotifications: boolean;
  allowSmsNotifications: boolean;
  allowPushNotifications: boolean;
  };
  message?: string;
};

export function getCurrentUser() {
  return async (dispatch: Dispatch): Promise<void> => {
    try {
    //   dispatch(setLoading(true));

      const response = await apiConnector<GetUserApiResponse>({
        method: "GET",
        url: GET_USER_API,
        withCredentials: true,
        headers: {
          "X-Client-Source": "WEB",
        },
      });

      // console.log("GET CURRENT USER RESPONSE:", response);

      if (response.data.status === "SUCCESS") {
        dispatch(setUser(response.data.data));
      }

    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "User fetch failed");
        dispatch(clearUser());
        console.error("Error fetching user:", error.response?.data);
      } else {
        console.error("Unknown error:", error);
      }
    } finally {
    //   dispatch(setLoading(false));
    }
  };
}


