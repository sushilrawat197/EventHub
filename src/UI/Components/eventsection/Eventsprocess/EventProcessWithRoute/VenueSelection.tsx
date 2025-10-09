import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../../reducers/hooks";
import { useEffect, useState } from "react";
import { listAllShowsByEvent } from "../../../../../services/operations/showsApi";
import { setTicketInfo } from "../../../../../slices/ticketInfoSlice";
import { getVenueByVenueId, listDetailsByCityId } from "../../../../../services/operations/venue";

const VenueSelection = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { contentName, eventId } = useParams();
  const cityId = useAppSelector((state) => state.cities.selectedCity);
  const shows = useAppSelector((state) => state.shows.data);

  const venueDetailsArray = useAppSelector((state) => state.venue.data || []);
  const details = useAppSelector((state) => state.venue.venueDetails );

  

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
    dispatch(getVenueByVenueId(venueId));
    setExpandedVenue(expandedVenue === venueId ? null : venueId);
  }


  useEffect(() => {
    if (eventId) dispatch(listAllShowsByEvent(eventId));
    if (cityId) dispatch(listDetailsByCityId(cityId));
  }, [dispatch, eventId, cityId]);

  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="text-left mb-4">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
            Select Venue
          </h1>
          <p className="text-lg text-gray-600">
            Choose your preferred venue for this amazing event
          </p>
        </div>

        {/* Venues Grid */}
        <div className="grid grid-cols-1 gap-6">
        {uniqueVenueShows.map((venue, idx) => {
          // ✅ Matching venue details from venueDetailsArray
          const venueDetail = venueDetailsArray.find(
            (v) => v.venueId === venue.venueId
          );

          return (
            <div
              key={idx}
                className={`group bg-white rounded-3xl shadow-xl border-2 transition-all duration-300 hover:shadow-2xl hover:scale-105 ${
                venue
                    ? "border-gray-200 hover:border-blue-300 cursor-pointer"
                    : "border-gray-300 bg-gray-50 opacity-60"
                }`}
              >
                {/* Venue Header */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                        <div>
                          <h3 className={`text-lg font-bold ${
                            venue ? "text-gray-900" : "text-gray-500"
                          }`}>
                            {venue.venueName}
                          </h3>
                          <p className={`text-sm ${
                            venue ? "text-blue-600" : "text-gray-400"
                          }`}>
                            {venue.eventName}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col items-end gap-2">
                      {venue ? (
                        <button
                          onClick={() => clickHandler(venue.venueId)}
                          className="group/btn bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2 rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
                        >
                          <span>Select Venue</span>
                          <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </button>
                      ) : (
                        <div className="bg-gray-200 text-gray-500 px-4 py-2 rounded-xl font-semibold text-sm">
                          Not Available
                        </div>
                      )}

                      <button
                        onClick={() => toggleDetails(venue.venueId)}
                        className="text-blue-600 hover:text-blue-700 font-medium text-xs flex items-center gap-1 transition-colors"
                      >
                        <span>
                          {expandedVenue === venue.venueId
                            ? "Hide Details"
                            : "View Details"}
                        </span>
                        <svg className={`w-3 h-3 transition-transform ${
                          expandedVenue === venue.venueId ? "rotate-180" : ""
                        }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>


                {/* Expanded Details */}
                {expandedVenue === venue.venueId && (
                  
                  <div className="px-4 pb-4">
                    <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 border border-gray-100">
                      <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Venue Information
                      </h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <div className="flex items-start gap-2">
                            <div className="w-6 h-6 bg-blue-100 rounded-md flex items-center justify-center flex-shrink-0">
                              <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-gray-700">Address</p>
                              <p className="text-xs text-gray-600">{ details?.address || "N/A"}</p>
                            </div>
                          </div>

                          <div className="flex items-start gap-2">
                            <div className="w-6 h-6 bg-green-100 rounded-md flex items-center justify-center flex-shrink-0">
                              <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-gray-700">Capacity</p>
                              <p className="text-xs text-gray-600">{ details?.totalCapacity || "N/A"} seats</p>
                            </div>
                          </div>

                          <div className="flex items-start gap-2">
                            <div className="w-6 h-6 bg-purple-100 rounded-md flex items-center justify-center flex-shrink-0">
                              <svg className="w-3 h-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-gray-700">Contact</p>
                              <p className="text-xs text-gray-600">{ details?.contactNumber || "N/A"}</p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-start gap-2">
                            <div className="w-6 h-6 bg-orange-100 rounded-md flex items-center justify-center flex-shrink-0">
                              <svg className="w-3 h-3 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V1a1 1 0 011-1h2a1 1 0 011 1v18a1 1 0 01-1 1H4a1 1 0 01-1-1V1a1 1 0 011-1h2a1 1 0 011 1v3m0 0h8" />
                              </svg>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-gray-700">Pincode</p>
                              <p className="text-xs text-gray-600">{ details?.pincode || "N/A"}</p>
                            </div>
                          </div>

                          <div className="flex items-start gap-2">
                            <div className="w-6 h-6 bg-red-100 rounded-md flex items-center justify-center flex-shrink-0">
                              <svg className="w-3 h-3 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              </svg>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-gray-700">Type</p>
                              <p className="text-xs text-gray-600">{ details?.venueType || "N/A"}</p>
                            </div>
                          </div>

                          {venueDetail?.description && (
                            <div className="flex items-start gap-2">
                              <div className="w-6 h-6 bg-indigo-100 rounded-md flex items-center justify-center flex-shrink-0">
                                <svg className="w-3 h-3 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                              </div>
                              <div>
                                <p className="text-xs font-semibold text-gray-700">Description</p>
                                <p className="text-xs text-gray-600">{ details?.description}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
            </div>
          );
        })}
        </div>

      </div>
    </div>
  );
};

export default VenueSelection;
