import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  AlertTriangle,
  Backpack,
  CheckCircle2,
  Clock,
  MapPin,
  Navigation,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import type { PackageActivity, PackageDetail } from "../../types/packageDetail";
import {
  activeActivities,
  byDisplayOrder,
  clean,
  formatActivityDuration,
  formatAgeRange,
  formatMoney,
  friendlyLabel,
} from "../../utils/packageDetailFormat";
import { Badge, DetailSection } from "./primitives";

const ACTIVITY_FALLBACK_IMAGE = "/activity-fallback.jpg";

function activityImage(activity: PackageActivity): string {
  const media = byDisplayOrder(activity.media ?? []).sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary));
  return clean(media[0]?.mediaUrl) ?? ACTIVITY_FALLBACK_IMAGE;
}

function ActivityPhoto({ src, alt, className }: { src: string; alt: string; className: string }) {
  const [current, setCurrent] = useState(src);
  return (
    <img
      src={current}
      alt={alt}
      className={`object-cover ${className}`}
      onError={() => {
        if (current !== ACTIVITY_FALLBACK_IMAGE) setCurrent(ACTIVITY_FALLBACK_IMAGE);
      }}
    />
  );
}

function PriceBadge({ activity }: { activity: PackageActivity }) {
  const type = activity.inclusionType?.toUpperCase();
  if (type === "INCLUDED" || !activity.price) {
    return type === "INCLUDED" ? <Badge tone="green" icon={CheckCircle2}>Included</Badge> : null;
  }
  const price = formatMoney(activity.price, activity.currency);
  const basis = friendlyLabel(activity.pricingBasisCode)?.toLowerCase();
  return (
    <Badge tone="blue">
      {price}
      {basis ? ` · ${basis}` : ""}
    </Badge>
  );
}

function ActivityCard({ activity, onOpen }: { activity: PackageActivity; onOpen: () => void }) {
  const type = clean(activity.activityType);
  const location = clean(activity.location);
  const duration = formatActivityDuration(activity);
  const summary = clean(activity.shortDescription) ?? clean(activity.description);

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:border-slate-300 hover:shadow-md sm:flex-row dark:border-slate-700 dark:bg-slate-900 print:break-inside-avoid">
      <div className="relative shrink-0 sm:w-56">
        <ActivityPhoto src={activityImage(activity)} alt={activity.activityName} className="aspect-[16/10] h-full w-full sm:aspect-auto sm:min-h-44" />
        {type ? (
          <span className="absolute left-3 top-3">
            <Badge tone="slate" className="bg-white/95 backdrop-blur dark:bg-slate-900/80">
              {type}
            </Badge>
          </span>
        ) : null}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-2 p-4">
        <h4 className="text-base font-semibold tracking-tight text-slate-950 dark:text-white">{activity.activityName.trim()}</h4>
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
          {location ? (
            <span className="inline-flex items-center gap-1">
              <MapPin className="size-3.5 shrink-0 text-red-500" aria-hidden />
              {location}
            </span>
          ) : null}
          {duration ? (
            <span className="inline-flex items-center gap-1">
              <Clock className="size-3.5 shrink-0" aria-hidden />
              {duration}
            </span>
          ) : null}
        </div>
        {summary ? <p className="line-clamp-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{summary}</p> : null}
        <div className="mt-auto flex items-center justify-between gap-3 pt-2">
          <PriceBadge activity={activity} />
          <button
            type="button"
            onClick={onOpen}
            className="shrink-0 whitespace-nowrap rounded-lg px-2 py-1 text-sm font-semibold text-blue-600 transition hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-blue-300 dark:hover:bg-blue-500/10 print:hidden"
            aria-label={`View details for ${activity.activityName.trim()}`}
          >
            View details
          </button>
        </div>
      </div>
    </article>
  );
}

function DetailBlock({ icon: Icon, title, text }: { icon: LucideIcon; title: string; text?: string }) {
  if (!text) return null;
  return (
    <div>
      <h4 className="flex items-center gap-1.5 text-sm font-semibold text-slate-900 dark:text-white">
        <Icon className="size-4 text-blue-600 dark:text-blue-300" aria-hidden />
        {title}
      </h4>
      <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-slate-600 dark:text-slate-300">{text}</p>
    </div>
  );
}

export function ActivityDrawer({ activity, onClose }: { activity: PackageActivity; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [onClose]);

  const requirements = clean(activity.requirements);
  const age = formatAgeRange(activity.minAge, activity.maxAge);
  const location = clean(activity.location);
  const duration = formatActivityDuration(activity);
  const titleId = `activity-${activity.activityId}-title`;

  return createPortal(
    <div className="fixed inset-0 z-[1000] flex justify-end" role="presentation">
      <button
        type="button"
        aria-label="Close activity details"
        tabIndex={-1}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/50 backdrop-blur-[2px] animate-in fade-in duration-200"
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative flex h-full w-full max-w-md flex-col bg-white shadow-2xl animate-in slide-in-from-right duration-200 dark:bg-slate-900"
      >
        <div className="relative">
          <ActivityPhoto src={activityImage(activity)} alt={activity.activityName} className="aspect-[16/9] w-full" />
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-slate-700 shadow transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <X className="size-4" />
          </button>
        </div>
        <div className="flex-1 space-y-5 overflow-y-auto p-5">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              {clean(activity.activityType) ? <Badge tone="blue">{activity.activityType!.trim()}</Badge> : null}
              <PriceBadge activity={activity} />
            </div>
            <h3 id={titleId} className="mt-2 text-xl font-bold text-slate-900 dark:text-white">
              {activity.activityName.trim()}
            </h3>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500 dark:text-slate-400">
              {location ? (
                <span className="inline-flex items-center gap-1">
                  <MapPin className="size-4" aria-hidden />
                  {location}
                </span>
              ) : null}
              {duration ? (
                <span className="inline-flex items-center gap-1">
                  <Clock className="size-4" aria-hidden />
                  {duration}
                </span>
              ) : null}
              {age ? (
                <span className="inline-flex items-center gap-1">
                  <Users className="size-4" aria-hidden />
                  Ages {age}
                </span>
              ) : null}
            </div>
          </div>

          {clean(activity.description) ?? clean(activity.shortDescription) ? (
            <p className="whitespace-pre-line text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {clean(activity.description) ?? clean(activity.shortDescription)}
            </p>
          ) : null}

          {requirements ? (
            <div role="note" className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3.5 dark:border-amber-500/30 dark:bg-amber-500/10">
              <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-300" aria-hidden />
              <div>
                <p className="text-sm font-semibold text-amber-900 dark:text-amber-100">Requirements</p>
                <p className="mt-0.5 text-sm text-amber-900/90 dark:text-amber-100/90">{requirements}</p>
              </div>
            </div>
          ) : null}

          <DetailBlock icon={CheckCircle2} title="What's included" text={clean(activity.whatIsIncluded)} />
          <DetailBlock icon={Backpack} title="What to bring" text={clean(activity.whatToBring)} />
          <DetailBlock icon={Navigation} title="Meeting point" text={clean(activity.meetingPickupInfo)} />
        </div>
      </aside>
    </div>,
    document.body,
  );
}

export default function PackageActivities({
  pkg,
  onOpenActivity,
}: {
  pkg: PackageDetail;
  onOpenActivity: (activity: PackageActivity) => void;
}) {
  const activities = activeActivities(pkg);
  if (!activities.length) return null;

  const dayTitles = new Map((pkg.itinerary ?? []).map((day) => [day.itineraryDayId, day]));
  const scheduled = activities.filter((activity) => activity.itineraryDayId != null);
  const other = activities.filter((activity) => activity.itineraryDayId == null);

  const groups = [
    ...(scheduled.length ? [{ key: "scheduled", title: undefined as string | undefined, items: scheduled }] : []),
    ...(other.length ? [{ key: "other", title: "Other included activities", items: other }] : []),
  ];

  return (
    <DetailSection
      id="activities"
      meta={`${activities.length} ${activities.length === 1 ? "activity" : "activities"}`}
      title="Activities"
    >
      <div className="space-y-6">
        {groups.map((group) => (
          <div key={group.key}>
            {group.title ? (
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{group.title}</h3>
            ) : null}
            <div className="grid gap-4">
              {group.items.map((activity) => (
                <div key={activity.activityId} className="flex flex-col">
                  {activity.itineraryDayId != null && dayTitles.get(activity.itineraryDayId) ? (
                    <span className="mb-1.5 text-xs font-semibold text-blue-600 dark:text-blue-300">
                      Day {dayTitles.get(activity.itineraryDayId)!.dayNumber}
                    </span>
                  ) : null}
                  <ActivityCard activity={activity} onOpen={() => onOpenActivity(activity)} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </DetailSection>
  );
}
