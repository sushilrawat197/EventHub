import { Compass, MapPin } from "lucide-react";
import type { PackageActivity } from "../../types/packageDetail";
import { byDisplayOrder, clean, formatMoney, friendlyLabel } from "../../utils/packageDetailFormat";
import { SafeImage, SectionCard } from "../detail/primitives";
import { Stepper } from "./reviewPrimitives";

export default function ActivitySelection({
  activities,
  quantities,
  maxQuantity,
  onChange,
}: {
  activities: PackageActivity[];
  quantities: Record<number, number>;
  maxQuantity: number;
  onChange: (activityId: number, quantity: number) => void;
}) {
  if (!activities.length) return null;

  return (
    <SectionCard id="add-ons" title="Optional activities" icon={Compass}>
      <p className="-mt-2 mb-4 text-sm text-slate-500 dark:text-slate-400">Add extra experiences to your trip.</p>
      <ul className="space-y-3">
        {activities.map((activity) => {
          const image = clean(byDisplayOrder(activity.media ?? [])[0]?.mediaUrl);
          const basis = friendlyLabel(activity.pricingBasisCode)?.toLowerCase();
          const location = clean(activity.location);
          return (
            <li
              key={activity.activityId}
              className="flex flex-col gap-3 rounded-xl border border-slate-200 p-3 sm:flex-row sm:items-center dark:border-slate-700"
            >
              <SafeImage src={image} alt={activity.activityName} className="h-16 w-full shrink-0 rounded-lg sm:w-24" iconClassName="size-5" />
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-slate-900 dark:text-white">{activity.activityName.trim()}</p>
                <p className="mt-0.5 flex flex-wrap items-center gap-x-3 text-sm text-slate-500 dark:text-slate-400">
                  <span className="font-medium text-slate-700 dark:text-slate-200">
                    {formatMoney(activity.price, activity.currency)}
                    {basis ? ` · ${basis}` : ""}
                  </span>
                  {location ? (
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="size-3.5" aria-hidden />
                      {location}
                    </span>
                  ) : null}
                </p>
              </div>
              <Stepper
                label={activity.activityName.trim()}
                value={quantities[activity.activityId] ?? 0}
                min={0}
                max={maxQuantity}
                onChange={(value) => onChange(activity.activityId, value)}
              />
            </li>
          );
        })}
      </ul>
    </SectionCard>
  );
}
