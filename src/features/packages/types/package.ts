export interface TourPackage {
  packageId: number;
  packageCode: string;
  packageName: string;
  shortDescription: string;
  coverImage: string;
  category: string;
  categoryCode: string;
  country: string;
  destination: string;
  currency: string;
  packagePrice: number;
  pricingBasis: string;
  nextDepartureDate: string;
  durationDays: number;
  durationNights: number;
  available: boolean;
  tourOperatorName: string;
}

export interface PackageSearchFilters {
  city?: string;
  category?: string;
  departureDate?: string;
  minPrice?: number;
  maxPrice?: number;
}

export const PACKAGE_PAGE_SIZE = 12;

/** API `category` codes. Chips match the published package categories. */
export const PACKAGE_CATEGORY_OPTIONS = [
  { code: "ADVENTURE", label: "Adventure" },
  { code: "HONEYMOON", label: "Honeymoon" },
  { code: "FAMILY", label: "Family" },
  { code: "GROUP", label: "Group" },
  { code: "LUXURY", label: "Luxury" },
  { code: "WEEKEND", label: "Weekend" },
  { code: "RELIGIOUS", label: "Religious" },
] as const;

export const PACKAGE_PRICE_MIN = 0;
export const PACKAGE_PRICE_MAX = 20000;
