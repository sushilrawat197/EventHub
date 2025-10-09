import React, { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment

import "swiper/css";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment

import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { FaTicketAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../reducers/hooks";
import { listEventsBySearch } from "../../services/operations/eventsApi";

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

const UpcomingEvents: React.FC = () => {
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const events = useAppSelector(
    (state) => state.events.allEventsBySearch?.content || []
  );
  console.log(events);

  useEffect(() => {
    dispatch(listEventsBySearch());
  }, [dispatch]);

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
          <Swiper
            modules={[Navigation]}
            navigation={{
              nextEl: ".swiper-button-next-custom",
              prevEl: ".swiper-button-prev-custom",
            }}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
              1280: { slidesPerView: 5 },
            }}
            className="pb-12"
          >
            {events.map((event, index) => (
              <SwiperSlide key={index}>
                <div className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 h-full flex flex-col">
                  {/* Image Container */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={event.posterUrl}
                      alt={event.eventName}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />

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
                        onClick={() =>
                          navigate(
                            `/events/${event.eventName.replace(/\s+/g, "-")}/${
                              event.eventId
                            }`
                          )
                        }
                        className={`w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 
                       
                          bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white hover:shadow-lg transform hover:scale-105"
                      }`}
                      >
                        Get Ticket
                      </button>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Buttons */}
          <button className="swiper-button-prev-custom absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-blue-600 hover:bg-blue-50 transition-colors z-10">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button className="swiper-button-next-custom absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-blue-600 hover:bg-blue-50 transition-colors z-10">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
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
