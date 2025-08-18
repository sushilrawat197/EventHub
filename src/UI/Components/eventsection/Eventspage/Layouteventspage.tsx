import EventHeroCard from "./EventHeroCard";
import EventDetailsCard from "./EventDetailsCard";
import EventDescriptionAndArtists from "./EventDescriptionAndArtists";
import TermsAndConditions from "./TermsAndConditions";
import EventscardSlider from "./EventscardSlider";
import MobileEventDetailsCard from "./MobileEventDetails";

const event = {
  title: "ALLOW ME - A Standup Comedy Show by John doe",
  image: "Events1.jpg",
  categories: ["Stand up Comedy", "Comedy Shows"],
  interestedCount: 457,

  details: {
    date: "Sun 17 Aug 2025",
    time: "8:30 PM",
    duration: "1 hour 30 minutes",
    ageLimit: "16yrs +",
    languages: ["English"],
    category: "Comedy",
    venue: "The Laugh Store: Maseru",
    price: "1499",
    bookingMsg: "",
    fillingFast: true,
  },

  description: `Sumit, one of India’s top stand-up comedians, Sumit, one of India’s top stand-up comediansSumit, one of India’s top stand-up comediansSumit, one of India’s top stand-up comediansSumit, one of India’s top stand-up comedians`,

  artists: [
    {
      name: "Sumit Dua",
      role: "Comedian",
      image: "Events1.jpg",
    },
  ],

  slider: [
    { title: "Samay Raina - Still Alive & Unfiltered", image: "Events1.jpg" },
    { title: "Comedy Overload - Sunil Grover", image: "Events2.jpg" },
    { title: "TOXIC - Abhishek Upmanyu Live", image: "Events3.jpg" },
    { title: "Comedy Show Noida Sector 18", image: "Events4.jpg" },
  ],
};


export default function Layouteventspage() {
  return (
    <div className="container mx-auto px-2 py-4 mt-32 relative">
      {/* Flex Layout */}
      <div className="flex justify-between gap-20 ">
        {/* LEFT SIDE */}
        <div className="flex-1 space-y-5">
          <EventHeroCard
            title={event.title}
            image={event.image}
            tags={event.categories}
          />

          <MobileEventDetailsCard/>

          <EventDescriptionAndArtists
            description={event.description}
            artists={event.artists}
          />
          
           <EventscardSlider events={event.slider} />
           
        </div>

        {/* RIGHT SIDE */}
        <div className="lg:w-96 md:hi pt-10 hidden lg:block">
          <div className="sticky top-36">
            <EventDetailsCard {...event.details} />
          </div>
        </div>
      </div>

      {/* Outside flex */}
      <TermsAndConditions />
     
    </div>
  );
}
