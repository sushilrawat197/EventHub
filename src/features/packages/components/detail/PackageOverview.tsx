import { useState } from "react";
import { Bus, ChevronDown, Clock, Hotel, MapPin, Users, UtensilsCrossed } from "lucide-react";
import type { PackageDetail } from "../../types/packageDetail";
import {
  clean,
  formatDurationLabel,
  friendlyLabel,
  plural,
  type TransportView,
} from "../../utils/packageDetailFormat";
import { DetailSection } from "./primitives";

function unique(values: (string | undefined)[]): string[] {
  return Array.from(new Set(values.filter((value): value is string => Boolean(value))));
}

export default function PackageOverview({ pkg, transport }: { pkg: PackageDetail; transport: TransportView[] }) {
  const [expanded, setExpanded] = useState(false);
  const description = clean(pkg.description);
  const shortDescription = clean(pkg.shortDescription);
  const destination = unique([
    clean(pkg.destination?.city) ?? clean(pkg.destination?.primaryDestination),
    clean(pkg.destination?.region),
    clean(pkg.destination?.country),
  ]).join(", ");
  const category = clean(pkg.category);
  const transportModes = unique(transport.map((item) => item.mode)).join(", ");
  const stays = (pkg.accommodation ?? []).filter((stay) => stay.active !== false);
  const hotelTypes = unique(stays.map((stay) => clean(stay.accommodationTypeName) ?? friendlyLabel(stay.accommodationTypeCode))).join(", ");
  const includedMeals = (pkg.meals ?? []).filter((meal) => meal.included !== false);
  const longStory = (description?.length ?? 0) > 220;

  const stats = [
    {
      icon: MapPin,
      label: "Destination",
      value: destination,
      iconColor: "text-emerald-600 dark:text-emerald-400",
      bgStyle: "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-100 dark:border-emerald-900/30",
    },
    {
      icon: Clock,
      label: "Duration",
      value: formatDurationLabel(pkg.duration?.days, pkg.duration?.nights),
      iconColor: "text-sky-600 dark:text-sky-400",
      bgStyle: "bg-sky-50 dark:bg-sky-950/40 border-sky-100 dark:border-sky-900/30",
    },
    {
      icon: Hotel,
      label: "Accommodation",
      value: hotelTypes || (stays.length ? plural(stays.length, "stay") : undefined),
      iconColor: "text-amber-600 dark:text-amber-400",
      bgStyle: "bg-amber-50 dark:bg-amber-950/40 border-amber-100 dark:border-amber-900/30",
    },
    {
      icon: Bus,
      label: "Transportation",
      value: transportModes,
      iconColor: "text-indigo-600 dark:text-indigo-400",
      bgStyle: "bg-indigo-50 dark:bg-indigo-950/40 border-indigo-100 dark:border-indigo-900/30",
    },
    {
      icon: UtensilsCrossed,
      label: "Meals",
      value: includedMeals.length ? plural(includedMeals.length, "meal") : undefined,
      iconColor: "text-teal-600 dark:text-teal-400",
      bgStyle: "bg-teal-50 dark:bg-teal-950/40 border-teal-100 dark:border-teal-900/30",
    },
    {
      icon: Users,
      label: "Operator",
      value: clean(pkg.tourOperatorName),
      iconColor: "text-purple-600 dark:text-purple-400",
      bgStyle: "bg-purple-50 dark:bg-purple-950/40 border-purple-100 dark:border-purple-900/30",
    },
  ].filter((stat) => stat.value);

  return (
    <DetailSection
      id="overview"
      eyebrow={category}
      eyebrowTone="emerald"
      title="About this package"
      aside={
        destination ? (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200/80 bg-neutral-50/80 px-3 py-1 text-xs font-semibold text-neutral-800 shadow-xs backdrop-blur-sm dark:border-slate-700/80 dark:bg-slate-800/80 dark:text-slate-200">
            <MapPin className="size-3.5 shrink-0 text-blue-600 dark:text-blue-400" aria-hidden />
            {destination}
          </span>
        ) : undefined
      }
    >
      <div className="flex flex-col gap-6">
        {/* Story / Description Section */}
        <article className="space-y-4 text-sm leading-relaxed text-neutral-700 dark:text-slate-300">
          {shortDescription ? (
            <div className="rounded-2xl border border-blue-100 border-l-4 border-l-blue-600 bg-blue-50 p-4 dark:border-blue-500/30 dark:bg-blue-950/30">
              <p className="m-0 text-sm font-semibold text-neutral-900 sm:text-base dark:text-white">
                {shortDescription}
              </p>
            </div>
          ) : null}

          {description ? (
            <p
              className={`m-0 text-sm font-normal text-neutral-600 sm:text-base/relaxed dark:text-slate-300 ${!expanded && longStory ? "line-clamp-4" : "whitespace-pre-line"
                }`}
            >
              {description}
            </p>
          ) : null}

          {longStory ? (
            <div>
              <button
                type="button"
                onClick={() => setExpanded((open) => !open)}
                className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-neutral-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-blue-600 shadow-xs transition-all hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 active:scale-95 dark:border-slate-700 dark:bg-slate-800 dark:text-blue-400 dark:hover:border-slate-600 dark:hover:bg-slate-700"
              >
                <span>{expanded ? "Show less" : "Read full story & details"}</span>
                <ChevronDown
                  className={`size-3.5 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
                  aria-hidden
                />
              </button>
            </div>
          ) : null}
        </article>

        {/* Highlights & Quick Stats Grid */}
        {stats.length ? (
          <ul className="m-0 grid list-none grid-cols-2 gap-3.5 p-0 sm:grid-cols-3">
            {stats.map((stat) => (
              <li
                key={stat.label}
                className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white hover:shadow-md dark:border-slate-700 dark:bg-slate-800/70 dark:hover:border-slate-600 dark:hover:bg-slate-800"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span
                    className={`flex size-9 items-center justify-center rounded-xl border ${stat.bgStyle} transition-transform duration-200 group-hover:scale-105`}
                  >
                    <stat.icon className={`size-4.5 ${stat.iconColor}`} aria-hidden />
                  </span>
                </div>
                <dl className="m-0 space-y-0.5">
                  <dt className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 dark:text-slate-500">
                    {stat.label}
                  </dt>
                  <dd className="m-0 truncate text-xs font-bold text-neutral-900 sm:text-sm dark:text-white">
                    {stat.value}
                  </dd>
                </dl>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </DetailSection>
  );
}