import { useState } from "react";
import { FaAngleDown } from "react-icons/fa6";
import { FaChevronUp } from "react-icons/fa";

type VenueDetails = {
  name: string;
  date: string;
  status: string;
};

type Venue = {
  city: string;
  venues: VenueDetails[];
};

interface VenueData {
  venues: Venue[];
  onNext: () => void;
}

export default function VenueSelection({ venues = [], onNext }: VenueData) {
  const [openCity, setOpenCity] = useState<string | null>(null);

  const toggleCity = (city: string) => {
    setOpenCity(openCity === city ? null : city);
    
  };

  return (
    <div className="max-w-xl mx-auto">
      <h2 className="text-lg font-semibold mb-3">Select Venue</h2>

      {venues.map((elemets, idx) => (
        <div
          key={idx}
          className="mb-3 border-2 border-sky-500 rounded-lg overflow-hidden shadow-sm"
        >
          <button
            className="w-full flex justify-between items-center px-3 py-4 text-left font-medium hover:bg-gray-100"
            onClick={() => toggleCity(elemets.city)}
            aria-expanded={openCity === elemets.city}

          >
            <span>{elemets.city}</span>
            <span>
              {openCity === elemets.city ? <FaChevronUp /> : <FaAngleDown />}
            </span>
          </button>

          {openCity === elemets.city && (
            <div className="bg-white divide-y">

              {elemets.venues.map((venue, vIdx) => (
                <div key={vIdx} className="p-4" onClick={()=>onNext()}>
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
