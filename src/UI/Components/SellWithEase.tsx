import { FaAngleRight } from "react-icons/fa6";
const SellWithEase = () => {
  return (
    <section className=" py-16 mt-10 ">
      <div className="max-w-6xl mx-auto  flex flex-col lg:flex-row items-start gap-6  ">
        {/* Left Content */}
        <div className="lg:w-1/2">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-2">
            Sell Tickets with <span className="text-sky-500">Ease</span>
          </h2>
          <div className="w-85 h-1 bg-sky-500 mb-5 rounded-full"></div>
          <p className="text-[#777777] text-base leading-relaxed mb-6">
            No more struggling with complex{" "}
            <strong className="text-black">event ticketing systems</strong>.
            MyTag makes it simple to set up and manage your events. Host
            standout experiences — we’ll handle the technology.
          </p>

          {/* Feature List */}
          <div className="space-y-7">
            {["Real-Time Reporting", "Smart Pricing", "Simple Scheduling"].map(
              (feature, i) => (
                <div
                  key={i}
                  className="bg-sky-500 p-5   rounded-lg shadow-lg hover:shadow-md transition flex justify-between items-center cursor-pointer"
                >
                  <span className="font-semibold text-white">{feature}</span>
                  <span className="text-white text-xl">
                    <FaAngleRight />
                  </span>
                </div>
              )
            )}
          </div>
        </div>

        {/* Right Side Images */}
        <div className="lg:w-1/2 grid grid-cols-2 gap-2  lg:mt-0">
          <img
            src="img17.jpg"
            alt="report"
            className="rounded-lg shadow-md w-full h-40 object-cover"
          />
          <img
            src="img16.jpg"
            alt="pricing"
            className="rounded-lg shadow-md w-full h-40 object-cover"
          />
          <img
            src="img11.jpg"
            alt="scheduling"
            className="col-span-2 rounded-lg shadow-md w-full  md:h-64 object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default SellWithEase;
