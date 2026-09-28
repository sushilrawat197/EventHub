import { CalendarDays, Check, Clock, MapPin } from "lucide-react";
import { plural, type DepartureView, type PickupView } from "../../utils/packageDetailFormat";
import { statusTone } from "../../utils/packageDetailIcons";
import { Badge, SectionCard } from "../detail/primitives";

export default function TripSelection({
  departures,
  departureKey,
  onDeparture,
  pickups,
  pickupKey,
  onPickup,
  departureError,
  pickupError,
}: {
  departures: DepartureView[];
  departureKey?: string;
  onDeparture: (key: string) => void;
  pickups: PickupView[];
  pickupKey?: string;
  onPickup: (key: string) => void;
  departureError?: string;
  pickupError?: string;
}) {
  return (
    <SectionCard id="trip" title="Trip details" icon={CalendarDays}>
      <fieldset>
        <legend className="mb-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
          Departure date <span className="text-rose-500">*</span>
        </legend>
        {departures.length ? (
          <div className="grid gap-2 sm:grid-cols-2">
            {departures.map((departure) => {
              const selected = departure.key === departureKey;
              return (
                <label
                  key={departure.key}
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition focus-within:ring-2 focus-within:ring-blue-500 ${
                    !departure.bookable
                      ? "cursor-not-allowed border-slate-100 bg-slate-50 opacity-60 dark:border-slate-800 dark:bg-slate-800/40"
                      : selected
                        ? "border-blue-500 bg-blue-50/60 dark:border-blue-400 dark:bg-blue-500/10"
                        : "border-slate-200 hover:border-slate-300 dark:border-slate-700"
                  }`}
                >
                  <input
                    type="radio"
                    name="review-departure"
                    className="sr-only"
                    checked={selected}
                    disabled={!departure.bookable}
                    onChange={() => onDeparture(departure.key)}
                  />
                  <span
                    aria-hidden
                    className={`mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border ${
                      selected ? "border-blue-600 bg-blue-600 text-white" : "border-slate-300 dark:border-slate-600"
                    }`}
                  >
                    {selected ? <Check className="size-3" /> : null}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {departure.start}
                        {departure.end && departure.end !== departure.start ? ` → ${departure.end}` : ""}
                      </span>
                      {departure.status ? <Badge tone={statusTone(departure.statusCode)}>{departure.status}</Badge> : null}
                    </span>
                    {departure.days ? (
                      <span className="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">{plural(departure.days, "day")}</span>
                    ) : null}
                  </span>
                </label>
              );
            })}
          </div>
        ) : (
          <p className="rounded-xl bg-slate-50 p-3 text-sm text-slate-600 dark:bg-slate-800/60 dark:text-slate-300">
            No departure dates are available for this package.
          </p>
        )}
        {departureError ? (
          <p role="alert" className="mt-2 text-sm font-medium text-rose-600 dark:text-rose-400">{departureError}</p>
        ) : null}
      </fieldset>

      {departureKey && pickups.length ? (
        <fieldset className="mt-6">
          <legend className="mb-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
            Pickup point <span className="text-rose-500">*</span>
          </legend>
          <div className="grid gap-2">
            {pickups.map((point) => {
              const selected = point.key === pickupKey;
              return (
                <label
                  key={point.key}
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition focus-within:ring-2 focus-within:ring-blue-500 ${
                    selected
                      ? "border-blue-500 bg-blue-50/60 dark:border-blue-400 dark:bg-blue-500/10"
                      : "border-slate-200 hover:border-slate-300 dark:border-slate-700"
                  }`}
                >
                  <input
                    type="radio"
                    name="review-pickup"
                    className="sr-only"
                    checked={selected}
                    onChange={() => onPickup(point.key)}
                  />
                  <MapPin className={`mt-0.5 size-4 shrink-0 ${selected ? "text-blue-600" : "text-slate-400"}`} aria-hidden />
                  <span className="min-w-0 flex-1 text-sm">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-slate-900 dark:text-slate-100">{point.name ?? point.address}</span>
                      {point.type ? <Badge tone="blue">{point.type}</Badge> : null}
                      {point.time ? (
                        <span className="inline-flex items-center gap-1 text-slate-500 dark:text-slate-400">
                          <Clock className="size-3.5" aria-hidden />
                          {point.time}
                        </span>
                      ) : null}
                    </span>
                    {[point.name ? point.address : undefined, point.city].filter(Boolean).length ? (
                      <span className="mt-0.5 block text-slate-500 dark:text-slate-400">
                        {[point.name ? point.address : undefined, point.city].filter(Boolean).join(", ")}
                      </span>
                    ) : null}
                  </span>
                </label>
              );
            })}
          </div>
          {pickupError ? (
            <p role="alert" className="mt-2 text-sm font-medium text-rose-600 dark:text-rose-400">{pickupError}</p>
          ) : null}
        </fieldset>
      ) : null}
    </SectionCard>
  );
}
