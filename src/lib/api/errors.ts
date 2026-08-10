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

/** Prefer nested `data.error` over top-level `message` (e.g. VALIDATION_FAILURE). */
export function extractApiFailureMessage(
  body: unknown,
  fallback = "Something went wrong. Please try again."
): string {
  if (!body || typeof body !== "object") return fallback;

  const record = body as {
    message?: unknown;
    error?: unknown;
    data?: unknown;
  };

  const nested =
    record.data &&
    typeof record.data === "object" &&
    "error" in record.data &&
    typeof (record.data as { error?: unknown }).error === "string"
      ? (record.data as { error: string }).error.trim()
      : "";

  if (nested) return nested;

  if (typeof record.error === "string" && record.error.trim()) {
    return record.error.trim();
  }

  if (typeof record.message === "string" && record.message.trim()) {
    return record.message.trim();
  }

  return fallback;
}

export function getApiErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again."
): string {
  if (error instanceof ApiError) return error.message;

  if (axios.isAxiosError(error)) {
    return extractApiFailureMessage(error.response?.data, fallback);
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
