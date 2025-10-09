import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { useAppDispatch, useAppSelector } from "../../../../reducers/hooks";
import { cancelBooking } from "../../../../services/operations/ticketCategory";
import { useEffect } from "react";

export default function BookingFlow() {
  const { contentName, eventId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const bookingId = useAppSelector(
    (state) => state.reserveTicket.booking?.bookingId);

  const path = location.pathname;
  let step = 1;
  if (path.includes("datetime")) step = 2;
  if (path.includes("ticket")) step = 3;
  if (path.includes("reviewandpay")) step = 4;

  const steps = [
    { number: 1, title: "Venue", active: step >= 1, completed: step > 1 },
    { number: 2, title: "Date & Time", active: step >= 2, completed: step > 2 },
    { number: 3, title: "Ticket", active: step >= 3, completed: step > 3 },
    { number: 4, title: "Review & Pay", active: step >= 4, completed: false },
  ];

  async function backHandler() {
    if (bookingId) {
      const res = dispatch(cancelBooking(bookingId));
      if ((await res).success) {
        navigate(`/events/${contentName}/${eventId}/booking/ticket`, {
          replace: true,
        });
      }
    }
  }


useEffect(() => {
  const handlePopState = () => {
    navigate(location.pathname, { replace: true });
  };

  window.addEventListener("popstate", handlePopState);

  return () => {
    window.removeEventListener("popstate", handlePopState);
  };
}, [location.pathname, navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Back button */}

            {path.includes("payment") && (
              <button
                onClick={backHandler}
                className="pr-3 text-xl sm:text-2xl gap-2 flex items-center text-blue-500 font-bold justify-center"
              >
                <IoIosArrowBack size={20} className="text-blue-500"/> Back To Ticket
              </button>
            )}

            {/* Logo / Title */}
            <div className="text-blue-600 text-lg sm:text-2xl font-bold">
              {path.includes("payment") ? (
                ""
              ) : (
                <NavLink to={"/events"} className="hover:text-blue-700 transition-colors flex items-center gap-2 group">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span>MyTag</span>
                </NavLink>
              )}
            </div>

            {/* Event Name - Centered */}
            {
              path.includes("payment")?(null):(
                  <div className="flex-1 flex items-center justify-center">
              <h1 className="text-base sm:text-xl font-bold text-gray-800 capitalize truncate">
                {contentName}
              </h1>
            </div>

              )

            }
          

          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
          {path.includes("payment") ? (
            <p className="text-lg sm:text-2xl font-semibold text-black text-center">
              Payment & Order summary
            </p>
          ) : (
            <div className="flex flex-wrap sm:flex-nowrap items-center justify-center gap-3 sm:gap-0">
              {steps.map((stepItem, idx) => (
                <div key={idx} className="flex items-center">
                  {/* Step circle */}
                  <div
                    className={`flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full text-xs sm:text-sm font-semibold ${
                      stepItem.completed
                        ? "bg-gray-900 text-white"
                        : stepItem.active
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {stepItem.completed ? "✓" : stepItem.number}
                  </div>

                  {/* Step Title */}
                  <span
                    className={`ml-2 text-xs sm:text-sm font-medium ${
                      stepItem.active ? "text-gray-800" : "text-gray-500"
                    }`}
                  >
                    {stepItem.title}
                  </span>

                  {/* Connector line */}
                  {idx < steps.length - 1 && (
                    <div
                      className={`hidden sm:block w-12 h-0.5 mx-4 ${
                        stepItem.completed ? "bg-sky-500" : "bg-gray-200"
                      }`}
                    ></div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <Outlet />
      </div>
    </div>
  );
}
