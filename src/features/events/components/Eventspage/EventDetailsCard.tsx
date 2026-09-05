import React, { useState } from "react"; // ✅ FIX
import {
  FaCalendarAlt,
  FaClock,
  FaUser,
  FaMapMarkerAlt,
  FaUsers,
} from "react-icons/fa";
import { MdOutlineTranslate } from "react-icons/md";
import { LuTickets } from "react-icons/lu";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../app/store/hooks";
import { checkEventAvailability } from "../../services/events.service";
import { setTicketInfo } from "../../../booking/store/ticketInfoSlice";
import { setEventsErrorMsg } from "../../store/eventSlice";
import { useMemo } from "react";
import EventsErrorPage from "../EventErrorsd";
import VenueDetailsPopup from "./VenueDetailsPopup";
// TODO: TEMP EVENT-39 FLOW - remove this import and gate check later.


export interface EventDetailsCardProps {
  date?: string;
  time?: string;
  duration?: string;
  ageLimit?: number;
  languages?: string[];
  category?: string;
  venue?: string;
  price?: number;
  priceNote?: string;
}

function EventDetailsCard({
  date,
  time,
  duration,
  ageLimit,
  languages,
  category,
  venue,
  price,
  priceNote,
}: EventDetailsCardProps) {
  const details = useMemo(() => {
    const langText = languages?.filter(Boolean).join(", ");
    return [
      ...(date ? [{ icon: <FaCalendarAlt />, text: date }] : []),
      ...(time ? [{ icon: <FaClock />, text: time }] : []),
      ...(duration
        ? [{ icon: <LuTickets />, text: duration }]
        : []),
      {
        icon: <FaUsers />,
        text: ageLimit ? `Age Limit - ${ageLimit}` : "All Ages",
      },
      ...(langText
        ? [{ icon: <MdOutlineTranslate />, text: langText }]
        : []),
      ...(category ? [{ icon: <FaUser />, text: category }] : []),
    ];
  }, [date, time, duration, ageLimit, languages, category]);

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { eventId } = useParams();

  const [loading, setLoading] = useState(false);
  const [venuePopupOpen, setVenuePopupOpen] = useState(false);

  const shows = useAppSelector((state) => state.shows.data);
  const showsLoading = useAppSelector((state) => state.shows.loading);
  const isSoldOut = !showsLoading && shows.length === 0;

  // ------------------ MEMOIZED UNIQUE SHOWS ------------------
  const uniqueShows = useMemo(() => {
    return Array.from(
      new Map(shows.map((s) => [`${s.eventId}-${s.venueId}`, s])).values()
    );
  }, [shows]);

  const uniqueVenues = useMemo(
    () =>
      Array.from(
        new Map(
          shows.map((s) => [
            s.venueId,
            { venueId: s.venueId, venueName: s.venueName },
          ])
        ).values()
      ),
    [shows]
  );

  const canViewVenue = uniqueVenues.length > 0;

  async function bookHandler() {
    if (loading || isSoldOut || showsLoading) return;

    try {
      setLoading(true);

      if (eventId) {
        const result = await dispatch(checkEventAvailability(eventId));
        if (result?.soldOut) {
          dispatch(
            setEventsErrorMsg("All tickets are sold out for this event")
          );
          return;
        }
      }

      if (uniqueShows.length > 1) {
        navigate(`${location.pathname}/booking/venue`);
        return;
      }

      const currentShow = uniqueShows[0];
      const showSchedules = shows.filter(
        (s) =>
          s.eventId === currentShow.eventId && s.venueId === currentShow.venueId
      );

      const uniqueDateTimes = Array.from(
        new Set(
          showSchedules.map((s) => `${s.showDate}-${s.startTime}-${s.endTime}`)
        )
      );

      if (uniqueDateTimes.length === 1) {
        const selectedShow = showSchedules[0];
        const ticketData = {
          venueId: selectedShow.venueId,
          showId: selectedShow.showId,
        };

        dispatch(setTicketInfo(ticketData));
        localStorage.setItem("ticketInfo", JSON.stringify(ticketData));
        localStorage.setItem("dairectnavigate", "singleD&T");

        navigate(`${location.pathname}/booking/ticket`);
      } else {
        const venueId = currentShow?.venueId;
        if (!venueId) {
          window.alert("Event Expired");
          return;
        }

        const ticketData = { venueId: currentShow.venueId };
        dispatch(setTicketInfo(ticketData));
        localStorage.setItem("ticketInfo", JSON.stringify(ticketData));

        navigate(`${location.pathname}/booking/datetime`);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col">
      <EventsErrorPage />

      <div className="pt-2 pb-3 px-3 space-y-2 flex flex-col">
        <div className="space-y-1.5">
          {details.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                <span className="text-blue-600 text-sm">{item.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900">
                  {item.text}
                </p>
              </div>
            </div>
          ))}

          {(venue || canViewVenue) && (
            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
              <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                <span className="text-blue-600 text-sm">
                  <FaMapMarkerAlt />
                </span>
              </div>
              <div className="flex-1 min-w-0">
                {venue ? (
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {venue}
                  </p>
                ) : null}
                {canViewVenue ? (
                  <button
                    type="button"
                    onClick={() => setVenuePopupOpen(true)}
                    className="mt-0.5 text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    View venue details
                  </button>
                ) : null}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 shrink-0 pt-0.5">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-2 border border-green-100 flex-1">
            <div className="text-center">
              <p className="text-lg font-bold text-green-600">
                {price != null ? `M${price}` : "—"}
              </p>
              {priceNote && <p className="text-xs text-red-500">{priceNote}</p>}
            </div>
          </div>

          <button
            onClick={bookHandler}
            disabled={loading || isSoldOut || showsLoading}
            className={`py-3 px-6 rounded-lg font-bold text-sm shadow-lg transition-all duration-300
                        flex items-center justify-center gap-2
                        ${
                          isSoldOut
                            ? "bg-red-500 cursor-not-allowed text-white"
                            : loading || showsLoading
                              ? "bg-gray-400 cursor-not-allowed text-white"
                              : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl transform hover:scale-105 text-white"
                        }`}
          >
            {isSoldOut ? (
              "Sold out"
            ) : loading || showsLoading ? (
              <>
                <svg
                  className="w-4 h-4 animate-spin text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
                Processing…
              </>
            ) : (
              <>
                <LuTickets className="text-sm" />
                Book Now
              </>
            )}
          </button>
        </div>
      </div>

      <VenueDetailsPopup
        open={venuePopupOpen}
        onOpenChange={setVenuePopupOpen}
        venues={uniqueVenues}
      />
    </div>
  );
}

export default React.memo(EventDetailsCard);
