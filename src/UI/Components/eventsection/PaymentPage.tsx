import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../reducers/hooks";
import { confirmBooking } from "../../../services/operations/ticketCategory";
import { IoLocationSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { FaWallet } from "react-icons/fa";

export default function PaymentPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState("Mpesa");
  const reserveTicket = useAppSelector((state) => state.reserveTicket.booking);
  const bookingId = useAppSelector((state) => state.ticket.bookingId);
  const [mobile, setMobile] = useState("");
  const isValid = mobile.length === 10;

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
    dispatch(confirmBooking(bookingId, navigate));
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-4">
      <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-6">
        {/* LEFT: Payment Options */}
        <div className="flex-1 flex flex-col lg:flex-row bg-white shadow-md rounded-2xl p-4 sm:p-6">
          {/* Payment Methods */}
          <div className="shadow px-4 sm:px-6 py-3 h-fit lg:h-full w-full lg:w-64 mb-4 lg:mb-0">
            <h2 className="text-base sm:text-lg font-semibold mb-4">Payment Method</h2>

            <div className="space-y-4">
              {/* Mpesa/Wallet */}
              <div
                onClick={() => setSelectedMethod("Mpesa")}
                className={`p-3 sm:p-4 flex items-center justify-between border rounded-xl cursor-pointer ${
                  selectedMethod === "Mpesa" ? "border-sky-400 bg-sky-50" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <FaWallet className="text-sky-600 text-xl sm:text-2xl" />
                  <span className="text-sm sm:text-base">Payment</span>
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
          <div className="p-4 sm:p-6 w-full">
            <div className="w-full bg-white border rounded-xl p-4 sm:p-6 shadow-sm">
              {/* Title */}
              <h2 className="text-gray-800 font-medium mb-3 text-sm sm:text-base">
                Enter your registered Mobile Number
              </h2>

              {/* Input */}
              <input
                type="text"
                placeholder="Enter Mobile Number"
                value={mobile}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  setMobile(value);
                }}
                className="w-full border rounded-lg px-3 sm:px-4 py-2 outline-none focus:ring-2 focus:ring-sky-400 mb-3 text-sm sm:text-base"
                maxLength={10}
              />

              {/* Checkbox */}
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

              {/* Button */}
              <button
                onClick={submitHandler}
                disabled={!isValid}
                className={`w-full py-2 sm:py-3 rounded-lg font-semibold transition text-sm sm:text-base
          ${
            isValid
              ? "bg-sky-500 hover:bg-sky-600 text-white cursor-pointer"
              : "bg-gray-300 text-gray-600 cursor-not-allowed"
          }`}
              >
                Verify & Pay
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: Order Summary */}
        <div className="w-full lg:w-1/3 bg-white shadow-md rounded-2xl p-4 sm:p-6 h-fit">
          <div className="w-full space-y-4">
            {/* Event Details */}
            <div className="bg-white shadow rounded-lg p-3 sm:p-4">
              <div className="flex justify-between items-start">
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
            </div>

            {/* Price Details */}
            <div className="bg-white shadow rounded-lg p-3 sm:p-4 space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between">
                <span>Ticket(s) price</span>
                <span>M {reserveTicket?.fees.baseAmount}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax Amount</span>
                <span>M {reserveTicket?.fees.taxAmount}</span>
              </div>

              <hr className="my-2" />

              <div className="flex justify-between font-semibold">
                <span>Order total</span>
                <span>M {reserveTicket?.fees.totalAmount}</span>
              </div>
            </div>

            {/* Amount Payable */}
            <div className="bg-white shadow rounded-lg p-3 sm:p-4 flex justify-between font-semibold text-sm sm:text-base">
              <span>Amount Payable</span>
              <span>M {reserveTicket?.fees.totalAmount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
