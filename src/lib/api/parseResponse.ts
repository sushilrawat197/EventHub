import type { ApiResponse, OtherApiResponse } from "./types";
import { ApiError } from "./errors";

function isSuccessStatus(statusCode: number): boolean {
  return statusCode >= 200 && statusCode < 300;
}

export function parseOtherApiResponse<T>(body: OtherApiResponse<T>): T {
  if (isSuccessStatus(body.statusCode)) return body.data;

  throw new ApiError(
    body.message || "Request failed",
    body.statusCode,
    body.traceId
  );
}

export function parsePaginatedApiResponse<T>(body: ApiResponse<T>) {
  if (isSuccessStatus(body.statusCode)) return body.data;

  throw new ApiError(
    body.message || "Request failed",
    body.statusCode,
    body.traceId
  );
}
