const StatsReview = () => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mt-3">
      {/* Left Side */}
      <div className="text-center sm:text-left bg-gray-200 rounded-2xl p-6">
        <h3 className="text-3xl font-bold text-black mb-2">14+</h3>
        <p className="text-gray-700 text-sm">
          Positive review for additional treatment
        </p>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-3">
        {/* Overlapping Avatars */}
        <div className="flex -space-x-2">
          <img
            title="1"
            src="1.jpg"
            className="w-8 h-8 rounded-full border-2 border-white shadow-lg"
          />
          <img
            title="2"
            src="2.jpg"
            className="w-8 h-8 rounded-full border-2 border-white shadow-lg"
          />
          <img
            title="3"
            src="3.jpg"
            className="w-8 h-8 rounded-full border-2 border-white shadow-lg"
          />
          <img
            title="4"
            src="4.jpg"
            className="w-8 h-8 rounded-full border-2 border-white shadow-lg"
          />
        </div>
        <p className="text-gray-600 text-sm">
          20+ people join in our Events
        </p>
      </div>
    </div>
  );
};

export default StatsReview;
