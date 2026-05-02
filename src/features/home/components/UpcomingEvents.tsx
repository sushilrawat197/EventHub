import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { FaTicketAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/store/hooks";
import { listEventsBySearch } from "../../events/api/eventsApi";

// const events = [
//   {
//     date: "17",
//     month: "SEP",
//     year: "2020",
//     title: "Golf Clubbers Annual Agenda",
//     location: "University of Golf Clubbers",
//     status: "SOLD OUT",
//     image: "Events1.jpg",
//   },
//   {
//     date: "16",
//     month: "APR",
//     year: "2021",
//     title: "Rio Olympic Games 1st Run",
//     location: "Rio Olympic Hall",
//     status: "M 5.00",
//     image: "Events2.jpg",
//   },
//   {
//     date: "11",
//     month: "MAR",
//     year: "2023",
//     title: "Riga Saxophone Days",
//     location: "Arena Riga",
//     status: "M 33.00",
//     discount: "M 48.00",
//     image: "Events3.jpg",
//   },
//   {
//     date: "05",
//     month: "JAN",
//     year: "2024",
//     title: "Football League Start",
//     location: "Bangalore Stadium",
//     status: "M 10.00",
//     image: "Events4.jpg",
//   },
//   {
//     date: "22",
//     month: "JUN",
//     year: "2025",
//     title: "Tech Conference 2025",
//     location: "Delhi Tech Park",
//     status: "FREE",
//     image: "Events5.jpg",
//   },
//   {
//     date: "09",
//     month: "AUG",
//     year: "2025",
//     title: "Startup Pitch Day",
//     location: "Hyderabad Expo",
//     status: "M 7.00",
//     image: "Events6.jpg",
//   },

//   {
//     date: "09",
//     month: "AUG",
//     year: "2025",
//     title: "Startup Pitch Day",
//     location: "Hyderabad Expo",
//     status: "M 7.00",
//     image: "Events7.jpg",
//   },

//   {
//     date: "09",
//     month: "AUG",
//     year: "2025",
//     title: "Startup Pitch Day",
//     location: "Hyderabad Expo",
//     status: "M 7.00",
//     image: "Events8.jpg",
//   },

//   {
//     date: "09",
//     month: "AUG",
//     year: "2025",
//     title: "Startup Pitch Day",
//     location: "Hyderabad Expo",
//     status: "M 7.00",
//     image: "Events9.jpg",
//   },

//   {
//     date: "09",
//     month: "AUG",
//     year: "2025",
//     title: "Startup Pitch Day",
//     location: "Hyderabad Expo",
//     status: "M 7.00",
//     image: "Events6.jpg",
//   },
// ];

const MD_BREAKPOINT = "(min-width: 768px)";

const UpcomingEvents = () => {
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const events = useAppSelector(
    (state) => state.events.allEventsBySearch?.content || []
  );

  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia(MD_BREAKPOINT).matches
      : false
  );

  useEffect(() => {
    dispatch(listEventsBySearch());
  }, [dispatch]);

  useEffect(() => {
    const mq = window.matchMedia(MD_BREAKPOINT);
    const onChange = () => setIsDesktop(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const showCarouselNav = isDesktop
    ? events.length > 3
    : events.length > 1;

  return (
    <div className="py-24 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-100 hidden  rounded-2xl lg:flex items-center justify-center">
              <FaTicketAlt className="text-blue-600 text-xl " />
            </div>
            <h2 className="text-4xl font-bold text-gray-900">
              Upcoming Events
            </h2>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover the most exciting events happening soon! Book your spot now
            and stay updated with the latest happenings.
          </p>
        </div>

        {/* Events Slider */}
        <div className="relative">
          <Carousel
            opts={{ align: "start" }}
            className="w-full pb-12"
          >
            <CarouselContent>
              {events.map((event, index) => (
                <CarouselItem
                  key={index}
                  className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
                >
                  <div className="p-1">
                    <Card
                      className="group h-full cursor-pointer gap-0 overflow-hidden rounded-3xl border-0 bg-white py-0 text-gray-900 shadow-lg ring-0 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
                      onClick={() =>
                        navigate(
                          `/events/${event.eventName.replace(/\s+/g, "-")}/${
                            event.eventId
                          }`,
                          { state: event }
                        )
                      }
                    >
                      <CardContent className="flex h-full flex-col p-0">
                  {/* Image Container */}
                  <div className="relative w-full aspect-[3/4] overflow-hidden flex-shrink-0">
                    <img
                      src={event.thumbnailUrl}
                      alt={event.eventName}
                      className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
                    />

                    <div
                      className={`absolute top-4 right-4 ${
                        event.eventSoldOut ? "bg-red-500" : "bg-blue-600"
                      } text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg`}
                    >
                      {event.eventSoldOut ? "Sold out" : event.genre?.replace(/_/g, " ")
                .replace(/\b\w/g, (char) => char.toUpperCase())}
                    </div>

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Date Badge */}
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-gray-900 text-sm font-bold px-3 py-2 rounded-xl shadow-lg">
                      <div className="text-center">
                        <div className="text-lg font-bold">
                          {new Date(event.startDate).toLocaleDateString(
                            "en-US",
                            {
                              day: "numeric",
                              month: "short",
                            }
                          )}
                        </div>

                        {/* <div className="text-xs">{event.month}</div> */}
                      </div>
                    </div>

                    {/* Status Badge */}
                    {/* <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow-lg ${
                        event.status === "SOLD OUT" 
                          ? "bg-red-500 text-white" 
                          : event.status === "FREE"
                          ? "bg-green-500 text-white"
                          : "bg-blue-500 text-white"
                      }`}>
                        {event.status}
                      </span>
                    </div> */}
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-grow flex flex-col">
                    <h3 className=" truncate text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {event.eventName}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 flex items-center">
                      <svg
                        className="w-4 h-4 mr-2 text-blue-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {event.venueName}
                    </p>

                    <div className="mt-auto">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(
                            `/events/${event.eventName.replace(/\s+/g, "-")}/${
                              event.eventId
                            }`
                          );
                        }}
                        className={`w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 
                       
                          bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white hover:shadow-lg transform hover:scale-105"
                      }`}
                      >
                        Get Ticket
                      </button>
                    </div>
                  </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {showCarouselNav && (
              <>
                <CarouselPrevious
                  variant="outline"
                  className="z-10 size-12 border-0 bg-white text-blue-600 shadow-lg hover:bg-blue-50 left-0 -translate-x-4 top-1/2 -translate-y-1/2 rounded-full [&_svg]:size-6"
                />
                <CarouselNext
                  variant="outline"
                  className="z-10 size-12 border-0 bg-white text-blue-600 shadow-lg hover:bg-blue-50 right-0 translate-x-4 top-1/2 -translate-y-1/2 rounded-full [&_svg]:size-6"
                />
              </>
            )}
          </Carousel>
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link to={"/events"}>
            <button className="group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2 mx-auto">
              <span>View All Events</span>
              <svg
                className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UpcomingEvents;
