import { useState, useRef, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { IoClose } from "react-icons/io5";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { useAppSelector, useAppDispatch } from "../../../reducers/hooks";
import {
  setCategories,
  setDates,
  setEndDate,
  setLanguages,
  setPrices,
  setStartDate,
} from "../../../slices/filterSlice";
import { setFilter } from "../../../slices/filter_Slice";
import { listEventsBySearch } from "../../../services/operations/eventsApi";

interface MobileFiltersProps {
  onClose: () => void;
}

export default function MobileFilters({ onClose }: MobileFiltersProps) {
  const dispatch = useAppDispatch();

  // Redux state
  const selectedCategories = useAppSelector((state) => state.filter.categories);
  const selectedLanguages = useAppSelector((state) => state.filter.languages);
  const selectedDates = useAppSelector((state) => state.filter.dates);
  const selectedPrices = useAppSelector((state) => state.filter.prices);
  const startDate = useAppSelector((state) => state.filter.startDate);
  const endDate = useAppSelector((state) => state.filter.endDate);

  // Local state
  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  const categoryOptions = [
    "CONCERT",
    "SPORTS",
    "THEATRE",
    "COMEDY",
    "EXHIBITION",
    "FESTIVA",
    "WORKSHOP",
    "OTHER",
  ];

  const filterSections = [
    {
      title: "Date",
      key: "dates",
      items: [
        { label: "Today" },
        { label: "Tomorrow" },
        { label: "Weekend" },
        {
          label: "Date Range",
          right: (
            <span className="flex items-center text-red-500 text-[10px]">
              Select Date <MdOutlineKeyboardArrowRight size={25} />
            </span>
          ),
        },
      ],
    },
    {
      title: "Languages",
      key: "languages",
      items: [{ label: "English" }, { label: "Hindi" }],
    },
    {
      title: "Categories",
      key: "categories",
      items: categoryOptions.map((cat) => ({ label: cat })),
    },
    {
      title: "Price",
      key: "prices",
      items: [
        { label: "0 - 500" },
        { label: "501 - 2000" },
        { label: "Above 2000" },
      ],
    },
  ];

  const handleSelect = (sectionKey: string, value: string) => {
    let newFilters;

    if (sectionKey === "categories") {
      newFilters = selectedCategories.includes(value)
        ? selectedCategories.filter((c) => c !== value)
        : [...selectedCategories, value];
      dispatch(setCategories(newFilters));
      dispatch(setFilter({ key: "genres", value: newFilters }));
    }

    if (sectionKey === "languages") {
      newFilters = selectedLanguages.includes(value)
        ? selectedLanguages.filter((c) => c !== value)
        : [...selectedLanguages, value];
      dispatch(setLanguages(newFilters));
      dispatch(setFilter({ key: "languages", value: newFilters }));
    }

    if (sectionKey === "dates") {
      if (value === "Date Range") {
        setShowCalendar(true);
        return;
      }
      newFilters = selectedDates.includes(value)
        ? selectedDates.filter((d) => d !== value)
        : [...selectedDates, value];
      dispatch(setDates(newFilters));
      dispatch(setFilter({ key: "datePresets", value: newFilters }));
    }

    if (sectionKey === "prices") {
      newFilters = selectedPrices.includes(value)
        ? selectedPrices.filter((p) => p !== value)
        : [...selectedPrices, value];

      const mapped = newFilters.map((f) => {
        if (f === "0 - 500") return { min: 0, max: 500 };
        if (f === "501 - 2000") return { min: 501, max: 2000 };
        if (f === "Above 2000") return { min: 2001, max: Number.MAX_SAFE_INTEGER };
        return { min: 0, max: Number.MAX_SAFE_INTEGER };
      });

      dispatch(setPrices(newFilters));
      dispatch(setFilter({ key: "priceGroups", value: mapped }));
    }

    // Automatic API call except for Date Range
    if (value !== "Date Range") dispatch(listEventsBySearch());
  };

  const handleClear = (sectionKey?: string) => {
    if (!sectionKey || sectionKey === "categories") {
      dispatch(setCategories([]));
      dispatch(setFilter({ key: "genres", value: [] }));
    }
    if (!sectionKey || sectionKey === "languages") {
      dispatch(setLanguages([]));
      dispatch(setFilter({ key: "languages", value: [] }));
    }
    if (!sectionKey || sectionKey === "dates") {
      dispatch(setDates([]));
      dispatch(setStartDate(null));
      dispatch(setEndDate(null));
      dispatch(setFilter({ key: "datePresets", value: [] }));
      dispatch(setFilter({ key: "startDate", value: null }));
      dispatch(setFilter({ key: "endDate", value: null }));
      setShowCalendar(false);
    }
    if (!sectionKey || sectionKey === "prices") {
      dispatch(setPrices([]));
      dispatch(setFilter({ key: "priceGroups", value: [] }));
    }

    dispatch(listEventsBySearch());
  };

  // Close calendar on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setShowCalendar(false);
      }
    };
    if (showCalendar) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showCalendar]);

  // API call when date range selected
  useEffect(() => {
    if (startDate && endDate) {
      dispatch(listEventsBySearch());
    }
  }, [startDate, endDate, dispatch]);

  const formatLocalDate = (date: Date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

  return (
    <>
      {/* Main Filter Panel */}
      <div className="fixed inset-0 bg-white z-50 flex flex-col md:hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <IoClose className="text-2xl cursor-pointer" onClick={onClose} />
          <h2 className="text-lg font-semibold">Filters</h2>
          <button className="text-red-500 font-medium" onClick={() => handleClear()}>
            Clear All
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filterSections.map((section, idx) => (
            <div key={idx}>
              <h3 className="bg-gray-200 px-3 py-2 font-semibold text-[14px]">{section.title}</h3>
              <div>
                {section.items.map((item, i) => {
                  const isSelected =
                    (section.key === "categories" && selectedCategories.includes(item.label)) ||
                    (section.key === "languages" && selectedLanguages.includes(item.label)) ||
                    (section.key === "dates" && selectedDates.includes(item.label)) ||
                    (section.key === "prices" && selectedPrices.includes(item.label));

                  return (
                    <div
                      key={i}
                      onClick={() => handleSelect(section.key, item.label)}
                      className={`px-4 py-3 flex justify-between items-center border-b last:border-b-0 cursor-pointer ${
                        isSelected ? "bg-sky-100 text-sky-600 font-medium" : ""
                      }`}
                    >
                      <span>{item.label}</span>
                      {item.right && item.right}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="p-2 border-t border-gray-200">
          <button className="w-full py-2 bg-sky-500 text-white rounded-md font-extrabold" onClick={onClose}>
            Apply
          </button>
        </div>
      </div>

      {/* Fullscreen Calendar Overlay */}
      {showCalendar && (
        <div className="fixed inset-0 z-[60] flex flex-col backdrop-blur-sm">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <IoClose className="text-2xl cursor-pointer" onClick={() => setShowCalendar(false)} />
            <h2 className="text-lg font-semibold">Select Date Range</h2>
            <button className="text-red-500 font-medium" onClick={() => setShowCalendar(false)}>
              Cancel
            </button>
          </div>

          <div className="flex-1 flex justify-center items-center" ref={calendarRef}>
            <DatePicker
              selected={startDate ? new Date(startDate) : null}
              onChange={(dates) => {
                const [start, end] = dates as [Date | null, Date | null];
                if (start) {
                  dispatch(setStartDate(formatLocalDate(start)));
                  dispatch(setFilter({ key: "startDate", value: formatLocalDate(start) }));
                } else {
                  dispatch(setStartDate(null));
                  dispatch(setFilter({ key: "startDate", value: null }));
                }
                if (end) {
                  dispatch(setEndDate(formatLocalDate(end)));
                  dispatch(setFilter({ key: "endDate", value: formatLocalDate(end) }));
                } else {
                  dispatch(setEndDate(null));
                  dispatch(setFilter({ key: "endDate", value: null }));
                }
                if (start && end && !selectedDates.includes("Date Range")) {
                  dispatch(setDates([...selectedDates, "Date Range"]));
                }
              }}
              startDate={startDate ? new Date(startDate) : null}
              endDate={endDate ? new Date(endDate) : null}
              selectsRange
              inline
            />
          </div>
        </div>
      )}
    </>
  );
}
