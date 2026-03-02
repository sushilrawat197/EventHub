import axios, { type AxiosInstance } from "axios";
import { endpoints } from "../services/apis";
import type { LoginResponse, RefreshResponse } from "./types";

const authHttp: AxiosInstance = axios.create({
  withCredentials: true,
  headers: {
    "X-Client-Source": "WEB",
  },
});

export async function login(payload: {
  email: string;
  password: string;
}): Promise<LoginResponse> {
  const res = await authHttp.post<LoginResponse>(endpoints.LOGIN_API, payload);
  return res.data;
}

export async function refresh(): Promise<RefreshResponse> {
  const res = await authHttp.post<RefreshResponse>(endpoints.REFRESH_ACCESS_TOKEN);
  return res.data;
}

export async function logout(): Promise<void> {
  // Best-effort. Even if it fails, frontend should still clear state.
  await authHttp.post(endpoints.LOGOUT_API);
}

