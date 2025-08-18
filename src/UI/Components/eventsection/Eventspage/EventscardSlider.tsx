import { useRef } from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

interface Event {
  title: string;
  image: string;
}

export default function EventscardSlider({ events = [] }: { events: Event[] }) {
  const sliderRef = useRef<HTMLDivElement>(null);

  const slide = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const scrollAmount = direction === "left" ? -300 : 300;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className=" w-fit py-4 pb-20">
      {/* Header */}
      <h2 className="text-xl font-bold">You May Also Like</h2>
      <p className="text-gray-600 mb-4">Events around you, book now</p>

      <div className="relative">
        {/* Left Arrow */}
        <button
          onClick={() => slide("left")}
          className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow p-2 hover:bg-gray-100 transition"
        >
          <MdChevronLeft size={28} />
        </button>

        {/* Slider */}
        <div
          ref={sliderRef}
          className="flex overflow-x-auto space-x-4 scrollbar-hide scroll-smooth snap-x snap-mandatory"
        >
          {events.map((event, idx) => (
            <div
              key={idx}
              className=""
            >
              <div className="rounded-lg overflow-hidden shadow hover:shadow-lg hover:scale-[1.02] transition-transform duration-300">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-64 object-cover"
                />
              </div>
              <h3 className="mt-2 text-sm font-semibold line-clamp-2">
                {event.title}
              </h3>
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => slide("right")}
          className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow p-2 hover:bg-gray-100 transition"
        >
          <MdChevronRight size={28} />
        </button>
      </div>
    </div>
  );
}
