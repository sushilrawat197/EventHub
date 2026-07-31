import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { CalendarDays, MapPin, Sparkles, Ticket } from "lucide-react";
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
      className="group flex h-full min-h-[420px] cursor-pointer flex-col overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
    >
      <div className="relative aspect-[4/5] w-full shrink-0 overflow-hidden bg-gray-100">
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

      <div className="flex flex-1 flex-col p-4 pt-3">
        <p className="mb-1.5 text-[11px] font-medium text-gray-500">
          {event.dateDisplay}
          {event.timeDisplay ? ` · ${event.timeDisplay}` : ""}
        </p>

        <h3 className="mb-2 line-clamp-2 min-h-[2.75rem] text-base font-semibold leading-snug text-gray-900 transition-colors group-hover:text-blue-700">
          {event.eventName}
        </h3>

        <p className="mb-3 flex items-start gap-1.5 text-sm text-gray-600">
          <MapPin className="mt-0.5 size-3.5 shrink-0 text-blue-500" aria-hidden />
          <span className="line-clamp-2">{event.venueName}</span>
        </p>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-gray-100 pt-3">
          <span className="text-sm font-bold text-gray-900">
            {event.priceDisplay ? `M${event.priceDisplay}` : "View pricing"}
          </span>
          <span className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition-colors group-hover:bg-blue-700">
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
    <div className="flex min-h-[420px] flex-col overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm">
      <div className="aspect-[4/5] animate-pulse bg-gray-200" />
      <div className="space-y-3 p-4">
        <div className="h-3 w-1/3 animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-4/5 animate-pulse rounded bg-gray-200" />
        <div className="mt-4 h-10 animate-pulse rounded-lg bg-gray-200" />
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
    <section className="relative overflow-hidden bg-slate-50 py-16 sm:py-20">
      <div
        className="pointer-events-none absolute -left-32 top-10 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-32 bottom-0 h-72 w-72 rounded-full bg-indigo-200/30 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center sm:mb-12">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-700 shadow-sm">
            <Sparkles className="size-3.5" aria-hidden />
            Featured events
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Upcoming Events
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-gray-600 sm:text-lg">
            Browse what&apos;s happening near you and book tickets in a few taps.
          </p>
        </div>

        <div className="relative px-1 sm:px-2">
          {isLoading && events.length === 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
              <CarouselContent className="-ml-4 items-stretch">
                {events.map((event) => (
                  <CarouselItem
                    key={event.eventId}
                    className="basis-full pl-4 sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
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
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
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
