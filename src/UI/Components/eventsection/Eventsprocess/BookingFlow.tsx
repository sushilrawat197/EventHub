import { useEffect, useState } from "react";
import ProgressSteps from "./ProgressSteps";
import VenueSelection, { type VenueProps } from "./VenueSelection";
import DateTimeSelectionUI from "./DateTimeSelectionUI";
import ReviewAndPayUI from "./ReviewAndPay";
import TicketSelectionUI from "./TicketSelection";
import { useAppDispatch, useAppSelector } from "../../../../reducers/hooks";
// import { useSearchParams } from "react-router-dom";
import { useParams } from "react-router-dom";
// import type { EventDetailsCardProps } from "../Eventspage/EventDetailsCard";
import type { Content } from "../../../../interfaces/eventInterface/eventInterface";
import { getEvents } from "../../../../services/operations/eventsApi";

export default function BookingFlow() {

    const {contentId} = useParams()
    console.log(contentId)

  const eventData=useAppSelector((state)=>state.events.events);

const filteredEvent = eventData.find(
  (e) => e.contentId === Number(contentId)
) as Content;

  const processLebel=filteredEvent?.contentName || ""

  console.log(filteredEvent);

  const steps = [
    { id: 1, label: "Venue" },
    { id: 2, label: "Date & Time" },
    { id: 3, label: "Ticket" },
    { id: 4, label: "Review &   Pay" },
  ];

  const [currentStep, setCurrentStep] = useState(1);

 //making venueData

const finalVenuesData: VenueProps[] =
  filteredEvent?.shows.reduce<VenueProps[]>((acc, show) => {
    const city = show.venue.city;

    // check if city already exists in acc
    let cityGroup = acc.find(item => item.city === city);
    if (!cityGroup) {
      cityGroup = { city, venues: [] };
      acc.push(cityGroup);
    }

    cityGroup.venues.push({
      showId: show.showId,
      name: show.venue.name,
      date: new Date(show.showDateTime).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      status: show.availableSeats === 0 ? "sold out" : "available",
    });

    return acc;
  }, []) || [];

  


 // Object ko array me convert
const venuesData = Object.values(finalVenuesData);
console.log(finalVenuesData)

  // //  Venue Data
  // const venuesData = [
  //   {
  //     city: "Lesotho",
  //     venues: [
  //       {
  //         name: "Studio XO Bar, Sector 29: Maseru",
  //         date: "Starting from 23 Aug 2025",
  //         status: "fast",
  //       },
  //       {
  //         name: "Kedarnath Sahni Auditorium: Maseru",
  //         date: "29 Aug 2025",
  //         status: "available",
  //       },
  //       {
  //         name: "Panchsheel Balak Inter College: Maseru",
  //         date: "31 Aug 2025",
  //         status: "available",
  //       },
  //     ],
  //   },


  //   {
  //     city: "Maseru",
  //     venues: [
  //       {
  //         name: "Pacific Mall: Maseru",
  //         date: "02 Sep 2025",
  //         status: "available",
  //       },
  //     ],
  //   },
  // ];

const showData = useAppSelector((state) => state.ticket.show);

const eventDate = showData
  ? new Date(showData.showDateTime).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  : "";
      
const eventTime = showData
  ? new Date(showData.showDateTime).toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true, // 👈 12-hour format
    })
  : "";
  
const venueName=showData?.venue.name;
console.log(eventDate,eventTime,venueName);

const event = {
  venue: showData?.venue.name || "Unknown Venue",
  date: eventDate,
  time: eventTime,
};


  const tickets = [
    { id: 1, name: "PHASE 2", price: 1499, status: "fast" },
    { id: 2, name: "EARLY BIRD", price: 799, status: "sold" },
    { id: 3, name: "PHASE 1", price: 999, status: "sold" },
  ];

  // Render step content dynamically
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <VenueSelection
            venues={venuesData} 
            onNext={() => setCurrentStep(2)}
          />
        );

      case 2:
        return <DateTimeSelectionUI  onNext={() => setCurrentStep(3)} />;

      case 3:
        return (
          <TicketSelectionUI
            event={event}
            tickets={tickets}
            onNext={() => setCurrentStep(4)}
          />
        );

      case 4:
        return <ReviewAndPayUI contentName={processLebel}/>;

      default:
        return null;
    }
  };

const dispatch=useAppDispatch();
  useEffect(()=>{
    dispatch(getEvents())
  },[])

  return (
    <div className="">
      {/* Progress Bar */}
      <ProgressSteps
        contentName={processLebel}
        steps={steps}
        currentStep={currentStep}
        onStepClick={(stepId: number) => {
          // Step wapas jaane ka logic
          setCurrentStep(stepId);
        }}
      />

      {/* Dynamic Step Content */}
      <div className="mt-6 px-1">{renderStepContent()}</div>
    </div>
  );
}
