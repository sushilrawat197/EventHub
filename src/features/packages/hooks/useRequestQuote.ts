import { useMutation } from "@tanstack/react-query";
import { submitPackageQuoteApi } from "../api/packages.api";
import type { PackageQuoteRequest } from "../types/packageReservation";

export function useRequestQuote() {
  return useMutation({
    mutationFn: (payload: PackageQuoteRequest) => submitPackageQuoteApi(payload),
  });
}
