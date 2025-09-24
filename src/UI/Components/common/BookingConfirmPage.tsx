import { FaDownload } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "../../../reducers/hooks";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ImSpinner6 } from "react-icons/im";
import {
  cancelBookingTicket,
  downloadTicket,
  getOrderDetails,
} from "../../../services/operations/ticketCategory";
import SpinnerLoading from "./SpinnerLoading";
import { IoIosArrowDropdown } from "react-icons/io";
import { IoIosArrowDropup } from "react-icons/io";

export default function BookingConfirmed() {
  const dispatch = useAppDispatch();
  const { bookingId } = useParams();

  const confirmeTicket = useAppSelector((state) => state.reserveTicket.booking);
  const confirmBookingDetails = useAppSelector(
    (state) => state.confirmBooking.booking
  );

  const [showPopup, setShowPopup] = useState(false);
  const refund = confirmBookingDetails?.payment?.refund;
  console.log(confirmBookingDetails);

  const loading = useAppSelector((state) => state.confirmBooking.loading);
  const cancelTicketLoading = useAppSelector((state) => state.confirmBooking.cancelTicketLoading);

  useEffect(() => {
    dispatch(getOrderDetails(Number(bookingId)));
  }, [dispatch, bookingId]);

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
  const showDateTime = confirmBookingDetails
    ? new Date(
        `${confirmBookingDetails.show.date}T${confirmBookingDetails.show.time}`
      )
    : null;

  const now = new Date();
  const canCancel =
    showDateTime &&
    showDateTime.getTime() - now.getTime() > 24 * 60 * 60 * 1000;


  if (loading) {
    return <SpinnerLoading />;
  }

  return (
    <div className="lg:min-h-[calc(100vh-6rem)] min-h-[calc(100vh-40px)] bg-gray-100 flex flex-col items-center p-6">
      {/* Header Confirmation */}
      <div className="w-full max-w-5xl bg-white shadow-md rounded-lg p-4 mb-6 flex items-center justify-center mt-3">
        <p className="font-semibold text-lg">
          {confirmBookingDetails?.status === "CONFIRMED" ? (
            <p className="text-green-600">✅ Booking Confirmed</p>
          ) : (
            <p className="text-red-600">Booking Cancelled</p>
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
          <div className="flex-1 ml-4">
            <div className="flex justify-between items-start">
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
                <span className="font-semibold">
                  {eventDate} | {eventTime}
                </span>
              </p>
              <p>
                {confirmBookingDetails?.event?.category && (
                  <span className="font-semibold">
                    {" "}
                    Category:{confirmBookingDetails?.event?.category}{" "}
                  </span>
                )}
              </p>

              {confirmBookingDetails?.tickets?.length ? (
                <>
                  <p>
                    <span className="font-semibold">Seats:</span>{" "}
                    {confirmBookingDetails.tickets
                      ?.map((item) => item.ticketNumber)
                      .join(", ")}
                  </p>

                  <p>
                    <span className="font-semibold">Ticket Id:</span>{" "}
                    {confirmBookingDetails.tickets
                      ?.map((item) => item.ticketId)
                      .join(", ")}
                  </p>

                  <p>
                    <span className="font-semibold">Booking Number:</span>{" "}
                    {confirmBookingDetails?.orderNo}
                  </p>
                </>
              ) : null}
            </div>
          </div>
        </div>

        {/* RIGHT: Payment Summary */}
        <div className="w-full md:w-80 bg-white shadow-md rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-3">Payment Summary</h3>

          <div className="flex justify-between text-sm mb-2">
            <span className="font-semibold">Order Id</span>
            <span className="text-xs">
              {confirmBookingDetails?.payment.conversationId}
            </span>
          </div>

          <div className="flex justify-between text-sm mb-2">
            <span className="font-semibold">Tickets</span>
            <span>M {confirmBookingDetails?.bookingAmount.baseAmount}</span>
          </div>

          <div className="flex justify-between text-sm mb-2">
            <span className="font-semibold">Taxes & Fees</span>
            <span>M {confirmBookingDetails?.bookingAmount.taxAmount}</span>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span className="font-semibold">Platform Fee</span>
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
            <p className="text-xs text-gray-500">
              Txn ID: {confirmBookingDetails?.payment.conversationId}
            </p>
          </div>
        </div>
      </div>

      {confirmBookingDetails?.status === "CANCELLED" && (
        <div className="w-full max-w-5xl bg-white shadow-md rounded-lg p-4 mb-6 flex flex-col gap-2  mt-3">
          <p className="text-sm">
            Money has been proccessd on :{" "}
            <span className="font-semibold">
              {confirmBookingDetails?.payment.refund.processedAt.split("T")[0]}
            </span>{" "}
          </p>

          <div className="relative ">
            {/* Refund Text */}
            <p className="text-sm cursor-pointer flex">
              Refund amount :{" "}
              <span className="font-semibold flex gap-2 ">
                {" "}
                M {refund?.refundAmount}{" "}
                {showPopup ? (
                  <IoIosArrowDropup
                    onClick={() => setShowPopup(false)}
                    className="text-sky-400 cursor-pointer"
                    size={20}
                  />
                ) : (
                  <IoIosArrowDropdown
                    onClick={() => setShowPopup(true)}
                    className="text-sky-400 cursor-pointer"
                    size={20}
                  />
                )}
              </span>
            </p>

            {/* Popup */}
            {showPopup && (
              <div className="absolute z-10 mt-2 w-64 rounded-xl bg-white p-4 shadow-lg border bottom-full mb-2">
                <h3 className="font-semibold text-gray-800 mb-2">
                  Refund Details
                </h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>
                    <span className="font-medium">Refund Amount: </span>
                    {refund?.refundAmount}
                  </p>
                  <p>
                    <span className="font-medium">Refund Status: </span>
                    {refund?.refundStatus}
                  </p>
                  <p>
                    <span className="font-medium">Processed At: </span>
                    {refund?.processedAt?.split("T")[0]}
                  </p>
                  <p>
                    <span className="font-medium">Phone: </span>
                    {refund?.phoneNumber}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer Note / Cancel Button */}
      {confirmBookingDetails?.status === "CONFIRMED" && (
        <div className="w-full max-w-5xl mt-6 flex justify-center items-center">
          {canCancel ? (
            <button
              className="bg-red-500 text-white w-40 h-10 rounded-md flex items-center justify-center"
              onClick={() => dispatch(cancelBookingTicket(Number(bookingId)))}
              disabled={cancelTicketLoading ?? false} // ✅ disable while loading
            >
              {cancelTicketLoading ? (
                <ImSpinner6 className="animate-spin"/>
              ) : (
                "Cancel Ticket"
              )}
            </button>
          ) : (
            <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-md text-sm">
              ⚠️ Cancellation not available within 24 hours of the event.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
