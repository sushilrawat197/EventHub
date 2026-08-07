import axios, {
  type AxiosRequestConfig,
  type AxiosResponse,
  type Method,
  type ResponseType,
} from "axios";
import { showGlobalPopup } from "@/utils/globalPopup";
import { api } from "./axios";
import {
  CLIENT_SOURCE_HEADER,
  DEFAULT_CLIENT_SOURCE,
  DEFAULT_TIMEOUT_MS,
  REQUEST_TIMEOUT_MESSAGE,
} from "./constants";

export const axiosInstance = api;

type Connection<TData = unknown, TParams = Record<string, unknown>> = {
  method: Method;
  url: string;
  bodyData?: TData;
  headers?: Record<string, string>;
  params?: TParams;
  withCredentials?: boolean;
  timeout?: number;
  suppressTimeoutPopup?: boolean;
  skipAuth?: boolean;
  skipRefresh?: boolean;
  responseType?: ResponseType;
};

export async function apiConnector<
  TResponse,
  TData = unknown,
  TParams = Record<string, unknown>,
>({
  method,
  url,
  bodyData,
  headers,
  params,
  withCredentials,
  timeout,
  suppressTimeoutPopup,
  skipAuth,
  skipRefresh,
  responseType,
}: Connection<TData, TParams>): Promise<AxiosResponse<TResponse>> {
  const controller = new AbortController();

  const config: AxiosRequestConfig<TData> = {
    method,
    url,
    data: bodyData,
    headers: {
      [CLIENT_SOURCE_HEADER]: DEFAULT_CLIENT_SOURCE,
      ...headers,
    },
    params,
    withCredentials,
    signal: controller.signal,
    skipAuth,
    skipRefresh,
    responseType,
  };

  const timeoutId = setTimeout(() => {
    controller.abort();
  }, timeout ?? DEFAULT_TIMEOUT_MS);

  try {
    const response = await axiosInstance(config);
    clearTimeout(timeoutId);
    return response;
  } catch (error: unknown) {
    clearTimeout(timeoutId);

    if (axios.isAxiosError(error) && error.code === "ERR_CANCELED") {
      if (!suppressTimeoutPopup) {
        showGlobalPopup({
          message: REQUEST_TIMEOUT_MESSAGE,
          variant: "error",
        });
      }
    }

    throw error;
  }
}
