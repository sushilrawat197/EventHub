export type {
  ApiResponse,
  OtherApiResponse,
  PageData,
} from "@/interfaces/country";

export type ClientRequestConfig = {
  suppressTimeoutPopup?: boolean;
  timeout?: number;
  skipAuth?: boolean;
  skipRefresh?: boolean;
  headers?: Record<string, string>;
  withCredentials?: boolean;
};
