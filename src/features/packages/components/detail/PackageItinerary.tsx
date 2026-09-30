import { useState } from "react";
import { BedDouble, ChevronDown, Clock, MapPin } from "lucide-react";
import type { PackageDetail, PackageItineraryDay } from "../../types/packageDetail";
import { clean, formatTimeRange } from "../../utils/packageDetailFormat";
import { DetailSection } from "./primitives";

function DayCard({ day, open, onToggle }: { day: PackageItineraryDay; open: boolean; onToggle: () => void }) {
  const panelId = `day-panel-${day.itineraryDayId}`;
  const buttonId = `day-button-${day.itineraryDayId}`;
  const place = [clean(day.destinationCityName), clean(day.regionName)]
    .filter((value, index, list) => value && list.indexOf(value) === index)
    .join(", ");
  const time = formatTimeRange(day.startTime, day.endTime);
  const stayName = clean(day.accommodationName) ?? clean(day.accommodationReference);
  const description = clean(day.description);

  return (
    <li className="group relative">
      <button
        type="button"
        onClick={onToggle}
        aria-label={`Toggle day ${day.dayNumber}`}
        className={`absolute left-[18px] top-4 z-10 flex size-9 -translate-x-1/2 cursor-pointer items-center justify-center rounded-full text-xs font-bold ring-4 ring-white transition-all duration-200 dark:ring-slate-900 ${
          open
            ? "bg-blue-600 text-white shadow-md shadow-blue-600/20 ring-blue-100 dark:ring-blue-950"
            : "border-2 border-neutral-300 bg-white text-neutral-700 hover:border-blue-600 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-blue-400"
        }`}
      >
        {day.dayNumber}
      </button>

      <article
        className={`ml-14 overflow-hidden rounded-xl border bg-slate-50 shadow-[0_16px_40px_-24px_rgba(15,23,42,0.35)] ring-1 ring-slate-900/[0.03] transition-shadow duration-200 dark:bg-slate-800/70 dark:ring-white/5 ${
          open
            ? "border-slate-200 shadow-[0_20px_50px_-28px_rgba(15,23,42,0.55)] dark:border-slate-700"
            : "border-slate-200/90 hover:shadow-[0_18px_44px_-24px_rgba(15,23,42,0.4)] dark:border-slate-800"
        }`}
      >
        <h3>
          <button
            id={buttonId}
            type="button"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={onToggle}
            className="flex w-full cursor-pointer items-start justify-between gap-3 px-4 py-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500 sm:px-4 sm:py-3.5"
          >
            <span className="min-w-0 space-y-2">
              <span className="block font-jakarta text-base font-semibold tracking-tight text-slate-950 sm:text-lg dark:text-white">
                {day.title.trim()}
              </span>
              <span className="flex flex-wrap items-center gap-2 font-jakarta">
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  Day {day.dayNumber}
                </span>
                {time ? (
                  <time className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-0.5 text-xs font-medium text-neutral-600 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-300">
                    <Clock className="size-3 shrink-0 text-neutral-400" aria-hidden />
                    {time}
                  </time>
                ) : null}
                {place ? (
                  <span className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-0.5 text-xs font-medium text-neutral-700 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-300">
                    <MapPin className="size-3 shrink-0 text-red-500 dark:text-red-400" aria-hidden />
                    {place}
                  </span>
                ) : null}
                {day.overnightStay ? (
                  <span className="inline-flex items-center gap-1 rounded-md border border-purple-200/60 bg-purple-50 px-2 py-0.5 text-xs font-semibold text-purple-700 dark:border-purple-900/30 dark:bg-purple-950/40 dark:text-purple-300">
                    Overnight stay
                  </span>
                ) : null}
              </span>
            </span>
            <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-neutral-600 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-300">
              <ChevronDown className={`size-4 transition-transform duration-300 ${open ? "rotate-180 text-blue-600 dark:text-blue-400" : "text-neutral-400"}`} aria-hidden />
            </span>
          </button>
        </h3>

        <section
          id={panelId}
          role="region"
          aria-labelledby={buttonId}
          className={`space-y-3 border-t border-slate-100 px-4 pb-3.5 pt-3 dark:border-slate-800 ${open ? "block" : "hidden print:block"}`}
        >
          {description ? (
            <p className="m-0 max-w-2xl text-sm font-normal leading-relaxed text-slate-600 dark:text-slate-300 whitespace-pre-line">
              {description}
            </p>
          ) : null}
          {stayName ? (
            <div className="flex items-center gap-3 rounded-lg border border-amber-200/60 bg-amber-50/50 px-3 py-2.5 text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/80 text-amber-700 shadow-xs dark:bg-slate-900/60 dark:text-amber-200">
                <BedDouble className="size-4" aria-hidden />
              </span>
              <span className="min-w-0">
                <span className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-700/80 dark:text-amber-200/80">
                  Accommodation
                </span>
                <span className="mt-0.5 block truncate text-sm font-semibold text-neutral-900 dark:text-white">{stayName}</span>
              </span>
              {day.overnightStay ? (
                <span className="ml-auto hidden shrink-0 text-xs font-medium text-amber-800/80 sm:block dark:text-amber-100/80">
                  Overnight stay included
                </span>
              ) : null}
            </div>
          ) : null}
        </section>
      </article>
    </li>
  );
}

export default function PackageItinerary({ pkg }: { pkg: PackageDetail }) {
  const days = [...(pkg.itinerary ?? [])].sort(
    (a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0) || (a.dayNumber ?? 0) - (b.dayNumber ?? 0),
  );
  const [openIds, setOpenIds] = useState<Set<number>>(() => new Set(days[0] ? [days[0].itineraryDayId] : []));

  if (!days.length) return null;

  const allOpen = openIds.size === days.length;

  function toggle(id: number) {
    setOpenIds((previous) => {
      const next = new Set(previous);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <DetailSection
      id="itinerary"
      eyebrow="Day-by-day timeline"
      eyebrowTone="sky"
      meta={`${days.length} ${days.length === 1 ? "day" : "days"} program`}
      title="Trip itinerary timeline"
      aside={
        days.length > 1 ? (
          <button
            type="button"
            onClick={() => setOpenIds(allOpen ? new Set() : new Set(days.map((day) => day.itineraryDayId)))}
            className="cursor-pointer rounded-full border border-neutral-200/80 bg-white px-3.5 py-1.5 text-xs font-semibold text-neutral-700 shadow-xs transition-all hover:border-neutral-300 hover:bg-neutral-50 active:scale-95 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 print:hidden"
          >
            {allOpen ? "Collapse all days" : "Expand all days"}
          </button>
        ) : undefined
      }
    >
      <ol className="relative my-1 list-none space-y-4 p-0">
        <span
          aria-hidden
          className="pointer-events-none absolute bottom-8 left-[18px] top-8 w-0.5 -translate-x-1/2 bg-blue-500/25 dark:bg-slate-700"
        />
        {days.map((day) => (
          <DayCard
            key={day.itineraryDayId}
            day={day}
            open={openIds.has(day.itineraryDayId)}
            onToggle={() => toggle(day.itineraryDayId)}
          />
        ))}
      </ol>
    </DetailSection>
  );
}