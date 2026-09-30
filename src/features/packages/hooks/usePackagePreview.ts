import { useQuery } from "@tanstack/react-query";
import { previewPackageApi } from "../api/packages.api";
import type { PackagePreviewRequest } from "../types/packageReservation";
import { packagesQueryKeys } from "./packagesQueryKeys";

export function usePackagePreview(request: PackagePreviewRequest | null) {
  const travellersKey = request ? JSON.stringify(request.travellers) : "";

  return useQuery({
    queryKey: packagesQueryKeys.preview(
      request
        ? {
            packageId: request.packageId,
            departureId: request.departureId,
            pickupPointId: request.pickupPointId,
            travellers: travellersKey,
          }
        : { packageId: 0, departureId: 0, travellers: "" },
    ),
    queryFn: () => previewPackageApi(request!),
    enabled: request != null && request.travellers.length > 0,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
