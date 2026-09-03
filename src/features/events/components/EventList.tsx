import EventCard from "./EventCard";
import { FaFilter } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import MobileFilters from "./MobileFilter";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/store/hooks";
import {
  setCategories,
  setDates,
  setLanguages,
  setPrices,
  setStartDate,
  setEndDate,
} from "../store/filterSlice";
import { setFilter } from "../store/filter_Slice";
import ScrollPagination from "../../../shared/components/common/ScrollPagination";
import { useEventsSearchInfinite } from "../hooks/useEventsSearch";
import {
  CATEGORY_OPTIONS,
  formatFilterLabel,
  mapPriceLabelsToGroups,
} from "../utils/filterOptions";

const categoryOptions = [...CATEGORY_OPTIONS];

function arraysEqual(a: string[], b: string[]) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

export default function EventList() {
  const DEFAULT_VISIBLE_CHIPS = 8;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const selectedCategories = useAppSelector((state) => state.filter.categories);
  const selectedLanguage = useAppSelector((state) => state.filter.languages);
  const selectedDates = useAppSelector((state) => state.filter.dates);
  const selectedPrice = useAppSelector((state) => state.filter.prices);
  const searchFilters = useAppSelector((state) => state.searchFilter);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useEventsSearchInfinite(searchFilters);

  const events = useMemo(
    () => data?.pages.flatMap((page) => page.content) ?? [],
    [data]
  );
  const hasMore = Boolean(hasNextPage);

  const [searchParams, setSearchParams] = useSearchParams();

  const [openFilter, setOpenFilter] = useState(false);
  const [showAllChips, setShowAllChips] = useState(false);

  // URL → UI filter store + API searchFilter (so deep links actually query)
  useEffect(() => {
    const categoriesFromUrl = searchParams.get("categories");
    const languageFromUrl = searchParams.get("languages");
    const datesFromUrl = searchParams.get("dates");
    const priceFromUrl = searchParams.get("prices");

    if (categoriesFromUrl) {
      const next = categoriesFromUrl.split(",");
      if (!arraysEqual(selectedCategories, next)) {
        dispatch(setCategories(next));
        dispatch(setFilter({ key: "categories", value: next }));
      }
    }
    if (languageFromUrl) {
      const next = languageFromUrl.split(",");
      if (!arraysEqual(selectedLanguage, next)) {
        dispatch(setLanguages(next));
        dispatch(setFilter({ key: "languages", value: next }));
      }
    }
    if (datesFromUrl) {
      const next = datesFromUrl.split(",");
      if (!arraysEqual(selectedDates, next)) {
        dispatch(setDates(next));
        dispatch(setFilter({ key: "datePresets", value: next }));
      }
    }
    if (priceFromUrl) {
      const next = priceFromUrl.split(",");
      if (!arraysEqual(selectedPrice, next)) {
        dispatch(setPrices(next));
        dispatch(setFilter({ key: "priceGroups", value: mapPriceLabelsToGroups(next) }));
      }
    }
    // Only react to URL changes — selected* compared inside to avoid write loops
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional: hydrate from URL only
  }, [dispatch, searchParams]);

  // UI filter store → URL (single owner; FilterPanel no longer writes URL)
  useEffect(() => {
    const params = new URLSearchParams();

    if (selectedCategories.length > 0)
      params.set("categories", selectedCategories.join(","));
    if (selectedLanguage.length > 0)
      params.set("languages", selectedLanguage.join(","));
    if (selectedDates.length > 0) params.set("dates", selectedDates.join(","));
    if (selectedPrice.length > 0) params.set("prices", selectedPrice.join(","));

    const next = params.toString();
    const current = searchParams.toString();
    if (next !== current) {
      setSearchParams(params, { replace: true });
    }
  }, [
    selectedCategories,
    selectedLanguage,
    selectedDates,
    selectedPrice,
    searchParams,
    setSearchParams,
  ]);

  const handleFilterToggle = useCallback(
    (
      filterKey: "categories" | "languages" | "prices" | "dates",
      value: string
    ) => {
      switch (filterKey) {
        case "categories": {
          const updated = selectedCategories.includes(value)
            ? selectedCategories.filter((c) => c !== value)
            : [...selectedCategories, value];

          dispatch(setCategories(updated));
          dispatch(setFilter({ key: "categories", value: updated }));
          break;
        }

        case "languages": {
          const updated = selectedLanguage.includes(value)
            ? selectedLanguage.filter((l) => l !== value)
            : [...selectedLanguage, value];

          dispatch(setLanguages(updated));
          dispatch(setFilter({ key: "languages", value: updated }));
          break;
        }

        case "prices": {
          const updated = selectedPrice.includes(value)
            ? selectedPrice.filter((p) => p !== value)
            : [...selectedPrice, value];

          dispatch(setPrices(updated));
          dispatch(
            setFilter({ key: "priceGroups", value: mapPriceLabelsToGroups(updated) })
          );
          break;
        }

        case "dates": {
          const updated = selectedDates.includes(value)
            ? selectedDates.filter((d) => d !== value)
            : [...selectedDates, value];

          if (!updated.includes("Date Range")) {
            dispatch(setStartDate(null));
            dispatch(setEndDate(null));
            dispatch(setFilter({ key: "startDate", value: null }));
            dispatch(setFilter({ key: "endDate", value: null }));
          }

          dispatch(setDates(updated));
          dispatch(setFilter({ key: "datePresets", value: updated }));
          break;
        }
      }
    },
    [
      dispatch,
      selectedCategories,
      selectedLanguage,
      selectedPrice,
      selectedDates,
    ]
  );

  const allFilterOptions = useMemo(
    () =>
      Array.from(
        new Set([
          ...selectedDates,
          ...selectedPrice,
          ...selectedLanguage,
          ...selectedCategories,
          ...categoryOptions,
        ])
      ),
    [selectedDates, selectedPrice, selectedLanguage, selectedCategories]
  );

  const isFilterSelected = useCallback(
    (tag: string): boolean => {
      return (
        selectedCategories.includes(tag) ||
        selectedLanguage.includes(tag) ||
        selectedDates.includes(tag) ||
        selectedPrice.includes(tag)
      );
    },
    [selectedCategories, selectedLanguage, selectedDates, selectedPrice]
  );

  const handleChipClick = useCallback(
    (tag: string) => {
      if (categoryOptions.includes(tag as (typeof categoryOptions)[number])) {
        handleFilterToggle("categories", tag);
      }
      if (selectedLanguage.includes(tag)) handleFilterToggle("languages", tag);
      else if (selectedPrice.includes(tag)) handleFilterToggle("prices", tag);
      else if (selectedDates.includes(tag)) handleFilterToggle("dates", tag);
    },
    [
      handleFilterToggle,
      selectedLanguage,
      selectedPrice,
      selectedDates,
    ]
  );

  const handleLoadMore = useCallback(async () => {
    if (isFetchingNextPage || !hasMore) return;
    await fetchNextPage();
  }, [isFetchingNextPage, hasMore, fetchNextPage]);

  const visibleFilterOptions = showAllChips
    ? allFilterOptions
    : allFilterOptions.slice(0, DEFAULT_VISIBLE_CHIPS);
  const hasMoreChips = allFilterOptions.length > DEFAULT_VISIBLE_CHIPS;

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl p-3 md:p-4 shadow-sm border border-gray-100">
        <div className="py-2 md:py-3">
          <div className="flex flex-wrap gap-1.5 md:gap-2">
            {visibleFilterOptions.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleChipClick(tag)}
                className={`px-3 md:px-3 py-1.5 md:py-1.5 rounded-full text-xs md:text-xs font-semibold transition-all duration-200 whitespace-nowrap ${
                  isFilterSelected(tag)
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                    : "bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:shadow-md"
                }`}
              >
                {formatFilterLabel(tag)}
              </button>
            ))}
            {hasMoreChips && (
              <button
                type="button"
                onClick={() => setShowAllChips((prev) => !prev)}
                className="px-3 md:px-3 py-1.5 md:py-1.5 rounded-full text-xs md:text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors whitespace-nowrap"
              >
                {showAllChips ? "Show less" : "Show More.."}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 items-stretch">
        {isLoading && events.length === 0 ? (
          <div className="col-span-full text-center py-16 text-gray-500">
            Loading events…
          </div>
        ) : events.length > 0 ? (
          events.map((event) => {
            const slug = event.eventName
              .toLowerCase()
              .trim()
              .replace(/&/g, "and")
              .replace(/\s+/g, "-")
              .replace(/[^\w-]/g, "");

            return (
              <button
                key={event.eventId}
                type="button"
                onClick={() =>
                  navigate(`/events/${slug}/${event.eventId}`, {
                    state: event,
                  })
                }
                className="w-full h-full"
              >
                <EventCard event={event} />
              </button>
            );
          })
        ) : (
          <div className="col-span-full">
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-12 h-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No events found
              </h3>

              <p className="text-gray-600 mb-6">
                Try adjusting your filters to see more events
              </p>
            </div>
          </div>
        )}
      </div>

      {openFilter && <MobileFilters onClose={() => setOpenFilter(false)} />}

      <div className="flex justify-between items-center fixed bottom-4 left-4 right-4 md:hidden z-30">
        {!openFilter && (
          <button
            type="button"
            onClick={() => setOpenFilter(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-2xl shadow-lg shadow-blue-200 transition-all duration-200 hover:scale-105"
          >
            <FaFilter size={20} />
          </button>
        )}
        <button
          type="button"
          className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-2xl shadow-lg shadow-green-200 transition-all duration-200 hover:scale-105"
        >
          <FaLocationDot size={20} />
        </button>
      </div>

      <ScrollPagination
        onLoadMore={handleLoadMore}
        hasMore={hasMore}
        loading={isFetchingNextPage}
      />
    </div>
  );
}
