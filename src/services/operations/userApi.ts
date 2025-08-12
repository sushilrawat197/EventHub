import { apiConnector } from "../apiConnector";
import { clearUser, setUser } from "../../slices/userSlice";
import { toast } from "react-toastify";
import { type Dispatch } from "@reduxjs/toolkit";
import axios from "axios";
import { userEndpoint } from "../apis";
import type { AppDispatch } from "../../reducers/store";
import { setLoading } from "../../slices/authSlice";

const { GET_USER_API, UPDATE_USER_API, UPDATE_USER_IMAGE_API } = userEndpoint;


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
    dob: string;
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
        // toast.error(error.response?.data?.message || "User fetch failed");
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



type UpdatedUserResponseApi = {
  status: string;
  message?: string;
};


interface ProfileFormData {
  firstName: string;
  lastName: string;
  dob: string;
  gender: string;
}


export function updateUserDetails(
  data: ProfileFormData,
  setProfileLoading:React.Dispatch<React.SetStateAction<boolean>>
) {
  return async (dispatch: AppDispatch): Promise<void> => {

    try {
      setProfileLoading(true);
      const response = await apiConnector<UpdatedUserResponseApi>({
        method: "POST",
        url: UPDATE_USER_API,
        bodyData: data, // ✅ match the key in your Connection type
        withCredentials: true,
        headers: {
          "X-Client-Source": "WEB",
        },
      });



      if (response.data.status === "SUCCESS") {
        dispatch(getCurrentUser());
        toast.success(response.data.message);
      }

      console.log("UPDATED USER RESPONSE:", response);

    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "User update failed");
        console.error("Error updating user:", error.response?.data);
      } else {
        console.error("Unknown error:", error);
      }
    }
    setProfileLoading(false);
  };

}


interface UpdatedUserPhotoApi {
  masssage: string,
  statusCode: number
}

export function updateUserProfilPicture(file: FormData) {
  return async (dispatch: AppDispatch): Promise<void> => {
    try {
      dispatch(setLoading(true))
      const response = await apiConnector<UpdatedUserPhotoApi>({
        method: "POST",
        url: UPDATE_USER_IMAGE_API,
        bodyData: file,
        withCredentials: true,
        headers: {
          "X-Client-Source": "WEB",
        },
      });

      if (response.data.statusCode === 200) {

        await dispatch(getCurrentUser());
        console.log(response)
        toast.success(response?.data?.masssage)
      }

      console.log("UPDATED USER RESPONSE:", response);
    } catch (error) {
      // error handling...
      console.log(error);
    }
    dispatch(setLoading(false));
  };
}






