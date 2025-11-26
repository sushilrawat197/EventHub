import { apiConnector } from "../apiConnector";
import { clearUser, setUser } from "../../slices/userSlice";
import { toast } from "react-toastify";
import { type Dispatch } from "@reduxjs/toolkit";
import axios from "axios";
import { userEndpoint } from "../apis";
import type { AppDispatch } from "../../reducers/store";
import { setLoading } from "../../slices/userSlice";

const { GET_USER_API, UPDATE_USER_API, UPDATE_USER_IMAGE_API } = userEndpoint;


export type GetUserApiResponse = {
  statusCode:number;
  message?: string;
  data: {
    userId: string;
    email: string;
    mobile:string;
    accountStatus:string;
    firstName: string;
    lastName: string;
    dob: string;
    gender: string;
    address: string;
    avatarUrl: string;
    roles:string[];
  };
};


export function getCurrentUser() {

  return async (dispatch: Dispatch): Promise<void> => {
    try {
        dispatch(setLoading(true));
      const response = await apiConnector<GetUserApiResponse>({
        method: "GET",
        url: GET_USER_API,
        withCredentials: true,
        headers: {
          "X-Client-Source": "WEB",
        },
      });

      // console.log("GET CURRENT USER RESPONSE:", response);

      if (response.data.statusCode === 200) {
        dispatch(setUser(response?.data?.data));
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
        dispatch(setLoading(false));
    }
  };
}



type UpdatedUserResponseApi = {
  statusCode : number;
  message?: string;
};


interface ProfileFormData {
  mobile:string,
  firstName: string;
  lastName: string;
  dob: string;
  gender: string;
  address:string;
  avatarUrl:string
}


export function updateUserDetails( 
  data: ProfileFormData,
  setProfileLoading:React.Dispatch<React.SetStateAction<boolean>>
) {
  return async (dispatch: AppDispatch): Promise<void> => {

    try {
      setProfileLoading(true);
      const response = await apiConnector<UpdatedUserResponseApi>({
        method: "PUT",
        url: UPDATE_USER_API,
        bodyData: data, // ✅ match the key in your Connection type
        withCredentials: true,
        headers: {
          "X-Client-Source": "WEB",
        },
      });



      if (response.data.statusCode === 200) {
        dispatch(getCurrentUser());
        toast.success(response.data.message);
      }

      // console.log("UPDATED USER RESPONSE:", response);

    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message ||error.response?.data?.message?.gender || "User update failed");
        console.error("Error updating user:", error.response?.data);
      } else {
        console.error("Unknown error:", error);
      }
    }finally {
        setProfileLoading(false);
    }
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
        // console.log(response)
        toast.success(response?.data?.masssage)
      }

      // console.log("UPDATED USER RESPONSE:", response);
    } catch (error) {
      // error handling...
      console.log(error);
    }finally {
        dispatch(setLoading(false));
    }
  };
}






