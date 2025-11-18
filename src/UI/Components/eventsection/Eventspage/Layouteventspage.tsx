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
  checkEventAvailability,
} from "../../../../services/operations/eventsApi";

import SpinnerLoading from "../../common/SpinnerLoading";
import { clearSingleEvent } from "../../../../slices/eventSlice";
import { fetchFilteredShows, listAllShowsByEvent } from "../../../../services/operations/showsApi";
import { clearSetShows } from "../../../../slices/showSlice";


export default function Layouteventspage() {
  const location = useLocation();
  const event = location.state as Content; // 👈 cast to your interface
  const dispatch = useAppDispatch();

  const { eventId } = useParams<{ eventId: string }>();

  // console.log(eventId);

  const allEvents = useAppSelector(
    (state) => state.events.allEventsBySearch?.content || []
  );
  const singleEvent = useAppSelector((state) => state.events.singleEvent);
  const eventLoading = useAppSelector((state) => state.events.eventloading);
  const shows = useAppSelector((state) => state.shows.data);

  // console.log("list all shows :", shows);



  // ------------------ FILTER SHOWS BASED ON AVAILABILITY ------------------


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

     // ✅ Check if start and end are same
  if (startDate.getTime() === endDate.getTime()) {
    formattedDates = formattedStart; // same date, sirf ek baar show karo
  } else {
    formattedDates = `${formattedStart} - ${formattedEnd}`; // range show karo
  }
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


  // console.log(formattedTime);


 const uniqueVenues = Array.from(
  new Map(shows.map((s) => [s.venueId, s.venueName])).entries()
).map(([venueId, venueName]) => ({ venueId, venueName }));

// console.log(uniqueVenues)

  // const cityname=shows.map((data)=>(
  // data.
  // ))

  const sliderEvents = allEvents.filter((e) => e?.genre === event?.genre);

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
      dispatch(clearSetShows()); // 👈 old data hatao
      dispatch(listEventById(eventId));
      dispatch(listAllShowsByEvent(eventId));
      dispatch(checkEventAvailability(eventId));
      dispatch(fetchFilteredShows(eventId));
    }
    dispatch(listEventsBySearch());
  }, [eventId, dispatch]);



  // if(!details){
  //   return <SpinnerLoading/>
  // }


  if (eventLoading) {
    return <SpinnerLoading />;
  }

  // console.log(details)
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 lg:mt-32 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Event Title - Outside Hero Card */}
        <div className="mb-3">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
            {singleEvent?.name ?? ""}
          </h1>
        </div>

        {/* Modern Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT SIDE - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Section */}
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
              <EventHeroCard
                title=""
                image={singleEvent?.thumbnailUrl ?? null}
                tags={singleEvent?.genre ?? ""}
              />
            </div>

            {/* Mobile Event Details - Hidden on desktop */}
            <div className="lg:hidden">
              <MobileEventDetailsCard {...details} />
            </div>

            {/* Event Description */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
              <EventDescriptionAndArtists
                description={singleEvent?.longDescription}
                artists={singleEvent?.artists}
              />
            </div>

            {/* Related Events */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
              <EventscardSlider events={sliderEvents} />
            </div>
          </div>

          {/* RIGHT SIDE - Booking Card */}
          <div className="lg:col-span-1 hidden lg:block">
            <div className=" sticky top-32">
              <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                <EventDetailsCard {...details} />
              </div>
            </div>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="mt-12 mb-20">
          <TermsAndConditions description={singleEvent?.termsAndConditions || []} />
        </div>
      </div>
    </div>
  );
}
