import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../../reducers/hooks";
import { useEffect, useState } from "react";
import { listAllShowsByEvent } from "../../../../../services/operations/showsApi";
import { setTicketInfo } from "../../../../../slices/ticketInfoSlice";
import { listDetailsByCityId } from "../../../../../services/operations/venue";

const VenueSelection = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { contentName, eventId } = useParams();
  const cityId = useAppSelector((state) => state.cities.selectedCity);
  const shows = useAppSelector((state) => state.shows.data);

  const venueDetailsArray = useAppSelector((state) => state.venue.data || []);

  // Track which venue's details are open
  const [expandedVenue, setExpandedVenue] = useState<number | null>(null);

  // remove duplicate venueIds from shows
  const uniqueVenueShows = Array.from(
    new Map(shows.map((s) => [s.venueId, s])).values()
  );

  function clickHandler(venueId: number) {
    dispatch(setTicketInfo({ venueId }));
    setSearchParams(searchParams);
    navigate(`/events/${contentName}/${eventId}/booking/datetime`, {
      replace: true,
    });
  }

  function toggleDetails(venueId: number) {
    setExpandedVenue(expandedVenue === venueId ? null : venueId);
  }

  useEffect(() => {
    if (eventId) dispatch(listAllShowsByEvent(eventId));
    if (cityId) dispatch(listDetailsByCityId(cityId));
  }, [dispatch, eventId, cityId]);

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Select Cinema</h2>
      <div className="space-y-4">
        
        {uniqueVenueShows.map((venue, idx) => {

          // ✅ Matching venue details from venueDetailsArray
          const venueDetail = venueDetailsArray.find(
            (v) => v.venueId === venue.venueId
          );

          return (
            <div
              key={idx}
              className={`border rounded-lg p-4 ${
                venue
                  ? "hover:shadow-lg cursor-pointer border-gray-200"
                  : "bg-gray-100 border-gray-300"
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3
                    className={`font-semibold ${
                      venue ? "text-gray-800" : "text-gray-500"
                    }`}
                  >
                    {venue.venueName}
                  </h3>
                  <p
                    className={`text-sm ${
                      venue ? "text-gray-600" : "text-gray-400"
                    }`}
                  >
                    {venue.eventName}
                  </p>
                </div>

                <div className="text-right flex flex-col items-end gap-2">
                  {venue ? (
                    <button
                      onClick={() => clickHandler(venue.venueId)}
                      className="bg-sky-500 text-white px-8 py-2 rounded text-sm hover:bg-sky-600"
                    >
                      Select
                    </button>
                  ) : (
                    <span className="text-gray-400 text-sm">Not Available</span>
                  )}

                  <button
                    onClick={() => toggleDetails(venue.venueId)}
                    className="text-sky-500 text-sm hover:underline"
                  >
                    {expandedVenue === venue.venueId
                      ? "Hide Details ▲"
                      : "Venue Details ▼"}
                  </button>
                </div>
              </div>

              {/* Dropdown Details */}
              {expandedVenue === venue.venueId && (
                <div className="mt-4 bg-gray-50 p-3 rounded border border-gray-200 text-gray-700 text-sm space-y-1">
                  <p>
                    <strong>Address:</strong> {venueDetail?.address || "N/A"}
                  </p>
                  <p>
                    <strong>Pincode:</strong> {venueDetail?.pincode || "N/A"}
                  </p>
                  <p>
                    <strong>Total Capacity:</strong>{" "}
                    {venueDetail?.totalCapacity || "N/A"}
                  </p>
                  <p>
                    <strong>Contact:</strong>{" "}
                    {venueDetail?.contactNumber || "N/A"}
                  </p>
                  <p>
                    <strong>Venue Type:</strong>{" "}
                    {venueDetail?.venueType || "N/A"}
                  </p>
                  <p>
                    <strong>Description:</strong>{" "}
                    {venueDetail?.description || "No description"}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VenueSelection;
