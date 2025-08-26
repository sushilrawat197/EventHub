import {
  FaCalendarAlt,
  FaClock,
  FaUser,
  FaMapMarkerAlt,
  FaUsers,
} from "react-icons/fa";
import { MdOutlineTranslate } from "react-icons/md";
import { LuTickets } from "react-icons/lu";
import { useLocation, useNavigate } from "react-router-dom";

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
  buttonLabel?: string;
  onButtonClick?: () => void;
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
  const details = [
    { icon: <FaCalendarAlt />, text: date },
    { icon: <FaClock />, text: time },
    { icon: <LuTickets />, text: duration },
    { icon: <FaUsers />, text: `Age Limit - ${ageLimit}` },
    { icon: <MdOutlineTranslate />, text: languages },
    { icon: <FaUser />, text: category },
    { icon: <FaMapMarkerAlt />, text: venue },
  ];

 const navigate = useNavigate();
  const location = useLocation();
  
  return (
    <div className=" shadow-sky-500 rounded-xl w-full max-w-sm  bg-white space-y-4 lg:hidden">
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
      {/* Price & Button */}
      <div className="lg:hidden flex justify-between items-center py-3 border-t border-sky-300 fixed bottom-0 left-0 right-0 bg-white w-full px-4 z-40">
        <div className="flex flex-col">
          <p className="text-lg font-bold">M-{price} onwards</p>
          {priceNote && <p className="text-xs text-red-500">{priceNote}</p>}
        </div>

        <button
          onClick={() =>
            navigate(`${location.pathname}/booking`)
          }
          className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-md text-sm font-bold"
        >
          Book Now
        </button>
      </div>
    </div>
  );
}
