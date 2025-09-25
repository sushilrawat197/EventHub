import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../reducers/hooks';
import { listAllOrders } from '../../../services/operations/orderDetails';
import { format } from "date-fns";
import { useNavigate } from 'react-router-dom';


const BookingOrder: React.FC = () => {

  const [searchTerm, setSearchTerm] = useState<string>('');


  const orderDetails = useAppSelector((state) => state.order.order?.content || []);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();



const filteredOrder = searchTerm
  ? orderDetails.filter((order) => {
      const search = searchTerm.toLowerCase();
      return (
        (order.eventName?.toLowerCase() || "").includes(search) ||
        (order.orderNo?.toString().toLowerCase() || "").includes(search)
      );
    })
  : orderDetails;




   console.log(filteredOrder);

  const tabs = ['Movies & Events'];

  function clickHandler(bookingId: number) {
    navigate(`/order/${bookingId}`);
  }

  useEffect(() => {
    dispatch(listAllOrders());
  }, [dispatch]);

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        
        {/* Header with tabs */}
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            
            {/* Tabs */}
            <div className="flex space-x-6 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  className={`whitespace-nowrap pb-1 font-medium transition-colors ${
                    tab === 'Movies & Events'
                      ? 'text-sky-500 border-b-2 border-sky-500'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>


            {/* Search */}
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Enter Order ID or Event Name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
          </div>
        </div>


        {/* Desktop Table Header */}
        <div className="hidden sm:grid grid-cols-4 gap-6 px-6 py-4 bg-gray-50 border-b border-gray-200 ">
          <div className="text-sm font-semibold text-gray-700">Event Name</div>
          <div className="text-sm font-semibold text-gray-700 text-center">Status</div>
          <div className="text-sm font-semibold text-gray-700 text-center">Order No.</div>
          <div className="text-sm font-semibold text-gray-700 text-right">Order Total</div>
        </div>


        {/* Orders */}
        <div className="divide-y divide-gray-200">
          {filteredOrder.map((transaction) => (
            <div
              key={transaction.bookingId}
              onClick={() => clickHandler(transaction.bookingId)}
              className="p-4 sm:px-6 sm:py-4 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              {/* Mobile Card Layout */}
              <div className="flex flex-col gap-3 sm:hidden">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-lg"></div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{transaction.eventName}</div>
                    <div className="text-xs text-gray-500">
                      {format(new Date(transaction.orderDateTime), "dd MMM ''yy h:mm a")}
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-2 ${
                    transaction.status === 'CONFIRMED' ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                  <span className={`text-sm font-medium ${
                    transaction.status === 'CONFIRMED' ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {transaction.status === 'CONFIRMED' ? 'Your order is successful' : 'Cancelled and refunded'}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-xs font-medium text-gray-500">{transaction.orderNo}</div>
                  <div className="text-sm font-semibold text-gray-900">Rs {transaction.amount}</div>
                </div>
              </div>


              {/* Desktop Table Row */}
              <div className="hidden sm:grid grid-cols-4 gap-6 ">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-lg"></div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{transaction.eventName}</div>
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      transaction.status === 'CONFIRMED' ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                    <span className={`text-sm font-medium ${
                      transaction.status === 'CONFIRMED' ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {transaction.status === 'CONFIRMED' ? 'Your order is successful' : 'Cancelled and refunded'}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <div className="text-sm font-medium text-gray-900">{transaction.orderNo}</div>
                  <div className="text-xs text-gray-500">
                    {format(new Date(transaction.orderDateTime), "dd MMM ''yy h:mm a")}
                  </div>
                </div>

                <div className="flex items-center justify-end">
                  <span className="text-sm font-semibold text-gray-900">Rs {transaction.amount}</span>
                </div>
              </div>
            </div>
          ))}
        </div>


        {orderDetails.length === 0 && (
          <div className="px-6 py-12 text-center">
            <div className="text-gray-500 text-sm">
              No transactions found matching your search.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default BookingOrder;
