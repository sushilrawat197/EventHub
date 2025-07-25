const StatsReview = () => {
  return (
    <div className=" flex-col sm:flex-row items-start justify-center gap-5 mt-3 hidden lg:flex">
      {/* Left Side */}
      <div className="text-center sm:text-left">
        <h3 className="text-lg font-bold text-black">14+</h3>
        <p className="text-[#777777] text-[10px] -mt-1">
          Positive review for additional treatment
        </p>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-1">
        {/* Overlapping Avatars */}
        <div className="flex -space-x-2  ">
          <img
            title="1"
            src="1.jpg"
            className="w-6 h-6 rounded-full border-2 border-white"
          />
          <img
            title="2"
            src="2.jpg"
            className="w-6 h-6 rounded-full border-2 border-white"
          />
          <img
            title="3"
            src="3.jpg"
            className="w-6 h-6 rounded-full border-2 border-white"
          />
          <img
            title="4"
            src="4.jpg"
            className="w-6 h-6 rounded-full border-2 border-white"
          />
        </div>
        <p className="text-[#777777] text-[10px]">
          20+ people join in our Events
        </p>
      </div>
    </div>
  );
};

export default StatsReview;
