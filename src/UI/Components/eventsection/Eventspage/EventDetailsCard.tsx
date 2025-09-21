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
  const details = [
    { icon: <FaCalendarAlt />, text: date },

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

  // console.log('PRINTING CONTEND_ID : ',contentId)
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  // console.log(contentId);

  const { eventId } = useParams();

  const shows = useAppSelector((state) => state.shows.data);

  const uniqueVenues = Array.from(
    new Map(shows.map((s) => [s.venueId, s])).values()
  );

  const uniqueDates = Array.from(new Set(shows.map((s) => s.showDate)));

  console.log("Unique Dates:", uniqueDates);

 async function bookHandler() {
  if (eventId) {
    // API call result wait karo
    const result = await dispatch(checkEventAvailability(eventId));



    if (result?.soldOut) {
      alert("This event's tickets are sold out");
      return; // flow stop
    }
  }

  // Agar eventSoldOut nahi tha to ye hamesha chalega
  if (uniqueVenues.length > 1) {
    navigate(`${location.pathname}/booking/venue`);
  } else {
    navigate(`${location.pathname}/booking/datetime`);
  }
}


  return (
    <div className="border-2 border-sky-500 shadow-sm shadow-sky-500 rounded-xl p-4 w-full max-w-sm  bg-white space-y-4">
      {/* Details List */}
      <div className="space-y-4">
        {details.map((item, idx) => (
          <div key={idx} className="flex items-center gap-4 text-gray-900">
            <span className="text-lg text-sky-500">{item.icon}</span>
            <span className="text-lg">{item.text}</span>
          </div>
        ))}
      </div>

      {/* Booking Alert */}
      {bookingAlert && (
        <div className="bg-yellow-50 text-sm border border-yellow-200 px-3 py-2 rounded-md flex items-center gap-2">
          <span>⚠️</span> {bookingAlert}
        </div>
      )}

      {/* Price & Button */}
      <div className="flex items-center justify-between pt-3 border-t border-sky-300 ">
        <div>
          <p className=" text-lg font-bold">M-{price} onwards</p>
          {priceNote && <p className="text-xs text-red-500">{priceNote}</p>}
        </div>

        <button
          onClick={bookHandler}
          className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-md text-sm font-bold"
        >
          Book
        </button>
      </div>
    </div>
  );
}
