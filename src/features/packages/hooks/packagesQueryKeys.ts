import type { PackageSearchFilters } from "../types/package";

export const packagesQueryKeys = {
  all: ["packages"] as const,
  list: (filters: PackageSearchFilters) =>
    ["packages", "list", filters] as const,
  detail: (packageId: string) => ["packages", "detail", packageId] as const,
  preview: (request: {
    packageId: number;
    departureId: number;
    pickupPointId?: number;
    travellers: string;
  }) => ["packages", "preview", request] as const,
};
