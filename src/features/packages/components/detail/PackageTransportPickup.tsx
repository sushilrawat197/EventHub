import { Clock, MapPin, Users } from "lucide-react";
import type { DepartureView, PickupView, TransportView } from "../../utils/packageDetailFormat";
import { transportIcon } from "../../utils/packageDetailIcons";
import { Badge, DetailSection } from "./primitives";

function TransportCard({ item }: { item: TransportView }) {
  const Icon = transportIcon(item.modeCode);
  const title = item.route ?? item.mode ?? "Transfer";
  const vehicle =
    item.vehicle && item.vehicle.toUpperCase() !== (item.mode ?? "").toUpperCase() ? item.vehicle : undefined;

  return (
    <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900 print:break-inside-avoid">
      <div className="flex gap-4 p-4">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-500/15 dark:text-sky-300">
          <Icon className="size-5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-sky-700 dark:text-sky-300">
              {item.mode ?? "Transfer"}
            </span>
            {item.dayNumber != null ? (
              <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                Day {item.dayNumber}
              </span>
            ) : null}
            {!item.included ? <Badge tone="amber">Not included</Badge> : <Badge tone="green">Included</Badge>}
          </div>
          <h3 className="text-base font-semibold tracking-tight text-slate-950 dark:text-white">{title}</h3>
          {item.capacity != null || vehicle || item.pickupIncluded || item.dropOffIncluded ? (
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              {item.capacity != null ? (
                <span className="inline-flex items-center gap-1">
                  <Users className="size-3.5" aria-hidden />
                  {item.capacity} seats
                </span>
              ) : null}
              {vehicle ? <span>{vehicle}</span> : null}
              {item.pickupIncluded ? <span className="font-medium text-emerald-700 dark:text-emerald-300">Pickup included</span> : null}
              {item.dropOffIncluded ? <span className="font-medium text-emerald-700 dark:text-emerald-300">Drop-off included</span> : null}
            </div>
          ) : null}
          {item.description ? <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{item.description}</p> : null}
        </div>
      </div>
    </article>
  );
}

function PickupList({ points, departureLabels }: { points: PickupView[]; departureLabels: Map<number, string> }) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Pickup points</h3>
      <ul className="grid gap-3">
        {points.map((point) => {
          const place = [point.name ? point.address : undefined, point.city].filter(Boolean).join(", ");
          const departure = point.departureId != null ? departureLabels.get(point.departureId) : undefined;
          return (
            <li
              key={point.key}
              className="flex gap-4 rounded-xl border border-blue-100 bg-blue-50/70 p-4 dark:border-blue-500/20 dark:bg-blue-500/10"
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm dark:bg-slate-900 dark:text-blue-300">
                <MapPin className="size-5" aria-hidden />
              </span>
              <div className="min-w-0 space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-slate-950 dark:text-white">{point.name ?? point.address}</p>
                  {point.type ? <Badge tone="blue">{point.type}</Badge> : null}
                  {point.time ? (
                    <span className="inline-flex items-center gap-1 rounded-md border border-white bg-white px-2 py-0.5 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                      <Clock className="size-3.5 shrink-0" aria-hidden />
                      {point.time}
                    </span>
                  ) : null}
                </div>
                {place ? <p className="text-sm text-slate-600 dark:text-slate-300">{place}</p> : null}
                {point.instructions ? <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{point.instructions}</p> : null}
                {departure ? (
                  <p className="text-xs font-medium text-blue-700 dark:text-blue-200">For departure on {departure}</p>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function PackageTransportPickup({
  transport,
  pickupPoints,
  departures,
}: {
  transport: TransportView[];
  pickupPoints: PickupView[];
  departures: DepartureView[];
}) {
  if (!transport.length && !pickupPoints.length) return null;
  const departureLabels = new Map(departures.map((departure) => [Number(departure.key), departure.start ?? ""]));
  return (
    <DetailSection
      id="transport"
      title="Transport & pickup"
    >
      <div className="space-y-6">
        {transport.length ? (
          <div className="grid gap-3">
            {transport.map((item) => (
              <TransportCard key={item.key} item={item} />
            ))}
          </div>
        ) : null}
        {pickupPoints.length ? <PickupList points={pickupPoints} departureLabels={departureLabels} /> : null}
      </div>
    </DetailSection>
  );
}
