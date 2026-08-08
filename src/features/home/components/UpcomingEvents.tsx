import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { CalendarDays, MapPin, Ticket } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useEventsSearch } from "../../events/hooks/useEventsSearch";
import type { EventSearchFilters } from "../../events/store/filter_Slice";
import type { EventResponseBySearch } from "../../events/types/evnetInterFace";

const MD_BREAKPOINT = "(min-width: 768px)";

const UPCOMING_EVENTS_FILTERS: EventSearchFilters = {
  genres: [],
  languages: [],
  datePresets: [],
  venueIds: [],
  priceGroups: [],
  startDate: null,
  endDate: null,
  eventName: null,
};

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

function formatCardDate(isoDate: string) {
  const date = new Date(isoDate);
  return {
    day: date.toLocaleDateString("en-US", { day: "numeric" }),
    month: date.toLocaleDateString("en-US", { month: "short" }),
  };
}

function UpcomingEventCard({
  event,
  onOpen,
}: {
  event: EventResponseBySearch;
  onOpen: () => void;
}) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const { day, month } = formatCardDate(event.startDate);

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
      className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
    >
      <div className="relative aspect-[1/1] w-full shrink-0 overflow-hidden bg-gray-100 sm:aspect-[5/6]">
        {!imgLoaded && (
          <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200" />
        )}
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

        <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-3">
          <div className="flex min-w-[3rem] flex-col items-center rounded-xl border border-white/60 bg-white/95 px-2.5 py-1.5 text-center shadow-sm backdrop-blur-sm">
            <span className="text-[10px] font-semibold uppercase tracking-wide text-blue-600">
              {month}
            </span>
            <span className="text-lg font-bold leading-none text-gray-900">{day}</span>
          </div>
          <span
            className={cn(
              "rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white shadow-sm",
              event.eventSoldOut ? "bg-red-500" : "bg-blue-600"
            )}
          >
            {event.eventSoldOut ? "Sold out" : formatGenre(event.genre)}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-3 pt-2.5 sm:p-3.5">
        <p className="mb-1 text-[11px] font-medium text-gray-500">
          {event.dateDisplay}
          {event.timeDisplay ? ` · ${event.timeDisplay}` : ""}
        </p>

        <h3 className="mb-1.5 line-clamp-2 text-sm font-semibold leading-snug text-gray-900 transition-colors group-hover:text-blue-700 sm:text-base">
          {event.eventName}
        </h3>

        <p className="mb-2 flex items-start gap-1.5 text-xs text-gray-600 sm:text-sm">
          <MapPin className="mt-0.5 size-3.5 shrink-0 text-blue-500" aria-hidden />
          <span className="line-clamp-1">{event.venueName}</span>
        </p>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-gray-100 pt-2.5">
          <span className="text-sm font-bold text-gray-900">
            {event.priceDisplay ? `M${event.priceDisplay}` : "View pricing"}
          </span>
          <span className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-2.5 py-1.5 text-xs font-semibold text-white transition-colors group-hover:bg-blue-700">
            <Ticket className="size-3.5" aria-hidden />
            Get tickets
          </span>
        </div>
      </div>
    </article>
  );
}

function EventCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm">
      <div className="aspect-[1/1] animate-pulse bg-gray-200 sm:aspect-[5/6]" />
      <div className="space-y-2.5 p-3.5">
        <div className="h-3 w-1/3 animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-4/5 animate-pulse rounded bg-gray-200" />
        <div className="mt-2 h-9 animate-pulse rounded-lg bg-gray-200" />
      </div>
    </div>
  );
}

const UpcomingEvents = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useEventsSearch(UPCOMING_EVENTS_FILTERS);
  const events = data?.content ?? [];

  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(MD_BREAKPOINT).matches : false
  );

  useEffect(() => {
    const mq = window.matchMedia(MD_BREAKPOINT);
    const onChange = () => setIsDesktop(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const showCarouselNav = isDesktop ? events.length > 3 : events.length > 1;

  const openEvent = (event: EventResponseBySearch) => {
    navigate(eventPath(event), { state: event });
  };

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-800 via-indigo-800 to-purple-900 py-5 sm:py-6">
      <div
        className="pointer-events-none absolute -left-24 top-0 h-64 w-64 rounded-full bg-blue-600/40 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-purple-700/40 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-40 w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-700/35 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto container rounded-2xl px-4 sm:px-6 lg:px-8">
        <div className="mb-5 text-center sm:mb-6">
          <p
            className="mb-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-blue-200/80 sm:text-[11px]"
            style={{ fontFamily: "var(--font-jakarta), 'Plus Jakarta Sans', sans-serif" }}
          >
            Don&apos;t miss out
          </p>
          <h2
            className="inline-flex items-baseline gap-2 bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-4xl tracking-[0.04em] text-transparent sm:gap-2.5 sm:text-5xl"
            style={{ fontFamily: "var(--font-bebas), 'Bebas Neue', sans-serif" }}
          >
            <span>Upcoming</span>
            <span>Events</span>
          </h2>
        </div>

        <div className="relative px-1 sm:px-2">
          {isLoading && events.length === 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <EventCardSkeleton key={i} />
              ))}
            </div>
          ) : events.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white/80 px-6 py-16 text-center">
              <CalendarDays className="mx-auto mb-3 size-10 text-gray-400" aria-hidden />
              <p className="text-lg font-semibold text-gray-900">No upcoming events yet</p>
              <p className="mt-1 text-sm text-gray-600">Check back soon for new listings.</p>
            </div>
          ) : (
            <Carousel opts={{ align: "start", loop: false }} className="w-full">
              <CarouselContent className="-ml-5 items-stretch sm:-ml-6">
                {events.map((event) => (
                  <CarouselItem
                    key={event.eventId}
                    className="basis-full pl-5 sm:basis-1/2 sm:pl-6 lg:basis-1/3 xl:basis-1/4"
                  >
                    <UpcomingEventCard event={event} onOpen={() => openEvent(event)} />
                  </CarouselItem>
                ))}
              </CarouselContent>

              {showCarouselNav && (
                <>
                  <CarouselPrevious className="left-0 z-10 size-10 border-gray-200 bg-white text-gray-700 shadow-md hover:bg-gray-50 sm:-left-5" />
                  <CarouselNext className="right-0 z-10 size-10 border-gray-200 bg-white text-gray-700 shadow-md hover:bg-gray-50 sm:-right-5" />
                </>
              )}
            </Carousel>
          )}
        </div>

        {events.length > 0 && (
          <div className="mt-10 text-center sm:mt-12">
            <Link
              to="/events"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-blue-900 shadow-md transition-all hover:bg-blue-50 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            >
              View all events
              <span aria-hidden>→</span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default UpcomingEvents;
