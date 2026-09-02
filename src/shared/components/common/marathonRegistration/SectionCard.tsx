import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SectionCard({
  title,
  subtitle,
  icon,
  iconBgClass,
  children,
  className,
}: {
  title: string;
  subtitle?: string;
  icon: ReactNode;
  iconBgClass: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-xl border border-gray-100 bg-white/95 shadow-sm transition-all hover:shadow-md",
        className
      )}
    >
      <div className="flex shrink-0 items-center gap-3 border-b border-gray-100 bg-slate-50/50 px-4 py-3">
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm shadow-sm ${iconBgClass}`}
        >
          {icon}
        </div>
        <div className="min-w-0 flex-1 leading-tight">
          <h2 className="text-sm font-bold text-gray-800">{title}</h2>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4">{children}</div>
    </section>
  );
}
