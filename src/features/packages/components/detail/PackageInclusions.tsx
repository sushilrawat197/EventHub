import {
  BedDouble,
  Bus,
  Check,
  Compass,
  Plane,
  ShieldPlus,
  Sparkles,
  Ticket,
  UserRound,
  UtensilsCrossed,
  X,
  type LucideIcon,
} from "lucide-react";
import type { PackageInclusion } from "../../types/packageDetail";
import { byDisplayOrder, clean, friendlyLabel } from "../../utils/packageDetailFormat";
import { DetailSection } from "./primitives";

const CATEGORY_ICONS: Array<[RegExp, LucideIcon]> = [
  [/TRANSPORT|TRANSFER/, Bus],
  [/ACCOMMODATION|STAY|HOTEL/, BedDouble],
  [/MEAL|FOOD/, UtensilsCrossed],
  [/ACTIVITY|SIGHTSEEING|EXCURSION/, Compass],
  [/INSURANCE/, ShieldPlus],
  [/FLIGHT|AIRFARE|VISA/, Plane],
  [/GUIDE/, UserRound],
  [/ENTRY|PERMIT|TICKET/, Ticket],
];

function categoryIcon(code: string | null | undefined): LucideIcon {
  const value = (code ?? "").toUpperCase();
  return CATEGORY_ICONS.find(([pattern]) => pattern.test(value))?.[1] ?? Sparkles;
}

function InclusionList({ title, items, included }: { title: string; items: PackageInclusion[]; included: boolean }) {
  const StatusIcon = included ? Check : X;
  return (
    <div
      className={`rounded-2xl border p-4 sm:p-5 print:break-inside-avoid ${
        included
          ? "border-emerald-100 bg-emerald-50/40 dark:border-emerald-500/20 dark:bg-emerald-500/5"
          : "border-rose-100 bg-rose-50/40 dark:border-rose-500/20 dark:bg-rose-500/5"
      }`}
    >
      <h3 className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
        <span
          className={`flex size-6 items-center justify-center rounded-full text-white ${included ? "bg-emerald-500" : "bg-rose-500"}`}
          aria-hidden
        >
          <StatusIcon className="size-3.5" strokeWidth={3} />
        </span>
        {title}
      </h3>
      {items.length ? (
        <ul className="mt-4 space-y-3.5">
          {items.map((item) => {
            const CategoryIcon = categoryIcon(item.categoryCode ?? item.categoryName);
            const category = clean(item.categoryName) ?? friendlyLabel(item.categoryCode);
            return (
              <li key={item.inclusionId} className="flex gap-3">
                <CategoryIcon
                  className={`mt-0.5 size-4 shrink-0 ${included ? "text-emerald-600 dark:text-emerald-400" : "text-rose-500 dark:text-rose-400"}`}
                  aria-hidden
                />
                <div className="min-w-0">
                  {category ? (
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{category}</p>
                  ) : null}
                  <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">{clean(item.description)}</p>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Nothing listed.</p>
      )}
    </div>
  );
}

export default function PackageInclusions({
  inclusions,
  exclusions,
}: {
  inclusions: PackageInclusion[];
  exclusions: PackageInclusion[];
}) {
  const included = byDisplayOrder((inclusions ?? []).filter((item) => clean(item.description)));
  const excluded = byDisplayOrder((exclusions ?? []).filter((item) => clean(item.description)));
  if (!included.length && !excluded.length) return null;

  return (
    <DetailSection
      id="inclusions"
      title="What's included & what's not included"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <InclusionList title="What's included" items={included} included />
        <InclusionList title="Not included" items={excluded} included={false} />
      </div>
    </DetailSection>
  );
}
