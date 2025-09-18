

import  {Outlet, useLocation, useParams}  from "react-router-dom";


export default function BookingFlow() {
  const { contentName } = useParams();
  const location = useLocation();

  

  // URL ke basis pe step nikaal lo
  const path = location.pathname;
  let step = 1;
  if (path.includes("datetime")) step = 2;
  if (path.includes("ticket")) step = 3;
  if (path.includes("payment")) step = 4;

  
  const steps = [
    { number: 1, title: "Venue", active: step >= 1, completed: step > 1 },
    { number: 2, title: "Date & Time", active: step >= 2, completed: step > 2 },
    { number: 3, title: "Ticket", active: step >= 3, completed: step > 3 },
    { number: 4, title: "Payment", active: step >= 4, completed: false },
  ];


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="text-sky-500 text-2xl font-bold mr-8">Ticketing</div>
            <div className="flex-1 flex items-center gap-2">
              <h1 className="text-xl font-bold text-gray-800 capitalize">
                {contentName}
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-center">
            {steps.map((stepItem, idx) => (
              <div key={idx} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${
                    stepItem.completed
                      ? "bg-gray-900 text-white"
                      : stepItem.active
                      ? "bg-sky-500 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {stepItem.completed ? "✓" : stepItem.number}
                </div>
                <span
                  className={`ml-2 text-sm font-medium ${
                    stepItem.active ? "text-gray-800" : "text-gray-500"
                  }`}
                >
                  {stepItem.title}
                </span>
                {idx < steps.length - 1 && (
                  <div
                    className={`w-12 h-0.5 mx-4 ${
                      stepItem.completed ? "bg-sky-500" : "bg-gray-200"
                    }`}
                  ></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Outlet /> {/* Yeh child route (VenueSelection, DateTime, Ticket, Payment) render karega */}
      </div>
    </div>
  );
}






// import { useEffect, useState } from "react";
// import ProgressSteps from "./ProgressSteps";
// import VenueSelection from "./VenueSelection";
// import DateTimeSelectionUI from "./DateTimeSelectionUI";
// import ReviewAndPayUI from "./ReviewAndPay";
// import TicketSelectionUI from "./TicketSelection";
// import { useAppDispatch, useAppSelector } from "../../../../reducers/hooks";
// // import { useSearchParams } from "react-router-dom";
// import { useParams } from "react-router-dom";
// // import type { EventDetailsCardProps } from "../Eventspage/EventDetailsCard";



// import { listAllEvents } from "../../../../services/operations/eventsApi";

// import { listAllShowsByEvent } from "../../../../services/operations/showsApi";

// export default function BookingFlow() {
//   const { eventId } = useParams();
//   console.log(eventId);

//   const eventData = useAppSelector((state) => state.events.singleEvent);
//   const showsData = useAppSelector((state) => state.shows.data);

//   // const filteredEvent = eventData.find(
//   //   (e) => e.eventId === Number(eventId)
//   // ) as EventResponse;

//   const processLebel = eventData?.name || "";

//   // console.log(filteredEvent);

//   const steps = [
//     { id: 1, label: "Venue" },
//     { id: 2, label: "Date & Time" },
//     { id: 3, label: "Ticket" },
//     { id: 4, label: "Review &   Pay" },
//   ];

//   const [currentStep, setCurrentStep] = useState(1);

//   //making venueData

//   // const finalVenuesData: VenueProps[] =
//   //   filteredEvent?.shows.reduce<VenueProps[]>((acc, show) => {
//   //     const city = show.venue.city;

//   //     // check if city already exists in acc
//   //     let cityGroup = acc.find(item => item.city === city);
//   //     if (!cityGroup) {
//   //       cityGroup = { city, venues: [] };
//   //       acc.push(cityGroup);
//   //     }

//   //     cityGroup.venues.push({
//   //       showId: show.showId,
//   //       name: show.venue.name,
//   //       date: new Date(show.showDateTime).toLocaleDateString("en-GB", {
//   //         day: "2-digit",
//   //         month: "short",
//   //         year: "numeric",
//   //       }),
//   //       status: show.availableSeats === 0 ? "sold out" : "available",
//   //     });

//   //     return acc;
//   //   }, []) || [];

//   // Object ko array me convert

//   const venuesData = showsData.map((item)=>item.venueName)
//   const showData = useAppSelector((state) => state.ticket.show);

//   const eventDate = showData
//     ? new Date(showData.showDateTime).toLocaleDateString("en-GB", {
//         day: "2-digit",
//         month: "short",
//         year: "numeric",
//       })
//     : "";

//   const eventTime = showData
//     ? new Date(showData.showDateTime).toLocaleTimeString("en-GB", {
//         hour: "2-digit",
//         minute: "2-digit",
//         hour12: true, // 👈 12-hour format
//       })
//     : "";

//   const venueName = showData?.venue.name;
//   console.log(eventDate, eventTime, venueName);

//   const event = {
//     venue: showData?.venue.name || "Unknown Venue",
//     date: eventDate,
//     time: eventTime,
//   };

//   const tickets = [
//     { id: 1, name: "PHASE 2", price: 1499, status: "fast" },
//     { id: 2, name: "EARLY BIRD", price: 799, status: "sold" },
//     { id: 3, name: "PHASE 1", price: 999, status: "sold" },
//   ];

//   // Render step content dynamically
//   const renderStepContent = () => {
//     switch (currentStep) {
//       case 1:
//         return (
//           <VenueSelection
//             venues={venuesData}
//             onNext={() => setCurrentStep(2)}
//           />
//         );

//       case 2:
//         return <DateTimeSelectionUI onNext={() => setCurrentStep(3)} />;

//       case 3:
//         return (
//           <TicketSelectionUI
//             event={event}
//             tickets={tickets}
//             onNext={() => setCurrentStep(4)}
//           />
//         );

//       case 4:
//         return <ReviewAndPayUI contentName={processLebel} />;

//       default:
//         return null;
//     }
//   };

//   const dispatch = useAppDispatch();
//   useEffect(() => {
//     if (eventId) {
//       dispatch(listAllShowsByEvent(eventId));
//     }
//     dispatch(listAllEvents());
//   }, []);

//   return (
//     <div className=" flex flex-col justify-center items-center min-w-max">
//       {/* Progress Bar */}
//       <ProgressSteps
//         contentName={processLebel}
//         steps={steps}
//         currentStep={currentStep}
//         onStepClick={(stepId: number) => {
//           // Step wapas jaane ka logic
//           setCurrentStep(stepId);
//         }}
//       />

//       {/* Dynamic Step Content */}
//       <div className="mt-6 px-1 w-full">{renderStepContent()}</div>
//     </div>
//   );
// }

// Venue Selection Component



