// import axios, {
//   type AxiosRequestConfig,
//   type AxiosResponse,
//   type Method,
// } from "axios";

// // Create axios instance
// export const axiosInstance = axios.create({});

// // Type for connector params
// type Connection<TData = unknown, TParams = Record<string, unknown>> = {
//   method: Method;
//   url: string;
//   bodyData?: TData;
//   headers?: Record<string, string>;
//   params?: TParams;
// };

// // Generic API connector
// export const apiConnector = async <
//   TResponse,
//   TData = unknown,
//   TParams = Record<string, unknown>
// >({
//   method,
//   url,
//   bodyData,
//   headers,
//   params,
// }: Connection<TData, TParams>): Promise<AxiosResponse<TResponse>> => {
//   const config: AxiosRequestConfig<TData> = {
//     method,
//     url,
//     data: bodyData ?? undefined,
//     headers,
//     params,
//   };

//   return axiosInstance(config);
// };

// src/utils/apiConnector.ts
import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
  type Method,
  type AxiosError,
  AxiosHeaders,
} from "axios";
import { store } from "../reducers/store";
import { setAccessToken } from "../slices/authSlice";
import { refreshAccessToken } from "../token/refreshTokenAccess";
import { logout } from "./operations/authApi";
import { type NavigateFunction } from "react-router-dom";
// import { access } from "fs";
// 1. Create Axios instance
const axiosInstance: AxiosInstance = axios.create();

let navigateRef: NavigateFunction;

export const setNavigateRef = (nav: NavigateFunction) => {
  navigateRef = nav;
};

axiosInstance.interceptors.request.use(
  async (
    config: InternalAxiosRequestConfig
  ): Promise<InternalAxiosRequestConfig> => {

          // ✅ Step 1: Skip auth if custom flag is set
          if (config.headers?.skipAuth) {
          // Remove the custom flag before sending the request
          delete config.headers.skipAuth;
          return config;
        }
        
    const state = store.getState();
    const token = state.auth.accessToken || localStorage.getItem("accessToken");
    const refreshToken =
      state.auth.refreshToken || localStorage.getItem("refreshToken");
    const expiryString =
      state.auth.accessTokenExpiry || localStorage.getItem("accessTokenExpiry");

    console.log("expiryString", expiryString);

    let expiry: Date | null = null;
    if (expiryString) {
      const parsed = new Date(expiryString);
      if (!isNaN(parsed.getTime())) {
        expiry = parsed;
      }
    }

    const now = new Date();

    console.log("expiry time:", expiry?.toLocaleTimeString());
    console.log("now time:", now.toLocaleTimeString());

    if (expiry && now >= expiry && refreshToken) {
      try {

        const newTokenData = await refreshAccessToken(refreshToken);

        store.dispatch(setAccessToken(newTokenData.accessToken));
        localStorage.setItem("accessToken", newTokenData.accessToken);

        config.headers = AxiosHeaders.from({
          ...(config.headers || {}),
          Authorization: `Bearer ${newTokenData.accessToken}`,
        });
      } catch (error) {
        store.dispatch(logout(token, navigateRef, store.dispatch));
        throw error;
      }
    } else if (token) {
      config.headers = AxiosHeaders.from({
        ...(config.headers || {}),
        Authorization: `Bearer ${token}`,
      });
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// 3. API Connector generic function
type Connection<TData = unknown, TParams = Record<string, unknown>> = {
  method: Method;
  url: string;
  bodyData?: TData;
  headers?: Record<string, string>;
  params?: TParams;
};

export const apiConnector = async <
  TResponse,
  TData = unknown,
  TParams = Record<string, unknown>
>({
  method,
  url,
  bodyData,
  headers,
  params,
}: Connection<TData, TParams>): Promise<AxiosResponse<TResponse>> => {
  const config: AxiosRequestConfig<TData> = {
    method,
    url,
    data: bodyData,
    headers,
    params,
  };

  return axiosInstance(config);
};
