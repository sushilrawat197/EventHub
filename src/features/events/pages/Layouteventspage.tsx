
import EventHeroCard from "../components/Eventspage/EventHeroCard";
import EventDetailsCard from "../components/Eventspage/EventDetailsCard";
import EventDescriptionAndArtists from "../components/Eventspage/EventDescriptionAndArtists";
import TermsAndConditions from "../components/Eventspage/TermsAndConditions";
import EventscardSlider from "../components/Eventspage/EventscardSlider";
import MobileEventDetailsCard from "../components/Eventspage/MobileEventDetails";
import { useLocation, useParams } from "react-router-dom";
import type { EventResponseBySearch } from "../types/evnetInterFace";
import { useAppDispatch, useAppSelector } from "../../../app/store/hooks";
import { useEffect, useMemo } from "react";
import { checkEventAvailability } from "../services/events.service";
import SpinnerLoading from "../../../shared/components/common/SpinnerLoading";
import {
  fetchFilteredShows,
  listAllShowsByEvent,
} from "../services/shows.service";
import { clearSetShows } from "../store/showSlice";
import { useEvent } from "../hooks/useEvent";
import { useEventsSearch } from "../hooks/useEventsSearch";

function formatPreviewDateRange(p: EventResponseBySearch): string {
  if (p.dateDisplay?.trim()) return p.dateDisplay;
  if (!p.startDate) return "";
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-US", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  const start = new Date(p.startDate);
  const end = p.endDate ? new Date(p.endDate) : start;
  return start.getTime() === end.getTime()
    ? fmt(start)
    : `${fmt(start)} - ${fmt(end)}`;
}

export default function Layouteventspage() {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { eventId } = useParams<{ eventId: string }>();
  const searchFilters = useAppSelector((state) => state.searchFilter);

  const navPreview = useMemo((): EventResponseBySearch | undefined => {
    const s = location.state as EventResponseBySearch | undefined;
    if (s && String(s.eventId) === eventId) return s;
    return undefined;
  }, [location.state, eventId]);

  const event = navPreview;

  const { data: singleEvent, isLoading: eventLoading } = useEvent(eventId);
  const { data: eventsPage } = useEventsSearch(searchFilters);
  const shows = useAppSelector((state) => state.shows.data);

  const formattedDates = useMemo(() => {
    const dates = shows.map((e) => new Date(e.showDate));
    if (!dates.length) return "";

    dates.sort((a, b) => a.getTime() - b.getTime());

    const start = dates[0];
    const end = dates[dates.length - 1];

    const fmt = (d: Date) =>
      d.toLocaleDateString("en-US", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

    return start.getTime() === end.getTime()
      ? fmt(start)
      : `${fmt(start)} - ${fmt(end)}`;
  }, [shows]);

  const formattedTime = useMemo(() => {
    if (shows.length !== 1) return "";
    const [h, m] = shows[0].startTime.split(":");
    let hour = parseInt(h, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    if (hour > 12) hour -= 12;
    return `${hour}:${m} ${ampm}`;
  }, [shows]);

  const uniqueVenues = useMemo(() => {
    return Array.from(
      new Map(shows.map((s) => [s.venueId, s.venueName])).entries()
    ).map(([venueId, venueName]) => ({ venueId, venueName }));
  }, [shows]);

  const sliderEvents = useMemo(() => {
    const relatedEvents = eventsPage?.content ?? [];
    return relatedEvents.filter(
      (e) => e?.genre === event?.genre && String(e?.eventId) !== eventId
    );
  }, [eventsPage?.content, event?.genre, eventId]);

  const previewVenue =
    navPreview &&
    [navPreview.venueName, navPreview.city].filter(Boolean).join(", ");

  const details = useMemo(
    () => ({
      date:
        formattedDates ||
        (navPreview ? formatPreviewDateRange(navPreview) : ""),
      time: formattedTime || navPreview?.timeDisplay || "",
      duration:
        singleEvent?.durationMinutes != null
          ? `${singleEvent.durationMinutes} min`
          : "",
      ageLimit: singleEvent?.ageRestriction,
      languages:
        singleEvent?.languages?.length
          ? singleEvent.languages
          : navPreview?.language
            ? [navPreview.language]
            : [],
      category: singleEvent?.genre || navPreview?.genre,
      venue:
        uniqueVenues.map((v) => v.venueName).join(", ") ||
        previewVenue ||
        "",
      price: singleEvent?.basePrice ?? navPreview?.price,
    }),
    [
      formattedDates,
      formattedTime,
      singleEvent,
      uniqueVenues,
      navPreview,
      previewVenue,
    ]
  );

  useEffect(() => {
    if (eventId) {
      dispatch(clearSetShows());
      dispatch(listAllShowsByEvent(eventId));
      dispatch(checkEventAvailability(eventId));
      dispatch(fetchFilteredShows(eventId));
    }
  }, [eventId, dispatch]);

  const canRenderShell =
    Boolean(navPreview) ||
    (singleEvent && String(singleEvent.eventId) === eventId);

  if (eventLoading && !canRenderShell) return <SpinnerLoading />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 lg:mt-32 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="mb-3">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
            {singleEvent?.name ?? navPreview?.eventName ?? ""}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
              <EventHeroCard
                title=""
                image={
                  singleEvent?.posterUrl ?? navPreview?.posterUrl ?? null
                }
                tags={singleEvent?.genre ?? navPreview?.genre ?? ""}
              />
            </div>

            <div className="lg:hidden">
              <MobileEventDetailsCard {...details} />
            </div>

            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
              <EventDescriptionAndArtists
                shortDescription={singleEvent?.shortDescription}
                description={singleEvent?.longDescription}
                artists={singleEvent?.artists}
              />
            </div>

            {sliderEvents.length >= 1 && (
              <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
                <EventscardSlider events={sliderEvents} />
              </div>
            )}
          </div>

          <div className="lg:col-span-1 hidden lg:block">
            <div className="sticky top-32">
              <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                <EventDetailsCard {...details} />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 mb-20">
          <TermsAndConditions
            description={singleEvent?.termsAndConditions || []}
          />
        </div>
      </div>
    </div>
  );
}
