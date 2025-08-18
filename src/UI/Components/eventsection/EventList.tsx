import EventCard from "./EventCard";
import { FaFilter } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import MobileFilters from "./MobileFilter";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const events = [
  {
    id: 1,
    image: "Events1.jpg",
    promoted: true,
    date: "Sun, 7 Aug",
    title: "Maheep Singh Live - A Standup Comedy Show",
    venue: "The Laugh Store: DLF Mall",
    category: "Stand up Comedy",
    price: 799,
  },
  {
    id: 2,
    image: "Events2.jpg",
    promoted: true,
    date: "Wed, 6 Aug onwards",
    title: "Best of Stand-up - Stand-up Comedy Show",
    venue: "Laughter Nation Comedy...",
    category: "Stand up Comedy",
    price: 299,
  },
  {
    id: 3,
    image: "Events8.jpg",
    promoted: false,
    date: "Fri, 3 Aug onwards",
    title: "Samay Raina - Still Alive & Unfiltered",
    venue: "Plenary Hall Bharat...",
    category: "Stand up Comedy",
    price: 999,
  },
  {
    id: 4,
    image: "Fastivalpng (3).jpg",
    promoted: false,
    date: "Wed, 6 Aug onwards",
    title: "Van Gogh - An Immersive Story",
    venue: "DLF Promenade Mall,...",
    category: "Antiques",
    price: 800,
  },
  {
    id: 5,
    image: "Fastivalpng (1).jpg",
    promoted: false,
    date: "Wed, 6 Aug onwards",
    title: "Van Gogh - An Immersive Story",
    venue: "DLF Promenade Mall,...",
    category: "Antiques",
    price: 800,
  },
  {
    id: 6,
    image: "Events4.jpg",
    promoted: false,
    date: "Wed, 6 Aug onwards",
    title: "Van Gogh - An Immersive Story",
    venue: "DLF Promenade Mall,...",
    category: "Antiques",
    price: 800,
  },
  {
    id: 7,
    image: "Events1.jpg",
    promoted: false,
    date: "Wed, 6 Aug onwards",
    title: "Van Gogh - An Immersive Story",
    venue: "DLF Promenade Mall,...",
    category: "Antiques",
    price: 800,
  },
  {
    id: 8,
    image: "Events3.jpg",
    promoted: false,
    date: "Fri, 1 Oct onwards",
    title: "Samay Raina - Still Alive & Unfiltered",
    venue: "Plenary Hall Bharat...",
    category: "Stand up Comedy",
    price: 999,
  },
];

export default function EventList() {
  const [openFilter, setOpenFilter] = useState(false);

  const navigate = useNavigate();

  return (
    <div className=" py-4  ">
      <h2 className="text-2xl font-bold mb-4">Events In Lesotho</h2>
      {/* Filters  */}
      <div className=" overflow-x-auto md:overflow-visible scrollbar-hide">
        <div className="flex  md:flex-wrap   flex-nowrap    space-x-4 mb-6  gap-2 cursor-pointer  ">
          {[
            "Kids Events",
            "Comedy Shows",
            "Festivals",
            " Music Concerts",
            "Cultural Events",
            "Sports Events",
            "Theater and Performing Arts",
            "Corporate Conferences and Workshops",
            // "Screening",
            // "Award shows",
            // "Spirituality",
            // "Talks",
          ].map((tag, i) => (
            <span
              key={i}
              className="min-w-max border border-gray-200 text-base px-3 py-1 rounded-full text-sky-500 hover:text-black   "
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-4  gap-4 py-2  shadow   ">
        {events.map((event) => (
          <button
            key={event.id}
            onClick={() => navigate(`/events/${event.id}`, { state: event })}
          >
            <EventCard event={event} />
          </button>
        ))}
      </div>

      {openFilter && <MobileFilters onClose={() => setOpenFilter(false)} />}

      <div className="flex justify-between   items-center fixed bottom-0 left-0 right-0  p-2  md:hidden ">
        {!openFilter && (
          <button onClick={() => setOpenFilter(true)}>
            <span className=" p-4 bg-red-500 text-white rounded-full  block md:hidden">
              <FaFilter size={22} />
            </span>
          </button>
        )}

        <span className="p-4 bg-sky-500 text-white rounded-full  block md:hidden">
          <FaLocationDot size={22} />
        </span>
      </div>
    </div>
  );
}
