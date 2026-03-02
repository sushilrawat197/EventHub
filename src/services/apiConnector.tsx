import type { AxiosRequestConfig, AxiosResponse, Method } from "axios";
import { api } from "../api/axios";

export const axiosInstance = api;


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

