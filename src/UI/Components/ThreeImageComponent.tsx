const ThreeImgComponent = () => {
  const cards = [
    {
      img: "img11.jpg",
      title: "Event Dashboard",
      desc: "Manage everything from one place",
    },
    {
      img: "img16.jpg",
      title: "Analytics Overview",
      desc: "Track event performance easily",
    },
    {
      img: "img17.jpg",
      title: "Ticket Management",
      desc: "Simplify ticket sales and tracking",
    },
  ];

  return (
    <section className="py-9 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         <div className="space-y-8 pb-5">
            {/* Header */}
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 text-center">
                Sell Tickets with{" "}
                <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  Ease
                </span>
              </h2>
              <div className="w-20 mx-auto h-1 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full mb-6"></div>
              <p className="text-xl text-gray-600 leading-relaxed">
                No more struggling with complex{" "}
                <span className="font-semibold text-gray-900">event ticketing systems</span>.
                EventHub makes it simple to set up and manage your events. Host
                standout experiences — we'll handle the technology.
              </p>
            </div>
            </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 place-items-center">
          {cards.map((card, index) => (
            <div
              key={index}
              className="relative w-full max-w-[22rem] aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl group"
            >
              <img
                src={card.img}
                alt={card.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="text-2xl font-bold mb-1">{card.title}</h3>
                <p className="text-blue-100">{card.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ThreeImgComponent;
