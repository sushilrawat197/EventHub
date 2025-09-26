import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../../reducers/hooks";
import PrimaryButton from "../PrimaryButton";
import { useEffect, useState } from "react";
import { cancelBooking } from "../../../../../services/operations/ticketCategory";

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
      <div className="lg:max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
        {/* LEFT SIDE - Delivery Options */}
        <div className="bg-white shadow-md rounded-md p-6">
          <button
            onClick={backHandler}
            className="text-white mr-4 mb-3 bg-sky-500 rounded-lg p-2 px-5 font-semibold"
          >
            ← Back
          </button>
          <h3 className="font-semibold text-gray-800 mb-4">
            Please select from the following option(s)
          </h3>

          {/* M-Ticket Option */}
          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="radio"
              name="delivery"
              checked
              readOnly
              className="mt-1"
            />
            <div>
              <p className="font-medium text-gray-800">M-Ticket</p>
              <p className="text-sm text-gray-600">
                Save the planet. Use your phone as a ticket.
              </p>

              <div className="bg-blue-50 border border-blue-200 p-4 rounded-md mt-3 text-sm text-gray-700">
                <p className="font-semibold mb-2">M-Ticket Information</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>
                    Customer(s) can access their ticket(s) from the 'My Profile'
                    section on the app/mobile-web.
                  </li>
                  <li>
                    It is mandatory to present the ticket(s) in My Profile at
                    the venue.
                  </li>
                  <li>
                    No physical ticket(s) are required to enter the venue.
                  </li>
                </ol>
              </div>
            </div>
          </label>
        </div>

        {/* RIGHT SIDE - Order Summary */}
        <div className="bg-white shadow-md rounded-md p-6">
          {/* Event Info */}
          <h3 className="font-semibold uppercase text-gray-800 mb-2">
            {contentName}
          </h3>
          <p className="text-sm text-gray-600 mb-4">{ticketCount} Ticket</p>

          <div className="border-2 border-sky-500 rounded-md p-4 text-sm space-y-2 mb-4">
            <p>
              <strong>{eventDate} | {eventTime}</strong> 
            </p>
            <p>
              <span className="font-bold">
                Venue: {reserveTicket?.showVenue}{" "}
              </span>
             
            </p>
            {/* <p>PHASE 2 (M 1499) : {ticketCount} ticket(s)</p> */}
          </div>

          {/* Price Breakdown */}
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span>Base-Amount</span>
              <span>M {reserveTicket?.fees.baseAmount}</span>
            </div>
            {/* <div className="flex justify-between">
              <span>Platform-Fee</span>
              <span>M {reserveTicket?.fees.platformFee}</span>
            </div> */}
            <div className="flex justify-between">
              <span>Tax-Amount</span>
              <span>M {reserveTicket?.fees.taxAmount}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg">
              <span>Total Amount</span>
              <span>M {reserveTicket?.fees.totalAmount}</span>
            </div>
          </div>

          {/* Consent + Button */}
          <p className="text-xs text-gray-500 mb-4">
            By proceeding, I express my consent to complete this transaction.
          </p>

          <PrimaryButton
            onClick={submitHandler}
            label=" Proceed to Pay"
            className=""
          />
        </div>
      </div>

      {/* Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40">
          <div className="bg-gray-100 p-6 rounded-lg shadow-lg w-xl">
            <h1 className="text-center text-2xl font-semibold">
              Cancel transaction
            </h1>
            <h2 className="text-lg text-center text-gray-800 mb-4">
              Are you sure you want to cancel your transaction?
            </h2>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowPopup(false)}
                className="px-8 shadow py-2 bg-white rounded-lg"
              >
                No
              </button>

              <button
                onClick={handleCancelConfirm}
                className="px-8 shadow py-2 bg-red-500 text-white rounded-lg"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ReviewAndPay;
