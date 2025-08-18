import {
  FaCalendarAlt,
  FaClock,
  FaUser,
  FaMapMarkerAlt,
  FaUsers,
} from "react-icons/fa";
import { MdOutlineTranslate } from "react-icons/md";
import { LuTickets } from "react-icons/lu";

interface EventDetailsCardProps {
  date?: string
  time?: string
  duration?: string
  ageLimit?: string
  languages?: string[]
  category?: string
  venue?: string
  bookingAlert?: string
  price?: string
  priceNote?: string
  buttonLabel?: string
  onButtonClick?: () => void
}


export default function MobileEventDetailsCard({
  date = "17.08.2025",
  time = "20:30 PM",
  duration = "2 Hours",
  ageLimit = "18+",
  languages = ["English"],
  category = "Comedy",
  venue = "Lesotho",
  bookingAlert,
  price = "200",
  priceNote,
  buttonLabel = "Book Now",
  onButtonClick,
}:EventDetailsCardProps) {
  const details = [
    { icon: <FaCalendarAlt />, text: date },
    { icon: <FaClock />, text: time },
    { icon: <LuTickets />, text: duration },
    { icon: <FaUsers />, text: `Age Limit - ${ageLimit}` },
    { icon: <MdOutlineTranslate />, text: languages },
    { icon: <FaUser />, text: category },
    { icon: <FaMapMarkerAlt />, text: venue },
  ];

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
      <div className="lg:hidden flex justify-between py-3 border-t border-sky-300 fixed bottom-0 bg-white w-full px-3 z-40">

        <div>
          <p className=" text-lg font-bold">M-{price} onwards</p>
          {priceNote && <p className="text-xs text-red-500">{priceNote}</p>}
        </div>


        <button
          onClick={onButtonClick}
          className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-md text-sm font-bold"
        >
          {buttonLabel}
        </button>

      </div>
    </div>
  );
}
