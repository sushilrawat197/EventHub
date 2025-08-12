import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";

// ✅ Define correct types
interface EventCardProps {
  title: string;
  options: string[];
}

// ✅ Single filter item
const FilterItem = ({ title, options }: EventCardProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white p-4 rounded-md shadow-sm mb-4">
      {/* Header */}
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-2 font-medium text-gray-800">
          <FiChevronDown
            className={`transition-transform duration-300 ${
              open ? "rotate-180 text-sky-500" : ""
            }`}
          />
          <span className={open ? "text-sky-500" : ""}>{title}</span>
        </div>
        <button className="text-sm text-sky-600 hover:underline">Clear</button>
      </div>

      {/* Body */}
      {open && (
        <div className="mt-3 flex flex-wrap gap-2 text-sm">
          {options.map((opt, idx) => (
            <button
              key={idx}
              className="px-3 py-1 border rounded text-gray-700 hover:bg-sky-50 hover:text-sky-500"
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ✅ Filter panel using FilterItem
export default function FilterPanel() {
  const dateOptions: string[] = [
    "Today",
    "Tomorrow",
    "This Weekend",
    "Date Range",
  ];

  const languageOptions: string[] = ["English"];
  const categoryOptions: string[] = [
    "Kids Events",
    "Comedy Shows",
    "Festivals",
    "Music Concerts",
    "Cultural Events",
    "Sports Events",
    "Theater and Performing Arts",
    "Corporate Conferences and Workshops",
  ];
  const priceOptions: string[] = [
    "Free",
    "0 - 500",
    "501 - 2000",
    "Above 2000",
  ];

  return (
    <div className="bg-white p-4 rounded-md w-[90%] flex-shrink-0 mt-5 hidden md:block ">
      <h2 className="text-2xl font-bold mb-4">Filters</h2>

      <FilterItem title="Date" options={dateOptions} />
      <FilterItem title="Languages" options={languageOptions} />
      <FilterItem title="Categories" options={categoryOptions} />
      <FilterItem title="Price" options={priceOptions} />

      <button className="w-full mt-3 py-2 border border-sky-400 text-sky-500 rounded-md font-medium hover:bg-sky-50 transition">
        Browse by Venues
      </button>
    </div>
  );
}
