import { memo, useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useAppDispatch, useAppSelector } from "../../../app/store/hooks";
import {
  setCategories,
  setDates,
  setEndDate,
  setLanguages,
  setPrices,
  setStartDate,
} from "../store/filterSlice";
import { setFilter } from "../store/filter_Slice";
import {
  formatFilterLabel,
  formatLocalDate,
  mapPriceLabelsToGroups,
} from "../utils/filterOptions";

export interface FilterItemProps {
  title: string;
  options: string[];
  filterKey: "categories" | "languages" | "dates" | "prices";
}

/**
 * Subscribes only to the slice it needs so changing Categories
 * does not re-render Languages / Price panels.
 */
function FilterItemComponent({ title, options, filterKey }: FilterItemProps) {
  const dispatch = useAppDispatch();
  const selectedFilters = useAppSelector((state) => state.filter[filterKey]);
  const startDate = useAppSelector((state) =>
    filterKey === "dates" ? state.filter.startDate : null
  );
  const endDate = useAppSelector((state) =>
    filterKey === "dates" ? state.filter.endDate : null
  );

  const [open, setOpen] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);
  const [showCalendar, setShowCalendar] = useState(false);

  const handleOptionClick = (opt: string) => {
    if (opt === "DATE RANGE") {
      setShowCalendar(true);
    }

    let newFilters: string[];

    if (selectedFilters.includes(opt)) {
      newFilters = selectedFilters.filter((f) => f !== opt);
    } else {
      newFilters = [...selectedFilters, opt];
    }

    if (filterKey === "categories") {
      dispatch(setCategories(newFilters));
      dispatch(setFilter({ key: "categories", value: newFilters }));
    }

    if (filterKey === "languages") {
      dispatch(setLanguages(newFilters));
      dispatch(setFilter({ key: "languages", value: newFilters }));
    }

    if (filterKey === "dates") {
      if (newFilters.includes("DATE RANGE")) {
        return;
      }
      dispatch(setDates(newFilters));
      dispatch(setFilter({ key: "datePresets", value: newFilters }));
    }

    if (filterKey === "prices") {
      dispatch(setPrices(newFilters));
      dispatch(setFilter({ key: "priceGroups", value: mapPriceLabelsToGroups(newFilters) }));
    }
  };

  const handleClear = () => {
    setShowCalendar(false);

    dispatch(setStartDate(null));
    dispatch(setEndDate(null));
    dispatch(setFilter({ key: "startDate", value: null }));
    dispatch(setFilter({ key: "endDate", value: null }));

    if (filterKey === "categories") {
      dispatch(setCategories([]));
      dispatch(setFilter({ key: "categories", value: [] }));
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
  };

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

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div
        className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
            {title === "Date" && (
              <svg
                className="w-4 h-4 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            )}
            {title === "Languages" && (
              <svg
                className="w-4 h-4 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                />
              </svg>
            )}
            {title === "Categories" && (
              <svg
                className="w-4 h-4 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            )}
            {title === "Price" && (
              <span className="w-4 h-4 text-blue-600 font-bold text-sm flex items-center justify-center">
                M
              </span>
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
            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {open && (
        <div className="px-4 pb-4 border-t border-gray-100">
          <div className="pt-4 flex flex-wrap gap-2">
            {options.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => handleOptionClick(opt)}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  selectedFilters.includes(opt)
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                    : "bg-gray-100 text-gray-800 hover:bg-blue-50 hover:text-blue-600 hover:shadow-md"
                }`}
              >
                {formatFilterLabel(opt)}
              </button>
            ))}
          </div>
        </div>
      )}

      {showCalendar && filterKey === "dates" && (
        <div className="mt-3 " ref={calendarRef}>
          <DatePicker
            selected={startDate ? new Date(startDate) : null}
            onChange={(dates) => {
              const [start, end] = dates as [Date | null, Date | null];

              if (start) {
                const formattedStart = formatLocalDate(start);
                dispatch(setStartDate(formattedStart));
                dispatch(setFilter({ key: "startDate", value: formattedStart }));
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

              if (start && end && !selectedFilters.includes("DATE RANGE")) {
                dispatch(
                  setDates([
                    ...selectedFilters.filter((d) => d !== "DATE RANGE"),
                    "DATE RANGE",
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
}

export const FilterItem = memo(FilterItemComponent);
