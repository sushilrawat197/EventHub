const PosterRanking = () => {
  return (
    <section className="bg-gradient-to-r from-sky-500 via-sky-400 to-sky-300 text-white py-12">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 text-center">
        {/* Organizers */}
        <div>
          <h2 className="text-2xl font-extrabold">
            599<span className="text-xl">+</span>
          </h2>
          <p className="mt-2 text-lg font-medium">Organizers</p>
        </div>

        {/* Events */}
        <div>
          <h2 className="text-2xl font-extrabold">
            1,999<span className="text-xl">+</span>
          </h2>
          <p className="mt-2 text-lg font-medium">Events</p>
        </div>

        {/* Attendees */}
        <div>
          <h2 className="text-2xl font-extrabold">
            4,999<span className="text-xl">+</span>
          </h2>
          <p className="mt-2 text-lg font-medium">Attendees</p>
        </div>
      </div>
    </section>
  );
};

export default PosterRanking;
