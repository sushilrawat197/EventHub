import React, { useState } from "react";
import { FaAngleDown } from "react-icons/fa6";
import { FaChevronUp } from "react-icons/fa";

export default function VenueSelection({ venues }) {
  const [openCity, setOpenCity] = useState(null);

  const toggleCity = (city) => {
    setOpenCity(openCity === city ? null : city);
  };

  return (
    <div className="max-w-3xl mx-auto   ">
      <h2 className="text-lg font-semibold mb-3 ">Select Venue</h2>

      {venues.map((city, idx) => (
        <div
          key={idx}
          className="mb-3 border-2 border-sky-500 rounded-lg overflow-hidden shadow-sm  "
        >
          {/* City Header */}
          <button
            className="w-full flex justify-between items-center px-3 py-4 text-left font-medium  hover:bg-gray-100   "
            onClick={() => toggleCity(city.city)}
          >
            <span>{city.city}</span>
            <span>
              {openCity === city.city ? <FaChevronUp /> : <FaAngleDown />}
            </span>
          </button>

          {/* Venues under city */}
          {openCity === city.city && (
            <div className="bg-white divide-y">
              {city.venues.map((venue, vIdx) => (
                <div key={vIdx} className="p-4">
                  <h3 className="font-semibold text-gray-800">{venue.name}</h3>
                  <p className="text-sm text-gray-600">
                    {venue.date}{" "}
                    {venue.status === "fast" && (
                      <span className="text-orange-500 ml-2">Fast Filling</span>
                    )}
                  </p>
                  <button className="mt-3 px-4 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm font-medium">
                    Know more
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
