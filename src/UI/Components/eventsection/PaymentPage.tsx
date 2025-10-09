import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../reducers/hooks";
import {
  cancelBooking,
  ticketPay,
} from "../../../services/operations/ticketCategory";
import { IoLocationSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <BookingErrorPage />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* LEFT: Payment Options */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              {/* Header */}
              <div className="flex items-center gap-2 mb-4">
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
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    Payment Details
                  </h1>
                  <p className="text-sm text-gray-600">
                    Complete your secure payment
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Payment Methods */}
                {/* Payment Methods */}
                <div>
                  <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <div className="w-5 h-5 bg-green-100 rounded-md flex items-center justify-center">
                      <svg
                        className="w-3 h-3 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    Payment Method
                  </h2>

                  <div className="space-y-4">
                    {/* Modern Wallet Selection Cards */}
                    <div className="grid grid-cols-1 gap-3">
                      {/* M-Pesa Card */}
                      <div
                        className={`group relative p-4 border-2 rounded-2xl transition-all duration-300 cursor-pointer ${
                          selectedMethod === "Mpesa"
                            ? "border-green-500 bg-green-50 shadow-lg scale-105"
                            : "border-gray-200 hover:border-green-300 hover:shadow-md hover:scale-102"
                        }`}
                        onClick={() => setSelectedMethod("Mpesa")}
                    >
                      <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            {/* M-Pesa Icon */}
                            <div
                              className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                selectedMethod === "Mpesa"
                                  ? "bg-green-100"
                                  : "bg-gray-100"
                              }`}
                            >
                              <svg
                                className="w-6 h-6"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M12 2L2 7L12 12L22 7L12 2Z"
                                  fill={selectedMethod === "Mpesa" ? "#10B981" : "#6B7280"}
                                />
                                <path
                                  d="M2 17L12 22L22 17"
                                  stroke={selectedMethod === "Mpesa" ? "#10B981" : "#6B7280"}
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M2 12L12 17L22 12"
                                  stroke={selectedMethod === "Mpesa" ? "#10B981" : "#6B7280"}
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </div>

                            <div>
                              <h3 className="text-lg font-bold text-gray-900">
                                M-Pesa
                              </h3>
                              <div className="flex items-center gap-1 mt-1">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="text-xs text-green-600 font-medium">
                                  Most Popular
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Selection Indicator */}
                          <div
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                              selectedMethod === "Mpesa"
                                ? "border-green-500 bg-green-500"
                                : "border-gray-300"
                            }`}
                          >
                            {selectedMethod === "Mpesa" && (
                              <svg
                                className="w-3 h-3 text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* C-Pay Card */}
                      <div
                        className={`group relative p-4 border-2 rounded-2xl transition-all duration-300 cursor-pointer ${
                          selectedMethod === "Apesa"
                            ? "border-blue-500 bg-blue-50 shadow-lg scale-105"
                            : "border-gray-200 hover:border-blue-300 hover:shadow-md hover:scale-102"
                        }`}
                        onClick={() => setSelectedMethod("Apesa")}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            {/* C-Pay Icon */}
                            <div
                              className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                selectedMethod === "Apesa"
                                  ? "bg-blue-100"
                                  : "bg-gray-100"
                              }`}
                            >
                              <svg
                                className="w-6 h-6"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <rect
                                  x="2"
                                  y="4"
                                  width="20"
                                  height="16"
                                  rx="2"
                                  fill={selectedMethod === "Apesa" ? "#3B82F6" : "#6B7280"}
                                />
                                <path
                                  d="M2 8H22"
                                  stroke="white"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                />
                                <circle
                                  cx="8"
                                  cy="14"
                                  r="2"
                                  fill="white"
                                />
                                <circle
                                  cx="16"
                                  cy="14"
                                  r="2"
                                  fill="white"
                                />
                              </svg>
                          </div>

                          <div>
                              <h3 className="text-lg font-bold text-gray-900">
                                C-Pay
                            </h3>
                              <div className="flex items-center gap-1 mt-1">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <span className="text-xs text-blue-600 font-medium">
                                  Secure & Fast
                                </span>
                              </div>
                          </div>
                        </div>

                          {/* Selection Indicator */}
                        <div
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                              selectedMethod === "Apesa"
                              ? "border-blue-500 bg-blue-500"
                              : "border-gray-300"
                          }`}
                        >
                            {selectedMethod === "Apesa" && (
                              <svg
                                className="w-3 h-3 text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>


                {/* Mobile Input */}
                <div>
                  <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <div className="w-5 h-5 bg-purple-100 rounded-md flex items-center justify-center">
                      <svg
                        className="w-3 h-3 text-purple-600"
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
                    Mobile Number
                  </h2>


                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Enter your registered Mobile Number
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg
                            className="w-4 h-4 text-gray-400"
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
                        <input
                          type="text"
                          placeholder="Enter Mobile Number"
                          value={mobile}
                          onChange={(e) =>
                            setMobile(e.target.value.replace(/\D/g, ""))
                          }
                          className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-all duration-300 bg-gray-50 focus:bg-white text-base"
                          maxLength={12}
                        />
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="mt-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <div>
                          <p className="text-xs text-gray-700">
                            <span className="font-semibold text-blue-600">
                              Securely save Number.
                            </span>{" "}
                            Your Mobile Number is 100% safe with us.
                          </p>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={submitHandler}
                      disabled={!isValid || Boolean(paymentLoading)}
                      className={`w-full py-3 rounded-lg font-bold text-base transition-all duration-300 flex items-center justify-center gap-2 ${
                        isValid
                          ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
                          : "bg-gray-300 text-gray-600 cursor-not-allowed"
                      }`}
                    >
                      {paymentLoading ? (
                        <>
                          <ClipLoader size={16} color="#ffffff" />
                          <span>Processing Payment...</span>
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                            />
                          </svg>
                          <span>Verify & Pay</span>
                        </>
                      )}
                    </button>


                  </div>
                </div>
              </div>
            </div>
          </div>



          {/* RIGHT: Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 sticky top-8">
              <div className="flex items-center gap-2 mb-3">
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
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h2 className="text-lg font-bold text-gray-900">
                  Order Summary
                </h2>
              </div>

              {/* Event Details */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mb-4">
                <h3 className="text-base font-bold text-gray-900 mb-3">
                  {reserveTicket?.eventName}
                </h3>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-100 rounded-md flex items-center justify-center">
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
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-gray-900 text-sm">
                        {eventDate}
                      </span>
                      <div className="w-3 h-3 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg
                          className="w-1.5 h-1.5 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <span className="font-semibold text-gray-900 text-sm">
                        {eventTime}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-green-100 rounded-md flex items-center justify-center">
                      <IoLocationSharp className="w-3 h-3 text-green-600" />
                    </div>
                    <span className="font-semibold text-gray-900 text-sm">
                      {reserveTicket?.showVenue}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-purple-100 rounded-md flex items-center justify-center">
                      <svg
                        className="w-3 h-3 text-purple-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-9 0a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V6a2 2 0 00-2-2"
                        />
                      </svg>
                    </div>
                    <span className="font-semibold text-gray-900 text-sm">
                      English
                    </span>
                  </div>
                </div>
              </div>

              {/* Ticket Info */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-3 mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600">Tickets</p>
                    <p className="text-lg font-bold text-gray-900">
                      {reserveTicket?.tickets.length}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-600">Type</p>
                    <p className="text-sm font-bold text-green-600">M-Ticket</p>
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-4">
                <h3 className="text-base font-bold text-gray-900">
                  Price Breakdown
                </h3>

                <div className="space-y-2">
                  <div className="flex justify-between items-center py-1">
                    <span className="text-sm text-gray-700">
                      Ticket(s) price
                    </span>
                    <span className="font-semibold text-gray-900 text-sm">
                      M{reserveTicket?.fees.baseAmount}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-sm text-gray-700">Tax Amount</span>
                    <span className="font-semibold text-gray-900 text-sm">
                      M{reserveTicket?.fees.taxAmount}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-base font-bold text-gray-900">
                        Total Amount
                      </span>
                      <span className="text-lg font-bold text-blue-600">
                        M{reserveTicket?.fees.totalAmount}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Amount Payable */}
              <div className="bg-gradient-to-r bg-blue-50 rounded-xl p-4 text-blue-600">
                <div className="flex justify-between items-center">
                  <span className="text-base font-bold">Amount Payable</span>
                  <span className="text-lg font-bold">
                    M{reserveTicket?.fees.totalAmount}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
