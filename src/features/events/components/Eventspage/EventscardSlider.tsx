import { memo, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import type { EventResponseBySearch } from "../../types/evnetInterFace";

interface EventscardSliderProps {
  events: EventResponseBySearch[];
}

function formatGenre(genre?: string) {
  if (!genre) return "Event";
  return genre.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function eventPath(event: EventResponseBySearch) {
  const slug = event.eventName
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");
  return `/events/${slug}/${event.eventId}`;
}

const RelatedEventCard = memo(function RelatedEventCard({
  event,
  onOpen,
}: {
  event: EventResponseBySearch;
  onOpen: () => void;
}) {
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
      className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
    >
      <div className="relative aspect-[4/5] w-full shrink-0 overflow-hidden bg-gray-100">
        {!imgLoaded && <div className="absolute inset-0 animate-pulse bg-gray-200" />}
        <img
          src={event.thumbnailUrl || event.posterUrl}
          alt={event.eventName}
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
          className={cn(
            "absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-300",
            imgLoaded ? "opacity-100" : "opacity-0"
          )}
        />
        <span
          className={cn(
            "absolute right-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white shadow-sm",
            event.eventSoldOut ? "bg-red-500" : "bg-blue-600"
          )}
        >
          {event.eventSoldOut ? "Sold out" : formatGenre(event.genre)}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-3">
        <p className="mb-1 text-[11px] font-medium text-gray-500">
          {event.dateDisplay}
        </p>
        <h3 className="mb-2 line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-snug text-gray-900 group-hover:text-blue-700">
          {event.eventName}
        </h3>
        <p className="mt-auto flex items-start gap-1 text-xs text-gray-600">
          <MapPin className="mt-0.5 size-3 shrink-0 text-blue-500" aria-hidden />
          <span className="line-clamp-1">{event.venueName}</span>
        </p>
      </div>
    </article>
  );
});

function EventscardSlider({ events = [] }: EventscardSliderProps) {
  const navigate = useNavigate();

  if (events.length === 0) return null;

  const showNav = events.length > 3;

  return (
    <div className="w-full overflow-hidden">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-gray-900">You May Also Like</h2>
        <p className="mt-1 text-sm text-gray-600">Similar events you might enjoy</p>
      </div>

      <Carousel opts={{ align: "start", loop: false }} className="w-full">
        <CarouselContent className="-ml-3 items-stretch">
          {events.map((event) => (
            <CarouselItem
              key={event.eventId}
              className="basis-[85%] pl-3 sm:basis-1/2 lg:basis-1/3"
            >
              <RelatedEventCard
                event={event}
                onOpen={() =>
                  navigate(eventPath(event), {
                    state: event,
                    replace: true,
                  })
                }
              />
            </CarouselItem>
          ))}
        </CarouselContent>

        {showNav && (
          <>
            <CarouselPrevious className="left-0 z-10 size-9 border-gray-200 bg-white text-gray-700 shadow-md hover:bg-gray-50 sm:-left-4" />
            <CarouselNext className="right-0 z-10 size-9 border-gray-200 bg-white text-gray-700 shadow-md hover:bg-gray-50 sm:-right-4" />
          </>
        )}
      </Carousel>
    </div>
  );
}

export default memo(EventscardSlider);
