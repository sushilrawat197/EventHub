import { useState, type ReactNode } from "react";
import { ImageOff, type LucideIcon } from "lucide-react";
import type { BadgeTone } from "../../utils/packageDetailIcons";

export const sectionShell =
  "scroll-mt-[calc(var(--site-header-height,8rem)+5.25rem)] w-full rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_10px_28px_rgba(15,23,42,0.06)] sm:p-8 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none";

const EYEBROW_TONES = {
  emerald: "bg-emerald-50 text-emerald-800 border-emerald-200/60 dark:bg-emerald-500/15 dark:text-emerald-200 dark:border-emerald-500/30",
  amber: "bg-amber-50 text-amber-800 border-amber-200/60 dark:bg-amber-500/15 dark:text-amber-200 dark:border-amber-500/30",
  rose: "bg-rose-50 text-rose-800 border-rose-200/60 dark:bg-rose-500/15 dark:text-rose-200 dark:border-rose-500/30",
  sky: "bg-sky-50 text-sky-800 border-sky-200/60 dark:bg-sky-500/15 dark:text-sky-200 dark:border-sky-500/30",
  indigo: "bg-indigo-50 text-indigo-800 border-indigo-200/60 dark:bg-indigo-500/15 dark:text-indigo-200 dark:border-indigo-500/30",
  blue: "bg-blue-50 text-blue-800 border-blue-200/60 dark:bg-blue-500/15 dark:text-blue-200 dark:border-blue-500/30",
  slate: "bg-neutral-100 text-neutral-800 border-neutral-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700",
} as const;

export function DetailSection({
  id,
  eyebrow,
  eyebrowTone = "slate",
  meta,
  title,
  aside,
  children,
}: {
  id?: string;
  eyebrow?: string;
  eyebrowTone?: keyof typeof EYEBROW_TONES;
  meta?: string;
  title: string;
  aside?: ReactNode;
  children: ReactNode;
}) {
  const headingId = id ? `${id}-heading` : undefined;
  return (
    <section id={id} aria-labelledby={headingId} className={`${sectionShell} space-y-6 print:break-inside-avoid`}>
      <header className="flex flex-col justify-between gap-3 border-b border-neutral-100 pb-4 sm:flex-row sm:items-center dark:border-slate-800">
        <div>
          {eyebrow || meta ? (
            <p className="mb-1 flex flex-wrap items-center gap-2">
              {eyebrow ? (
                <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${EYEBROW_TONES[eyebrowTone]}`}>
                  {eyebrow}
                </span>
              ) : null}
              {meta ? <span className="text-xs font-medium text-neutral-500 dark:text-slate-400">{meta}</span> : null}
            </p>
          ) : null}
          <h2 id={headingId} className="text-xl font-semibold tracking-tight text-neutral-900 sm:text-2xl dark:text-white">
            {title}
          </h2>
        </div>
        {aside ? <div className="max-w-xs text-xs font-normal leading-relaxed text-neutral-500 dark:text-slate-400">{aside}</div> : null}
      </header>
      {children}
    </section>
  );
}

export function SectionCard({
  id,
  title,
  icon: Icon,
  children,
  className = "",
}: {
  id?: string;
  title: string;
  icon?: LucideIcon;
  children: ReactNode;
  className?: string;
}) {
  const headingId = id ? `${id}-heading` : undefined;
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={`scroll-mt-40 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-6 dark:border-slate-800 dark:bg-slate-900 print:break-inside-avoid print:border-slate-300 print:shadow-none ${className}`}
    >
      <h2
        id={headingId}
        className="mb-4 flex items-center gap-2.5 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-slate-50"
      >
        {Icon ? (
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300">
            <Icon className="size-[18px]" aria-hidden />
          </span>
        ) : null}
        {title}
      </h2>
      {children}
    </section>
  );
}

const BADGE_TONES: Record<BadgeTone, string> = {
  blue: "bg-blue-50 text-blue-700 ring-blue-200 dark:bg-blue-500/15 dark:text-blue-200 dark:ring-blue-500/30",
  green: "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-200 dark:ring-emerald-500/30",
  red: "bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-500/15 dark:text-rose-200 dark:ring-rose-500/30",
  amber: "bg-amber-50 text-amber-800 ring-amber-200 dark:bg-amber-500/15 dark:text-amber-200 dark:ring-amber-500/30",
  slate: "bg-slate-100 text-slate-700 ring-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700",
};

export function Badge({
  tone = "slate",
  icon: Icon,
  children,
  className = "",
}: {
  tone?: BadgeTone;
  icon?: LucideIcon;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${BADGE_TONES[tone]} ${className}`}
    >
      {Icon ? <Icon className="size-3.5" aria-hidden /> : null}
      {children}
    </span>
  );
}

export function SafeImage({
  src,
  alt,
  className = "",
  iconClassName = "size-8",
  loading = "lazy",
}: {
  src?: string;
  alt: string;
  className?: string;
  iconClassName?: string;
  loading?: "lazy" | "eager";
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400 dark:from-slate-800 dark:to-slate-700 dark:text-slate-500 ${className}`}
      >
        <ImageOff className={iconClassName} aria-hidden />
      </div>
    );
  }

  return (
    <img src={src} alt={alt} loading={loading} onError={() => setFailed(true)} className={`object-cover ${className}`} />
  );
}

export function Fact({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value?: ReactNode }) {
  if (value == null || value === "") return null;
  return (
    <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-800/50">
      <Icon className="mt-0.5 size-4 shrink-0 text-blue-600 dark:text-blue-300" aria-hidden />
      <div className="min-w-0">
        <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</dt>
        <dd className="mt-0.5 text-sm font-semibold text-slate-900 dark:text-slate-100">{value}</dd>
      </div>
    </div>
  );
}
