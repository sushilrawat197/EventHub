import { BedDouble, Building, Check, Hotel, Minus, Tent, TreePalm, Home, type LucideIcon } from "lucide-react";
import type { PackageAccommodation, PackageDetail } from "../../types/packageDetail";
import { byDisplayOrder, clean, friendlyLabel, plural } from "../../utils/packageDetailFormat";
import { Badge, DetailSection } from "./primitives";

const STAY_ICONS: Record<string, LucideIcon> = {
  HOTEL: Hotel,
  RESORT: TreePalm,
  CAMP: Tent,
  CAMPSITE: Tent,
  LODGE: Home,
  GUEST_HOUSE: Home,
  GUESTHOUSE: Home,
  APARTMENT: Building,
};

const MEAL_COLUMNS = ["BREAKFAST", "LUNCH", "DINNER"];

function StayCard({ stay }: { stay: PackageAccommodation }) {
  const code = stay.accommodationTypeCode?.toUpperCase() ?? "";
  const Icon = STAY_ICONS[code] ?? BedDouble;
  const type = clean(stay.accommodationTypeName) ?? clean(stay.accommodationTypeOtherDescription) ?? friendlyLabel(code);
  const room = clean(stay.roomTypeDescription) ?? friendlyLabel(stay.roomType);
  const sharing = clean(stay.sharingTypeDescription) ?? friendlyLabel(stay.sharingType);
  const days = (stay.dayNumbers ?? []).filter((day) => day != null).sort((a, b) => a - b);
  const description = clean(stay.description);

  return (
    <article className="flex gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:bg-white hover:shadow-md dark:border-slate-700 dark:bg-slate-800/70 dark:hover:bg-slate-800 print:break-inside-avoid">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300">
        <Icon className="size-5" aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            {type ? <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{type}</p> : null}
            <h3 className="text-base font-bold text-slate-900 dark:text-white">{stay.propertyName.trim()}</h3>
          </div>
          {stay.included === false ? <Badge tone="amber">Not included</Badge> : null}
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {room ? <Badge>{room} room</Badge> : null}
          {sharing ? <Badge>{sharing} sharing</Badge> : null}
          {stay.nights ? <Badge>{plural(stay.nights, "night")}</Badge> : null}
          {days.length ? <Badge tone="blue">Day {days.join(", ")}</Badge> : null}
        </div>
        {description ? <p className="mt-2.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{description}</p> : null}
      </div>
    </article>
  );
}

function MealsGrid({ pkg }: { pkg: PackageDetail }) {
  const meals = (pkg.meals ?? []).filter((meal) => meal.included !== false);
  if (!meals.length) return null;

  const dayNumberById = new Map((pkg.itinerary ?? []).map((day) => [day.itineraryDayId, day.dayNumber]));
  const byDay = new Map<number, Set<string>>();
  const extraColumns = new Set<string>();
  const labels = new Map<string, string>();

  for (const meal of meals) {
    const day = meal.dayNumber ?? (meal.itineraryDayId != null ? dayNumberById.get(meal.itineraryDayId) : undefined);
    const code = (clean(meal.mealTypeCode) ?? clean(meal.mealTypeName) ?? "").toUpperCase();
    if (day == null || !code) continue;
    labels.set(code, clean(meal.mealTypeName) ?? friendlyLabel(code) ?? code);
    if (!MEAL_COLUMNS.includes(code)) extraColumns.add(code);
    if (!byDay.has(day)) byDay.set(day, new Set());
    byDay.get(day)!.add(code);
  }

  const days = Array.from(byDay.keys()).sort((a, b) => a - b);
  if (!days.length) return null;
  const columns = [...MEAL_COLUMNS, ...extraColumns];

  return (
    <div>
      <h3 className="mb-3 text-base font-bold text-slate-900 dark:text-white">Meals by day</h3>
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/70">
        <table className="w-full min-w-[360px] text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:bg-slate-800/60 dark:text-slate-400">
            <tr>
              <th scope="col" className="px-4 py-2.5 text-left font-semibold">Day</th>
              {columns.map((code) => (
                <th key={code} scope="col" className="px-4 py-2.5 text-center font-semibold">
                  {labels.get(code) ?? friendlyLabel(code)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {days.map((day) => (
              <tr key={day}>
                <th scope="row" className="px-4 py-2.5 text-left font-semibold text-slate-800 dark:text-slate-100">
                  Day {day}
                </th>
                {columns.map((code) => {
                  const included = byDay.get(day)!.has(code);
                  return (
                    <td key={code} className="px-4 py-2.5 text-center">
                      {included ? (
                        <Check className="mx-auto size-4 text-emerald-600 dark:text-emerald-400" aria-label="Included" />
                      ) : (
                        <Minus className="mx-auto size-4 text-slate-300 dark:text-slate-600" aria-label="Not included" />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function PackageStayMeals({ pkg }: { pkg: PackageDetail }) {
  const stays = byDisplayOrder((pkg.accommodation ?? []).filter((stay) => stay.active !== false && clean(stay.propertyName)));
  const hasMeals = (pkg.meals ?? []).some((meal) => meal.included !== false);
  if (!stays.length && !hasMeals) return null;

  return (
    <DetailSection
      id="stay"
      title="Stay & meals"
    >
      <div className="space-y-6">
        {stays.length ? (
          <div className="grid gap-3">
            {stays.map((stay) => (
              <StayCard key={stay.accommodationId} stay={stay} />
            ))}
          </div>
        ) : null}
        <MealsGrid pkg={pkg} />
      </div>
    </DetailSection>
  );
}
