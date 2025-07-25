import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { FaTicketAlt } from "react-icons/fa";

const events = [
  {
    date: "17",
    month: "SEP",
    year: "2020",
    title: "Golf Clubbers Annual Agenda",
    location: "University of Golf Clubbers",
    status: "SOLD OUT",
    image: "Events1.jpg",
  },
  {
    date: "16",
    month: "APR",
    year: "2021",
    title: "Rio Olympic Games 1st Run",
    location: "Rio Olympic Hall",
    status: "£5.00",
    image: "Events2.jpg",
  },
  {
    date: "11",
    month: "MAR",
    year: "2023",
    title: "Riga Saxophone Days",
    location: "Arena Riga",
    status: "£33.00",
    discount: "£48.00",
    image: "Events3.jpg",
  },
  {
    date: "05",
    month: "JAN",
    year: "2024",
    title: "Football League Start",
    location: "Bangalore Stadium",
    status: "£10.00",
    image: "Events4.jpg",
  },
  {
    date: "22",
    month: "JUN",
    year: "2025",
    title: "Tech Conference 2025",
    location: "Delhi Tech Park",
    status: "FREE",
    image: "Events5.jpg",
  },
  {
    date: "09",
    month: "AUG",
    year: "2025",
    title: "Startup Pitch Day",
    location: "Hyderabad Expo",
    status: "£7.00",
    image: "Events6.jpg",
  },

  {
    date: "09",
    month: "AUG",
    year: "2025",
    title: "Startup Pitch Day",
    location: "Hyderabad Expo",
    status: "£7.00",
    image: "Events7.jpg",
  },

  {
    date: "09",
    month: "AUG",
    year: "2025",
    title: "Startup Pitch Day",
    location: "Hyderabad Expo",
    status: "£7.00",
    image: "Events8.jpg",
  },

  {
    date: "09",
    month: "AUG",
    year: "2025",
    title: "Startup Pitch Day",
    location: "Hyderabad Expo",
    status: "£7.00",
    image: "Events9.jpg",
  },

  {
    date: "09",
    month: "AUG",
    year: "2025",
    title: "Startup Pitch Day",
    location: "Hyderabad Expo",
    status: "£7.00",
    image: "Events6.jpg",
  },
];

const UpcomingEvents: React.FC = () => {
  return (
    <div className="px-4 py-12 bg-sky-100">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <h2 className=" ">
            <FaTicketAlt className="text-sky-500 text-2xl" />
            <span className="border-l-4 border-sky-500 pl-2 text-3xl font-medium">
              UPCOMING EVENTS
            </span>
            <p className="text-[#777777] max-w-xl mt-2 font-light">
              Explore the most exciting events happening soon! Book your spot
              now and stay updated.
            </p>
          </h2>
        </div>
        <button className="mt-4 md:mt-0 border border-sky-500 hover:bg-sky-500 hover:text-white transition px-6 py-2 rounded-full text-sm font-semibold text-sky-600">
          SEE ALL UPCOMING EVENTS
        </button>
      </div>

      <Swiper
        modules={[Navigation]}
        navigation
        spaceBetween={16}
        slidesPerView={1}
        breakpoints={{
          480: { slidesPerView: 1.2 },
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
          1280: { slidesPerView: 5 },
        }}
      >
        {events.map((event, index) => (
          <SwiperSlide key={index}>
            <div className="relative rounded-xl overflow-hidden shadow group transition-transform duration-300 hover:scale-105 cursor-pointer">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-56 object-cover"
              />
              <div className="absolute top-3 left-3 bg-sky-500/40   text-white text-xs px-2 py-1 rounded shadow">
                {event.date} {event.month} {event.year}
              </div>
              <div className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded shadow">
                {event.status}
              </div>
              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-black/20 text-white p-3">
                <h3 className="text-sm font-semibold truncate">
                  {event.title}
                </h3>
                <p className="text-xs truncate">{event.location}</p>
                <button
                  className={`mt-2 text-xs px-3 py-1 rounded-full font-medium ${
                    event.status === "SOLD OUT"
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-sky-500 hover:bg-sky-600"
                  }`}
                >
                  {event.status === "SOLD OUT" ? "SOLD OUT" : "GET TICKET"}
                </button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default UpcomingEvents;
