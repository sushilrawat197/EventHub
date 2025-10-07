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
import EventsErrorPage from "../EventErrorsd";
import { useEffect, useState } from "react";


export interface EventDetailsCardProps {
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
  buttonLabel?: string;
  city?: string[];
  onButtonClick?: () => void;
}

export default function EventDetailsCard({
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

  const details = [

    ...(date?[{ icon: <FaCalendarAlt />, text: date }]:[]),
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

  // Debug: Log the details to see what's being passed
  console.log("EventDetailsCard - All details:", details);


  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { eventId } = useParams();


  const shows = useAppSelector((state) => state.shows.data);


  const uniqueShows = Array.from(
    new Map(shows.map((s) => [`${s.eventId}-${s.venueId}`, s])).values()
  );


  async function bookHandler() {
    if (eventId) {
      const result = await dispatch(checkEventAvailability(eventId));
      if (result?.soldOut) {
        dispatch(setEventsErrorMsg("All tickets are sold out for this event"));
        return;
      }
    }

    if (uniqueShows.length > 1) {
      navigate(`${location.pathname}/booking/venue`);
    } else {
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
  }

  
  // ⏳ 1 sec delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCard(true);
    }, 700);
    return () => clearTimeout(timer);
  }, []);


    if (!showCard) {
    return (
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden animate-pulse h-96 lg:h-[28rem] flex flex-col">
        <div className="p-3 space-y-2 flex-1 flex flex-col">
          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/4"></div>
          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/3"></div>
          <div className="h-6 bg-gray-200 rounded w-full mt-2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden h-96 lg:h-[28rem] flex flex-col">
      {/* Content - Reduced Top Padding with Flex Layout */}
      <div className="pt-2 pb-3 px-3 space-y-2 flex-1 flex flex-col">
        {/* Event Details - Balanced Padding */}
        <div className="space-y-1.5 flex-1">
          {details.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-sm">{item.icon}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">{item.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Price and Book Now Button - Side by Side */}
        <div className="flex items-center gap-3">
          {/* Price - Left Side */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-2 border border-green-100 flex-1">
            <div className="text-center">
              <p className="text-lg font-bold text-green-600">M{price}</p>
              {priceNote && <p className="text-xs text-red-500">{priceNote}</p>}
            </div>
          </div>

          {/* Book Now Button - Right Side */}
          <button
            onClick={bookHandler}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 px-6 rounded-lg font-bold text-sm shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <LuTickets className="text-sm" />
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}
