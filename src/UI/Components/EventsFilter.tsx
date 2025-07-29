import React from "react";

const EventsFilter: React.FC = () => {
  return (
    <div className="bg-sky-500  md:p-4 rounded-lg shadow-lg  ">
      <div className="flex flex-col lg:flex-row flex-wrap gap-8   rounded-lg  p-3 ">
        {[
          {
            label: "Category",
            options: ["Music", "Sports", "Theatre"],
          },
          {
            label: "State",
            options: ["Berea", "Butha-Buthe", "Leribe"],
          },
          {
            label: "City",
            options: ["Maseru", "Teyateyaneng", "Hlotse"],
          },
          {
            label: "Venue",
            options: ["Stadium 1", "Open Air Arena", "Community Hall"],
          },
        ].map(({ label, options }) => (
          <select
            key={label}
            className="flex-1  bg-white text-base px-3 py-2 rounded-lg focus:outline-none   "
            title="Select "
          >
            <option className="bg-sky-500 text-white "> {label}</option>
            {options.map((option) => (
              <option className="  " key={option}>
                {option}
              </option>
            ))}
          </select>
        ))}

        <button className="bg-sky-600 text-white text-sm font-semibold px-6 py-2.5 rounded-lg  hover:bg-sky-300 transition cursor-pointer">
          Search Event
        </button>
      </div>
    </div>
  );
};

export default EventsFilter;
