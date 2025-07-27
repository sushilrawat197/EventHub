import axios, {
  type AxiosRequestConfig,
  type AxiosResponse,
  type Method,
} from "axios";

// Create axios instance
export const axiosInstance = axios.create({});

// Type for connector params
type Connection<TData = unknown, TParams = Record<string, unknown>> = {
  method: Method;
  url: string;
  bodyData?: TData;
  headers?: Record<string, string>;
  params?: TParams;
};

// Generic API connector
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
    data: bodyData ?? undefined,
    headers,
    params,
  };

  return axiosInstance(config);
};
