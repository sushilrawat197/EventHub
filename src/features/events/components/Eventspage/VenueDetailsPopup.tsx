import { useEffect, useState, type ReactNode } from "react";
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

function InfoRow({
  icon,
  children,
}: {
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-gray-50 px-3.5 py-3 transition-colors hover:bg-gray-100">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
        {icon}
      </span>
      <div className="min-w-0 flex-1 text-sm leading-relaxed text-gray-700">
        {children}
      </div>
    </div>
  );
}

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
        if (!cancelled)
          setError("Could not load venue details. Please try again.");
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

  const hasMap =
    venue != null &&
    Number.isFinite(venue.latitude) &&
    Number.isFinite(venue.longitude) &&
    !(venue.latitude === 0 && venue.longitude === 0);

  const subtitle = needsVenuePick
    ? "This event has more than one venue. Choose one to view details."
    : venue?.name?.trim() ||
      venues.find((v) => v.venueId === selectedVenueId)?.venueName ||
      "Loading venue information";

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent
        overlayClassName="bg-black/45 supports-backdrop-filter:backdrop-blur-sm duration-300 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0"
        className="flex max-h-[min(90vh,40rem)] w-[min(100vw-1.5rem,36rem)] flex-col gap-0 overflow-hidden border border-gray-100 bg-white p-0 shadow-2xl duration-300 ease-out data-[size=default]:max-w-[36rem] data-[size=default]:sm:max-w-[36rem] data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-open:slide-in-from-bottom-2 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 data-closed:slide-out-to-bottom-2"
      >
        <AlertDialogHeader className="relative shrink-0 gap-1 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-white px-6 py-5 pr-14 text-left sm:text-left">
          <AlertDialogCancel
            variant="ghost"
            size="icon"
            className="absolute top-3.5 right-3.5 h-9 w-9 rounded-full border-0 bg-white p-0 text-gray-500 shadow-sm ring-1 ring-gray-200 transition-colors hover:bg-gray-50 hover:text-gray-900"
            aria-label="Close"
          >
            <IoClose className="h-5 w-5" />
          </AlertDialogCancel>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-blue-600">
            Venue
          </p>
          <AlertDialogTitle className="text-xl font-bold tracking-tight text-gray-900">
            {needsVenuePick ? "Select a venue" : "Venue details"}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-left text-sm text-gray-500">
            {subtitle}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
          {needsVenuePick ? (
            <ul className="space-y-2.5">
              {venues.map((v) => (
                <li key={v.venueId}>
                  <button
                    type="button"
                    onClick={() => setSelectedVenueId(v.venueId)}
                    className="group flex w-full items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3.5 text-left transition-all duration-200 hover:border-blue-200 hover:bg-blue-50"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600 transition-colors group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-blue-700 group-hover:text-white">
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
            <div className="space-y-3 animate-pulse py-1">
              <div className="h-6 w-2/3 rounded-lg bg-gray-200" />
              <div className="h-4 w-1/2 rounded bg-gray-200" />
              <div className="h-16 rounded-xl bg-gray-200" />
              <div className="h-12 rounded-xl bg-gray-200" />
              <div className="h-12 rounded-xl bg-gray-200" />
            </div>
          ) : error ? (
            <div className="space-y-4 py-8 text-center">
              <p className="text-sm text-red-600">{error}</p>
              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setFetchKey((k) => k + 1)}
                  className="rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-2 text-sm font-semibold text-white shadow-lg transition-all hover:from-blue-700 hover:to-blue-800"
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
                    className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    Choose another venue
                  </button>
                )}
              </div>
            </div>
          ) : venue ? (
            <div className="animate-in fade-in-0 slide-in-from-bottom-1 space-y-5 duration-300">
              <div>
                <h3 className="text-lg font-bold tracking-tight text-gray-900">
                  {venue.name?.trim()}
                </h3>
                {locationLine ? (
                  <p className="mt-1 text-sm text-gray-500">{locationLine}</p>
                ) : null}
              </div>

              {venue.description?.trim() ? (
                <p className="text-sm leading-7 text-gray-600">
                  {venue.description.trim()}
                </p>
              ) : null}

              <div className="space-y-2">
                {venue.address?.trim() ? (
                  <InfoRow icon={<FaMapMarkerAlt className="text-xs" />}>
                    <p className="font-semibold text-gray-900">Address</p>
                    <p className="mt-0.5 text-gray-600">
                      {venue.address.trim()}
                      {venue.pincode?.trim()
                        ? `, ${venue.pincode.trim()}`
                        : ""}
                    </p>
                  </InfoRow>
                ) : null}

                {venue.totalCapacity > 0 ? (
                  <InfoRow icon={<FaUsers className="text-xs" />}>
                    <p className="font-semibold text-gray-900">Capacity</p>
                    <p className="mt-0.5 text-gray-600">
                      {venue.totalCapacity.toLocaleString()} guests
                    </p>
                  </InfoRow>
                ) : null}

                {venue.contactNumber?.trim() ? (
                  <InfoRow icon={<FaPhone className="text-xs" />}>
                    <p className="font-semibold text-gray-900">Phone</p>
                    <a
                      href={`tel:${venue.contactNumber.trim()}`}
                      className="mt-0.5 inline-block text-gray-600 hover:text-blue-600"
                    >
                      {venue.contactNumber.trim()}
                    </a>
                  </InfoRow>
                ) : null}

                {venue.email?.trim() ? (
                  <InfoRow icon={<FaEnvelope className="text-xs" />}>
                    <p className="font-semibold text-gray-900">Email</p>
                    <a
                      href={`mailto:${venue.email.trim()}`}
                      className="mt-0.5 inline-block break-all text-gray-600 hover:text-blue-600"
                    >
                      {venue.email.trim()}
                    </a>
                  </InfoRow>
                ) : null}
              </div>

              {activeFacilities.length > 0 ? (
                <div className="border-t border-gray-100 pt-4">
                  <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-blue-600">
                    Facilities
                  </p>
                  <ul className="flex flex-wrap gap-2">
                    {activeFacilities.map((f) => (
                      <li
                        key={f.facilityId}
                        className="rounded-full border border-blue-100 bg-blue-50 px-3.5 py-1.5 text-xs font-medium text-blue-700"
                        title={f.description?.trim() || undefined}
                      >
                        {f.name}
                        {f.description?.trim() ? (
                          <span className="font-normal text-blue-500/80">
                            {" "}
                            · {f.description.trim()}
                          </span>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {(hasMap || venues.length > 1) && (
                <div className="flex flex-wrap items-center gap-4 border-t border-gray-100 pt-4">
                  {hasMap ? (
                    <a
                      href={`https://www.google.com/maps?q=${venue.latitude},${venue.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      <FaMapMarkerAlt className="text-xs" />
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
                      className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      Choose another venue
                    </button>
                  ) : null}
                </div>
              )}
            </div>
          ) : null}
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
