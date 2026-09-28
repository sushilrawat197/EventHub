import { useInfiniteQuery } from "@tanstack/react-query";
import { listPackagesApi } from "../api/packages.api";
import type { PackageSearchFilters } from "../types/package";
import { packagesQueryKeys } from "./packagesQueryKeys";

export function usePackagesSearchInfinite(filters: PackageSearchFilters) {
  return useInfiniteQuery({
    queryKey: packagesQueryKeys.list(filters),
    queryFn: ({ pageParam }) => listPackagesApi(filters, pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.last ? undefined : lastPage.page + 1,
  });
}
