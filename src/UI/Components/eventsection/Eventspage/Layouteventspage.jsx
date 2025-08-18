import React from "react";
import EventHeroCard from "./EventHeroCard";
import EventDetailsCard from "./EventDetailsCard";
import EventDescriptionAndArtists from "./EventDescriptionAndArtists";
import EventscardSlider from "./EventscardSlider";
import TermsAndConditions from "./TermsAndConditions";

export default function Layouteventspage() {
  const event = {
    title: "ALLOW ME - A Standup Comedy Show by Sumit Dua",
    image: "Events1.jpg",
    categories: ["Stand up Comedy", "Comedy Shows"],
    interestedCount: 457,

    // details: {
    //   date: "Sun 17 Aug 2025",
    //   time: "8:30 PM",
    //   duration: "1 hour 30 minutes",
    //   ageLimit: "16yrs +",
    //   languages: ["Hindi", "English"],
    //   category: "Comedy",
    //   venue: "The Laugh Store: DLF Cyberhub, Gurugram",
    //   price: "₹1499 onwards",
    //   bookingMsg: "Bookings are filling fast for Delhi-NCR",
    //   fillingFast: true,
    // },

    description: `Sumit, one of India’s top stand-up comedians, is a powerhouse performer, host (Shark Tank India Season 2 & 3, Comicstaan S3 Finale), actor, creator, and writer. With a global fanbase, he has captivated over 100,000 live attendees across shows in 25+ countries, amassing 100M+ views on his content across social media...`,

    artists: [
      {
        name: "",
        role: "Actor",
        image: "Events1.jpg",
      },
    ],
    slider: [
      {
        title: "Samay Raina - Still Alive & Unfiltered",
        image: "Events1.jpg",
      },
      {
        title: "Comedy Overload - A Comedy Show By Sunil Grover",
        image: "Events2.jpg",
      },
      {
        title: "TOXIC - Abhishek Upmanyu Live",
        image: "Events3.jpg",
      },
      {
        title: "Comedy Show Noida Sector 18",
        image: "Events4.jpg",
      },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto  px-2 py-4  ">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10     ">
        {/* LEFT SIDE */}
        <div className="lg:col-span-2 space-y-5  ">
          <EventHeroCard
            title={event.title}
            image={event.image}
            categories={event.categories}
            interestedCount={event.interestedCount}
          />

          <EventDescriptionAndArtists
            description={event.description}
            artists={event.artists}
          />
        </div>

        {/* RIGHT SIDE */}
        <div className="lg:col-span-1 mt-10">
          <EventDetailsCard details={event.details} />
        </div>
        <TermsAndConditions />
      </div>
      <EventscardSlider events={event.slider} />
    </div>
  );
}
