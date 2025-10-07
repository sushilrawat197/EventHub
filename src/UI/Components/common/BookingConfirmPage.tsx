import { FaDownload } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "../../../reducers/hooks";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  downloadTicket,
  getOrderDetails,
} from "../../../services/operations/ticketCategory";
import SpinnerLoading from "./SpinnerLoading";
// import { IoIosArrowDropdown } from "react-icons/io";
// import { IoIosArrowDropup } from "react-icons/io";

export default function BookingConfirmed() {
  const dispatch = useAppDispatch();
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const confirmBookingDetails = useAppSelector(
    (state) => state.confirmBooking.booking
  );

  console.log("CONFIRM BOOKING DETAILS..", confirmBookingDetails);

  const [showPopup, setShowPopup] = useState<boolean>(false);
  // const refund = confirmBookingDetails?.payment?.refund;
  // console.log(confirmBookingDetails);

  const loading = useAppSelector((state) => state.confirmBooking.loading);

  // const cancelTicketLoading = useAppSelector(
  //   (state) => state.confirmBooking.cancelTicketLoading
  // );

  // ✅ Format event date
  const eventDate = confirmBookingDetails
    ? new Date(confirmBookingDetails.show.date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "";

  // ✅ Format event time
  const eventTime = confirmBookingDetails
    ? new Date(
        `1970-01-01T${confirmBookingDetails.show.time}`
      ).toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    : "";

  // ✅ Calculate show DateTime (for cancel button logic)
  // const showDateTime = confirmBookingDetails
  //   ? new Date(
  //       `${confirmBookingDetails.show.date}T${confirmBookingDetails.show.time}`
  //     )
  //   : null;

  // const now = new Date();
  // const canCancel =
  //   showDateTime &&
  //   showDateTime.getTime() - now.getTime() > 24 * 60 * 60 * 1000;

  useEffect(() => {
    const context = localStorage.getItem("navigateContext");

    if (context === "confirmBooking") {
      dispatch(getOrderDetails(Number(bookingId), navigate));
    }

    return () => {
      // cleanup: localStorage se key hata do
      localStorage.removeItem("navigateContext");
    };
  }, [bookingId, dispatch, navigate]);

  const downloadHandler = async () => {
    const resFn = downloadTicket(Number(bookingId));
    const res = await resFn(); // execute the returned async function
    if (res.success) {
      setShowPopup(true);
    }
  };

  if (loading) {
    return <SpinnerLoading />;
  }

  return (
    <div className="lg:min-h-[calc(100vh-6rem)] min-h-[calc(100vh-40px)] bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col items-center p-6">
      {/* Header Confirmation */}
      <div className="w-full max-w-5xl bg-white shadow-2xl rounded-xl p-3 mb-4 flex items-center justify-center mt-2 border border-gray-100">
        <div className="text-center">
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mx-auto mb-2 shadow-lg">
            {confirmBookingDetails?.status === "CONFIRMED" ? (
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </div>
          <h1 className="text-base font-bold text-gray-900 mb-1">
            {confirmBookingDetails?.status === "CONFIRMED" ? "Booking Confirmed!" : "Booking Cancelled"}
          </h1>
          <p className="text-gray-600 text-xs">
            {confirmBookingDetails?.status === "CONFIRMED" 
              ? "Your tickets are ready for download" 
              : "Your booking has been cancelled"}
          </p>
        </div>
      </div>

      {/* show Popup */}

      {showPopup && (
        <div className="fixed inset-0 backdrop-blur-2xl flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md text-center border border-gray-100">
            {/* Success Icon */}
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>

            {/* Success Message */}
            <h2 className="text-2xl font-bold mb-3 text-gray-900">
              Ticket Downloaded!
            </h2>
            <p className="text-gray-600 mb-8">
              Your ticket has been saved to your downloads folder.
            </p>

            {/* Review Section */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-6">
              <h3 className="text-lg font-bold mb-2 text-gray-900">
                Share Your Experience
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Your feedback helps us improve our service!
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
                onClick={() => navigate("/rate-and-review")}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                Give Feedback
              </button>

              <button
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                onClick={() => setShowPopup(false)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content Section */}
      <div className="w-full max-w-5xl flex flex-col lg:flex-row gap-6">
        {/* LEFT: Event Details */}
        <div className="w-full lg:w-2/3 bg-white shadow-2xl rounded-xl p-4 border border-gray-100">
          <div className="flex items-start gap-4">
            {/* Event Image */}
            <div className="relative">
              <img
                src={confirmBookingDetails?.event.eventPoster}
                alt="Event Poster"
                className="w-16 h-20 object-cover rounded-lg shadow-lg"
              />
              {confirmBookingDetails?.status === "CONFIRMED" && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </div>

            {/* Event Details */}
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-1">
                    {confirmBookingDetails?.event.eventName}
                  </h2>
                  <p className="text-gray-600 text-sm mb-3">
                    Event Details
                  </p>
                  
                  {/* Venue and Date/Time in one row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-5 h-5 bg-blue-100 rounded flex items-center justify-center">
                          <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <span className="text-sm font-semibold text-gray-900">Venue</span>
                      </div>
                      <p className="text-xs text-gray-600">
                        {confirmBookingDetails?.show.venue}
                      </p>
                      <p className="text-xs text-gray-500">
                        {confirmBookingDetails?.show.venueAddress}
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-5 h-5 bg-green-100 rounded flex items-center justify-center">
                          <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <span className="text-sm font-semibold text-gray-900">Date & Time</span>
                      </div>
                      <p className="text-xs font-semibold text-gray-900">
                        {eventDate}
                      </p>
                      <p className="text-xs text-gray-600">
                        {eventTime}
                      </p>
                    </div>
                  </div>

                  {/* Ticket Information */}
                  {confirmBookingDetails?.tickets?.length ? (
                    <div className="mt-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-3">
                      <h3 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 6v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-6V7a2 2 0 00-2-2H5z" />
                        </svg>
                        Ticket Information
                      </h3>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div>
                          <p className="text-xs font-semibold text-gray-700 mb-1">Seats</p>
                          <p className="text-sm font-bold text-gray-900">
                            {confirmBookingDetails.tickets
                              ?.map((item) => item.seatCode)
                              .join(", ")}
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-xs font-semibold text-gray-700 mb-1">Ticket IDs</p>
                          <p className="text-sm font-bold text-gray-900">
                            {confirmBookingDetails.tickets
                              ?.map((item) => item.ticketId)
                              .join(", ")}
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-xs font-semibold text-gray-700 mb-1">Booking Number</p>
                          <p className="text-sm font-bold text-gray-900">
                            {confirmBookingDetails?.bookingNo}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>

                {/* Download Button - Top Right */}
                {confirmBookingDetails?.status === "CONFIRMED" && (
                  <button
                    onClick={() => dispatch(downloadHandler)}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2 text-sm"
                  >
                    <FaDownload className="w-4 h-4" />
                    Download
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Payment Summary */}
        <div className="w-full lg:w-80 bg-white shadow-2xl rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h3 className="text-sm font-bold text-gray-900">Payment Summary</h3>
          </div>

          <div className="space-y-2 mb-3">
            <div className="flex justify-between items-center py-1.5 px-2 bg-gray-50 rounded-lg">
              <span className="text-xs font-semibold text-gray-700">Order ID</span>
              <span className="text-xs font-bold text-gray-900">#{confirmBookingDetails?.orderNo}</span>
            </div>

            <div className="flex justify-between items-center py-1.5 px-2 bg-blue-50 rounded-lg">
              <span className="text-xs font-semibold text-gray-700">Tickets</span>
              <span className="text-xs font-bold text-gray-900">M{confirmBookingDetails?.bookingAmount.baseAmount}</span>
            </div>

            <div className="flex justify-between items-center py-1.5 px-2 bg-orange-50 rounded-lg">
              <span className="text-xs font-semibold text-gray-700">Taxes & Fees</span>
              <span className="text-xs font-bold text-gray-900">M{confirmBookingDetails?.bookingAmount.taxAmount}</span>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-2 mb-3">
            <div className="flex justify-between items-center bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-2">
              <span className="text-xs font-bold text-gray-900">Total Amount Paid</span>
              <span className="text-sm font-bold text-green-600">M{confirmBookingDetails?.bookingAmount.totalAmount}</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-3">
            <h4 className="text-xs font-bold text-gray-900 mb-2 flex items-center gap-1">
              <svg className="w-3 h-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              Payment Details
            </h4>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-xs font-semibold text-gray-700">Method</span>
                <span className="text-xs font-bold text-gray-900">Mobile Money</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs font-semibold text-gray-700">Transaction ID</span>
                <span className="text-xs text-gray-600 font-mono">{confirmBookingDetails?.payment.conversationId}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
