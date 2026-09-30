import { useMemo } from "react";
import { BedDouble, Bus, CalendarDays, Clock, MapPin, ShieldCheck, Users } from "lucide-react";
import type { DepartureView, PickupView } from "../../utils/packageDetailFormat";
import type { PackageDetail } from "../../types/packageDetail";
import { SafeImage } from "../detail/primitives";

export default function TripSelection({
  pkg,
  image,
  departures,
  departureKey,
  pickups,
  pickupKey,
  travellerRows,
}: {
  pkg?: PackageDetail;
  image?: string;
  departures: DepartureView[];
  departureKey?: string;
  onDeparture?: (key: string) => void;
  pickups: PickupView[];
  pickupKey?: string;
  onPickup?: (key: string) => void;
  departureError?: string;
  pickupError?: string;
  travellerRows?: { type: string; label: string; quantity: number }[];
}) {
  const departure = departures.find((item) => item.key === departureKey);
  const pickup = pickups.find((point) => point.key === pickupKey) ?? pickups[0];

  // Duration badge: Only show nights if nights > 0!
  const durationBadge = useMemo(() => {
    if (!pkg?.duration) return undefined;
    const { days, nights } = pkg.duration;
    if (days && nights > 0) return `${days}D/${nights}N`;
    if (days) return `${days} ${days === 1 ? "Day" : "Days"}`;
    return undefined;
  }, [pkg?.duration]);

  // Duration text: Only show nights if nights > 0!
  const durationText = useMemo(() => {
    if (!pkg?.duration) return departure?.days ? `${departure.days} Days` : undefined;
    const { days, nights } = pkg.duration;
    if (days && nights > 0) return `${nights}N / ${days}D`;
    if (days) return `${days} ${days === 1 ? "Day" : "Days"}`;
    return undefined;
  }, [pkg?.duration, departure?.days]);

  // Location text from pkg.destination
  const locationText = useMemo(() => {
    if (!pkg?.destination) return undefined;
    const { primaryDestination, city, region, country } = pkg.destination;
    const parts = [primaryDestination || city, region !== city ? region : undefined, country].filter(Boolean);
    return parts.length ? parts.join(", ") : undefined;
  }, [pkg?.destination]);

  // Occupancy text from selected travellers
  const occupancyText = useMemo(() => {
    const active = (travellerRows ?? []).filter((r) => r.quantity > 0);
    if (!active.length) return "1 Adult";
    return active.map((r) => `${r.quantity} ${r.label}`).join(", ");
  }, [travellerRows]);

  // Dynamic meta items: ONLY include items present in the API response!
  const metaItems = useMemo(() => {
    const items: { label: string; value: string; icon?: typeof CalendarDays }[] = [];

    if (durationText) {
      items.push({ label: "DURATION", value: durationText, icon: CalendarDays });
    }
    if (departure?.start) {
      items.push({ label: "START DATE", value: departure.start });
    }
    if (departure?.end) {
      items.push({ label: "END DATE", value: departure.end });
    }
    if (occupancyText) {
      items.push({ label: "OCCUPANCY", value: occupancyText, icon: Users });
    }
    if (pkg?.category) {
      items.push({ label: "CATEGORY", value: pkg.category });
    }
    // Only show Rooms if accommodation exists in response!
    if (pkg?.accommodation && pkg.accommodation.length > 0) {
      items.push({
        label: "ROOMS",
        value: `${pkg.accommodation.length} ${pkg.accommodation.length === 1 ? "Room" : "Rooms"}`,
        icon: BedDouble,
      });
    }
    // Transport from response
    if (pkg?.transport && pkg.transport.length > 0 && pkg.transport[0].transportTypeName) {
      items.push({
        label: "TRANSPORT",
        value: pkg.transport[0].transportTypeName,
        icon: Bus,
      });
    }
    // Tour Operator from response
    if (pkg?.tourOperatorName) {
      items.push({
        label: "OPERATOR",
        value: pkg.tourOperatorName,
        icon: ShieldCheck,
      });
    }

    return items;
  }, [
    durationText,
    departure?.start,
    departure?.end,
    occupancyText,
    pkg?.category,
    pkg?.accommodation,
    pkg?.transport,
    pkg?.tourOperatorName,
  ]);

  if (!pkg) return null;

  return (
    <section
      id="trip"
      aria-label="Trip overview"
      className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900 sm:p-5"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
        {/* Left: Thumbnail Image with Duration Badge */}
        <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800 sm:aspect-[4/3] sm:w-60 md:w-64">
          <SafeImage
            src={image}
            alt={pkg.packageName}
            className="size-full object-cover"
            iconClassName="size-8"
          />
          {durationBadge ? (
            <span className="absolute left-2.5 top-2.5 rounded-md bg-gradient-to-r from-red-600 to-rose-600 px-2.5 py-1 text-xs font-black tracking-wide text-white shadow-md">
              {durationBadge}
            </span>
          ) : null}
        </div>

        {/* Right: Package Title, Location & Dynamic Meta */}
        <div className="min-w-0 flex-1">
          <h2 className="line-clamp-2 text-base font-bold tracking-tight text-slate-900 dark:text-white sm:text-lg">
            {pkg.packageName.trim()}
          </h2>

          {locationText ? (
            <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 sm:text-sm">
              <MapPin className="size-3.5 shrink-0 text-blue-600 dark:text-blue-400" aria-hidden />
              <span className="break-words">{locationText}</span>
            </p>
          ) : null}

          {/* Dynamic Info Grid based strictly on API response */}
          {metaItems.length ? (
            <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3.5 border-t border-slate-100 pt-3.5 text-xs dark:border-slate-800 sm:grid-cols-3 sm:text-sm">
              {metaItems.map((item) => (
                <div key={item.label} className="min-w-0">
                  <span className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
                    {item.icon ? <item.icon className="size-3 text-blue-600 dark:text-blue-400" aria-hidden /> : null}
                    {item.label}
                  </span>
                  <p className="mt-0.5 font-bold leading-snug text-slate-900 break-words dark:text-white">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          ) : null}

          {/* Pickup Point Details (Only if present in response) */}
          {pickup ? (
            <div className="mt-4 border-t border-slate-100 pt-3 dark:border-slate-800">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Pickup Point
              </span>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs sm:text-sm">
                <span className="font-bold text-slate-900 dark:text-white">
                  {pickup.name ?? pickup.address}
                </span>
                {pickup.type ? (
                  <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                    {pickup.type}
                  </span>
                ) : null}
                {pickup.time ? (
                  <span className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                    <Clock className="size-3 text-slate-400" aria-hidden />
                    {pickup.time}
                  </span>
                ) : null}
              </div>
              {pickup.address && pickup.name && pickup.address !== pickup.name ? (
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  {[pickup.address, pickup.city].filter(Boolean).join(", ")}
                </p>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
