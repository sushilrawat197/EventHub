import { useState } from "react";
import ProgressSteps from "./ProgressSteps";
import VenueSelection from "./VenueSelection";
import DateTimeSelectionUI from "./DateTimeSelectionUI";
import ReviewAndPayUI from "./ReviewAndPay";
import TicketSelectionUI from "./TicketSelection";
// import { useSearchParams } from "react-router-dom";
// import {  useLocation } from "react-router-dom";
// import type { EventDetailsCardProps } from "../Eventspage/EventDetailsCard";

export default function BookingFlow() {
  // const [searchParams, setSearchParams] = useSearchParams();
  // const location = useLocation();
  // const eventData = location.state as EventDetailsCardProps;

  // const city=eventData.city
  // const venue=eventData.venue
  // console.log(city)
  // console.log(venue)

  const steps = [
    { id: 1, label: "Venue" },
    { id: 2, label: "Date & Time" },
    { id: 3, label: "Ticket" },
    { id: 4, label: "Review &   Pay" },
  ];

  const [currentStep, setCurrentStep] = useState(1);

  //  Venue Data
  const venuesData = [
    {
      city: "Lesotho",
      venues: [
        {
          name: "Studio XO Bar, Sector 29: Maseru",
          date: "Starting from 23 Aug 2025",
          status: "fast",
        },
        {
          name: "Kedarnath Sahni Auditorium: Maseru",
          date: "29 Aug 2025",
          status: "available",
        },
        {
          name: "Panchsheel Balak Inter College: Maseru",
          date: "31 Aug 2025",
          status: "available",
        },
      ],
    },

    {
      city: "Maseru",
      venues: [
        {
          name: "Pacific Mall: Maseru",
          date: "02 Sep 2025",
          status: "available",
        },
      ],
    },
  ];

  const event = {
    venue: "The Laugh Store: Lesotho",
    date: "Mon 18 Aug",
    time: "02:30 PM",
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
        return <DateTimeSelectionUI onNext={() => setCurrentStep(3)} />;

      case 3:
        return (
          <TicketSelectionUI
            event={event}
            tickets={tickets}
            onNext={() => setCurrentStep(4)}
          />
        );

      case 4:
        return <ReviewAndPayUI />;

      default:
        return null;
    }
  };

  return (
    <div className="">
      {/* Progress Bar */}
      <ProgressSteps
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
