import { useEffect, useState } from "react";
import EventList from "./EventList";
import FilterPanel from "./FilterPanel";
import SpinnerLoading from "../common/SpinnerLoading";

export default function Layout() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
     <SpinnerLoading/>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row pt-5 max-w-[100%] mx-auto px-2 bg-gray-100">
      {/* LEFT: Filter Section */}
      <div className="w-full lg:w-1/4">
        <FilterPanel />
      </div>

      {/* RIGHT: Event Cards Section */}
      <div className="w-full lg:w-3/4">
        <EventList />
      </div>
    </div>
  );
}
