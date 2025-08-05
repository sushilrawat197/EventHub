import axios, { type AxiosResponse } from "axios";

interface RefreshTokenResponse {
  accessToken: string;
  expiresIn: number; // Or the correct type if you have a different field
  refreshToken:string;
}
export const refreshAccessToken = async (
  refreshToken: string,
  
): Promise<RefreshTokenResponse> => {
  try {
    const response: AxiosResponse<RefreshTokenResponse> = await axios.post(
      "https://thedemonstrate.com/GenericAuthService/api/v1/auth/refreshToken",
      {
        refreshToken:refreshToken,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Refresh token failed:", error);
    throw error;
  }
};
