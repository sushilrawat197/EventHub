import { IoClose } from "react-icons/io5";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { useAppDispatch, useAppSelector } from "../../../reducers/hooks";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {
  setCategories,
  setDates,
  setEndDate,
  setLanguages,
  setPrices,
  setStartDate,
} from "../../../slices/filterSlice";

interface MobileFiltersProps {
  onClose: () => void;
}

export default function MobileFilters({ onClose }: MobileFiltersProps) {
  const dispatch = useAppDispatch();
  const categories = useAppSelector((state) => state.events.categories);

  const selectedCategories = useAppSelector((state) => state.filter.categories);
  const selectedLanguages = useAppSelector((state) => state.filter.languages);
  const selectedDates = useAppSelector((state) => state.filter.dates);
  const selectedPrices = useAppSelector((state) => state.filter.prices);
  const startDate = useAppSelector((state) => state.filter.startDate);
  const endDate = useAppSelector((state) => state.filter.endDate);

  const [showCalendar, setShowCalendar] = useState(false);

  interface FilterItem {
    label: string;
    right?: React.ReactNode;
  }

  const filterSections: {
    title: string;
    key: string;
    items: FilterItem[];
  }[] = [
    {
      title: "Date",
      key: "dates",
      items: [
        { label: "Today" },
        { label: "Tomorrow" },
        { label: "This Weekend" },
        {
          label: "Date Range",
          right: (
            <span className="flex items-center text-red-500 text-[10px] ">
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
      items: categories.map((cat) => ({
        label: cat,
      })),
    },
    {
      title: "Price",
      key: "prices",
      items: [
        { label: "Free" },
        { label: "0 - 500" },
        { label: "501 - 2000" },
        { label: "Above 2000" },
      ],
    },
  ];

  const handleSelect = (sectionKey: string, value: string) => {
    if (sectionKey === "categories") {
      const newFilters = selectedCategories.includes(value)
        ? selectedCategories.filter((c) => c !== value)
        : [...selectedCategories, value];
      dispatch(setCategories(newFilters));
    }
    if (sectionKey === "languages") {
      const newFilters = selectedLanguages.includes(value)
        ? selectedLanguages.filter((c) => c !== value)
        : [...selectedLanguages, value];
      dispatch(setLanguages(newFilters));
    }
    if (sectionKey === "dates") {
      if (value === "Date Range") {
        setShowCalendar(true); // 📌 Fullscreen calendar open
      }
      const newFilters = selectedDates.includes(value)
        ? selectedDates.filter((c) => c !== value)
        : [...selectedDates, value];
      dispatch(setDates(newFilters));
    }
    if (sectionKey === "prices") {
      const newFilters = selectedPrices.includes(value)
        ? selectedPrices.filter((c) => c !== value)
        : [...selectedPrices, value];
      dispatch(setPrices(newFilters));
    }
  };

  console.log("Start Date End Date",startDate,endDate)

  return (
    <>
      {/* Main Filters Panel */}
      <div className="fixed inset-0 bg-white z-50 flex flex-col md:hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <IoClose className="text-2xl cursor-pointer" onClick={onClose} />
          <h2 className="text-lg font-semibold">Filters</h2>
          <span className="w-6" />
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          {filterSections.map((section, idx) => (
            <div key={idx}>
              <h3 className="bg-gray-200 text-[15px] font-semibold px-3 py-2">
                {section.title}
              </h3>

              <div className="text-[12px]">
                {section.items.map((item, i) => {
                  const isSelected =
                    (section.key === "categories" &&
                      selectedCategories.includes(item.label)) ||
                    (section.key === "languages" &&
                      selectedLanguages.includes(item.label)) ||
                    (section.key === "dates" &&
                      selectedDates.includes(item.label)) ||
                    (section.key === "prices" &&
                      selectedPrices.includes(item.label));

                  return (
                    <div
                      key={i}
                      onClick={() => handleSelect(section.key, item.label)}
                      className={`px-4 py-3 flex justify-between items-center border-b border-gray-200 last:border-b-0 cursor-pointer ${
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

        {/* Apply Button */}
        <div className="p-2 border-t border-gray-200">
          <button
            className="w-full py-2 bg-sky-500 text-white rounded-md font-extrabold"
            onClick={onClose}
          >
            Apply
          </button>
        </div>
      </div>

      {/* 📌 Fullscreen Calendar Overlay */}
      {showCalendar && (
        <div className="fixed inset-0 z-[60] flex flex-col  backdrop-blur-sm">
          {/* Calendar Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <IoClose
              className="text-2xl cursor-pointer"
              onClick={() => setShowCalendar(false)}
            />
            <h2 className="text-lg font-semibold">Select Date Range</h2>
            <button
              className="text-red-500 font-medium"
              onClick={() => setShowCalendar(false)}
            >
              Cancel
            </button>
          </div>

          {/* Calendar Body */}
          <div className="flex-1 flex justify-center items-center">
            <DatePicker
              selected={startDate ? new Date(startDate) : null}
              onChange={(dates) => {
                const [start, end] = dates as [Date | null, Date | null];

                if (start) {
                  dispatch(setStartDate(start.toISOString().split("T")[0]));
                } else {
                  dispatch(setStartDate(null));
                }

                if (end) {
                  dispatch(setEndDate(end.toISOString().split("T")[0]));
                } else {
                  dispatch(setEndDate(null));
                }

                if (start && end) {
                  if (!selectedDates.includes("Date Range")) {
                    dispatch(setDates([...selectedDates, "Date Range"]));
                  }
                  setShowCalendar(false); // Close overlay after selecting range
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
