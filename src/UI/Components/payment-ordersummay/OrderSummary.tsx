import { IoLocationSharp } from "react-icons/io5";

interface OrderSummaryProps {
  reserveTicket: any; // Replace 'any' with your actual Ticket type
  eventDate: string;
  eventTime: string;
}

export default function OrderSummary({ reserveTicket, eventDate, eventTime }: OrderSummaryProps) {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 sticky top-8">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>
      </div>

      {/* Event Details */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mb-4">
        <h3 className="text-base font-bold text-gray-900 mb-3">{reserveTicket?.eventName}</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-100 rounded-md flex items-center justify-center">
              <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-semibold text-gray-900 text-sm">{eventDate}</span>
              <div className="w-3 h-3 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-1.5 h-1.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="font-semibold text-gray-900 text-sm">{eventTime}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-green-100 rounded-md flex items-center justify-center">
              <IoLocationSharp className="w-3 h-3 text-green-600" />
            </div>
            <span className="font-semibold text-gray-900 text-sm">{reserveTicket?.showVenue}</span>
          </div>
        </div>
      </div>

      {/* Ticket Info */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-3 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-600">Tickets</p>
            <p className="text-lg font-bold text-gray-900">{reserveTicket?.tickets.length}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-600">Type</p>
            <p className="text-sm font-bold text-green-600">M-Ticket</p>
          </div>
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="space-y-3 mb-4">
        <h3 className="text-base font-bold text-gray-900">Price Breakdown</h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center py-1">
            <span className="text-sm text-gray-700">Ticket(s) price</span>
            <span className="font-semibold text-gray-900 text-sm">M{reserveTicket?.fees.baseAmount}</span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-sm text-gray-700">Tax Amount</span>
            <span className="font-semibold text-gray-900 text-sm">M{reserveTicket?.fees.taxAmount}</span>
          </div>
          <div className="border-t border-gray-200 pt-2">
            <div className="flex justify-between items-center">
              <span className="text-base font-bold text-gray-900">Total Amount</span>
              <span className="text-lg font-bold text-blue-600">M{reserveTicket?.fees.totalAmount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Amount Payable */}
      <div className="bg-gradient-to-r bg-blue-50 rounded-xl p-4 text-blue-600">
        <div className="flex justify-between items-center">
          <span className="text-base font-bold">Amount Payable</span>
          <span className="text-lg font-bold">M{reserveTicket?.fees.totalAmount}</span>
        </div>
      </div>
    </div>
  );
}