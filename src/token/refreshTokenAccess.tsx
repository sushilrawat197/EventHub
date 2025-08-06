import axios, { type AxiosResponse } from "axios";

interface RefreshTokenPayload {
  accessToken: string;
  accessTokenExpiry: string;
  refreshToken: string;
  refreshTokenExpiry: string;
}

interface RefreshTokenResponse {
  status: string;
  message: string;
  statusCode: number;
  timestamp: string;
  traceId: string;
  data: RefreshTokenPayload;
}


export const refreshAccessToken = async (
  refreshToken: string
): Promise<RefreshTokenPayload> => {
  try {
    const response: AxiosResponse<RefreshTokenResponse> = await axios.post(
      "https://thedemonstrate.com/GenericAuthService/api/v1/auth/refreshToken",
      {
        refreshToken: refreshToken,
      },
      {
        headers: {
          "X-Client-Source": "OTHER",
        },
        withCredentials: true,
      }
    );

    console.log("✅ Tokens from response:", response.data.data);
    return response.data.data;

  } catch (error) {
    console.error("❌ Refresh token failed:", error);
    throw error;
  }
};
