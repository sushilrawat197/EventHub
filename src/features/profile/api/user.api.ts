import { apiConnector } from "@/lib/api/connector";
import { client } from "@/lib/api/client";
import { ApiError } from "@/lib/api/errors";
import { profileEndpoints } from "./endpoints";

export type UserProfile = {
  userId: string;
  email: string;
  mobile: string;
  accountStatus: string;
  firstName: string;
  lastName: string;
  dob: string;
  gender: string;
  address: string;
  avatarUrl: string;
  roles: string[];
};

export type ProfileFormData = {
  mobile: string;
  firstName: string;
  lastName: string;
  dob: string;
  gender: string;
  address: string;
  avatarUrl: string;
};

export async function getCurrentUserApi(): Promise<UserProfile> {
  return client.get<UserProfile>(profileEndpoints.me());
}

export async function updateUserProfileApi(data: ProfileFormData): Promise<string | undefined> {
  const response = await apiConnector<{ statusCode: number; message?: string }>({
    method: "PUT",
    url: profileEndpoints.me(),
    bodyData: data,
  });

  if (response.data.statusCode === 200) {
    return response.data.message;
  }

  throw new ApiError(response.data.message || "User update failed", response.data.statusCode);
}

export async function updateUserPictureApi(file: FormData): Promise<string | undefined> {
  const response = await apiConnector<{ statusCode: number; masssage?: string; message?: string }>({
    method: "POST",
    url: profileEndpoints.picture(),
    bodyData: file,
  });

  if (response.data.statusCode === 200) {
    return response.data.masssage ?? response.data.message;
  }

  throw new ApiError(response.data.message || "Photo update failed", response.data.statusCode);
}
