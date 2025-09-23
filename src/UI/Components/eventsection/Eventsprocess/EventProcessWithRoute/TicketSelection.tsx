import { useEffect, useState } from "react";
import { GrFormSubtract } from "react-icons/gr";
import { IoMdAdd } from "react-icons/io";
import PrimaryButton from "../PrimaryButton";
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
    <div className="space-y-4 max-w-4xl mx-auto">
      <EventsErrorPage/>
      <button
        onClick={() =>
          navigate(`/events/${contentName}/${eventId}/booking/datetime`, {
            replace: true,
          })
        }
        className="text-sky-500 hover:text-sky-600 mr-4"
      >
        ← Back
      </button>

      {ticketCategory.map((ticket) => (
        <div
          key={ticket.categoryId}
          className={`flex justify-between items-center p-4 rounded-lg shadow-sm border-2 ${
            (ticket.capacity ?? 0) < 1
              ? "bg-gray-100 opacity-60 cursor-not-allowed border-gray-300"
              : "bg-white border-sky-500"
          }`}
        >
          <div>
            <h4 className="font-semibold">Ticket {ticket.name}</h4>
            <p className="text-gray-600">{ticket.price} M</p>
            {ticket.capacity < 10 && (
              <span className="text-red-500 text-sm">Fast Filling</span>
            )}
            {ticket.capacity <= 0 && (
              <span className="text-red-500 text-sm">Sold Out</span>
            )}
          </div>

          {ticket.capacity >= 1 ? (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleRemove(ticket.categoryId)}
                className="px-3 py-1 border rounded text-red-600 cursor-pointer"
              >
                <GrFormSubtract />
              </button>
              <span>{selectedTickets[ticket.categoryId] || 0}</span>

              <button
                onClick={() => handleAdd(ticket.categoryId)}
                className="px-3 py-1 border rounded text-green-600 cursor-pointer"
              >
                <IoMdAdd />
              </button>
            </div>
          ) : null}
        </div>
      ))}

      <div className="mt-4 ">
        <PrimaryButton
          label={`${!userId ? "Login to proceed" : "Proceed"}`}
          onClick={clickHandler} // safe call in case onNext is undefined
          className="cursor-pointer"
        />
      </div>
    </div>
  );
};

export default TicketSelection;
