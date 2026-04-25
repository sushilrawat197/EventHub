import axios, { type AxiosRequestConfig, type AxiosResponse, type Method } from "axios";
import { api } from "../api/axios";
import { showGlobalPopup } from "../utils/globalPopup";

export const axiosInstance = api;

const API_TIMEOUT_MS = 15000;
const REQUEST_TIMEOUT_ERROR_MESSAGE = "Something went wrong. Please try again.";

// Type for connector params
type Connection<TData = unknown, TParams = Record<string, unknown>> = {
  method: Method;
  url: string;
  bodyData?: TData;
  headers?: Record<string, string>;
  params?: TParams;
  withCredentials?: boolean;
  timeout?: number;
  suppressTimeoutPopup?: boolean;
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
  withCredentials,
  timeout,
  suppressTimeoutPopup,
}: Connection<TData, TParams>): Promise<AxiosResponse<TResponse>> => {

  const controller = new AbortController(); // 👈 create controller

  const config: AxiosRequestConfig<TData> = {
    method,
    url,
    data: bodyData,
    headers,
    params,
    withCredentials,
    signal: controller.signal, // 👈 attach signal
  };

  // 👇 manual timeout logic (real cancel)
  const timeoutId = setTimeout(() => {
    controller.abort(); // 👈 request cancel
  }, timeout ?? API_TIMEOUT_MS);

  try {
    const response = await axiosInstance(config);
    clearTimeout(timeoutId); // cleanup
    return response;
  } catch (error: unknown) {
    clearTimeout(timeoutId);

    if (axios.isAxiosError(error)) {
      if (error.code === "ERR_CANCELED") {
        if (!suppressTimeoutPopup) {
          showGlobalPopup({
            message: REQUEST_TIMEOUT_ERROR_MESSAGE,
            variant: "error",
          });
        }
      }
    }

    throw error;
  }
};