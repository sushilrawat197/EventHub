import React from "react";
import PrimaryButton from "./PrimaryButton";

export default function ReviewAndPayUI() {
  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
      {/* LEFT SIDE - Delivery Options */}
      <div className="bg-white shadow-md rounded-md p-6">
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
                  It is mandatory to present the ticket(s) in My Profile at the
                  venue.
                </li>
                <li>No physical ticket(s) are required to enter the venue.</li>
              </ol>
            </div>
          </div>
        </label>
      </div>

      {/* RIGHT SIDE - Order Summary */}
      <div className="bg-white shadow-md rounded-md p-6">
        {/* Event Info */}
        <h3 className="font-semibold text-gray-800 mb-2">
          Daily Ka Kaam Hai By Aakash Gupta
        </h3>
        <p className="text-sm text-gray-600 mb-4">1 Ticket</p>

        <div className="border-2 border-sky-500 rounded-md p-4 text-sm space-y-2 mb-4">
          <p>
            <strong>Mon, 18 Aug, 2025</strong> | 01:30 PM
          </p>
          <p>
            Venue:{" "}
            <span className="text-gray-700">
              The Laugh Store: DLF Cyberhub, Gurugram
            </span>
          </p>
          <p>PHASE 2 (M 1499) : 1 ticket(s)</p>
        </div>

        {/* Price Breakdown */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between">
            <span>Sub-total</span>
            <span>M 1499.00</span>
          </div>
          <div className="flex justify-between">
            <span>Booking Fee</span>
            <span>M 123.82</span>
          </div>
          <div className="flex justify-between font-semibold text-lg">
            <span>Total Amount</span>
            <span>M 1622.82</span>
          </div>
        </div>

        {/* Consent + Button */}
        <p className="text-xs text-gray-500 mb-4">
          By proceeding, I express my consent to complete this transaction.
        </p>

        <PrimaryButton label=" Proceed to Pay" className="" />
      </div>
    </div>
  );
}
