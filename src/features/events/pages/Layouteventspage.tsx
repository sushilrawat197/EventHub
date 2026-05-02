
import EventHeroCard from "../components/Eventspage/EventHeroCard";
import EventDetailsCard from "../components/Eventspage/EventDetailsCard";
import EventDescriptionAndArtists from "../components/Eventspage/EventDescriptionAndArtists";
import TermsAndConditions from "../components/Eventspage/TermsAndConditions";
import EventscardSlider from "../components/Eventspage/EventscardSlider";
import MobileEventDetailsCard from "../components/Eventspage/MobileEventDetails";
import { useLocation, useParams } from "react-router-dom";
import type { Content } from "../types/eventInterface";
import { useAppDispatch, useAppSelector } from "../../../app/store/hooks";
import { useEffect, useMemo } from "react";
import {
  listEventsBySearch,
  listEventById,
  checkEventAvailability,
} from "../api/eventsApi";

import SpinnerLoading from "../../../shared/components/common/SpinnerLoading";
import { clearSingleEvent } from "../store/eventSlice";
import {
  fetchFilteredShows,
  listAllShowsByEvent,
} from "../api/showsApi";
import { clearSetShows } from "../store/showSlice";

export default function Layouteventspage() {
  const location = useLocation();
  const event = location.state as Content;
  const dispatch = useAppDispatch();
  const { eventId } = useParams<{ eventId: string }>();

  const allEvents = useAppSelector(
    (state) => state.events.allEventsBySearch?.content || []
  );
  const singleEvent = useAppSelector((state) => state.events.singleEvent);
  console.log("SINGLE EVENT....",singleEvent);
  const eventLoading = useAppSelector((state) => state.events.eventloading);
  const shows = useAppSelector((state) => state.shows.data);

  // ------------------ MEMOIZED FORMATTED DATES ------------------
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

  // ------------------ MEMOIZED TIME ------------------
  const formattedTime = useMemo(() => {
    if (shows.length !== 1) return "";
    const [h, m] = shows[0].startTime.split(":");
    let hour = parseInt(h, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    if (hour > 12) hour -= 12;
    return `${hour}:${m} ${ampm}`;
  }, [shows]);

  
  // ------------------ MEMOIZED VENUES ------------------
  const uniqueVenues = useMemo(() => {
    return Array.from(
      new Map(shows.map((s) => [s.venueId, s.venueName])).entries()
    ).map(([venueId, venueName]) => ({ venueId, venueName }));
  }, [shows]);


  // ------------------ MEMOIZED RELATED EVENTS ------------------
  const sliderEvents = useMemo(() => {
    return allEvents.filter(
      (e) => e?.genre === event?.genre && String(e?.eventId) !== eventId
    );
  }, [allEvents, event?.genre, eventId]);

  console.log("SLIDER Events....",sliderEvents);


  // ------------------ MEMOIZED DETAILS ------------------
  const details = useMemo(
    () => ({
      date: formattedDates,
      time: formattedTime,
      duration: `${singleEvent?.durationMinutes} min`,
      ageLimit: singleEvent?.ageRestriction,
      languages: singleEvent?.languages || [],
      category: singleEvent?.genre,
      venue: uniqueVenues.map((v) => v.venueName).join(", "),
      price: singleEvent?.basePrice,
    }),
    [formattedDates, formattedTime, singleEvent, uniqueVenues]
  );

  // ------------------ API CALLS ------------------
  useEffect(() => {
    if (eventId) {
      dispatch(clearSingleEvent());
      dispatch(clearSetShows());
      dispatch(listEventById(eventId));
      dispatch(listAllShowsByEvent(eventId));
      dispatch(checkEventAvailability(eventId));
      dispatch(fetchFilteredShows(eventId));
    }
  }, [eventId, dispatch]);

  useEffect(() => {
    dispatch(listEventsBySearch());
  }, [dispatch]);

  if (eventLoading) return <SpinnerLoading />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 lg:mt-32 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="mb-3">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
            {singleEvent?.name ?? ""}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
              <EventHeroCard
                title=""
                image={singleEvent?.posterUrl ?? null}
                tags={singleEvent?.genre ?? ""}
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
