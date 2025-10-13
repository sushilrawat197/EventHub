import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../../reducers/hooks";
// import PrimaryButton from "../PrimaryButton";
import { useEffect, useState } from "react";
import { cancelBooking } from "../../../../../services/operations/ticketCategory";
import ScrollToTop from "../../../common/ScrollToTop";

// Review & Payment Component
const ReviewAndPay = () => {
  const reserveTicket = useAppSelector((state) => state.reserveTicket.booking);
  const bookingId = useAppSelector(
    (state) => state.reserveTicket.booking?.bookingId
  );
  const ticketCount = reserveTicket?.tickets.length;
  const dispatch = useAppDispatch();
  const { contentName, eventId } = useParams();
  const navigate = useNavigate();

  const eventDate = reserveTicket
    ? new Date(reserveTicket.showDate).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "";

  const eventTime = reserveTicket
    ? new Date(`1970-01-01T${reserveTicket.showTime}`).toLocaleTimeString(
        "en-GB",
        {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }
      )
    : "";

  // State for modal
  const [showPopup, setShowPopup] = useState(false);


  function backHandler() {
    setShowPopup(true); // popup open
  }


  function handleCancelConfirm() {
    if (bookingId) {
      dispatch(cancelBooking(bookingId));
    }
    navigate(`/events/${contentName}/${eventId}/booking/ticket`, {
      replace: true,
    });

    setShowPopup(false);
    console.log("Transaction cancelled ✅");
  }

  
  
 async function submitHandler(){
     navigate(`/events/${contentName}/${eventId}/booking/payment`,{ replace: true })
  }

  
 useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Only warn if there is a reserved ticket
      if (reserveTicket) {
        e.preventDefault();
        e.returnValue = ""; // Required for Chrome
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [reserveTicket]);

  return (
    <>
      <div className="min-h-[calc(100vh-200px)] bg-gradient-to-br from-gray-50 to-blue-50">
        <ScrollToTop />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Back Button */}
          <div className="mb-4">
            <button
              onClick={backHandler}
              className="group flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
            >
              <svg className="w-3 h-3 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back to Tickets</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT SIDE - Delivery Options */}
<div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
  <div className="flex items-center gap-2 mb-4">
    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
      <svg
        className="w-4 h-4 text-green-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
        />
      </svg>
    </div>
    <h3 className="text-lg font-bold text-gray-900">Payment Options</h3>
  </div>

  {/* 🌿 New M-Ticket Option (Card Style) */}
  <div className="space-y-3">
    <div
      className="relative group cursor-pointer bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-600/50 hover:border-blue-600 rounded-2xl p-5 shadow-md transition-all duration-300 hover:shadow-xl"
    >
      {/* Checkmark indicator */}
      <div className="absolute top-4 right-4 w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-md">
        <svg
          className="w-3 h-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      {/* Icon + Title */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
          <svg
            className="w-5 h-5 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
        </div>
        <div>
          <h4 className="text-base font-bold text-gray-900">M-Ticket</h4>
          <p className="text-sm text-gray-600">
            Save the planet. Use your phone as a ticket.
          </p>
        </div>
      </div>

      {/* Information Box */}
      <div className="bg-white border border-blue-100 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg
              className="w-3 h-3 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="font-semibold text-gray-900 text-sm">
            M-Ticket Information
          </p>
        </div>

        <ol className="space-y-2 text-xs text-gray-700">
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600 flex-shrink-0 mt-0.5">
              1
            </span>
            <span>
              Access your tickets anytime in <b>My Profile</b> on the app or
              mobile web.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600 flex-shrink-0 mt-0.5">
              2
            </span>
            <span>
              Present the digital ticket at the venue. Physical printouts not
              required.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600 flex-shrink-0 mt-0.5">
              3
            </span>
            <span>Fast, easy, and environment-friendly entry process.</span>
          </li>
        </ol>
      </div>
    </div>
  </div>
</div>


            {/* RIGHT SIDE - Order Summary */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  Order Summary
                </h3>
              </div>

              {/* Event Info */}
              <div className="mb-4">
                <h4 className="text-base font-bold text-gray-900 mb-1">
                  {contentName}
                </h4>
                <p className="text-xs text-gray-600 mb-3">{ticketCount || 0} Ticket{(ticketCount || 0) > 1 ? 's' : ''}</p>

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-blue-100 rounded-md flex items-center justify-center">
                        <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900 text-sm">{eventDate}</span>
                        <div className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center">
                          <svg className="w-2 h-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <span className="font-semibold text-gray-900 text-sm">{eventTime}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-green-100 rounded-md flex items-center justify-center">
                        <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">Venue: {reserveTicket?.showVenue}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-4">
                <h4 className="text-base font-bold text-gray-900 mb-3">Price Breakdown</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center py-1">
                    <span className="text-sm text-gray-700">Base Amount</span>
                    <span className="font-semibold text-gray-900 text-sm">M{reserveTicket?.fees.baseAmount}</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-sm text-gray-700">Tax Amount</span>
                    <span className="font-semibold text-gray-900 text-sm">M{reserveTicket?.fees.taxAmount}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900">Total Amount</span>
                      <span className="text-xl font-bold text-blue-600">M{reserveTicket?.fees.totalAmount}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Consent + Button */}
              <div className="bg-gray-50 rounded-xl p-3 mb-4">
                <p className="text-xs text-gray-600 text-center">
                  By proceeding, I express my consent to complete this transaction.
                </p>
              </div>

              <button
                onClick={submitHandler}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-xl font-bold text-base shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <span>Proceed to Payment</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center border border-gray-100">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Cancel Transaction
            </h1>
            <p className="text-gray-600 mb-8">
              Are you sure you want to cancel your transaction? This action cannot be undone.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowPopup(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>No, Keep Booking</span>
              </button>
              <button
                onClick={handleCancelConfirm}
                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>Yes, Cancel</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ReviewAndPay;
