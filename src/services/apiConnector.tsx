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
}: Connection<TData, TParams>): Promise<AxiosResponse<TResponse>> => {
  const config: AxiosRequestConfig<TData> = {
    method,
    url,
    data: bodyData,
    headers,
    params,
    withCredentials,
    timeout: timeout ?? API_TIMEOUT_MS,
  };

  try {
    return await axiosInstance(config);
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.code === "ECONNABORTED") {
      showGlobalPopup({
        message: REQUEST_TIMEOUT_ERROR_MESSAGE,
        variant: "error",
      });
    }
    throw error;
  }
};

