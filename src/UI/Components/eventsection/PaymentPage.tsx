import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../reducers/hooks";
import {
  cancelBooking,
  ticketPay,
} from "../../../services/operations/ticketCategory";
import { IoLocationSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { FaWallet } from "react-icons/fa";
import BookingErrorPage from "./Eventsprocess/BookingError";
import { ClipLoader } from "react-spinners";

export default function PaymentPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [selectedMethod, setSelectedMethod] = useState("Mpesa");
  const [mobile, setMobile] = useState("");

  const reserveTicket = useAppSelector((state) => state.reserveTicket.booking);
  const bookingId = useAppSelector((state) => state.ticket.bookingId);
  const paymentLoading = useAppSelector((state) => state.pay.payTicketLoading);

  const isValid = mobile.length === 12;

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

    
  function submitHandler() {
    dispatch(ticketPay(bookingId, mobile, navigate));
  }


  useEffect(() => {
    if (!bookingId) {
      navigate("/events");
      return;
    }

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (reserveTicket && bookingId) {
        dispatch(cancelBooking(bookingId));
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [reserveTicket, bookingId, navigate, dispatch]);

  return (
    <div className="min-h-screen flex justify-center p-4">
      <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-6">
        <BookingErrorPage />

        {/* LEFT: Payment Options */}
        <div className="flex-1 flex flex-col lg:flex-row bg-white shadow-md rounded-2xl p-4 sm:p-6 gap-4">
          {/* Payment Methods */}
          <div className="flex-shrink-0 w-full lg:w-64 shadow-sm p-2 rounded-lg">
            <h2 className="text-base sm:text-lg font-semibold mb-4">
              Payment Method
            </h2>
            <div className="space-y-4">
              <div
                onClick={() => setSelectedMethod("Mpesa")}
                className={`p-3 sm:p-4 flex items-center justify-between border rounded-xl cursor-pointer ${
                  selectedMethod === "Mpesa" ? "border-sky-400 bg-sky-50" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <FaWallet className="text-sky-600 text-xl sm:text-2xl" />
                  <span className="text-sm sm:text-base">Mobile Wallet</span>
                </div>
                <input
                  type="radio"
                  checked={selectedMethod === "Mpesa"}
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Mobile Input */}
          <div className="flex-1">
            <div className="w-full bg-white border rounded-xl p-4 sm:p-6 shadow-sm">
              <h2 className="text-gray-800 font-medium mb-3 text-sm sm:text-base">
                Enter your registered Mobile Number
              </h2>
              <input
                type="text"
                placeholder="Enter Mobile Number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                className="w-full border rounded-lg px-3 sm:px-4 py-2 outline-none focus:ring-2 focus:ring-sky-400 mb-3 text-sm sm:text-base"
                maxLength={12}
              />

              <div className="flex items-start gap-2 mb-5">
                <input
                  type="checkbox"
                  defaultChecked
                  className="mt-1 accent-gray-100"
                />
                <p className="text-xs sm:text-sm text-gray-600">
                  <span className="text-sky-400 font-medium">
                    Securely save Number.
                  </span>{" "}
                  Your Mobile Number is 100% safe with us.
                </p>
              </div>

              <button
                onClick={submitHandler}
                disabled={!isValid || Boolean(paymentLoading)}
                className={`w-full py-2 sm:py-3 rounded-lg font-semibold transition text-sm sm:text-base ${
                  isValid
                    ? "bg-sky-500 hover:bg-sky-600 text-white cursor-pointer"
                    : "bg-gray-300 text-gray-600 cursor-not-allowed"
                }`}
              >
                {paymentLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <ClipLoader size={20} color="#ffffff" />
                    Processing...
                  </div>
                ) : (
                  "Verify & Pay"
                )}
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: Order Summary */}
        <div className="w-full lg:w-1/3 bg-white shadow-md rounded-2xl p-4 sm:p-6 h-fit">
          <div className="w-full space-y-4">
            <div className="bg-white shadow rounded-lg p-3 sm:p-4 flex justify-between items-start">
              <div>
                <h2 className="font-semibold text-gray-800 text-sm sm:text-base">
                  {reserveTicket?.eventName}
                </h2>
                <p className="text-xs sm:text-sm text-gray-600">
                  {eventDate} | {eventTime}
                </p>
                <p className="text-xs sm:text-sm text-gray-600">English</p>
                <p className="text-xs sm:text-sm text-gray-600 flex items-center gap-1">
                  <IoLocationSharp className="text-red-600" />{" "}
                  {reserveTicket?.showVenue}
                </p>
              </div>
              <div className="text-right w-16 sm:w-20">
                <p className="font-semibold text-sm sm:text-base">
                  {reserveTicket?.tickets.length}
                </p>
                <p className="text-sky-500 font-bold text-xs sm:text-sm">
                  M-Ticket
                </p>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg p-3 sm:p-4 space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between">
                <span>Ticket(s) price</span>
                <span>M{reserveTicket?.fees.baseAmount}</span>
              </div>
              {/* <div className="flex justify-between">
                <span>Platform-Fee</span>
                <span>M {reserveTicket?.fees.platformFee}</span>
              </div> */}
              <div className="flex justify-between">
                <span>Tax Amount</span>
                <span>M{reserveTicket?.fees.taxAmount}</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between font-semibold">
                <span>Order total</span>
                <span>M{reserveTicket?.fees.totalAmount}</span>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg p-3 sm:p-4 flex justify-between font-semibold text-sm sm:text-base">
              <span>Amount Payable</span>
              <span>M{reserveTicket?.fees.totalAmount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
