import Footer from "../Footer";
import EventList from "./EventList";
import FilterPanel from "./FilterPanel";

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:pt-20 ">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* LEFT: Filter Section */}
          <div className="w-full lg:w-1/4 lg:sticky lg:top-24 lg:h-fit">
            <FilterPanel />
          </div>

          {/* RIGHT: Event Cards Section */}
          <div className="w-full lg:w-3/4">
            <EventList />
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
