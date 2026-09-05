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
import { useAppSelector, useAppDispatch } from "../../../../app/store/hooks";
import { checkEventAvailability } from "../../services/events.service";
import { setTicketInfo } from "../../../booking/store/ticketInfoSlice";
import { setEventsErrorMsg } from "../../store/eventSlice";
import { useEffect, useState } from "react";
// import VenueDetailsPopup from "./VenueDetailsPopup";


interface EventDetailsCardProps {
  date?: string;
  time?: string;
  duration?: string;
  ageLimit?: number;
  languages?: string[];
  category?: string;
  venue?: string;
  bookingAlert?: string;
  price?: number;
  priceNote?: string;
}

export default function MobileEventDetailsCard({
  date,
  time,
  duration,
  ageLimit,
  languages,
  category,
  venue,
  bookingAlert,
  price,
  priceNote,
}: EventDetailsCardProps) {
  const [showCard, setShowCard] = useState(false);
  const [loading, setLoading] = useState(false);
  // const [venuePopupOpen, setVenuePopupOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { eventId } = useParams();

  const shows = useAppSelector((state) => state.shows.data);
  const showsLoading = useAppSelector((state) => state.shows.loading);
  const isSoldOut = !showsLoading && shows.length === 0;

  // const uniqueVenues = useMemo(
  //   () =>
  //     Array.from(
  //       new Map(
  //         shows.map((s) => [
  //           s.venueId,
  //           { venueId: s.venueId, venueName: s.venueName },
  //         ])
  //       ).values()
  //     ),
  //   [shows]
  // );
  // const canViewVenue = uniqueVenues.length > 0;

  useEffect(() => {
    setShowCard(false);
  }, [eventId]);

  useEffect(() => {
    const hasListPreview =
      Boolean((date ?? "").trim()) && Boolean((venue ?? "").trim());
    const hasShows = Boolean(shows?.length);
    if (hasShows || hasListPreview) {
      setShowCard(true);
    }
  }, [date, time, venue, shows]);

  if (!showCard) {
    return (
      <div className="animate-pulse bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden p-6 space-y-4">
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        <div className="h-10 bg-gray-200 rounded w-full mt-4"></div>
      </div>
    );
  }

  const langText = languages?.filter(Boolean).join(", ");
  const details = [
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

  const bookHandler = async () => {
    if (loading || isSoldOut || showsLoading || !shows?.length) return;
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

      const uniqueShows = Array.from(
        new Map(shows.map((s) => [`${s.eventId}-${s.venueId}`, s])).values()
      );

      if (uniqueShows.length > 1) {
        navigate(`${location.pathname}/booking/venue`);
      } else {
        const currentShow = uniqueShows[0];
        const showSchedules = shows.filter(
          (s) =>
            s.eventId === currentShow.eventId &&
            s.venueId === currentShow.venueId
        );

        const uniqueDateTimes = Array.from(
          new Set(
            showSchedules.map(
              (s) => `${s.showDate}-${s.startTime}-${s.endTime}`
            )
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
          const ticketData = {
            venueId: currentShow.venueId,
          };
          dispatch(setTicketInfo(ticketData));
          localStorage.setItem("ticketInfo", JSON.stringify(ticketData));
          navigate(`${location.pathname}/booking/datetime`);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lg:hidden bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden mb-24">
      <div className="space-y-2 p-4">
        {details.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
              <span className="text-blue-600 text-sm">{item.icon}</span>
            </div>
            <span className="text-sm font-semibold text-gray-900">
              {item.text}
            </span>
          </div>
        ))}

        {venue && (
          <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
            <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
              <span className="text-blue-600 text-sm">
                <FaMapMarkerAlt />
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-gray-900">{venue}</p>
              {/* TODO: re-enable View venue details
              {canViewVenue ? (
                <button
                  type="button"
                  onClick={() => setVenuePopupOpen(true)}
                  className="mt-0.5 text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline"
                >
                  View venue details
                </button>
              ) : null}
              */}
            </div>
          </div>
        )}
      </div>

      {bookingAlert && (
        <div className="bg-yellow-50 text-sm border border-yellow-200 px-3 py-2 rounded-md flex items-center gap-2 mx-4 mb-4">
          <span>⚠️</span> {bookingAlert}
        </div>
      )}

      <div className="flex justify-between items-center py-3 border-t border-gray-200 fixed bottom-0 left-0 right-0 bg-white w-full px-4 z-40 shadow-lg">
        <div className="flex flex-col">
          <p className="text-lg font-bold text-green-600">
            {price != null ? `M${price}` : "—"}
          </p>
          {priceNote && <p className="text-xs text-red-500">{priceNote}</p>}
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

      {/* TODO: re-enable venue details popup
      <VenueDetailsPopup
        open={venuePopupOpen}
        onOpenChange={setVenuePopupOpen}
        venues={uniqueVenues}
      />
      */}
    </div>
  );
}
