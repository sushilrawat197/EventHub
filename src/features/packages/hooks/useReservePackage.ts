import { useMutation } from "@tanstack/react-query";
import { reservePackageApi } from "../api/packages.api";
import type { PackageReservationRequest } from "../types/packageReservation";

export function useReservePackage() {
  return useMutation({
    mutationFn: ({ payload, idempotencyKey }: { payload: PackageReservationRequest; idempotencyKey: string }) =>
      reservePackageApi(payload, idempotencyKey),
  });
}
