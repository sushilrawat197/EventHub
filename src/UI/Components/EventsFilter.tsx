import React from "react";

const EventsFilter: React.FC = () => {
  return (
    <div className="bg-sky-300 p-4 md:p-6 rounded-2xl shadow-lg">
      <div className="flex flex-col lg:flex-row flex-wrap gap-4">
        {[
          {
            label: "Category",
            options: ["Music", "Sports", "Theatre"],
          },
          {
            label: "State",
            options: ["Delhi", "Mumbai", "Bangalore"],
          },
          {
            label: "City",
            options: ["Noida", "Pune", "Chennai"],
          },
          {
            label: "Venue",
            options: ["Stadium 1", "Open Air Arena", "Community Hall"],
          },
        ].map(({ label, options }) => (
          <select
            key={label}
            className="flex-1  bg-white text-black text-base px-4 py-2.5 rounded-xl focus:outline-none"
            title="Filter"
          >
            <option>{label}</option>
            {options.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        ))}

        <button className="bg-sky-500 text-white text-sm font-semibold px-6 py-2.5 rounded-xl hover:bg-sky-300 transition ">
          Search Event
        </button>
      </div>
    </div>
  );
};

export default EventsFilter;
