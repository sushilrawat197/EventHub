import { useQuery } from "@tanstack/react-query";
import { getPackageByIdApi } from "../api/packages.api";
import { packagesQueryKeys } from "./packagesQueryKeys";

const USE_MOCK = import.meta.env.VITE_PACKAGES_MOCK === "true";

async function fetchPackage(packageId: string) {
  if (USE_MOCK) {
    const { packageDetailMock } = await import("../mock/packageDetail.mock");
    return packageDetailMock;
  }
  return getPackageByIdApi(packageId);
}

export function usePackageDetail(packageId: string | undefined) {
  return useQuery({
    queryKey: packagesQueryKeys.detail(packageId ?? ""),
    queryFn: () => fetchPackage(packageId!),
    enabled: Boolean(packageId),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
