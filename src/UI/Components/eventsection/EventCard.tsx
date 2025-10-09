import { useState } from "react";
import { FaCalendarAlt, FaMapMarkerAlt, FaTicketAlt } from "react-icons/fa";
import type { EventResponseBySearch } from "../../../interfaces/eventInterface/evnetInterFace";

interface EventCardProps {
  event: EventResponseBySearch;
}

export default function EventCard({ event }: EventCardProps) {
  const [imgLoaded, setImgLoaded] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      day: date.getDate().toString().padStart(2, '0'),
      month: date.toLocaleDateString("en-US", { month: "short" }),
      weekday: date.toLocaleDateString("en-US", { weekday: "short" })
    };
  };

  const dateInfo = formatDate(event.startDate);

  return (
    <div className="group w-full h-full bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200 hover:-translate-y-1 flex flex-col">
      {/* Image Section */}
      <div className="relative w-full aspect-[3/4] overflow-hidden flex-shrink-0">
        {/* Skeleton Loader */}
        {!imgLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200 animate-pulse" />
        )}

        {/* Event Image */}
        <img
          src={event.thumbnailUrl}
          alt={event.eventName}
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${
            imgLoaded ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />


        {/* Genre Badge */}
        <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
          {event.genre}
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <FaTicketAlt className="inline mr-2" />
            Book Now
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 flex-grow flex flex-col">
        {/* Event Title */}
        <h3 className="font-bold text-lg text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {event.eventName}
        </h3>

        {/* Event Details - Compressed */}
        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <div className="flex items-center">
            <FaCalendarAlt className="w-4 h-4 mr-2 text-blue-500" />
            <span>{event.language}</span>
          </div>
          
          <div className="flex items-center">
            <FaMapMarkerAlt className="w-4 h-4 mr-2 text-blue-500" />
            <span className="truncate">{event.venueName}</span>
          </div>
        </div>

        {/* Price and Date Section */}
        <div className="flex items-center justify-between mt-auto">
          <div>
            <span className="text-sm text-gray-500">Starting from</span>
            <div className="text-lg font-bold text-gray-900">
              M{event.price} Onwards
            </div>
          </div>
          
          {/* Date Badge */}
          <div className="bg-gray-100 text-gray-900 px-3 py-2 rounded-lg text-sm font-medium text-center">
            <div className="font-bold text-base">{dateInfo.day}</div>
            <div className="text-xs">{dateInfo.month}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
