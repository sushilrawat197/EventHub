import { Clock, MapPin, Users } from "lucide-react";
import type { DepartureView, PickupView, TransportView } from "../../utils/packageDetailFormat";
import { transportIcon } from "../../utils/packageDetailIcons";
import { Badge, DetailSection } from "./primitives";

function TransportCard({ item }: { item: TransportView }) {
  const Icon = transportIcon(item.modeCode);
  return (
    <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:bg-white hover:shadow-md dark:border-slate-700 dark:bg-slate-800/70 dark:hover:bg-slate-800 print:break-inside-avoid">
      <div className="flex items-start gap-3">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-500/15 dark:text-sky-300">
          <Icon className="size-5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {[item.mode ?? "Transfer", item.dayNumber != null ? `Day ${item.dayNumber}` : undefined].filter(Boolean).join(" · ")}
          </p>
          {item.route ? <h3 className="text-base font-bold text-slate-900 dark:text-white">{item.route}</h3> : null}
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {!item.included ? <Badge tone="amber">Not included</Badge> : null}
        {item.vehicle ? <Badge>{item.vehicle}</Badge> : null}
        {item.capacity ? (
          <Badge icon={Users}>
            {item.capacity} seats
          </Badge>
        ) : null}
        {item.pickupIncluded ? <Badge tone="green">Pickup included</Badge> : null}
        {item.dropOffIncluded ? <Badge tone="green">Drop-off included</Badge> : null}
      </div>
      {item.description ? <p className="mt-2.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{item.description}</p> : null}
    </article>
  );
}

function PickupList({ points, departureLabels }: { points: PickupView[]; departureLabels: Map<number, string> }) {
  return (
    <div>
      <h3 className="mb-3 text-base font-bold text-slate-900 dark:text-white">Pickup points</h3>
      <ul className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-slate-50 dark:divide-slate-700 dark:border-slate-700 dark:bg-slate-800/70">
        {points.map((point) => (
          <li key={point.key} className="flex gap-3 p-4">
            <MapPin className="mt-0.5 size-4 shrink-0 text-blue-600 dark:text-blue-300" aria-hidden />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-semibold text-slate-900 dark:text-white">{point.name ?? point.address}</p>
                {point.type ? <Badge tone="blue">{point.type}</Badge> : null}
                {point.time ? (
                  <span className="inline-flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
                    <Clock className="size-3.5" aria-hidden />
                    {point.time}
                  </span>
                ) : null}
              </div>
              {[point.name ? point.address : undefined, point.city].filter(Boolean).length ? (
                <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                  {[point.name ? point.address : undefined, point.city].filter(Boolean).join(", ")}
                </p>
              ) : null}
              {point.instructions ? <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-300">{point.instructions}</p> : null}
              {point.departureId != null && departureLabels.get(point.departureId) ? (
                <p className="mt-1.5 text-xs font-medium text-blue-600 dark:text-blue-300">
                  For departure on {departureLabels.get(point.departureId)}
                </p>
              ) : null}
            </div>
          </li>
        ))}
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
          <div className="grid gap-3 sm:grid-cols-2">
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
