import type { AxiosResponse } from "axios";
import { apiConnector } from "./connector";
import { parseOtherApiResponse, parsePaginatedApiResponse } from "./parseResponse";
import type { ApiResponse, ClientRequestConfig, OtherApiResponse, PageData } from "./types";

type ConnectorOverrides = Pick<
  ClientRequestConfig,
  "suppressTimeoutPopup" | "timeout" | "skipAuth" | "skipRefresh" | "headers" | "withCredentials"
>;

async function request<T>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  url: string,
  body?: unknown,
  config?: ConnectorOverrides
): Promise<AxiosResponse<T>> {
  return apiConnector<T>({
    method,
    url,
    bodyData: body,
    ...config,
  });
}

export const client = {
  async get<T>(url: string, config?: ConnectorOverrides): Promise<T> {
    const response = await request<OtherApiResponse<T>>("GET", url, undefined, config);
    return parseOtherApiResponse(response.data);
  },

  async post<T, B = unknown>(url: string, body?: B, config?: ConnectorOverrides): Promise<T> {
    const response = await request<OtherApiResponse<T>>("POST", url, body, config);
    return parseOtherApiResponse(response.data);
  },

  async put<T, B = unknown>(url: string, body?: B, config?: ConnectorOverrides): Promise<T> {
    const response = await request<OtherApiResponse<T>>("PUT", url, body, config);
    return parseOtherApiResponse(response.data);
  },

  async getPaginated<T>(url: string, config?: ConnectorOverrides): Promise<PageData<T>> {
    const response = await request<ApiResponse<T>>("GET", url, undefined, config);
    return parsePaginatedApiResponse(response.data);
  },

  async postPaginated<T, B = unknown>(
    url: string,
    body?: B,
    config?: ConnectorOverrides
  ): Promise<PageData<T>> {
    const response = await request<ApiResponse<T>>("POST", url, body, config);
    return parsePaginatedApiResponse(response.data);
  },

  async getBlob(url: string, config?: ConnectorOverrides): Promise<Blob> {
    const response = await apiConnector<Blob>({
      method: "GET",
      url,
      responseType: "blob",
      ...config,
    });

    if (response.status >= 200 && response.status < 300) {
      return response.data;
    }

    throw new Error("Failed to download file");
  },
};
