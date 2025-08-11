import axios, {
  type AxiosRequestConfig,
  type AxiosResponse,
  type Method,
  // type InternalAxiosRequestConfig
} from "axios";
// import { setAccessToken, setRefreshToken } from "../slices/authSlice";
// const BASE_URL: string = import.meta.env.VITE_BASE_URL as string;
// import { store } from "../reducers/store";
// import { setAccessToken, setAccessTokenExpiry, setRefreshToken, setRefreshTokenExpiry } from "../slices/authSlice";
// import { logout } from "../services/operations/authApi";
// Create axios instance
export const axiosInstance = axios.create({});

// // Add a request interceptor
// let isRefreshing = false;
// let failedQueue: any[] = [];

// const processQueue = (error: any, token: string | null = null) => {
//   failedQueue.forEach((prom) => {
//     if (error) {
//       prom.reject(error);
//     } else {
//       prom.resolve(token);
//     }
//   });

//   failedQueue = [];
// };

// // Request Interceptor (adds accessToken)
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("accessToken");
//     // console.log("TOKEN INSIDE INTERCEPTOR ", token);
//     if (token && config?.headers) {
//       // console.log("TOKEN AND CONFIG.HEADER");
//       config.headers["Authorization"] = `Bearer ${token}`;
//     }
//     // console.log("RETURNING CONFIG");
//     return config;
//   },
//   (error) => {
//     Promise.reject(error);
//     console.log("ERROR....INTERCEPTOR", error);
//   }
// );

// // Response Interceptor (handles expired accessToken)
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     // console.log('ENTERED IN RESPONSE INTERCEPTOR')
//     const originalRequest = error.config;

//     // agar error 401 hai aur retry nahi hua
//     // console.log("CHECKING IF ERROR.RES.STATUS == 401")

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       //  console.log("ENTERED IN IF CONDITION == 401")

//       if (isRefreshing) {
//         return new Promise(function (resolve, reject) {
//           failedQueue.push({ resolve, reject });
//         })
//           .then((token) => {
//             originalRequest.headers["Authorization"] = "Bearer " + token;
//             return axiosInstance(originalRequest);
//           })
//           .catch((err) => Promise.reject(err));
//       }

//       originalRequest._retry = true;
//       isRefreshing = true;

//       // const refreshToken = localStorage.getItem("refreshToken");
//       // console.log('PRINTING REFRESH TOKEN',refreshToken);

//       try {
//         const refreshToken = localStorage.getItem("refreshToken");
//         console.log("PRINTING REFRESH TOKEN", refreshToken);

//         const res = await axios.post(
//           `https://thedemonstrate.com/GenericAuthServiceapi/v1/auth/refreshToken`,
//           {
//             refreshToken: refreshToken?.trim(), // trim spaces just in case
//           },
//           {
//             headers: {
//               "Content-Type": "application/json", // explicitly set content type
//               "X-Client-Source": "OTHER",
//             },
//             withCredentials: true, // send cookies if any
//           }
//         );

//         console.log("RESPONSE......");

//         const newAccessToken = res.data?.data?.accessToken;

//         localStorage.setItem("accessToken", newAccessToken);

//         axiosInstance.defaults.headers.common[
//           "Authorization"
//         ] = `Bearer ${newAccessToken}`;
//         processQueue(null, newAccessToken);

//         return axiosInstance(originalRequest); // 🔁 retry original request
//       } catch (err) {
//         processQueue(err, null);
//         console.log("ERROR IN FETCHING NEW ACCEESS TOEKN", err);
//         // localStorage.removeItem("accessToken");
//         // localStorage.removeItem("refreshToken");

//         // window.location.href = "/ticketing/login"; // ya navigate("/login") if using react-router
//         return Promise.reject(err);
//       } finally {
//         isRefreshing = false;
//       }
//     }

//     return Promise.reject(error);
//   }
// );

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

// import axios, {type AxiosRequestConfig,type AxiosResponse,type Method } from "axios";

// // 🔹 Axios instance
// const axiosInstance = axios.create({
//   baseURL: import.meta.env.VITE_BASE_URL, // ✅ .env se API base URL
//   withCredentials: true, // cookies ke liye
// });

// // 🔹 Refresh token function
// let isRefreshing = false;
// let refreshSubscribers: ((token: string) => void)[] = [];

// const onTokenRefreshed = (newToken: string) => {
//   refreshSubscribers.forEach((cb) => cb(newToken));
//   refreshSubscribers = [];
// };

// const addRefreshSubscriber = (cb: (token: string) => void) => {
//   refreshSubscribers.push(cb);
// };

// async function refreshAccessToken() {
//   if (!isRefreshing) {
//     isRefreshing = true;
//     try {
//       const response = await axios.post(
//         `${import.meta.env.VITE_BASE_URL}/auth/refreshToken`,
//         {},
//         { withCredentials: true }
//       );
//       const newToken = response.data?.accessToken;

//       if (newToken) {
//         localStorage.setItem("accessToken", newToken);
//         onTokenRefreshed(newToken);
//       }
//       return newToken;
//     } catch (error) {
//       console.error("Refresh token failed:", error);
//       localStorage.clear();
//       window.location.href = "/login";
//       return null;
//     } finally {
//       isRefreshing = false;
//     }
//   }

//   return new Promise<string>((resolve) => {
//     addRefreshSubscriber((token) => {
//       resolve(token);
//     });
//   });
// }

// // 🔹 Request Interceptor
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("accessToken");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // 🔹 Response Interceptor
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (
//       error.response?.status === 401 &&
//       !originalRequest._retry
//     ) {
//       originalRequest._retry = true;
//       const newToken = await refreshAccessToken();

//       if (newToken) {
//         originalRequest.headers.Authorization = `Bearer ${newToken}`;
//         return axiosInstance(originalRequest);
//       }
//     }
//     return Promise.reject(error);
//   }
// );

// export const apiConnector = async (
//   method: Method, // ✅ axios ka built-in type
//   url: string,
//   bodyData?: any,
//   headers?: Record<string, string>,
//   params?: Record<string, any>
// ) => {
//   const response = await axios({
//     method: method.toLowerCase() as Method, // ✅ lowercase karke safe
//     url: url,
//     data: bodyData || {},
//     headers: headers || {},
//     params: params || {},
//   });
//   return response;
// };

// export default axiosInstance;
