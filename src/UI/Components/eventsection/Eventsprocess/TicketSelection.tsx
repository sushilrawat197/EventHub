import { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { GrFormSubtract } from "react-icons/gr";
import PrimaryButton from "./PrimaryButton";

interface TicketSelectionUIProps {
  event: { venue: string; date: string; time: string };
  tickets: { id: number; name: string; price: number; status: string }[];
  onNext?: () => void; // optional
}

export default function TicketSelectionUI({
  event,
  tickets,
  onNext,
}: TicketSelectionUIProps) {

  
  const [selectedTickets, setSelectedTickets] = useState<{ [key: number]: number }>({});


  const handleAdd = (ticketId:number) => {
    setSelectedTickets((prev) => {
      const current = prev[ticketId] || 0;
      return { ...prev, [ticketId]: Math.min(current + 1, 10) };
    });
  };

  const handleRemove = (ticketId:number) => {
    setSelectedTickets((prev) => {
      const current = prev[ticketId] || 0;
      return { ...prev, [ticketId]: Math.max(current - 1, 0) };
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Event Info */}
      <div className="bg-gray-100 p-4 rounded-md mb-6">
        <h2 className="font-semibold text-lg">{event.venue}</h2>
        <p className="text-gray-600">
          {event.date} | {event.time}
        </p>
      </div>

      {/* Tickets Section */}
      <h3 className="font-semibold text-lg mb-1">Select Tickets</h3>
      <p className="text-sm text-gray-500 mb-4">
        You can add up to 10 tickets only
      </p>

      <div className="space-y-4">
        {tickets.map((ticket) => (
          <div
            key={ticket.id}
            className={`flex justify-between items-center p-4 rounded-lg shadow-sm border-2 border-sky-500 ${
              ticket.status === "sold"
                ? "bg-gray-100 opacity-60 cursor-not-allowed"
                : "bg-white"
            }`}
          >
            <div>
              <h4 className="font-semibold">{ticket.name}</h4>
              <p className="text-gray-600">M {ticket.price}</p>
              {ticket.status === "fast" && (
                <span className="text-red-500 text-sm">Fast Filling</span>
              )}
              {ticket.status === "sold" && (
                <span className="text-red-500 text-sm">Sold Out</span>
              )}
            </div>

            {ticket.status === "available" || ticket.status === "fast" ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleRemove(ticket.id)}
                  className="px-3 py-1 border rounded text-red-600 cursor-pointer"
                >
                  <GrFormSubtract />
                </button>
                <span>{selectedTickets[ticket.id] || 0}</span>
                <button
                  onClick={() => handleAdd(ticket.id)}
                  className="px-3 py-1 border rounded text-green-600 cursor-pointer"
                >
                  <IoMdAdd />
                </button>
              </div>
            ) : null}
          </div>
        ))}
      </div>

      {/* Proceed Button */}
      <div className="mt-4 ">
        <PrimaryButton 
        label="Proceed"
          onClick={() => onNext?.()} // safe call in case onNext is undefined
          className="cursor-pointer"
        />
      </div>
    </div>
  );
}
