import EventHeroCard from "./EventHeroCard";
import EventDetailsCard from "./EventDetailsCard";
import EventDescriptionAndArtists from "./EventDescriptionAndArtists";
import TermsAndConditions from "./TermsAndConditions";
import EventscardSlider from "./EventscardSlider";
import MobileEventDetailsCard from "./MobileEventDetails";
import { useLocation } from "react-router-dom";
import type { Content } from "../../../../interfaces/eventInterface/eventInterface";
import { useAppSelector } from "../../../../reducers/hooks";


// interface details {
//   date: string;
//   time: string;
//   duration: string;
//   ageLimit: number;
//   languages: [];
//   category: string;
//   venue: string;
//   price: number;
//   bookingMsg: "";
//   fillingFast: true;
// }

// const event = {
//   title: "ALLOW ME - A Standup Comedy Show by John doe",
//   image: "Events1.jpg",
//   categories: ["Stand up Comedy", "Comedy Shows"],
//   interestedCount: 457,

//   details: {
//     date: "Sun 17 Aug 2025",
//     time: "8:30 PM",
//     duration: "1 hour 30 minutes",
//     ageLimit: "16yrs +",
//     languages: ["English"],
//     category: "Comedy",
//     venue: "The Laugh Store: Maseru",
//     price: "1499",
//     bookingMsg: "",
//     fillingFast: true,
//   },

//   description: `Sumit, one of India’s top stand-up comedians, Sumit, one of India’s top stand-up comediansSumit, one of India’s top stand-up comediansSumit, one of India’s top stand-up comediansSumit, one of India’s top stand-up comedians`,

//   artists: [
//     {
//       name: "Sumit Dua",
//       role: "Comedian",
//       image: "Events1.jpg",
//     },
//   ],

//   slider: [
//     { title: "Samay Raina - Still Alive", image: "Events1.jpg" },
//     { title: "Comedy Overload - Sunil Grover", image: "Events2.jpg" },
//     { title: "Abhishek Upmanyu Live", image: "Events3.jpg" },
//     { title: "Comedy Show Noida Sector 18", image: "Events4.jpg" },
//     { title: "Comedy Show Noida Sector 18", image: "Events4.jpg" },
//     { title: "Comedy Show Noida Sector 18", image: "Events4.jpg" },
//     { title: "Comedy Show Noida Sector 18", image: "Events4.jpg" },
//   ],
// };



export default function Layouteventspage() {
  const location = useLocation();
  const event = location.state as Content; // 👈 cast to your interface
  
const allEvents = useAppSelector((state) => state.events.events);
const showDateObj = new Date(event.shows[0]?.showDateTime);

// Assuming allEvents is available somewhere
// const allEvents: Content[] = [...]; // all events list


const sliderEvents = allEvents
  .filter((e) => e.genre === event.genre)

const details = {
  date: showDateObj.toLocaleDateString("en-US", {
    weekday: "short",   // 👉 Fri
    day: "2-digit",     // 👉 20
    month: "short",     // 👉 Sep
    year: "numeric",    // 👉 2025
  }),
  time: showDateObj.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }),
  duration: `${event.durationMinutes} min`,
  ageLimit: event.ageRestriction,
  languages: [event.defaultLang],
  category: event.genre,
  venue: event.shows[0]?.venue?.name || "Venue not decided",
  price: event.basePrice,
};


  console.log(details.date)
  return (
    <div className="container mx-auto px-2 py-4 mt-32 relative">
      {/* Flex Layout */}
      <div className="flex justify-between gap-20 ">
        {/* LEFT SIDE */}
        <div className="flex-1 space-y-5">
          <EventHeroCard
            title={event.title}
            image={event.thumbnail}
            tags={event.genre}
          />

          <MobileEventDetailsCard {...details} />

          <EventDescriptionAndArtists
            description={event.longDescription}
            artists={event.artists}
          />

          <EventscardSlider events={sliderEvents} />
        </div>

        {/* RIGHT SIDE */}
        <div className="lg:w-96 md:hi pt-10 hidden lg:block">
          <div className="sticky top-36">
            <EventDetailsCard {...details} />
          </div>
        </div>
      </div>

      {/* Outside flex */}
      <TermsAndConditions description={event.termsNConditions}/>
    </div>
  );
}
