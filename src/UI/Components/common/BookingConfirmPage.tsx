import {
  FaDownload,
  FaTicketAlt,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaCreditCard,
} from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "../../../reducers/hooks";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  downloadTicket,
  getOrderDetails,
} from "../../../services/operations/ticketCategory";
import SpinnerLoading from "./SpinnerLoading";

export default function BookingConfirmed() {
  const dispatch = useAppDispatch();
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [downloading, setDownloading] = useState(false);

  const confirmBookingDetails = useAppSelector(
    (state) => state.confirmBooking.booking
  );

  const [showPopup, setShowPopup] = useState<boolean>(false);
  const loading = useAppSelector((state) => state.confirmBooking.loading);

  const eventDate = confirmBookingDetails
    ? new Date(confirmBookingDetails.show.date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "";

  const eventTime = confirmBookingDetails
    ? new Date(
        `1970-01-01T${confirmBookingDetails.show.time}`
      ).toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    : "";

  const downloadHandler = async () => {
    try {
      setDownloading(true); // disable button + show loader
      const res = await dispatch(downloadTicket(Number(bookingId)));
      if (res.success) {
        setShowPopup(true);
      }
    } finally {
      setDownloading(false); // re-enable button
    }
  };



  useEffect(() => {
    const context = localStorage.getItem("navigateContext");
    if (context === "confirmBooking") {
      dispatch(getOrderDetails(Number(bookingId), navigate));
    }
    return () => {
      localStorage.removeItem("navigateContext");
    };
  }, [bookingId, dispatch, navigate]);

  useEffect(()=>{
    dispatch(getOrderDetails(Number(bookingId), navigate));
  },[])

  if (loading) {
    return <SpinnerLoading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col items-center p-4 sm:p-6 mt-16 lg:mt-28">
      {/* Header Confirmation */}
      <div className="w-full max-w-7xl bg-white shadow-xl rounded-xl p-4 sm:p-5 mb-4 flex items-center justify-center border border-gray-100">
        <div className="text-center">
          <div
            className={`w-8 h-8 sm:w-10 sm:h-10  ${
              confirmBookingDetails?.status === "CONFIRMED"
                ? " bg-green-500"
                : "bg-red-500"
            }   rounded-lg flex items-center justify-center mx-auto mb-2 shadow-lg`}
          >
            {confirmBookingDetails?.status === "CONFIRMED" ? (
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            )}
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
            {confirmBookingDetails?.status}
          </h1>
          <p className="text-gray-600 text-xs sm:text-sm">
            {confirmBookingDetails?.status === "CONFIRMED"
              ? "Your tickets are ready for download"
              : "Your booking has been cancelled"}
          </p>
        </div>
      </div>

      {/* ✅ Popup */}
      {showPopup && (
        <div className="fixed inset-0 backdrop-blur-2xl flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-2xl w-full max-w-md text-center border border-gray-100">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <svg
                className="w-7 h-7 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3"
                />
              </svg>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold mb-2 text-gray-900">
              Ticket Downloaded!
            </h2>
            <p className="text-gray-600 mb-6 text-sm sm:text-base">
              Your ticket has been saved to your downloads folder.
            </p>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-5 mb-6">
              <h3 className="text-base sm:text-lg font-bold mb-1 text-gray-900">
                Share Your Experience
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 mb-3">
                Your feedback helps us improve our service!
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-3 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                onClick={() => navigate("/rate-and-review")}
              >
                Give Feedback
              </button>

              <button
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-2xl font-semibold transition-all duration-300"
                onClick={() => setShowPopup(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Main Content */}
      <div className="w-full max-w-7xl flex flex-col lg:flex-row gap-6 items-stretch">
        {/* LEFT SECTION - Order Summary */}
        <div className="w-full lg:w-2/3">
          {/* Event Details Card */}
          <div className="bg-white shadow-xl rounded-2xl p-6 border border-gray-100 h-full">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Event Image */}
              <div className="relative w-full lg:w-48 h-64 lg:h-48">
                <img
                  src={confirmBookingDetails?.event.eventPoster}
                  alt="Event Poster"
                  className="w-full h-full object-cover rounded-xl shadow-lg"
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-700">
                  {confirmBookingDetails?.event.category}
                </div>
              </div>

              {/* Event Details */}
              <div className="flex-1">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="flex-1">
                    <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">
                      {confirmBookingDetails?.event.eventName}
                    </h2>
                    <p className="text-gray-600 text-sm mb-4">
                      {confirmBookingDetails?.event.eventName}
                    </p>
                  </div>

                  {confirmBookingDetails?.status === "CONFIRMED" && (
                    <button
                      onClick={!downloading ? downloadHandler : undefined}
                      disabled={downloading}
                      className={`relative justify-center  bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-semibold text-sm shadow-lg flex items-center gap-2 transition-all duration-300 transform ${
                        downloading
                          ? "opacity-60 cursor-not-allowed"
                          : "hover:from-blue-700 hover:to-blue-800 hover:shadow-xl hover:scale-105"
                      }`}
                    >
                      {downloading ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                          <span>Downloading...</span>
                        </>
                      ) : (
                        <>
                          <FaDownload className="w-4 h-4" />
                          <span>Download Tickets</span>
                        </>
                      )}

                      {/* Simple animated progress bar (optional) */}
                      {downloading && (
                        <span className="absolute bottom-0 left-0 h-[2px] bg-white animate-[progress_2s_linear_infinite] w-full"></span>
                      )}
                    </button>
                  )}
                </div>

                {/* Event Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <FaMapMarkerAlt className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-semibold text-gray-900">
                        Venue
                      </span>
                    </div>
                    <p className="text-sm font-bold text-gray-900 mb-1">
                      {confirmBookingDetails?.show.venue}
                    </p>
                    <p className="text-xs text-gray-600">
                      {confirmBookingDetails?.show.venueAddress}
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <FaCalendarAlt className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-semibold text-gray-900">
                        Date & Time
                      </span>
                    </div>
                    <p className="text-sm font-bold text-gray-900 mb-1">
                      {eventDate}
                    </p>
                    <p className="text-xs text-gray-600">{eventTime}</p>
                  </div>
                </div>

                {/* Ticket Info */}
                {confirmBookingDetails?.tickets?.length ? (
                  <div className="mt-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <FaTicketAlt className="w-4 h-4 text-purple-600" />
                      <h3 className="text-sm font-bold text-gray-900">
                        Ticket Information
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                      <div>
                        <p className="font-semibold text-gray-700 mb-1">
                          Seats
                        </p>
                        <p className="font-bold text-gray-900">
                          {confirmBookingDetails.tickets
                            .map((t) => t.seatCode)
                            .join(", ")}
                        </p>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-700 mb-1">
                          Ticket IDs
                        </p>
                        <p className="font-bold text-gray-900">
                          {confirmBookingDetails.tickets
                            .map((t) => t.ticketId)
                            .join(", ")}
                        </p>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-700 mb-1">
                          Booking No
                        </p>
                        <p className="font-bold text-gray-900">
                          {confirmBookingDetails?.bookingNo}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SECTION - Payment Summary */}
        <div className="w-full lg:w-1/3">
          {/* Payment Summary Card */}
          <div className="bg-white shadow-xl rounded-2xl p-6 border border-gray-100 h-full">
            <div className="flex items-center gap-3 mb-6">
              <FaCreditCard className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-bold text-gray-900">
                Payment Summary
              </h3>
            </div>

            <div className="space-y-4">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-700">
                    Order ID
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    #{confirmBookingDetails?.orderNo}
                  </span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-700">
                    Payment Status
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    {confirmBookingDetails?.payment?.responseDesc}
                  </span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-700">
                    Tickets
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    M{confirmBookingDetails?.bookingAmount.baseAmount}
                  </span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-700">
                    Taxes & Fees
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    M{confirmBookingDetails?.bookingAmount.taxAmount}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-bold text-gray-900">
                      Total Amount Paid
                    </span>
                    <span className="text-lg font-bold text-green-600">
                      M{confirmBookingDetails?.bookingAmount.totalAmount}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
