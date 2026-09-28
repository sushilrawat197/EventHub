import { memo, useState } from "react";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { TourPackage } from "../types/package";
import {
  formatDeparture,
  formatPackagePrice,
  formatPricingBasis,
  packagePath,
} from "../utils/formatPackage";

function PackageCard({ pkg }: { pkg: TourPackage }) {
  const navigate = useNavigate();
  const [imgLoaded, setImgLoaded] = useState(false);
  const open = () => navigate(packagePath(pkg), { state: pkg });
  const place = [pkg.destination, pkg.country].filter(Boolean).join(", ");

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={open}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          open();
        }
      }}
      className="flex h-full cursor-pointer flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
    >
      <div className="relative h-52 w-full shrink-0 overflow-hidden bg-gray-200">
        {!imgLoaded && <div className="absolute inset-0 animate-pulse bg-gray-200" />}
        {pkg.coverImage ? (
          <img
            src={pkg.coverImage}
            alt=""
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
            className={`h-full w-full object-cover transition-opacity duration-300 ${
              imgLoaded ? "opacity-100" : "opacity-0"
            }`}
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10" />

        {!pkg.available && (
          <span className="absolute right-3 top-3 rounded-full bg-red-500 px-2.5 py-1 text-[11px] font-semibold text-white">
            Unavailable
          </span>
        )}

        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
          <Clock className="h-3.5 w-3.5" />
          {pkg.durationNights}N / {pkg.durationDays}D
        </span>

        <div className="absolute inset-x-0 bottom-0 px-4 pb-4">
          <h3 className="line-clamp-2 text-xl font-bold leading-tight text-white drop-shadow-sm">
            {pkg.packageName}
          </h3>
          {place ? (
            <p className="mt-1.5 flex items-center gap-2 text-sm font-medium text-white/95">
              <span className="h-2 w-2 rounded-full bg-blue-400" />
              {place}
            </p>
          ) : null}
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between gap-4 p-4">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {pkg.category ? (
              <span className="rounded-full bg-blue-50 px-2.5 py-1 font-semibold text-blue-700">
                {pkg.category}
              </span>
            ) : null}
            {pkg.tourOperatorName ? (
              <span className="text-gray-500">{pkg.tourOperatorName}</span>
            ) : null}
          </div>
          {pkg.nextDepartureDate ? (
            <p className="inline-flex items-center gap-1.5 text-sm text-gray-600">
              <Calendar className="h-3.5 w-3.5 text-blue-600" />
              {formatDeparture(pkg.nextDepartureDate)}
            </p>
          ) : null}
          {pkg.shortDescription ? (
            <p className="line-clamp-2 text-sm leading-6 text-gray-600">
              {pkg.shortDescription}
            </p>
          ) : null}
        </div>

        <div className="flex items-end justify-between gap-3 border-t border-gray-100 pt-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
              Starting from
            </p>
            <p className="text-2xl font-bold leading-none text-gray-900">
              {formatPackagePrice(pkg.packagePrice, pkg.currency)}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              {formatPricingBasis(pkg.pricingBasis)}
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm">
            View
            <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </article>
  );
}

export default memo(PackageCard);
