import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import Footer from "@/features/home/components/Footer";
import { listCitiesByRegion } from "@/features/events/services/regions.service";
import ScrollPagination from "@/shared/components/common/ScrollPagination";
import PackageCard from "../components/PackageCard";
import PackageFiltersPanel from "../components/PackageFiltersPanel";
import { usePackagesSearchInfinite } from "../hooks/usePackagesSearch";
import type { PackageSearchFilters } from "../types/package";
import {
  PACKAGE_CATEGORY_OPTIONS,
  PACKAGE_PRICE_MAX,
  PACKAGE_PRICE_MIN,
} from "../types/package";

export default function PackagesPage() {
  const dispatch = useAppDispatch();
  const cities = useAppSelector((state) => state.cities.data ?? []);
  const selectedCityId = useAppSelector((state) => state.cities.selectedCity);
  const cityName =
    cities.find((item) => item.id === selectedCityId)?.label || undefined;

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [departureDate, setDepartureDate] = useState("");
  const [dateOpen, setDateOpen] = useState(false);
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState(PACKAGE_PRICE_MIN);
  const [maxPrice, setMaxPrice] = useState(PACKAGE_PRICE_MAX);
  const [queryMin, setQueryMin] = useState(PACKAGE_PRICE_MIN);
  const [queryMax, setQueryMax] = useState(PACKAGE_PRICE_MAX);
  const priceTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (priceTimer.current) window.clearTimeout(priceTimer.current);
    };
  }, []);

  function onPriceChange(nextMin: number, nextMax: number) {
    const lo = Math.min(nextMin, nextMax);
    const hi = Math.max(nextMin, nextMax);
    setMinPrice(lo);
    setMaxPrice(hi);
    if (priceTimer.current) window.clearTimeout(priceTimer.current);
    priceTimer.current = window.setTimeout(() => {
      setQueryMin(lo);
      setQueryMax(hi);
    }, 400);
  }

  useEffect(() => {
    if (!cities.length) {
      void dispatch(listCitiesByRegion());
    }
  }, [cities.length, dispatch]);

  const priceActive = queryMin > PACKAGE_PRICE_MIN || queryMax < PACKAGE_PRICE_MAX;
  const filters = useMemo((): PackageSearchFilters => {
    return {
      city: cityName,
      departureDate: departureDate || undefined,
      category: category || undefined,
      minPrice: priceActive ? queryMin : undefined,
      maxPrice: priceActive ? queryMax : undefined,
    };
  }, [cityName, departureDate, category, priceActive, queryMin, queryMax]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = usePackagesSearchInfinite(filters);

  const packages = useMemo(
    () => data?.pages.flatMap((page) => page.content ?? []) ?? [],
    [data]
  );
  const total = data?.pages[0]?.totalElements ?? 0;

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  function resetFilters() {
    if (priceTimer.current) window.clearTimeout(priceTimer.current);
    setDepartureDate("");
    setCategory("");
    setMinPrice(PACKAGE_PRICE_MIN);
    setMaxPrice(PACKAGE_PRICE_MAX);
    setQueryMin(PACKAGE_PRICE_MIN);
    setQueryMax(PACKAGE_PRICE_MAX);
  }

  const filterProps = {
    departureDate,
    dateOpen,
    onDateOpenChange: setDateOpen,
    onDateSelect: (value: string) => {
      setDepartureDate(value);
      setDateOpen(false);
    },
    minPrice,
    maxPrice,
    onPriceChange,
    onReset: resetFilters,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 pb-24 pt-8 sm:px-6 lg:px-8 lg:pb-6 lg:pt-16">
        <div className="flex flex-col gap-6 lg:flex-row">
          <aside className="hidden w-full lg:sticky lg:top-36 lg:block lg:h-fit lg:w-72">
            <PackageFiltersPanel {...filterProps} />
          </aside>

          <section className="min-w-0 flex-1">
            <div className="mb-4 overflow-x-auto rounded-2xl border border-gray-100 bg-white px-3 py-3 shadow-sm">
              <div className="flex gap-2">
              <CategoryChip
                label="All Packages"
                active={!category}
                onClick={() => setCategory("")}
              />
              {PACKAGE_CATEGORY_OPTIONS.map((item) => (
                <CategoryChip
                  key={item.code}
                  label={item.label}
                  active={category === item.code}
                  onClick={() => setCategory(item.code)}
                />
              ))}
              </div>
            </div>

            {!isLoading && !isError && (
              <p className="mb-3 text-sm text-gray-500">
                {total} {total === 1 ? "package" : "packages"}
              </p>
            )}

            {isLoading ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-48 animate-pulse rounded-2xl border border-gray-100 bg-white"
                  />
                ))}
              </div>
            ) : isError ? (
              <div className="rounded-2xl border border-red-100 bg-white p-8 text-center">
                <p className="text-sm font-medium text-red-600">
                  Could not load packages. Please try again.
                </p>
              </div>
            ) : packages.length === 0 ? (
              <div className="rounded-2xl border border-gray-100 bg-white p-10 text-center">
                <p className="text-base font-semibold text-gray-900">
                  No packages found
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Try another date or budget.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {packages.map((pkg) => (
                    <PackageCard key={pkg.packageId} pkg={pkg} />
                  ))}
                </div>
                <ScrollPagination
                  onLoadMore={loadMore}
                  hasMore={Boolean(hasNextPage)}
                  loading={isFetchingNextPage}
                  endMessage="You've seen all packages"
                  loadingMessage="Loading more packages..."
                  idleMessage="Scroll to load more packages"
                />
              </div>
            )}
          </section>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setFiltersOpen(true)}
        className="fixed bottom-6 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-3 text-sm font-semibold text-white shadow-lg lg:hidden"
      >
        <SlidersHorizontal className="h-4 w-4" />
        Filters
      </button>

      {filtersOpen ? (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button
            type="button"
            aria-label="Close filters"
            className="absolute inset-0 bg-black/45"
            onClick={() => setFiltersOpen(false)}
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[88vh] overflow-y-auto rounded-t-3xl bg-gray-50 p-4 pb-6 shadow-2xl">
            <div className="mb-3 flex items-center justify-between">
              <span className="mx-auto h-1.5 w-10 rounded-full bg-gray-300" />
              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-600 shadow-sm"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <PackageFiltersPanel {...filterProps} />
          </div>
        </div>
      ) : null}

      <Footer />
    </div>
  );
}

function CategoryChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
        active
          ? "bg-blue-600 text-white shadow-sm"
          : "border border-gray-200 bg-gray-50 text-gray-700 hover:border-blue-200 hover:text-blue-700"
      }`}
    >
      {label}
    </button>
  );
}
