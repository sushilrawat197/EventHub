import { FaVectorSquare, FaCalendarPlus } from "react-icons/fa";
import { BiSupport } from "react-icons/bi";

const WhyChoose = () => {
  return (
    <section className="py-15 ">
      <div className="text-center mb-6  ">
        <h2 className="text-2xl md:text-2xl font-bold text-black  mb-2">
          Why Choose <span className="text-sky-500">MyTag?</span>
        </h2>
        <p className="max-w-2xl mx-auto text-base text-[#777777] leading-relaxed">
          The{" "}
          <span className="text-sky-500 font-semibold">
            #1 Event Ticketing Website
          </span>{" "}
          for all event types. Whether it’s concerts, amusement parks, trade
          shows, or marathons — we’ve got you covered. Sell tickets online for
          any event effortlessly.
        </p>
        {/* <div className="w-50 h-1 mx-auto mt-2 bg-sky-500 rounded-full"></div> */}
      </div>

      {/* Cards */}
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition-transform duration-300 hover:-translate-y-1 border-2 border-sky-500">
         

         <div className="flex gap-4">
          <div className="text-sky-500 text-4xl mb-4">
            <FaVectorSquare />
          </div>

          <h3 className="text-xl font-semibold mb-2 ">Flexibility</h3>

         </div>
         
          

          <p className="text-sm text-[#777777] leading-relaxed">
            MyTag offers a user-friendly ticketing system designed to streamline
            both online and box office ticket sales — ensuring a seamless and
            efficient experience.
          </p>
        </div>



        {/* Card 2 */}
        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition-transform duration-300 hover:-translate-y-1 border-2 border-sky-500">
          
          <div className="flex gap-3">
             <div className="text-sky-500 text-4xl mb-4">
            <BiSupport />
          </div>
          <h3 className="text-xl font-semibold mb-2">24/7 Expert Support</h3>

          </div>
          
         
          <p className="text-sm text-[#777777] leading-relaxed">
            24/7 expert assistance to help organizers set up and manage tickets
            efficiently. Our support team ensures a seamless and stress-free
            ticketing service.
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition-transform duration-300 hover:-translate-y-1 border-2 border-sky-500">
          
          <div className="flex gap-3">
            
            
          <div className="text-sky-500 text-4xl mb-4">

            <FaCalendarPlus />
          </div>
          <h3 className="text-xl font-semibold mb-2">Schedule Management</h3>

          </div>
          
          <p className="text-sm text-[#777777] leading-relaxed">
            Customize and simplify event schedules easily — whether date ranges
            or time slots. Smooth management with our flexible scheduling
            features.
          </p>
        </div>
      </div>
    </section>
  );
};

export default WhyChoose;
