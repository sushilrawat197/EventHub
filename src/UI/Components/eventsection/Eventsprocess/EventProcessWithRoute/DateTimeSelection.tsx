import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../../reducers/hooks";
import { useNavigate, useParams} from "react-router-dom";
import { setTicketInfo } from "../../../../../slices/ticketInfoSlice";

const DateTimeSelection = (

) => {
 

  const navigate=useNavigate();
  const dispatch = useAppDispatch();

   const {contentName,eventId}=useParams();

  const venueId=useAppSelector((state)=>state.ticket.venueId);
  const shows = useAppSelector((state) => state.shows.data);

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
    console.log("Clicked Proceed Handler",contentName,eventId)
    navigate(`/events/${contentName}/${eventId}/booking/ticket`,{ replace: true })
    dispatch(setTicketInfo({ showId:selectedShowId}));
  };

  
  useEffect(() => {
    const savedTicketInfo = localStorage.getItem("ticketInfo");
    if (savedTicketInfo) {
      dispatch(setTicketInfo(JSON.parse(savedTicketInfo)));
    }
  }, [dispatch]);

  return (
    <div className="max-w-4xl mx-auto rounded-2xl shadow-2xl p-6">
      <div className="flex items-center mb-6 ">
        <button
          onClick={()=>navigate(`/events/${contentName}/${eventId}/booking/venue`,{ replace: true })}
          className="text-sky-500 hover:text-sky-600 mr-4"
        >
          ← Back
        </button>
        <h2 className="text-2xl font-semibold text-gray-800">Select Date & Time</h2>
      </div>

      {/* Date Selection */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-700 mb-3">Select Date</h3>

        <div className="flex gap-3 flex-wrap justify-center">

          {uniqueDates.map((date, idx) => (
            <button
              key={idx}
              onClick={() => clickHandler(idx, date)}
              className={`border rounded-lg p-3 text-center cursor-pointer hover:border-sky-500 ${
                selectedDateIdx === idx
                  ? "border-sky-500 bg-sky-50"
                  : "border-gray-200"
              }`}
            >
              <div className="text-lg font-semibold">
                {new Date(date).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Time Selection */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-3">Select Show Time</h3>
        
        <div className="grid grid-cols-4 gap-3">
          {filteredTimes.map((time, idx) => (
            <button
              key={idx}
              onClick={() => timeHandler(idx, time.showId)}
              className={`border rounded-lg p-1 text-center cursor-pointer hover:border-sky-500 ${
                selectedTimeIdx === idx
                  ? "border-sky-500 bg-sky-50"
                  : "border-gray-200"
              }`}
            >
              <div className="font-semibold"> {time.startTime.slice(0, 5)}</div>
              <div className="text-xs text-gray-500">Available</div>
            </button>
          ))}
        </div>
      </div>

      <div className="w-full flex justify-center items-center">
        <button
          onClick={proceedHandler}
          disabled={!selectedShowId}
          className={`w-2xl mt-4 py-3 rounded-lg font-semibold text-white ${
            selectedShowId
              ? "bg-sky-500 hover:bg-sky-600"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Proceed
        </button>
      </div>
    </div>
  );
};


export default DateTimeSelection