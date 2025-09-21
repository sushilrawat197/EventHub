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
    <div className="bg-white p-4 rounded-md shadow-sm mb-4">
      {/* Header */}
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-2 font-medium text-gray-800">
          <span>{title}</span>
        </div>

        <button
          className="text-sm text-sky-600 hover:underline"
          onClick={(e) => {
            e.stopPropagation();
            handleClear();
          }}
        >
          Clear
        </button>
      </div>

      {/* Options */}
      {open && (
        <div className="mt-3 flex flex-wrap gap-2 text-sm">
          {options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleOptionClick(opt)}
              className={`px-3 py-1 border rounded text-gray-700 hover:bg-sky-50 hover:text-sky-500 ${
                selectedFilters.includes(opt)
                  ? "bg-sky-100 text-sky-600 border-sky-300"
                  : ""
              }`}
            >
              {opt}
            </button>
          ))}
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
    "FESTIVA",
    "WORKSHOP",
    "OTHER",
  ];

  const dateOptions: string[] = [
    "Today",
    "Tomorrow",
    "This Weekend",
    "Date Range",
  ];

  const languageOptions: string[] = ["English", "Hindi"];

  const priceOptions: string[] = ["0 - 500", "501 - 2000", "Above 2000"];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:block bg-white p-4 rounded-md w-[90%] flex-shrink-0 mt-5">
        <h2 className="text-2xl font-bold mb-4">Filters</h2>

        <FilterItem title="Date" options={dateOptions} filterKey="dates" />

        <FilterItem
          title="Languages"
          options={languageOptions}
          filterKey="languages"
        />
        <FilterItem
          title="Categories"
          options={categoryOptions}
          filterKey="categories"
        />
        <FilterItem title="Price" options={priceOptions} filterKey="prices" />

        {/* <button className="w-full mt-3 py-2 border border-sky-400 text-sky-500 rounded-md font-medium hover:bg-sky-50 transition">
          Browse by Venues
        </button> */}
      </div>

      {/* Mobile Filters */}
      <div className="md:hidden">
        {openMobileFilters && (
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setOpenMobileFilters(false)}
          />
        )}

        <div
          className={`fixed top-0 right-0 h-full w-4/5 max-w-sm bg-white shadow-lg z-50 transform transition-transform duration-300 ${
            openMobileFilters ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-lg font-semibold">Filters</h2>
            <button onClick={() => setOpenMobileFilters(false)}>
              <IoClose size={24} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
