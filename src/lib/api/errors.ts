import axios from "axios";

export class ApiError extends Error {
  readonly statusCode?: number;
  readonly traceId?: string;
  readonly cause?: unknown;

  constructor(message: string, statusCode?: number, traceId?: string, cause?: unknown) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.traceId = traceId;
    this.cause = cause;
  }
}

export function getApiErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again."
): string {
  if (error instanceof ApiError) return error.message;

  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string } | undefined;
    return data?.message ?? fallback;
  }

  if (error instanceof Error && error.message) return error.message;

  return fallback;
}

export function isTimeoutError(error: unknown): boolean {
  return (
    axios.isAxiosError(error) &&
    (error.code === "ERR_CANCELED" || error.code === "ECONNABORTED")
  );
}
