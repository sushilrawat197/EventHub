// import EventsFilter from "../Components/EventsFilter";
import { Link } from "react-router-dom";
import StatsReview from "../Components/StatsReviews";

const HeroSection = () => {

  return (
    <>
      <div className=" z-10 px-[10%]  grid grid-cols-1 md:grid-cols-2 items-center ">
        <div className="md:-ml-4 mt-25 px-5">
          <img
            src="mainimg00.jpg"
            alt=" Group"
            className="  w-130  rounded-2xl  md:h-auto  "
          />
        </div>

        {/* Right side: Text */}
        <div className="     items-start text-center ">
          <h1 className=" text-5xl  font-bold text-black    ">
            "Your Ultimate<br></br> Ticket<br></br> Destination"
          </h1>
          <p className="mt-4 text-gray-900   md:ml-6">
            Step into the future of events with MyTag. We offer a hassle free
            experience. No lines, just vibes!
          </p>

          <div className="mt-6 flex flex-wrap  justify-center md:justify-start gap-4 md:ml-[30%] font-semibold ">
            <Link to={'/events'}>
             <button className="bg-sky-500 hover:bg-sky-300 text-white  px-6 py-2 rounded-full whitespace-nowrap transition cursor-pointer">
              Get Ticket
            </button>
            </Link>
           
            <button className="border-2 border-black text-black hover:bg-black hover:text-white  px-6 py-2 rounded-full whitespace-nowrap transition  cursor-pointer ">
              Learn More
            </button>
          </div>
          <StatsReview />
        </div>
      </div>
      {/* <EventsFilter /> */}
    </>
  );
};

export default HeroSection;
