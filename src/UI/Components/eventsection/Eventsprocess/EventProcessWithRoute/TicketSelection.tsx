import { useEffect, useState } from "react";
import { GrFormSubtract } from "react-icons/gr";
import { IoMdAdd } from "react-icons/io";
// import PrimaryButton from "../PrimaryButton";
import { useNavigate, useParams } from "react-router-dom";
import {
  listAllTicketCategoriesByShowId,
  reserveTicket,
} from "../../../../../services/operations/ticketCategory";
import { useAppDispatch, useAppSelector } from "../../../../../reducers/hooks";
import { setEventsErrorMsg } from "../../../../../slices/eventSlice";
import EventsErrorPage from "../../EventErrorsd";


const TicketSelection = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const ticketCategory = useAppSelector(
    (state) => state.ticketCategory.data || []
  );

  const showId = useAppSelector((state) => state.ticket.showId);
  console.log("SHOW ID", showId);

  const { contentName, eventId } = useParams();

  const userId = useAppSelector((state) => state.user.user?.userId);

  const [selectedTickets, setSelectedTickets] = useState<{
    [key: number]: number;
  }>({});

  const handleAdd = (id: number) => {
    setSelectedTickets((prev) => ({
      ...prev,
      [id]: Math.min((prev[id] || 0) + 1, 10), // max 10 tickets
    }));
  };

  const handleRemove = (id: number) => {
    setSelectedTickets((prev) => ({
      ...prev,
      [id]: Math.max((prev[id] || 0) - 1, 0), // not less than 0
    }));
  };

  const categories = Object.entries(selectedTickets)
    .filter(([, cnt]) => cnt > 0) // zero tickets mat bhejo
    .map(([id, cnt]) => ({
      categoryId: Number(id),
      count: cnt,
    }));

  async function clickHandler() {
    if (!userId) {
      dispatch(setEventsErrorMsg("You need to login to proceed. Do you want to login now?"))
    } else if (!categories) {
      window.alert("Add at least one ticket!");
    } else {
      try {
        const res = await dispatch(reserveTicket(categories));

        console.log("Reserve ticket details ", categories);

        if (res?.success) {
          navigate(`/events/${contentName}/${eventId}/booking/reviewandpay`, {
            replace: true,
          });
          // dispatch(setTicketInfo({ bookingId:reserveTicket}));
        }
      } catch (err) {
        console.error("Reservation failed", err);
      }
    }
  }



  
useEffect(() => {
   if(!showId){
     navigate(`/events/${contentName}/${eventId}`,{ replace: true })
    }else {
    dispatch(listAllTicketCategoriesByShowId(Number(showId)));
  }
}, [dispatch, showId,contentName,eventId,navigate]);



  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <EventsErrorPage/>
        
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={() =>
                navigate(`/events/${contentName}/${eventId}/booking/datetime`, {
                  replace: true,
                })
              }
              className="group flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
            >
              <svg className="w-3 h-3 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back to Date & Time</span>
            </button>
          </div>
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-1">
            Select Tickets
          </h1>
          <p className="text-sm text-gray-600">
            Choose your ticket categories and quantities
          </p>
        </div>

        {/* Ticket Categories */}
        <div className="space-y-4 mb-8">
          {ticketCategory.map((ticket) => (
            <div
              key={ticket.categoryId}
              className={`group bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl ${
                (ticket.capacity ?? 0) < 1
                  ? "opacity-60 cursor-not-allowed border-gray-300"
                  : "border-gray-200 hover:border-blue-300"
              }`}
            >
              <div className="p-6">
                <div className="flex justify-between items-center">
                  {/* Ticket Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          {ticket.name}
                        </h3>
                        <div className="flex items-center gap-4">
                          <p className="text-2xl font-bold text-blue-600">
                            M{ticket.price}
                          </p>
                          <div className="flex items-center gap-2">
                            {ticket.capacity < 10 && ticket.capacity > 0 && (
                              <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-medium">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                Fast Filling
                              </span>
                            )}
                            {ticket.capacity <= 0 && (
                              <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                                Sold Out
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  {ticket.capacity >= 1 && (
                    <div className="flex items-center gap-3">
                      <div className="flex items-center bg-gray-50 rounded-xl border-2 border-gray-200">
                        <button
                          onClick={() => handleRemove(ticket.categoryId)}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-l-xl transition-all duration-200"
                        >
                          <GrFormSubtract className="w-4 h-4" />
                        </button>
                        
                        <div className="px-4 py-2 min-w-[3rem] text-center">
                          <span className="text-lg font-bold text-gray-900">
                            {selectedTickets[ticket.categoryId] || 0}
                          </span>
                        </div>
                        
                        <button
                          onClick={() => handleAdd(ticket.categoryId)}
                          className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-r-xl transition-all duration-200"
                        >
                          <IoMdAdd className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Proceed Button */}
        <div className="flex justify-center">
          <button
            onClick={clickHandler}
            className={`group px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center gap-3 ${
              !userId
                ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
                : categories.length === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
            }`}
            disabled={!!userId && categories.length === 0}
          >
            <span>
              {!userId ? "Login to Proceed" : categories.length === 0 ? "Select Tickets" : "Review & Pay"}
            </span>
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketSelection;
