import { useState } from "react";

import type {  EventResponseBySearch } from "../../../interfaces/eventInterface/evnetInterFace";



interface EventCardProps {
  event: EventResponseBySearch;
}


export default function EventCard({ event }: EventCardProps) {
  // const shows=useAppSelector((state)=>useState)
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-sm xl:max-w-xs rounded-xl shadow-lg bg-white flex-shrink-0 overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Image Section */}
      <div className="relative w-full aspect-[3/4]">
        {/* Skeleton Loader */}
        {!imgLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded-t-xl" />
        )}

        {/* Event Image */}
        <img
          src={event.thumbnailUrl} // 👈 yaha actual poster url use karo
          alt={event.thumbnailUrl}
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
            imgLoaded ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>

      {/* Date */}
      <div className="bg-black text-white text-[8px] sm:text-[10px] md:text-xs px-2 sm:px-3 py-1 font-medium tracking-wide">
       
        {new Date(event.startDate).toLocaleDateString("en-US", {
          weekday: "short", // Mon, Tue...
          day: "numeric", // 20
          month: "short", // Aug
        })}
      </div>

      {/* Info Section */}
      <div className="p-3 sm:p-4 space-y-1">

        <h3 className="font-semibold text-xs sm:text-sm md:text-base leading-tight line-clamp-2 truncate">
          {event.eventName}
        </h3>

        <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 truncate">
          {event.genre}
        </p>

        <p className="text-[10px] sm:text-xs md:text-sm text-gray-500">
          {event.language}
        </p>

        <p className="text-xs sm:text-sm md:text-base text-gray-900 font-bold truncate">
          M - {event.price} onwards
        </p>
      </div>
    </div>
  );
}
