import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../../app/store/hooks";
// import PrimaryButton from "../PrimaryButton";
import { useEffect, useState } from "react";
import { cancelBooking } from "@/features/booking/services/booking.service";
import ScrollToTop from "../../../../../shared/components/common/ScrollToTop";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

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
    //("Transaction cancelled ✅");
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

      {/* Cancel confirmation */}
      <AlertDialog open={showPopup} onOpenChange={setShowPopup}>
        <AlertDialogContent className="w-[min(100vw-1.5rem,26rem)] max-w-md gap-0 overflow-hidden border-0 bg-white p-0 shadow-2xl sm:max-w-md">
          <div className="border-b border-gray-100 px-5 py-4">
            <AlertDialogHeader className="gap-2 text-left sm:text-left">
              <div className="mb-1 flex h-10 w-10 items-center justify-center rounded-full bg-amber-50 ring-1 ring-amber-100">
                <svg
                  className="h-5 w-5 text-amber-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <AlertDialogTitle className="text-lg font-semibold tracking-tight text-gray-900">
                Cancel this booking?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-left text-sm leading-relaxed text-gray-600">
                Going back will release your reserved tickets. You may need to select them again.
              </AlertDialogDescription>
            </AlertDialogHeader>
          </div>

          <AlertDialogFooter className="m-0 flex-row gap-2 rounded-none border-t border-gray-100 bg-gray-50/80 px-5 py-3.5 sm:justify-end">
            <AlertDialogCancel
              type="button"
              className="rounded-lg border-gray-200 bg-white px-4 font-medium text-gray-700 hover:bg-gray-50"
            >
              Keep booking
            </AlertDialogCancel>
            <Button
              type="button"
              className="rounded-lg bg-red-600 px-4 font-semibold text-white hover:bg-red-700"
              onClick={handleCancelConfirm}
            >
              Yes, cancel
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};


export default ReviewAndPay;
