import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios";
import { getAccessToken } from "../auth/tokenManager";
import { refreshAccessTokenSingleFlight } from "../auth/refreshCoordinator";

declare module "axios" {
  export interface AxiosRequestConfig {
    _retry?: boolean;
    skipAuth?: boolean;
    skipRefresh?: boolean;
  }
}

function isAuthRoute(url?: string): boolean {
  if (!url) return false;
  return url.includes("/api/v1/auth/");
}

export const api: AxiosInstance = axios.create({
  withCredentials: true,
  headers: {
    "X-Client-Source": "WEB",
  },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  config.withCredentials = config.withCredentials ?? true;
  config.headers = config.headers ?? {};

  // Enforce required header for every request
  config.headers["X-Client-Source"] = "WEB";

  // Attach Authorization header from in-memory token store
  if (!config.skipAuth && !isAuthRoute(config.url)) {
    const token = getAccessToken();
    if (token && !("Authorization" in config.headers)) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const originalConfig = error.config as AxiosRequestConfig | undefined;

    if (!originalConfig) {
      return Promise.reject(error);
    }

    // Don't attempt refresh for auth routes or opted-out requests
    if (originalConfig.skipRefresh || isAuthRoute(originalConfig.url)) {
      return Promise.reject(error);
    }

    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    if (originalConfig._retry) {
      return Promise.reject(error);
    }

    originalConfig._retry = true;

    try {
      const tokens = await refreshAccessTokenSingleFlight("401");
      originalConfig.headers = originalConfig.headers ?? {};
      originalConfig.headers.Authorization = `Bearer ${tokens.accessToken}`;
      return api.request(originalConfig);
    } catch (refreshErr) {
      return Promise.reject(refreshErr);
    }
  }
);

