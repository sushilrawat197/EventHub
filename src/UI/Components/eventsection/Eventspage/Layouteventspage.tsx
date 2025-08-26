import EventHeroCard from "./EventHeroCard";
import EventDetailsCard from "./EventDetailsCard";
import EventDescriptionAndArtists from "./EventDescriptionAndArtists";
import TermsAndConditions from "./TermsAndConditions";
import EventscardSlider from "./EventscardSlider";
import MobileEventDetailsCard from "./MobileEventDetails";
import { useLocation } from "react-router-dom";
import type { Content } from "../../../../interfaces/eventInterface/eventInterface";
import { useAppSelector } from "../../../../reducers/hooks";


export default function Layouteventspage() {
  const location = useLocation();
  const event = location.state as Content; // 👈 cast to your interface

  console.log(event);
  
const allEvents = useAppSelector((state) => state.events.events);

const showDateObjs = event.shows.map(e => new Date(e.showDateTime));

const contentId=event.contentId;

// console.log(showDateObjs)

// Assuming allEvents is available somewhere
// const allEvents: Content[] = [...]; // all events list

const formattedDates = showDateObjs.map(date =>
  date.toLocaleDateString("en-US", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
);

const formattedTimes = showDateObjs.map(date =>
  date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })
);

const venueData=event.shows.map((data)=>(
data.venue.name
))

const cityname=event.shows.map((data)=>(
data.venue.city
))


const sliderEvents = allEvents.filter((e) => e.genre === event.genre)

  
const details = {
  date: formattedDates.join("- "),  // e.g., "Wed, 10 Sep 2025, Thu, 11 Sep 2025"
  time: formattedTimes.join("- "),  // e.g., "07:30 PM, 07:30 PM"
  duration: `${event.durationMinutes} min`,
  ageLimit: event.ageRestriction,
  languages: [event.defaultLang],
  category: event.genre,
  venue: venueData.join(", "),
  price: event.basePrice,
  contentId:contentId,
  city:cityname
};



  // console.log(details)
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
