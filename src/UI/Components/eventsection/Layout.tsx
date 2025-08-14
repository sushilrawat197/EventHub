import EventList from "./EventList";
import FilterPanel from "./FilterPanel";


export default function Layout() {
  return (
    <div className="flex flex-col lg:flex-row  pt-5 max-w-[100%] mx-auto  px-2 bg-gray-100">
      {/* LEFT: Filter Section */}
      <div className="w-full lg:w-1/4">
        <FilterPanel/>
      </div>

      {/* RIGHT: Event Cards Section */}
      <div className="w-full lg:w-3/4">
        <EventList/>
      </div>
    </div>
  );
}

