import EventCard from "./EventCard";
import { FaFilter } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import MobileFilters from "./MobileFilter";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../reducers/hooks";
import {
  setCategories,
  setDates,
  setLanguages,
  setPrices,
  setStartDate,
  setEndDate,
} from "../../../slices/filterSlice"; // 👈 add setStartDate, setEndDate
import { listEventsBySearch } from "../../../services/operations/eventsApi";
import { setFilter } from "../../../slices/filter_Slice";
import ScrollPagination from "../../Components/common/ScrollPagination";

const categoryOptions: string[] = [
  "CONCERT",
  "SPORTS",
  "GALA DINNERS",
  "COMEDY",
  "SEMINARS",
  "FESTIVAL",
  "WORKSHOP",
  "OTHER",
];

export default function EventList() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const selectedCategories = useAppSelector((state) => state.filter.categories);
  const selectedLanguage = useAppSelector((state) => state.filter.languages);
  const selectedDates = useAppSelector((state) => state.filter.dates);
  const selectedPrice = useAppSelector((state) => state.filter.prices);

  const events = useAppSelector(
    (state) => state.events.allEventsBySearch?.content || []
  );

  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);

  const totalPages = useAppSelector(
    (state) => state.events.allEventsBySearch?.totalPages
  );
  const hasMore = page < (totalPages || 1) - 1;

  const [searchParams, setSearchParams] = useSearchParams();

  const [openFilter, setOpenFilter] = useState(false);

  // Sync URL params with Redux state on mount
  useEffect(() => {
    const categoriesFromUrl = searchParams.get("categories");
    const languageFromUrl = searchParams.get("languages");
    const datesFromUrl = searchParams.get("dates");
    const priceFromUrl = searchParams.get("prices");

    if (categoriesFromUrl)
      dispatch(setCategories(categoriesFromUrl.split(",")));
    if (languageFromUrl) dispatch(setLanguages(languageFromUrl.split(",")));
    if (datesFromUrl) dispatch(setDates(datesFromUrl.split(",")));
    if (priceFromUrl) dispatch(setPrices(priceFromUrl.split(",")));
  }, [dispatch, searchParams]);

  // Update URL when filters change

  useEffect(() => {
    const params = new URLSearchParams(); // TO PREPARE QUERY STRING  "categories=comedy,music&languages=english,hindi"

    if (selectedCategories.length > 0)
      params.set("categories", selectedCategories.join(","));
    if (selectedLanguage.length > 0)
      params.set("languages", selectedLanguage.join(","));
    if (selectedDates.length > 0) params.set("dates", selectedDates.join(","));
    if (selectedPrice.length > 0) params.set("prices", selectedPrice.join(","));

    setSearchParams(params, { replace: true });
  }, [
    selectedCategories,
    selectedLanguage,
    selectedDates,
    selectedPrice,
    setSearchParams,
  ]);

  const handleFilterToggle = (
    filterKey: "categories" | "languages" | "prices" | "dates",
    value: string
  ) => {
    switch (filterKey) {
      case "categories": {
        const updated = selectedCategories.includes(value)
          ? selectedCategories.filter((c) => c !== value)
          : [...selectedCategories, value];

        dispatch(setCategories(updated));
        dispatch(setFilter({ key: "genres", value: updated }));
        dispatch(listEventsBySearch());
        break;
      }

      case "languages": {
        const updated = selectedLanguage.includes(value)
          ? selectedLanguage.filter((l) => l !== value)
          : [...selectedLanguage, value];

        dispatch(setLanguages(updated));
        dispatch(setFilter({ key: "languages", value: updated }));
        dispatch(listEventsBySearch());
        break;
      }

      case "prices": {
        const updated = selectedPrice.includes(value)
          ? selectedPrice.filter((p) => p !== value)
          : [...selectedPrice, value];

        // map to PriceGroup[]
        const mapped = updated.map((f) => {
          if (f === "0 - 500") return { min: 0, max: 500 };
          if (f === "501 - 2000") return { min: 501, max: 2000 };
          if (f === "Above 2000")
            return { min: 2001, max: Number.MAX_SAFE_INTEGER };
          return { min: 0, max: Number.MAX_SAFE_INTEGER }; // fallback
        });

        dispatch(setPrices(updated));
        dispatch(setFilter({ key: "priceGroups", value: mapped }));
        dispatch(listEventsBySearch());
        break;
      }

      case "dates": {
        const updated = selectedDates.includes(value)
          ? selectedDates.filter((d) => d !== value)
          : [...selectedDates, value];

        // Agar "Date Range" remove hua → start & end date bhi reset karo
        if (!updated.includes("Date Range")) {
          dispatch(setStartDate(null));
          dispatch(setEndDate(null));
          dispatch(setFilter({ key: "startDate", value: null }));
          dispatch(setFilter({ key: "endDate", value: null }));
        }

        dispatch(setDates(updated));
        dispatch(setFilter({ key: "datePresets", value: updated }));
        dispatch(listEventsBySearch());
        break;
      }
    }
  };

  const getAllFilterOptions = () => {
    return Array.from(
      // to make set object into array so that we can use .map funciton on getallfilter...
      new Set([
        ...selectedDates,
        ...selectedPrice,
        ...selectedLanguage,
        ...selectedCategories,
        ...categoryOptions,
      ])
    );
  };

  const isFilterSelected = (tag: string): boolean => {
    return (
      selectedCategories.includes(tag) ||
      selectedLanguage.includes(tag) ||
      selectedDates.includes(tag) ||
      selectedPrice.includes(tag)
    );
  };

  const handleLoadMore = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    const nextPage = page + 1;
    setPage(nextPage);
    await dispatch(listEventsBySearch(nextPage));
    setLoading(false);
  };

  useEffect(() => {
    dispatch(listEventsBySearch(page));
  }, [page, dispatch]);

  return (
    <div className="space-y-4">
      {/* Filter Tags */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex flex-nowrap gap-2 min-w-max">
            {getAllFilterOptions().map((tag, i) => (
              <button
                key={i}
                onClick={() => {
                  if (categoryOptions.includes(tag))
                    handleFilterToggle("categories", tag);
                  if (selectedLanguage.includes(tag))
                    handleFilterToggle("languages", tag);
                  else if (selectedPrice.includes(tag))
                    handleFilterToggle("prices", tag);
                  else if (selectedDates.includes(tag))
                    handleFilterToggle("dates", tag);
                }}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                  isFilterSelected(tag)
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                    : "bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:shadow-md"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 items-stretch">
        {events.length > 0 ? (
          events?.map((event) => {
            const slug = event.eventName
              .toLowerCase()
              .trim()
              .replace(/&/g, "and")
              .replace(/\s+/g, "-")
              .replace(/[^\w-]/g, "");

            return (
              <button
                key={event.eventId}
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
              {/* <button 
                onClick={() => {
                  dispatch(setCategories([]));
                  dispatch(setLanguages([]));
                  dispatch(setDates([]));
                  dispatch(setPrices([]));
                  dispatch(listEventsBySearch());
                }}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
              >
                Clear All Filters
              </button> */}
            </div>
          </div>
        )}
      </div>

      {openFilter && <MobileFilters onClose={() => setOpenFilter(false)} />}

      {/* Mobile buttons */}
      <div className="flex justify-between items-center fixed bottom-4 left-4 right-4 md:hidden z-30">
        {!openFilter && (
          <button
            onClick={() => setOpenFilter(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-2xl shadow-lg shadow-blue-200 transition-all duration-200 hover:scale-105"
          >
            <FaFilter size={20} />
          </button>
        )}
        <button className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-2xl shadow-lg shadow-green-200 transition-all duration-200 hover:scale-105">
          <FaLocationDot size={20} />
        </button>
      </div>

      <ScrollPagination
        onLoadMore={handleLoadMore}
        hasMore={hasMore}
        loading={loading}
      />
    </div>
  );
}
