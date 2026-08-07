import axios, { type AxiosInstance } from "axios";
import { authEndpoints } from "@/features/auth/api/endpoints";
import type { LoginResponse, RefreshResponse } from "./types";
import { showGlobalPopup } from "../utils/globalPopup";

const API_TIMEOUT_MS = 15000;
const REQUEST_TIMEOUT_ERROR_MESSAGE = "Something went wrong. Please try again.";

const authHttp: AxiosInstance = axios.create({
  withCredentials: true,
  timeout: API_TIMEOUT_MS,
  headers: {
    "X-Client-Source": "WEB",
  },
});

export async function login(payload: {
  email: string;
  password: string;
}): Promise<LoginResponse> {
  try {
    const res = await authHttp.post<LoginResponse>(authEndpoints.login(), payload);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.code === "ECONNABORTED") {
      showGlobalPopup({
        message: REQUEST_TIMEOUT_ERROR_MESSAGE,
        variant: "error",
      });
    }
    throw error;
  }
}

export async function refresh(): Promise<RefreshResponse> {
  try {
    const res = await authHttp.post<RefreshResponse>(authEndpoints.refresh());
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.code === "ECONNABORTED") {
      showGlobalPopup({
        message: REQUEST_TIMEOUT_ERROR_MESSAGE,
        variant: "error",
      });
    }
    throw error;
  }
}

export async function logout(): Promise<void> {
  // Best-effort. Even if it fails, frontend should still clear state.
  try {
    await authHttp.post(authEndpoints.logout());
  } catch (error) {
    if (axios.isAxiosError(error) && error.code === "ECONNABORTED") {
      showGlobalPopup({
        message: REQUEST_TIMEOUT_ERROR_MESSAGE,
        variant: "error",
      });
    }
    throw error;
  }
}

