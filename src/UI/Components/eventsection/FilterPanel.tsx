import { useState, useRef, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { IoClose } from "react-icons/io5";
import { useAppSelector, useAppDispatch } from "../../../reducers/hooks";
import {
  setCategories,
  setDates,
  setEndDate,
  setLanguages,
  setPrices,
  setStartDate,
} from "../../../slices/filterSlice";
import { useSearchParams } from "react-router-dom";

import { setFilter } from "../../../slices/filter_Slice";
import { listEventsBySearch } from "../../../services/operations/eventsApi";

interface FilterItemProps {
  title: string;
  options: string[];
  filterKey: "categories" | "languages" | "dates" | "prices";
}


const FilterItem = ({ title, options, filterKey }: FilterItemProps) => {
  const dispatch = useAppDispatch();
  const selectedCategories = useAppSelector((state) => state.filter.categories);
  const selectedLanguage = useAppSelector((state) => state.filter.languages);
  const startDate = useAppSelector((state) => state.filter.startDate);
  const endDate = useAppSelector((state) => state.filter.endDate);
  const selectedDates = useAppSelector((state) => state.filter.dates);
  const selectedPrice = useAppSelector((state) => state.filter.prices);

  const [open, setOpen] = useState(false);

  //CALENDER
  const calendarRef = useRef<HTMLDivElement>(null);
  const [showCalendar, setShowCalendar] = useState(false);

  const selectedFilters = useAppSelector((state) => state.filter[filterKey]);

  
  const handleOptionClick = (opt: string) => {
    if (opt === "Date Range") {
      setShowCalendar(true);
    }

    let newFilters;

    if (selectedFilters.includes(opt)) {
      newFilters = selectedFilters.filter((f) => f !== opt);
    } else {
      newFilters = [...selectedFilters, opt];
    }

    if (filterKey === "categories") {
      dispatch(setCategories(newFilters));
      dispatch(setFilter({ key: "genres", value: newFilters }));
      dispatch(listEventsBySearch());
    }

    if (filterKey === "languages") {
      dispatch(setLanguages(newFilters));
      dispatch(setFilter({ key: "languages", value: newFilters }));
      dispatch(listEventsBySearch());
    }

    if (filterKey === "dates") {
      if (newFilters.includes("Date Range")) {
        dispatch(setDates(newFilters));
        return;
      }
      dispatch(setDates(newFilters));
      dispatch(setFilter({ key: "datePresets", value: newFilters }));
      dispatch(listEventsBySearch());
    }

      

    if (filterKey === "prices") {
      const mappedFilters = newFilters.map((f) => {
        if (f === "0 - 500") return { min: 0, max: 500 };
        if (f === "501 - 2000") return { min: 501, max: 2000 };
        if (f === "Above 2000")
          return { min: 2001, max: Number.MAX_SAFE_INTEGER };
        return { min: 0, max: Number.MAX_SAFE_INTEGER }; // fallback
      });
      dispatch(setPrices(newFilters));
      dispatch(setFilter({ key: "priceGroups", value: mappedFilters }));
      dispatch(listEventsBySearch());
    }
  };

  // helper function to get YYYY-MM-DD local date
  const formatLocalDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Clear button
// Clear button
const handleClear = () => {
  setShowCalendar(false);

  // Calendar values clear
  dispatch(setStartDate(null));
  dispatch(setEndDate(null));
  dispatch(setFilter({ key: "startDate", value: null }));
  dispatch(setFilter({ key: "endDate", value: null }));

  if (filterKey === "categories") {
    dispatch(setCategories([]));
    dispatch(setFilter({ key: "genres", value: [] }));
  }

  if (filterKey === "languages") {
    dispatch(setLanguages([]));
    dispatch(setFilter({ key: "languages", value: [] }));
  }

  if (filterKey === "dates") {
    dispatch(setDates([]));
    dispatch(setFilter({ key: "datePresets", value: [] }));
  }

  if (filterKey === "prices") {
    dispatch(setPrices([]));
    dispatch(setFilter({ key: "priceGroups", value: [] }));
  }

  // ✅ Clear ke baad events dobara fetch karo
  dispatch(listEventsBySearch());
};


  // Calendar close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        setShowCalendar(false);
      }
    };

    if (showCalendar) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCalendar]);

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const params: Record<string, string> = {};

    if (selectedCategories.length > 0) {
      params.categories = selectedCategories.join(",");
    }

    if (selectedLanguage.length > 0) {
      params.languages = selectedLanguage.join(",");
    }

    if (selectedDates.length > 0) {
      params.dates = selectedDates.join(",");
    }

    if (selectedPrice.length > 0) {
      params.price = selectedPrice.join(",");
    }

    setSearchParams(params);
  }, [
    selectedCategories,
    selectedLanguage,
    setSearchParams,
    searchParams,
    selectedDates,
    selectedPrice,
  ]);



  // ✅ Yaha automatic API call jab dono date select ho jaye
  useEffect(() => {
    if (startDate && endDate) {
      dispatch(listEventsBySearch());
    }
  }, [startDate, endDate, dispatch]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div
        className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
            {title === "Date" && (
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            )}
            {title === "Languages" && (
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
            )}
            {title === "Categories" && (
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            )}
            {title === "Price" && (
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            )}
          </div>
          <span className="font-semibold text-gray-900 text-base">{title}</span>
        </div>

        <div className="flex items-center gap-2">
          {selectedFilters.length > 0 && (
            <span className="bg-blue-100 text-blue-600 text-xs font-medium px-2 py-1 rounded-full">
              {selectedFilters.length}
            </span>
          )}
          <button
            className="text-sm font-medium text-gray-600 hover:text-red-500 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              handleClear();
            }}
          >
            Clear
          </button>
          <svg 
            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Options */}
      {open && (
        <div className="px-4 pb-4 border-t border-gray-100">
          <div className="pt-4 flex flex-wrap gap-2">
            {options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleOptionClick(opt)}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  selectedFilters.includes(opt)
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                    : "bg-gray-100 text-gray-800 hover:bg-blue-50 hover:text-blue-600 hover:shadow-md"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Calendar */}
      {showCalendar && (
        <div className="mt-3 " ref={calendarRef}>
          <DatePicker
            selected={startDate ? new Date(startDate) : null}
            onChange={(dates) => {
              const [start, end] = dates as [Date | null, Date | null];

              if (start) {
                const formattedStart = formatLocalDate(start);
                dispatch(setStartDate(formattedStart));
                dispatch(
                  setFilter({ key: "startDate", value: formattedStart })
                );
              } else {
                dispatch(setStartDate(null));
                dispatch(setFilter({ key: "startDate", value: null }));
              }

              if (end) {
                const formattedEnd = formatLocalDate(end);
                dispatch(setEndDate(formattedEnd));
                dispatch(setFilter({ key: "endDate", value: formattedEnd }));
              } else {
                dispatch(setEndDate(null));
                dispatch(setFilter({ key: "endDate", value: null }));
              }


              if (start && end && !selectedDates.includes("Date Range")) {
                dispatch(
                  setDates([
                    ...selectedDates.filter((d) => d !== "Date Range"),
                    "Date Range",
                  ])
                );
              }
            }}
            startDate={startDate ? new Date(startDate) : null}
            endDate={endDate ? new Date(endDate) : null}
            selectsRange
            inline
          />
        </div>
      )}
    </div>
  );
};

// FILTER PANEL COMPONENT
export default function FilterPanel() {
  const [openMobileFilters, setOpenMobileFilters] = useState(false);

  const categoryOptions: string[] = [
    "CONCERT",
    "SPORTS",
    "THEATRE",
    "COMEDY",
    "EXHIBITION",
    "FESTIVAL",
    "WORKSHOP",
    "OTHER",
  ];

  const dateOptions: string[] = [
    "TODAY",
    "TOMORROW",
    "WEEKEND",
    "DATE RANGE",
  ];

  const languageOptions: string[] = ["English"];

  const priceOptions: string[] = ["0 - 500", "501 - 2000", "Above 2000"];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:block space-y-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Filters</h2>
          </div>

          <div className="space-y-4">
            <FilterItem title="Date" options={dateOptions} filterKey="dates" />
            <FilterItem title="Languages" options={languageOptions} filterKey="languages" />
            <FilterItem title="Categories" options={categoryOptions} filterKey="categories" />
            <FilterItem title="Price" options={priceOptions} filterKey="prices" />
          </div>
        </div>

        {/* Featured Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-3">Featured</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
                </svg>
              </div>
              <div>
                <div className="font-medium text-gray-900 text-sm">Trending Events</div>
                <div className="text-xs text-gray-500">Most popular this week</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="font-medium text-gray-900 text-sm">Last Minute</div>
                <div className="text-xs text-gray-500">Events starting soon</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filters */}
      <div className="md:hidden">
        {openMobileFilters && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setOpenMobileFilters(false)}
          />
        )}

        <div
          className={`fixed top-0 right-0 h-full w-4/5 max-w-sm bg-white shadow-2xl z-50 transform transition-transform duration-300 ${
            openMobileFilters ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold">Filters</h2>
            </div>
            <button 
              onClick={() => setOpenMobileFilters(false)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <IoClose size={24} />
            </button>
          </div>
          
          <div className="p-6 space-y-4 overflow-y-auto h-full">
            <FilterItem title="Date" options={dateOptions} filterKey="dates" />
            <FilterItem title="Languages" options={languageOptions} filterKey="languages" />
            <FilterItem title="Categories" options={categoryOptions} filterKey="categories" />
            <FilterItem title="Price" options={priceOptions} filterKey="prices" />
          </div>
        </div>
      </div>
    </>
  );
}
