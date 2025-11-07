import {  useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../../reducers/hooks";
import { useNavigate, useParams} from "react-router-dom";
import { setTicketInfo } from "../../../../../slices/ticketInfoSlice";
// import { listEventById } from "../../../../../services/operations/eventsApi";
import ScrollToTop from "../../../common/ScrollToTop";

const DateTimeSelection = (

) => {
 

  const navigate=useNavigate();
  const dispatch = useAppDispatch();

   const {contentName,eventId}=useParams();

  const venueId=useAppSelector((state)=>state.ticket.venueId);
  const shows = useAppSelector((state) => state.shows.data);

  //(shows);




  // const singleEvent = useAppSelector((state) => state.events.singleEvent);



  // filter shows by event + venue
  const filteredShows = shows.filter((item) =>
      item.eventId === Number(eventId) && item.venueId === Number(venueId)
  );


  const [selectedDateIdx, setSelectedDateIdx] = useState<number | null>(null);
  const [selectedTimeIdx, setSelectedTimeIdx] = useState<number | null>(null);
  const [selectedShowId, setSelectedShowId] = useState<number | null>(null);


  const [filteredTimes, setFilteredTimes] = useState<
    { showId: number; startTime: string }[]
  >([]);

  // 1️⃣ group shows by date
  const showsByDate = filteredShows.reduce(
    (acc: Record<string, typeof filteredShows>, show) => {
      if (!acc[show.showDate]) acc[show.showDate] = [];
      acc[show.showDate].push(show);
      return acc;
    },
    {}
  );

  // 2️⃣ get unique dates
  const uniqueDates = Object.keys(showsByDate);


  // 3️⃣ handle date click
  const clickHandler = (idx: number, date: string) => {
    setSelectedDateIdx(idx);
    setSelectedTimeIdx(null); // reset time
    setSelectedShowId(null);  // reset showId

    const times = showsByDate[date].map((s) => ({
      showId: s.showId,
      startTime: s.startTime,
    }));
    setFilteredTimes(times);
  };


  // 4️⃣ handle time click
  const timeHandler = (idx: number, showId: number) => {
    setSelectedTimeIdx(idx);
    setSelectedShowId(showId);
  };




  // 5️⃣ handle proceed
  const proceedHandler = () => {
    if (!selectedShowId) return alert("Please select date and time first!");
    //("Clicked Proceed Handler",contentName,eventId)
    navigate(`/events/${contentName}/${eventId}/booking/ticket`,{ replace: true })
    dispatch(setTicketInfo({ showId:selectedShowId}));
  };



  useEffect(()=>{
    if(!venueId){
     navigate(`/events/${contentName}/${eventId}`,{ replace: true })
    }
    
    // if(eventId) {
    //   dispatch(listEventById(eventId));
    // }

  },[dispatch, eventId,contentName,navigate,venueId])


  return (
    <div className="min-h-[calc(100vh-200px)] bg-gradient-to-br from-gray-50 to-blue-50">
      <ScrollToTop />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={()=>navigate(`/events/${contentName}/${eventId}/booking/venue`,{ replace: true })}
              className="group flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
            >
              <svg className="w-3 h-3 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back to Venues</span>
            </button>
          </div>
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-1">
            Select Date & Time
          </h1>
          <p className="text-sm text-gray-600">
            Choose your preferred date and show time
          </p>
        </div>

        {/* Date Selection */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 bg-blue-100 rounded-md flex items-center justify-center">
              <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-sm font-bold text-gray-900">Select Date</h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {uniqueDates.map((date, idx) => (
              <button
                key={idx}
                onClick={() => clickHandler(idx, date)}
                className={`group border-2 rounded-lg p-3 text-center cursor-pointer transition-all duration-300 hover:shadow-md hover:scale-105 ${
                  selectedDateIdx === idx
                    ? "border-blue-500 bg-blue-50 shadow-md scale-105"
                    : "border-gray-200 hover:border-blue-300 bg-white"
                }`}
              >
                <div className="flex flex-col items-center gap-1">
                  <div className="text-xs font-medium text-gray-600">
                    {new Date(date).toLocaleDateString("en-US", { weekday: "short" })}
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                    {new Date(date).toLocaleDateString("en-US", { day: "numeric" })}
                  </div>
                  <div className="text-xs font-medium text-gray-600">
                    {new Date(date).toLocaleDateString("en-US", { month: "short" })}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Time Selection */}
        {filteredTimes.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 bg-green-100 rounded-md flex items-center justify-center">
                <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-sm font-bold text-gray-900">Select Show Time</h3>
            </div>
            
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2">
              {filteredTimes.map((time, idx) => (
                <button
                  key={idx}
                  onClick={() => timeHandler(idx, time.showId)}
                  className={`group border-2 rounded-lg p-3 text-center cursor-pointer transition-all duration-300 hover:shadow-md hover:scale-105 ${
                    selectedTimeIdx === idx
                      ? "border-green-500 bg-green-50 shadow-md scale-105"
                      : "border-gray-200 hover:border-green-300 bg-white"
                  }`}
                >
                  <div className="flex flex-col items-center gap-1">
                    <div className="text-sm font-bold text-gray-900">
                      {time.startTime.slice(0, 5)}
                    </div>
                    <div className="text-xs text-gray-500 font-medium">Available</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Proceed Button */}
        <div className="flex justify-center">
          <button
            onClick={proceedHandler}
            disabled={!selectedShowId}
            className={`group px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 flex items-center gap-2 ${
              selectedShowId
                ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md hover:shadow-lg transform hover:scale-105"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            <span>Continue to Tickets</span>
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};


export default DateTimeSelection