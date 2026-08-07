import axios from "axios";
import toast from "react-hot-toast";
import type { Dispatch } from "@reduxjs/toolkit";
import type { AppDispatch } from "@/app/store/store";
import { clearUser, setLoading, setUser } from "../store/userSlice";
import {
  getCurrentUserApi,
  updateUserPictureApi,
  updateUserProfileApi,
  type ProfileFormData,
  type UserProfile,
} from "../api/user.api";

export type GetUserApiResponse = {
  statusCode: number;
  message?: string;
  data: UserProfile;
};

export function getCurrentUser() {
  return async (dispatch: Dispatch): Promise<void> => {
    try {
      dispatch(setLoading(true));
      const user = await getCurrentUserApi();
      dispatch(setUser(user));
    } catch (error) {
      if (axios.isAxiosError(error)) {
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

export function updateUserDetails(
  data: ProfileFormData,
  setProfileLoading: React.Dispatch<React.SetStateAction<boolean>>
) {
  return async (dispatch: AppDispatch): Promise<void> => {
    try {
      setProfileLoading(true);
      const message = await updateUserProfileApi(data);
      dispatch(getCurrentUser());
      toast.success(message ?? "Profile updated");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message ||
            error.response?.data?.message?.gender ||
            "User update failed"
        );
        console.error("Error updating user:", error.response?.data);
      } else {
        console.error("Unknown error:", error);
      }
    } finally {
      setProfileLoading(false);
    }
  };
}

export function updateUserProfilPicture(file: FormData) {
  return async (dispatch: AppDispatch): Promise<void> => {
    try {
      dispatch(setLoading(true));
      const message = await updateUserPictureApi(file);
      await dispatch(getCurrentUser());
      toast.success(message ?? "Photo updated");
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(setLoading(false));
    }
  };
}
