import { FaDownload } from "react-icons/fa";
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

  useEffect(() => {
    const context = localStorage.getItem("navigateContext");
    if (context === "confirmBooking") {
      dispatch(getOrderDetails(Number(bookingId), navigate));
    }
    return () => {
      localStorage.removeItem("navigateContext");
    };
  }, [bookingId, dispatch, navigate]);

  const downloadHandler = async () => {
    const resFn = downloadTicket(Number(bookingId));
    const res = await resFn();
    if (res.success) {
      setShowPopup(true);
    }
  };

  if (loading) {
    return <SpinnerLoading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col items-center p-4 sm:p-6 mt-16 lg:mt-28">
      {/* Header Confirmation */}
      <div className="w-full max-w-5xl bg-white shadow-xl rounded-xl p-4 sm:p-5 mb-4 flex items-center justify-center border border-gray-100">
        <div className="text-center">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mx-auto mb-2 shadow-lg">
            {confirmBookingDetails?.status === "CONFIRMED" ? (
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
            {confirmBookingDetails?.status === "CONFIRMED" ? "Booking Confirmed!" : "Booking Cancelled"}
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
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3" />
              </svg>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold mb-2 text-gray-900">Ticket Downloaded!</h2>
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
      <div className="w-full max-w-5xl flex flex-col lg:flex-row gap-5">
        {/* LEFT SECTION */}
        <div className="w-full lg:w-2/3 bg-white shadow-xl rounded-xl p-4 sm:p-5 border border-gray-100">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            {/* Event Image */}
            <div className="relative w-full sm:w-auto">
              <img
                src={confirmBookingDetails?.event.eventPoster}
                alt="Event Poster"
                className="w-full sm:w-20 h-28 object-cover rounded-lg shadow-lg"
              />
            </div>

            {/* Event Details */}
            <div className="flex-1 w-full">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-1">
                    {confirmBookingDetails?.event.eventName}
                  </h2>
                  <p className="text-gray-600 text-xs sm:text-sm mb-3">Event Details</p>
                </div>

                {confirmBookingDetails?.status === "CONFIRMED" && (
                  <button
                    onClick={downloadHandler}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-semibold text-xs sm:text-sm shadow-md hover:shadow-lg flex items-center gap-2"
                  >
                    <FaDownload className="w-4 h-4" />
                    Download
                  </button>
                )}
              </div>

              {/* Venue & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-sm font-semibold text-gray-900 mb-1">Venue</p>
                  <p className="text-xs text-gray-600">{confirmBookingDetails?.show.venue}</p>
                  <p className="text-xs text-gray-500">{confirmBookingDetails?.show.venueAddress}</p>
                </div>

                <div className="bg-green-50 rounded-lg p-3">
                  <p className="text-sm font-semibold text-gray-900 mb-1">Date & Time</p>
                  <p className="text-xs font-semibold text-gray-900">{eventDate}</p>
                  <p className="text-xs text-gray-600">{eventTime}</p>
                </div>
              </div>

              {/* Ticket Info */}
              {confirmBookingDetails?.tickets?.length ? (
                <div className="mt-3 bg-purple-50 rounded-lg p-3">
                  <h3 className="text-sm font-bold text-gray-900 mb-2">Ticket Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
                    <div>
                      <p className="font-semibold text-gray-700">Seats</p>
                      <p className="font-bold text-gray-900">{confirmBookingDetails.tickets.map(t => t.seatCode).join(", ")}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700">Ticket IDs</p>
                      <p className="font-bold text-gray-900">{confirmBookingDetails.tickets.map(t => t.ticketId).join(", ")}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700">Booking No</p>
                      <p className="font-bold text-gray-900">{confirmBookingDetails?.bookingNo}</p>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="w-full lg:w-80 bg-white shadow-xl rounded-xl p-4 sm:p-5 border border-gray-100">
          <h3 className="text-sm font-bold text-gray-900 mb-3">Payment Summary</h3>
          <div className="space-y-2 text-xs sm:text-sm">
            <div className="flex justify-between bg-gray-50 p-2 rounded-lg">
              <span>Order ID</span>
              <span className="font-bold">#{confirmBookingDetails?.orderNo}</span>
            </div>
            <div className="flex justify-between bg-blue-50 p-2 rounded-lg">
              <span>Tickets</span>
              <span className="font-bold">M{confirmBookingDetails?.bookingAmount.baseAmount}</span>
            </div>
            <div className="flex justify-between bg-orange-50 p-2 rounded-lg">
              <span>Taxes & Fees</span>
              <span className="font-bold">M{confirmBookingDetails?.bookingAmount.taxAmount}</span>
            </div>
          </div>

          <div className="mt-3 border-t border-gray-200 pt-2">
            <div className="flex justify-between bg-green-50 p-2 rounded-lg">
              <span className="font-bold text-gray-900">Total Paid</span>
              <span className="font-bold text-green-600">M{confirmBookingDetails?.bookingAmount.totalAmount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
