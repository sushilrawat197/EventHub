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
import { useAppDispatch, useAppSelector } from "../../../../reducers/hooks";
import { checkEventAvailability } from "../../../../services/operations/eventsApi";
import { setTicketInfo } from "../../../../slices/ticketInfoSlice";
import { setEventsErrorMsg } from "../../../../slices/eventSlice";
import { useMemo } from "react";
import EventsErrorPage from "../EventErrorsd";

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
  // const [showCard, setShowCard] = useState(false);

  // ------------------ MEMOIZE DETAILS ARRAY ------------------
  const details = useMemo(() => {
    return [
      ...(date ? [{ icon: <FaCalendarAlt />, text: date }] : []),
      ...(time ? [{ icon: <FaClock />, text: time }] : []),
      { icon: <LuTickets />, text: duration || "Duration not available" },
      {
        icon: <FaUsers />,
        text: ageLimit ? `Age Limit - ${ageLimit}` : "All Ages",
      },
      { icon: <MdOutlineTranslate />, text: languages?.join(", ") || "N/A" },
      { icon: <FaUser />, text: category || "N/A" },
      ...(venue ? [{ icon: <FaMapMarkerAlt />, text: venue }] : []),
    ];
  }, [date, time, duration, ageLimit, languages, category, venue]);

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { eventId } = useParams();

  const [loading, setLoading] = useState(false);

  const shows = useAppSelector((state) => state.shows.data);

  // ------------------ MEMOIZED UNIQUE SHOWS ------------------
  const uniqueShows = useMemo(() => {
    return Array.from(
      new Map(shows.map((s) => [`${s.eventId}-${s.venueId}`, s])).values()
    );
  }, [shows]);

  // ------------------ BOOK HANDLER (NO CHANGE) ------------------

  async function bookHandler() {
    if (loading) return; // ⛔ prevent double click

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

      // One show case
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
      // 🔓 ensure loading resets in all cases
      setLoading(false);
    }
  }

  // ------------------ MEMOIZED SKELETON ------------------
  // const skeleton = useMemo(() => {
  //   return (
  //     <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden animate-pulse h-96 lg:h-[28rem] flex flex-col">
  //       <div className="p-3 space-y-2 flex-1 flex flex-col">
  //         <div className="h-3 bg-gray-200 rounded w-2/3"></div>
  //         <div className="h-3 bg-gray-200 rounded w-1/2"></div>
  //         <div className="h-3 bg-gray-200 rounded w-1/4"></div>
  //         <div className="h-3 bg-gray-200 rounded w-3/4"></div>
  //         <div className="h-3 bg-gray-200 rounded w-1/3"></div>
  //         <div className="h-6 bg-gray-200 rounded w-full mt-2"></div>
  //       </div>
  //     </div>
  //   );
  // }, []);

  // useEffect(() => {
  //   if (shows?.length > 0) {
  //     setShowCard(true);
  //   }
  // }, [shows]);

  //   if (!showCard) return skeleton;

  return (
    <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden h-96 lg:h-[28rem] flex flex-col">
      <EventsErrorPage />

      <div className="pt-2 pb-3 px-3 space-y-2 flex-1 flex flex-col">
        <div className="space-y-1.5 flex-1">
          {details.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-sm">{item.icon}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">
                  {item.text}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-2 border border-green-100 flex-1">
            <div className="text-center">
              <p className="text-lg font-bold text-green-600">M{price}</p>
              {priceNote && <p className="text-xs text-red-500">{priceNote}</p>}
            </div>
          </div>

          <button
            onClick={bookHandler}
            disabled={loading}
            className={`py-3 px-6 rounded-lg font-bold text-sm shadow-lg transition-all duration-300
    flex items-center justify-center gap-2
    ${
      loading
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl transform hover:scale-105 text-white"
    }`}
          >
            {loading ? (
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
    </div>
  );
}

// ⭐ Performance Boost: prevents re-renders unless props change
export default React.memo(EventDetailsCard);
