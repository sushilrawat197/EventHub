import EventHeroCard from "./EventHeroCard";
import EventDetailsCard from "./EventDetailsCard";
import EventDescriptionAndArtists from "./EventDescriptionAndArtists";
import TermsAndConditions from "./TermsAndConditions";
import EventscardSlider from "./EventscardSlider";
import MobileEventDetailsCard from "./MobileEventDetails";
import { useLocation, useParams } from "react-router-dom";
import type { Content } from "../../../../interfaces/eventInterface/eventInterface";
import { useAppDispatch, useAppSelector } from "../../../../reducers/hooks";
import { useEffect } from "react";
import {
  listEventsBySearch,
  listEventById,
} from "../../../../services/operations/eventsApi";

import SpinnerLoading from "../../common/SpinnerLoading";
import { clearSingleEvent } from "../../../../slices/eventSlice";
import { listAllShowsByEvent } from "../../../../services/operations/showsApi";

export default function Layouteventspage() {
  const location = useLocation();
  const event = location.state as Content; // 👈 cast to your interface
  const dispatch = useAppDispatch();

  const { eventId } = useParams<{ eventId: string }>();

  console.log(eventId);

  const allEvents = useAppSelector(
    (state) => state.events.allEventsBySearch?.content || []
  );
  const singleEvent = useAppSelector((state) => state.events.singleEvent);
  const eventLoading = useAppSelector((state) => state.events.eventloading);
  const shows = useAppSelector((state) => state.shows.data);

  console.log("list all shows :", shows);

  // console.log("SHOWS...",shows)

  const showDateObjs = shows.map((e) => new Date(e.showDate));
  let formattedDates = ""; // 👈 pehle declare karo

  if (showDateObjs.length > 0) {
    // ascending sort
    showDateObjs.sort((a, b) => a.getTime() - b.getTime());

    const startDate = showDateObjs[0];
    const endDate = showDateObjs[showDateObjs.length - 1];

    const formattedStart = startDate.toLocaleDateString("en-US", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const formattedEnd = endDate.toLocaleDateString("en-US", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    formattedDates = `${formattedStart} - ${formattedEnd}`; // 👈 assign kiya
  }

  // ab yaha available hai


 let formattedTime = "";

if (shows.length === 1) {
  const [hourStr, minute] = shows[0].startTime.split(":"); // ["18","30","00"]
  let hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  if (hour > 12) hour -= 12;
  formattedTime = `${hour}:${minute} ${ampm}`;
}


  console.log(formattedTime);

 const uniqueVenues = Array.from(
  new Map(shows.map((s) => [s.venueId, s.venueName])).entries()
).map(([venueId, venueName]) => ({ venueId, venueName }));

console.log(uniqueVenues)

  // const cityname=shows.map((data)=>(
  // data.
  // ))

  const sliderEvents = allEvents.filter((e) => e.genre === event.genre);

  const details = {
    date: formattedDates, // e.g., "Wed, 10 Sep 2025, Thu, 11 Sep 2025"
    time: formattedTime, // e.g., "07:30 PM, 07:30 PM"
    duration: `${singleEvent?.durationMinutes} min`,
    ageLimit: singleEvent?.ageRestriction,
    languages: singleEvent?.languages || [],
    category: singleEvent?.genre,
    venue: uniqueVenues.map((v) => v.venueName).join(", "),
    price: singleEvent?.basePrice,
  };

  useEffect(() => {
    if (eventId) {
      dispatch(clearSingleEvent()); // 👈 old data hatao
      dispatch(listEventById(eventId));
      dispatch(listAllShowsByEvent(eventId));
    }
    dispatch(listEventsBySearch());
  }, [eventId, dispatch]);

  if (eventLoading) {
    return <SpinnerLoading />;
  }

  // console.log(details)
  return (
    <div className="container mx-auto px-2 py-4 mt-32 relative">
      {/* Flex Layout */}
      <div className="flex justify-between gap-20 ">
        {/* LEFT SIDE */}
        <div className="flex-1 space-y-5">
          
          <EventHeroCard
            title={singleEvent?.name ?? ""}
            image={singleEvent?.thumbnailUrl ?? null}
            tags={singleEvent?.genre ?? ""}
          />

          <MobileEventDetailsCard {...details} />

          <EventDescriptionAndArtists
            description={singleEvent?.longDescription}
            artists={singleEvent?.artists}
          />

          <EventscardSlider events={sliderEvents} />
        </div>

        {/* RIGHT SIDE */}
        <div className="lg:w-96 pt-10 hidden lg:block">
          <div className="sticky top-36">
            <EventDetailsCard {...details} />
          </div>
        </div>
      </div>

      {/* Outside flex */}
      <TermsAndConditions description={singleEvent?.termsAndConditions || []} />
    </div>
  );
}
