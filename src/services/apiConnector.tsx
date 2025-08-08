import axios, {
  type AxiosRequestConfig,
  type AxiosResponse,
  type Method,
} from "axios";

import { store } from "../reducers/store";
import { setAccessToken, setAccessTokenExpiry, setRefreshToken, setRefreshTokenExpiry } from "../slices/authSlice";
// import { logout } from "../services/operations/authApi";


let isRefreshing = false;

interface FailedRequest {
  resolve: (token: string) => void;
  reject: (error: any) => void;
}

let failedQueue: FailedRequest[] = [];


const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};


// Create axios instance
export const axiosInstance = axios.create({});


// 👉 Request Interceptor: Add access token
axiosInstance .interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


// 👉 Response Interceptor: Handle 401 errors
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        // Queue the request while refresh in progress
        return new Promise(function (resolve, reject) {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers["Authorization"] = "Bearer " + token;
              resolve(axiosInstance(originalRequest));
            },
            reject: (err) => reject(err),
          });
        });
      }

      isRefreshing = true;

      const refreshToken = localStorage.getItem("refreshToken");

      try {
        const res = await axios.post("https://thedemonstrate.com/GenericAuthService/api/v1/auth/refreshToken", {
          refreshToken,
        });

        const newAccessToken = res.data.accessToken;
        const newRefreshToken = res.data.refreshToken;
        const accessTokenExpiry = res.data.accessTokenExpiry;
        const refreshTokenExpiry = res.data.refreshTokenExpiry;

        // 🧠 Update tokens in redux & localStorage
        store.dispatch(setAccessToken(newAccessToken));
        store.dispatch(setAccessTokenExpiry(accessTokenExpiry));
        store.dispatch(setRefreshToken(newRefreshToken));
        store.dispatch(setRefreshTokenExpiry(refreshTokenExpiry));

        localStorage.setItem("accessToken", newAccessToken);
        localStorage.setItem("refreshToken", newRefreshToken);
        localStorage.setItem("accessTokenExpiry", accessTokenExpiry);
        localStorage.setItem("refreshTokenExpiry", refreshTokenExpiry);

        processQueue(null, newAccessToken);

        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return axiosInstance (originalRequest); // retry original request
      } catch (err) {
        processQueue(err, null);
        // store.dispatch(logout()); // logout user
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);




// Type for connector params
type Connection<TData = unknown, TParams = Record<string, unknown>> = {
  method: Method;
  url: string;
  bodyData?: TData;
  headers?: Record<string, string>;
  params?: TParams;
  withCredentials?: boolean; // ✅ add this line
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
  withCredentials, // ✅ take from args
}: Connection<TData, TParams>): Promise<AxiosResponse<TResponse>> => {
  const config: AxiosRequestConfig<TData> = {
    method,
    url,
    data: bodyData,
    headers,
    params,
    withCredentials, // ✅ apply it to axios config
  };

  return axiosInstance(config);
};
