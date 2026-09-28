import { client } from "@/lib/api/client";
import { apiConnector } from "@/lib/api/connector";
import { ApiError, extractApiFailureMessage } from "@/lib/api/errors";
import type { PageData } from "@/lib/api/types";
import { packagesEndpoints } from "./endpoints";
import type { PackageSearchFilters, TourPackage } from "../types/package";
import type { PackageDetail } from "../types/packageDetail";
import type {
  PackagePreviewRequest,
  PackagePreviewResponse,
  PackageQuoteRequest,
  PackageQuoteResponse,
  PackageReservationRequest,
  PackageReservationResponse,
} from "../types/packageReservation";
import { PACKAGE_PAGE_SIZE } from "../types/package";

export async function listPackagesApi(
  filters: PackageSearchFilters,
  page = 0,
  size = PACKAGE_PAGE_SIZE
): Promise<PageData<TourPackage>> {
  return client.getPaginated<TourPackage>(
    packagesEndpoints.list(filters, page, size),
    { skipAuth: true }
  );
}

/** Guests allowed: the token is attached only when the user is signed in. */
export async function reservePackageApi(
  payload: PackageReservationRequest,
  idempotencyKey?: string
): Promise<PackageReservationResponse> {
  return client.post<PackageReservationResponse, PackageReservationRequest>(
    packagesEndpoints.reserve(),
    payload,
    idempotencyKey ? { headers: { "X-Idempotency-Key": idempotencyKey } } : undefined
  );
}

/** Guests allowed. Returns the package view plus a quoted `payment` for these travellers. */
export async function previewPackageApi(payload: PackagePreviewRequest): Promise<PackagePreviewResponse> {
  return client.post<PackagePreviewResponse, PackagePreviewRequest>(packagesEndpoints.preview(), payload, {
    skipAuth: true,
  });
}

function successCode(body: Record<string, unknown>, httpStatus: number): number | undefined {
  if (typeof body.statusCode === "number") return body.statusCode;
  if (typeof body.status === "number") return body.status;
  return httpStatus;
}

/** Guests allowed. A signed-in token is attached when one exists. */
export async function submitPackageQuoteApi(payload: PackageQuoteRequest): Promise<PackageQuoteResponse> {
  const response = await apiConnector<unknown>({
    method: "POST",
    url: packagesEndpoints.quoteRequest(),
    bodyData: payload,
  });
  const body = response.data && typeof response.data === "object" ? (response.data as Record<string, unknown>) : {};
  const code = successCode(body, response.status);
  const data = body.data;
  if (code != null && code >= 200 && code < 300 && data && typeof data === "object") {
    return data as PackageQuoteResponse;
  }
  throw new ApiError(extractApiFailureMessage(body, "We couldn't submit your quote request."), code);
}

export async function getPackageByIdApi(packageId: string): Promise<PackageDetail> {
  return client.get<PackageDetail>(packagesEndpoints.byId(packageId), {
    skipAuth: true,
  });
}
