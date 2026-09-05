import { useEffect, useState } from "react";
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaUsers } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { getVenueByIdApi } from "../../api/venues.api";
import type { VenueResponse } from "../../types/venueInterface";

export type VenueOption = {
  venueId: number;
  venueName: string;
};

type VenueDetailsPopupProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  venues: VenueOption[];
};

export default function VenueDetailsPopup({
  open,
  onOpenChange,
  venues,
}: VenueDetailsPopupProps) {
  const [selectedVenueId, setSelectedVenueId] = useState<number | null>(null);
  const [venue, setVenue] = useState<VenueResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetchKey, setFetchKey] = useState(0);

  const needsVenuePick = venues.length > 1 && selectedVenueId == null;

  useEffect(() => {
    if (!open) {
      setSelectedVenueId(null);
      setVenue(null);
      setLoading(false);
      setError(null);
      return;
    }

    if (venues.length === 1) {
      setSelectedVenueId(venues[0].venueId);
    }
  }, [open, venues]);

  useEffect(() => {
    if (!open || selectedVenueId == null) return;

    let cancelled = false;
    setLoading(true);
    setError(null);
    setVenue(null);

    void getVenueByIdApi(selectedVenueId)
      .then((data) => {
        if (!cancelled) setVenue(data);
      })
      .catch(() => {
        if (!cancelled) setError("Could not load venue details. Please try again.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [open, selectedVenueId, fetchKey]);

  const locationLine = venue
    ? [venue.city?.label, venue.region?.label, venue.country?.label]
        .filter(Boolean)
        .join(", ")
    : "";

  const activeFacilities =
    venue?.facilities?.filter((f) => f.active && f.name?.trim()) ?? [];

  const images = [...(venue?.images ?? [])].sort(
    (a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)
  );

  const hasMap =
    venue != null &&
    Number.isFinite(venue.latitude) &&
    Number.isFinite(venue.longitude) &&
    !(venue.latitude === 0 && venue.longitude === 0);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent
        overlayClassName="bg-black/45 supports-backdrop-filter:backdrop-blur-[2px]"
        className="flex max-h-[min(90vh,42rem)] w-[min(100vw-1.5rem,42rem)] flex-col gap-0 overflow-hidden border-0 bg-white p-0 shadow-2xl data-[size=default]:max-w-[42rem] data-[size=default]:sm:max-w-[42rem]"
      >
        <AlertDialogHeader className="relative shrink-0 gap-1 border-b border-gray-100 px-5 py-4 pr-12 text-left sm:text-left">
          <AlertDialogCancel
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3 h-8 w-8 rounded-full border-0 bg-transparent p-0 text-gray-500 shadow-none hover:bg-gray-100 hover:text-gray-900"
            aria-label="Close"
          >
            <IoClose className="h-5 w-5" />
          </AlertDialogCancel>
          <AlertDialogTitle className="text-lg font-semibold text-gray-900">
            {needsVenuePick ? "Select a venue" : "Venue details"}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-left text-sm text-gray-500">
            {needsVenuePick
              ? "This event has more than one venue. Choose one to view details."
              : venue?.name?.trim() ||
                venues.find((v) => v.venueId === selectedVenueId)?.venueName ||
                "Loading venue information"}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          {needsVenuePick ? (
            <ul className="space-y-2">
              {venues.map((v) => (
                <li key={v.venueId}>
                  <button
                    type="button"
                    onClick={() => setSelectedVenueId(v.venueId)}
                    className="flex w-full items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-left transition-colors hover:border-blue-300 hover:bg-blue-50"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                      <FaMapMarkerAlt className="text-sm" />
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      {v.venueName}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : loading ? (
            <div className="space-y-3 animate-pulse py-2">
              <div className="h-36 rounded-xl bg-gray-200" />
              <div className="h-4 w-2/3 rounded bg-gray-200" />
              <div className="h-4 w-full rounded bg-gray-200" />
              <div className="h-4 w-5/6 rounded bg-gray-200" />
            </div>
          ) : error ? (
            <div className="space-y-3 py-4 text-center">
              <p className="text-sm text-red-600">{error}</p>
              <button
                type="button"
                onClick={() => setFetchKey((k) => k + 1)}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Retry
              </button>
              {venues.length > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedVenueId(null);
                    setVenue(null);
                    setError(null);
                  }}
                  className="ml-2 text-sm font-medium text-blue-600 hover:underline"
                >
                  Choose another venue
                </button>
              )}
            </div>
          ) : venue ? (
            <div className="space-y-4">
              {images[0]?.imageUrl ? (
                <div className="overflow-hidden rounded-xl bg-gray-100">
                  <img
                    src={images[0].imageUrl}
                    alt={venue.name}
                    className="h-40 w-full object-cover"
                  />
                </div>
              ) : null}

              <div>
                <h3 className="text-base font-bold text-gray-900">
                  {venue.name?.trim()}
                </h3>
                {locationLine ? (
                  <p className="mt-0.5 text-sm text-gray-500">{locationLine}</p>
                ) : null}
              </div>

              {venue.address?.trim() ? (
                <div className="flex gap-2 text-sm text-gray-700">
                  <FaMapMarkerAlt className="mt-0.5 shrink-0 text-blue-600" />
                  <p>
                    {venue.address.trim()}
                    {venue.pincode?.trim() ? `, ${venue.pincode.trim()}` : ""}
                  </p>
                </div>
              ) : null}

              {venue.description?.trim() ? (
                <p className="text-sm leading-relaxed text-gray-600">
                  {venue.description.trim()}
                </p>
              ) : null}

              {venue.totalCapacity > 0 ? (
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <FaUsers className="text-blue-600" />
                  <span>Capacity: {venue.totalCapacity}</span>
                </div>
              ) : null}

              {venue.contactNumber?.trim() ? (
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <FaPhone className="text-blue-600" />
                  <a
                    href={`tel:${venue.contactNumber.trim()}`}
                    className="hover:underline"
                  >
                    {venue.contactNumber.trim()}
                  </a>
                </div>
              ) : null}

              {venue.email?.trim() ? (
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <FaEnvelope className="text-blue-600" />
                  <a
                    href={`mailto:${venue.email.trim()}`}
                    className="break-all hover:underline"
                  >
                    {venue.email.trim()}
                  </a>
                </div>
              ) : null}

              {activeFacilities.length > 0 ? (
                <div>
                  <p className="mb-2 text-sm font-semibold text-gray-900">
                    Facilities
                  </p>
                  <ul className="space-y-1.5">
                    {activeFacilities.map((f) => (
                      <li
                        key={f.facilityId}
                        className="rounded-lg bg-gray-50 px-3 py-2 text-sm"
                      >
                        <span className="font-medium text-gray-900">
                          {f.name}
                        </span>
                        {f.description?.trim() ? (
                          <span className="text-gray-500">
                            {" "}
                            — {f.description.trim()}
                          </span>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {hasMap ? (
                <a
                  href={`https://www.google.com/maps?q=${venue.latitude},${venue.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex text-sm font-semibold text-blue-600 hover:underline"
                >
                  Open in Maps
                </a>
              ) : null}

              {venues.length > 1 ? (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedVenueId(null);
                    setVenue(null);
                    setError(null);
                  }}
                  className="text-sm font-medium text-blue-600 hover:underline"
                >
                  Choose another venue
                </button>
              ) : null}
            </div>
          ) : null}
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
