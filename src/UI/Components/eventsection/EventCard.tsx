import { useState } from "react";

interface EventType {
  image: string;
  promoted: boolean;
  date: string;
  title: string;
  venue: string;
  category: string;
  price: number;
}

interface EventCardProps {
  event: EventType;
}

export default function EventCard({ event }: EventCardProps) {
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <div className="w-full rounded-xl shadow-lg bg-white flex-shrink-0 overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Image Section */}
      <div className="relative group">
        {/* Skeleton Loader */}
        {!imgLoaded && (
          <div className="w-full aspect-[3/4] bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse" />
        )}

        {/* Event Image */}
        <img
          src={event.image}
          alt={event.title}
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
          className={`w-full aspect-[3/4] object-cover transition-all duration-500 group-hover:scale-105 ${
            imgLoaded ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Promoted Tag */}
        {event.promoted && (
          <span className="absolute top-2 right-2 bg-red-500/70 backdrop-blur-sm text-white text-xs font-semibold px-2 py-1 rounded-md shadow">
            PROMOTED
          </span>
        )}
      </div>

      {/* Date */}
      <div className="bg-black text-white text-[10px] px-3 py-1 font-medium tracking-wide">
        {event.date}
      </div>

      {/* Info Section */}
      <div className="p-4 space-y-1">
        <h3 className="font-semibold text-sm leading-tight line-clamp-2">{event.title}</h3>
        <p className="text-xs text-gray-600 truncate">{event.venue}</p>
        <p className="text-xs text-gray-500">{event.category}</p>
        <p className="text-sm text-gray-900 font-bold">
          M - ₹{event.price} onwards
        </p>
      </div>
    </div>
  );
}
