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
} from "../../../slices/filterSlice";   // 👈 add setStartDate, setEndDate
import { matchDateFilter } from "../../../utils/dateFilters";

export default function EventList() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const categories = useAppSelector((state) => state.events.categories);
  const events = useAppSelector((state) => state.events.events);
  const selectedCategories = useAppSelector((state) => state.filter.categories);
  const selectedLanguage = useAppSelector((state) => state.filter.languages);
  const selectedDates = useAppSelector((state) => state.filter.dates);
  const selectedPrice = useAppSelector((state) => state.filter.prices);

  const selectedStartDate = useAppSelector((state) => state.filter.startDate);
  const selectedEndDate = useAppSelector((state) => state.filter.endDate);

  const [searchParams, setSearchParams] = useSearchParams();
  const [openFilter, setOpenFilter] = useState(false);

  // Sync URL params with Redux state on mount
  useEffect(() => {
    const categoriesFromUrl = searchParams.get("categories");
    const languageFromUrl = searchParams.get("languages");
    const datesFromUrl = searchParams.get("dates");
    const priceFromUrl = searchParams.get("prices");

    if (categoriesFromUrl) dispatch(setCategories(categoriesFromUrl.split(",")));
    if (languageFromUrl) dispatch(setLanguages(languageFromUrl.split(",")));
    if (datesFromUrl) dispatch(setDates(datesFromUrl.split(",")));
    if (priceFromUrl) dispatch(setPrices(priceFromUrl.split(",")));
  }, [dispatch, searchParams]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();

    if (selectedCategories.length > 0)
      params.set("categories", selectedCategories.join(","));
    if (selectedLanguage.length > 0)
      params.set("languages", selectedLanguage.join(","));
    if (selectedDates.length > 0)
      params.set("dates", selectedDates.join(","));
    if (selectedPrice.length > 0)
      params.set("prices", selectedPrice.join(","));

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
      case "categories":
        dispatch(
          setCategories(
            selectedCategories.includes(value)
              ? selectedCategories.filter((c) => c !== value)
              : [...selectedCategories, value]
          )
        );
        break;

      case "languages":
        dispatch(
          setLanguages(
            selectedLanguage.includes(value)
              ? selectedLanguage.filter((l) => l !== value)
              : [...selectedLanguage, value]
          )
        );
        break;

      case "prices":
        dispatch(
          setPrices(
            selectedPrice.includes(value)
              ? selectedPrice.filter((p) => p !== value)
              : [...selectedPrice, value]
          )
        );
        break;

      case "dates":
        // 👇 special case: if date range chip is removed, also clear startDate & endDate
        if (selectedDates.includes(value)) {
          dispatch(setStartDate(null));
          dispatch(setEndDate(null));
        }
        dispatch(
          setDates(
            selectedDates.includes(value)
              ? selectedDates.filter((d) => d !== value)
              : [...selectedDates, value]
          )
        );
        break;
    }
  };

  const filteredEvents = events
    .map((event) => {
      const matchedShows = event.shows.filter((show) => {
        const showDate = new Date(show.showDateTime);
        return matchDateFilter(
          showDate,
          selectedDates,
          selectedStartDate,
          selectedEndDate
        );
      });

      if (matchedShows.length > 0) {
        return {
          ...event,
          shows: matchedShows,
        };
      }
      return null;
    })
    .filter((event): event is (typeof events)[0] => event !== null)
    .filter((event) => {
      const genreMatch =
        selectedCategories.length === 0 ||
        selectedCategories.includes(event.genre);

      const langMatch =
        selectedLanguage.length === 0 ||
        selectedLanguage.includes(event.defaultLang);

      const priceMatch =
        selectedPrice.length === 0 ||
        selectedPrice.some((priceRange) => {
          const price = event.basePrice;
          if (priceRange === "Free") return price === 0;
          if (priceRange === "0 - 500") return price >= 0 && price <= 500;
          if (priceRange === "501 - 2000") return price >= 501 && price <= 2000;
          if (priceRange === "Above 2000") return price > 2000;
          return false;
        });

      return genreMatch && langMatch && priceMatch;
    });

  const getAllFilterOptions = () => {
    return Array.from(
      new Set([
        ...selectedDates,
        ...selectedPrice,
        ...selectedLanguage,
        ...selectedCategories,
        ...categories.filter((option) => !selectedCategories.includes(option)),
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

  return (
    <div className="py-4">
      <h2 className="text-2xl font-bold mb-4">Events</h2>

      {/* Filter Tags */}
      <div className="overflow-x-auto md:overflow-visible scrollbar-hide mb-6">
        <div className="flex flex-nowrap md:flex-wrap gap-2">
          {getAllFilterOptions().map((tag, i) => (
            <span
              key={i}
              onClick={() => {
                if (categories.includes(tag))
                  handleFilterToggle("categories", tag);
                else if (selectedLanguage.includes(tag))
                  handleFilterToggle("languages", tag);
                else if (selectedPrice.includes(tag))
                  handleFilterToggle("prices", tag);
                else if (selectedDates.includes(tag))
                  handleFilterToggle("dates", tag);
              }}
              className={`min-w-max border px-3 py-1 rounded-full text-[12px] cursor-pointer transition-colors
                ${
                  isFilterSelected(tag)
                    ? "bg-sky-500 text-white border-sky-500"
                    : "border-gray-200 text-sky-500 hover:text-black hover:border-gray-400"
                }`}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Show active filters summary */}
      {(selectedDates.length > 0 ||
        selectedPrice.length > 0 ||
        selectedLanguage.length > 0 ||
        selectedCategories.length > 0) && (
        <div className="mb-4 text-sm text-gray-600">
          {filteredEvents.length} events found
          {selectedDates.length > 0 && ` • Dates: ${selectedDates.join(", ")}`}
          {selectedCategories.length > 0 &&
            ` • Categories: ${selectedCategories.join(", ")}`}
          {selectedLanguage.length > 0 &&
            ` • Languages: ${selectedLanguage.join(", ")}`}
          {selectedPrice.length > 0 && ` • Price: ${selectedPrice.join(", ")}`}
        </div>
      )}

      {/* Events Grid */}
      <div className="grid  grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-8 py-2">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <button
              key={event.contentId}
              onClick={() =>
                navigate(`/events/${event.parentCategoryId}`, { state: event })
              }
            >
              <EventCard event={event} />
            </button>
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-gray-500">
            <p className="text-lg">No events found</p>
            <p className="text-sm">
              Try adjusting your filters to see more events
            </p>
          </div>
        )}
      </div>

      {openFilter && <MobileFilters onClose={() => setOpenFilter(false)} />}

      {/* Mobile buttons */}
      <div className="flex justify-between items-center fixed bottom-0 left-0 right-0 p-2 md:hidden">
        {!openFilter && (
          <button onClick={() => setOpenFilter(true)}>
            <span className="p-4 bg-red-500 text-white rounded-full block md:hidden">
              <FaFilter size={22} />
            </span>
          </button>
        )}
        <span className="p-4 bg-sky-500 text-white rounded-full block md:hidden">
          <FaLocationDot size={22} />
        </span>
      </div>
    </div>
  );
}
