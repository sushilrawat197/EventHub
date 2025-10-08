import React, { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { listAllOrdersApi } from "../../../services/operations/orderDetails";
import { format } from "date-fns";
import { clearConfirmBooking } from "../../../slices/confirmBookingSlice";
import { getOrderDetails } from "../../../services/operations/ticketCategory";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../reducers/hooks";

const BookingOrder: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchTerm, setSearchTerm] = useState("");


  // ✅ Infinite Query for orders
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: ["orders"],
      queryFn: ({ pageParam }) => listAllOrdersApi(pageParam, 8),
      initialPageParam: 0, // 👈 required in v5
      getNextPageParam: (lastPage) => {
        if (lastPage.last) return undefined; // stop if last page
        return lastPage.page + 1;
      },
    });


  // Flatten pages into a single array
  const allOrders = data?.pages.flatMap((page) => page.content) ?? [];

  // Search filter
  const filteredOrder = searchTerm
    ? allOrders.filter((order) => {
        const search = searchTerm.toLowerCase();
        return (
          (order.eventName?.toLowerCase() || "").includes(search) ||
          (order.orderNo?.toString().toLowerCase() || "").includes(search)
        );
      })
    : allOrders;

  // Intersection Observer for infinite scroll
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  


  useEffect(() => {
    const target = loadMoreRef.current; // 👈 copy ref value once
    if (!target) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    });
    observer.observe(target);
    return () => {
      observer.unobserve(target); // 👈 use copied variable
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);


  function clickHandler(bookingId: number) {
    dispatch(clearConfirmBooking());
    dispatch(getOrderDetails(Number(bookingId), navigate));
  }

  
  if (status === "pending") return <p>Loading orders...</p>;
  if (status === "error") return <p>Failed to load orders.</p>;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen mt-32">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        {/* Header with search */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold">My Orders</h1>
                <p className="text-blue-100 text-xs">Track and manage your bookings</p>
              </div>
            </div>

            <div className="relative w-full sm:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by Order ID or Event Name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border-2 border-gray-200 bg-white rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 transition-all duration-300"
              />
            </div>
          </div>
        </div>

        {/* Desktop table header */}
        <div className="hidden sm:grid grid-cols-4 gap-6 px-6 py-4 bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-700">
            <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-9 0a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2M9 4V2a1 1 0 011-1h8a1 1 0 011 1v2" />
            </svg>
            Event Name
          </div>
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-gray-700">
            <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Status
          </div>
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-gray-700">
            <svg className="w-3 h-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
            </svg>
            Order No.
          </div>
          <div className="flex items-center justify-end gap-2 text-xs font-semibold text-gray-700">
            <svg className="w-3 h-3 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
            Order Total
          </div>
        </div>


        {/* Orders */}
        <div className="divide-y divide-gray-100">
          {filteredOrder.map((transaction) => (
            <div
              key={transaction.bookingId}
              onClick={() => clickHandler(transaction.bookingId)}
              className="group p-4 sm:px-6 sm:py-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 cursor-pointer border-l-4 border-transparent hover:border-blue-500"
            >
              {/* Mobile card layout */}
              <div className="flex flex-col gap-3 sm:hidden">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-9 0a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2M9 4V2a1 1 0 011-1h8a1 1 0 011 1v2" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-gray-900 mb-1">
                      {transaction.eventName}
                    </div>
                    <div className="text-xs text-gray-500">
                      {format(
                        new Date(transaction.orderDateTime),
                        "dd MMM ''yy h:mm a"
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      transaction.status === "CONFIRMED"
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  />
                  <span
                    className={`text-xs font-semibold ${
                      transaction.status === "CONFIRMED"
                        ? "text-green-700"
                        : "text-red-700"
                    }`}
                  >
                    {transaction.status === "CONFIRMED"
                      ? "Order Confirmed"
                      : "Order Cancelled"}
                  </span>
                </div>

                <div className="flex justify-between items-center bg-gray-50 rounded-lg p-2">
                  <div className="flex items-center gap-2">
                    <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                    </svg>
                    <span className="text-xs font-medium text-gray-600">
                      #{transaction.orderNo}
                    </span>
                  </div>

                  <div className="text-sm font-bold text-gray-900">
                    M{transaction.amount}
                  </div>
                </div>
              </div>

              {/* Desktop row */}
              <div className="hidden sm:grid grid-cols-4 gap-4 items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-9 0a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2M9 4V2a1 1 0 011-1h8a1 1 0 011 1v2" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                      {transaction.eventName}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-1.5">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        transaction.status === "CONFIRMED"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    />
                    <span
                      className={`text-xs font-semibold ${
                        transaction.status === "CONFIRMED"
                          ? "text-green-700"
                          : "text-red-700"
                      }`}
                    >
                      {transaction.status === "CONFIRMED"
                        ? "Confirmed"
                        : "Cancelled"}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <div className="text-sm font-bold text-gray-900">
                    #{transaction.orderNo}
                  </div>
                  <div className="text-xs text-gray-500">
                    {format(
                      new Date(transaction.orderDateTime),
                      "dd MMM ''yy h:mm a"
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-end">
                  <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1.5 rounded-lg font-bold text-sm shadow-lg">
                    M{transaction.amount}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Infinite scroll loader */}
        <div
          ref={loadMoreRef}
          className="h-16 flex items-center justify-center bg-gradient-to-r from-gray-50 to-blue-50"
        >
          {isFetchingNextPage && (
            <div className="flex items-center gap-3 text-blue-600">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="font-medium">Loading more orders...</span>
            </div>
          )}
          {!hasNextPage && allOrders.length > 0 && (
            <div className="flex items-center gap-2 text-gray-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-medium">All orders loaded</span>
            </div>
          )}
        </div>

        {allOrders.length === 0 && (
          <div className="px-8 py-16 text-center bg-gradient-to-br from-gray-50 to-blue-50">
            <div className="w-20 h-20 bg-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Orders Found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ? "No orders match your search criteria." : "You haven't made any orders yet."}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-medium transition-colors"
              >
                Clear Search
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingOrder;
