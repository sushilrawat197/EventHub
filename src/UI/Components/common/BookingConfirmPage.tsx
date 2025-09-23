import { FaDownload } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "../../../reducers/hooks";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import {
  downloadTicket,
  getOrderDetails,
} from "../../../services/operations/ticketCategory";
import SpinnerLoading from "./SpinnerLoading";

export default function BookingConfirmed() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { bookingId } = useParams();

  const path = location.pathname;

  const confirmeTicket = useAppSelector((state) => state.reserveTicket.booking);
  const confirmBookingDetails = useAppSelector(
    (state) => state.confirmBooking.booking
  );
  const loading = useAppSelector((state) => state.confirmBooking.loading);
  console.log(loading);
  console.log(confirmBookingDetails);

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
    dispatch(getOrderDetails(Number(bookingId)));
  }, [dispatch, bookingId]);

  if (loading) {
    return <SpinnerLoading />;
  }

  return (
    <div className="lg:min-h-[calc(100vh-6rem)] min-h-[calc(100vh-40px)] bg-gray-100 flex flex-col items-center p-6">
      {/* Header Confirmation */}
      <div className="w-full max-w-5xl bg-white shadow-md rounded-lg p-4 mb-6 flex items-center justify-center">
        <p className=" font-semibold text-lg">
          {confirmBookingDetails?.status == "CONFIRMED" ? (
            <p className="text-green-600">✅ Booking Confirmed</p>
          ) : (
            <p className="text-red-600">Booking Not confirmed</p>
          )}
        </p>
      </div>

      {/* Content Section */}
      <div className="w-full max-w-5xl flex flex-col md:flex-row gap-6">
        {/* LEFT: Movie Details */}
        <div className="flex-1 bg-white shadow-md rounded-lg p-4 flex flex-col md:flex-row">
          {/* Poster */}
          <img
            src={confirmBookingDetails?.event.eventPoster}
            alt="Movie Poster"
            className="w-40 h-56 object-cover rounded-lg shadow"
          />

          {/* Details */}
          <div className="flex-1 ml-4 ">
            <div className="flex justify-between items-start ">
              <h2 className="text-xl font-bold">{confirmeTicket?.eventName}</h2>
              <FaDownload
                onClick={() => dispatch(downloadTicket(Number(bookingId)))}
                className="text-gray-500 cursor-pointer"
              />
            </div>


            <p className="text-sm text-gray-600 mt-1">U/A | Hindi | 2D</p>
            <p className="mt-2 font-medium">{confirmeTicket?.showVenue}</p>
            <p className="text-sm text-gray-600">
              {confirmBookingDetails?.show.venue},{" "}
              {confirmBookingDetails?.show.venueAddress}
            </p>

            <div className="mt-3 text-sm space-y-1">
              <p>
                <span className="font-semibold">{eventDate}</span> | {eventTime}
              </p>
              <p><span className="font-semibold">Category:</span> {} </p>

              <p>
               <span className="font-semibold">Ticket Number:</span>{" "}
                {confirmBookingDetails?.tickets.map(
                  (item) =>  `${item.ticketNumber}, `
                )}
              </p>
              <p><span className="font-semibold">Booking Number:</span> {confirmBookingDetails?.orderNo}</p>
            </div>
          </div>
        </div>

        {/* RIGHT: Payment Summary */}
        <div className="w-full md:w-80 bg-white shadow-md rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-3">Payment Summary</h3>

          <div className="flex justify-between text-sm mb-2">
            <span className="font-semibold">Tickets</span>
            <span>M {confirmBookingDetails?.bookingAmount.baseAmount}</span>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span>Taxes & Fees</span>
            <span>M {confirmBookingDetails?.bookingAmount.taxAmount}</span>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span>Platform Fee</span>
            <span>M {confirmBookingDetails?.bookingAmount.platformFee}</span>
          </div>
          <div className="border-t my-2"></div>
          <div className="flex justify-between font-semibold text-lg">
            <span>Total Amount Paid</span>
            <span>M {confirmBookingDetails?.bookingAmount.totalAmount}</span>
          </div>

          <div className="mt-3 text-sm text-gray-700">
            <p className="font-medium">Payment Method</p>
            <p>Mobile Money</p>
            <p className="text-xs text-gray-500">Txn ID: {confirmBookingDetails?.payment.conversationId}</p>
          </div>
        </div>
      </div>
      {path.includes("/bookingconfirmed") && (
        <button
          className="mt-3 bg-sky-500 text-white px-7 py-2 rounded-md"
          onClick={() => navigate("/events")}
        >
          Browse More Events
        </button>
      )}

      {/* Footer Note */}
      {confirmBookingDetails?.status == "CONFIRMED" && (
        <div className="w-full max-w-5xl mt-6 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-md text-sm">
          ⚠️ Cancellation not available for this booking.
        </div>
      )}
    </div>
  );
}
