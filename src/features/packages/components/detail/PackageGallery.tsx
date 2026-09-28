import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Building2, ChevronLeft, ChevronRight, Clock, Expand, MapPin, X } from "lucide-react";
import type { PackageDetail } from "../../types/packageDetail";
import { byDisplayOrder, clean, formatDurationLabel } from "../../utils/packageDetailFormat";
import { SafeImage } from "./primitives";

function Lightbox({
  images,
  index,
  title,
  onChange,
  onClose,
}: {
  images: { url: string; alt: string }[];
  index: number;
  title: string;
  onChange: (index: number) => void;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const total = images.length;
  const go = useCallback((delta: number) => onChange((index + delta + total) % total), [index, total, onChange]);

  useEffect(() => {
    closeRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") go(1);
      if (event.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [go, onClose]);

  const current = images[index];

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${title} photos`}
      className="fixed inset-0 z-[1000] flex flex-col bg-slate-950/95 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="flex items-center justify-between px-4 py-3 text-sm text-slate-200">
        <span>
          {index + 1} / {total}
        </span>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close gallery"
          className="rounded-full p-2 text-slate-200 transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <X className="size-5" />
        </button>
      </div>
      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-6" onClick={(event) => event.stopPropagation()}>
        <SafeImage
          key={current.url}
          src={current.url}
          alt={current.alt}
          loading="eager"
          className="max-h-full max-w-full rounded-xl object-contain"
          iconClassName="size-12"
        />
        {total > 1 ? (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous photo"
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next photo"
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <ChevronRight className="size-5" />
            </button>
          </>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}

export default function PackageGallery({
  pkg,
  priceLabel,
}: {
  pkg: PackageDetail;
  priceLabel?: string;
}) {
  const images = useMemo(() => {
    const active = (pkg.media ?? []).filter((item) => item.status !== "INACTIVE" && clean(item.mediaUrl));
    const sorted = byDisplayOrder(active).sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary));
    return sorted.map((item, index) => ({
      url: item.mediaUrl.trim(),
      alt: index === 0 ? pkg.packageName : `${pkg.packageName} photo ${index + 1}`,
    }));
  }, [pkg.media, pkg.packageName]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const city = clean(pkg.destination?.city) ?? clean(pkg.destination?.primaryDestination);
  const location = [city, clean(pkg.destination?.country)].filter(Boolean).join(", ");
  const duration = formatDurationLabel(pkg.duration?.days, pkg.duration?.nights);
  const operator = clean(pkg.tourOperatorName);
  const shortDescription = clean(pkg.shortDescription);
  const category = clean(pkg.category);
  const current = images[activeIndex];

  return (
    <header className="space-y-4">
      <section className="relative overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-900 shadow-sm dark:border-slate-800">
        <figure className="relative m-0 flex min-h-[440px] flex-col justify-between overflow-hidden p-5 sm:min-h-[480px] sm:p-8 lg:p-10">
          {current ? (
            <img
              src={current.url}
              alt={pkg.packageName}
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
          ) : (
            <SafeImage alt={pkg.packageName} className="absolute inset-0 h-full w-full" iconClassName="size-12" />
          )}
          <span aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/25" />
          <span aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/20" />

          <div className="relative z-10 flex items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {category ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/90 px-3 py-1 text-xs font-medium text-white shadow-sm">
                  <span className="size-1.5 rounded-full bg-white" />
                  {category}
                </span>
              ) : null}
              {duration ? (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
                  <Clock className="size-3.5 text-sky-300" aria-hidden />
                  {duration}
                </span>
              ) : null}
            </div>
            {images.length ? (
              <button
                type="button"
                onClick={() => setLightboxOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-white/80 bg-white/95 px-3.5 py-1.5 text-xs font-medium text-neutral-800 shadow-sm"
              >
                <Expand className="size-3.5" aria-hidden />
                {images.length > 1 ? `Photos (${images.length})` : "View photo"}
              </button>
            ) : null}
          </div>

          <figcaption className="relative z-10 space-y-3.5 pt-10 text-left text-white">
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
              {location ? (
                <span className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-black/60 px-3 py-1 backdrop-blur-md">
                  <MapPin className="size-3.5 text-emerald-300" aria-hidden />
                  {location}
                </span>
              ) : null}
              {operator ? (
                <span className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-black/60 px-3 py-1 backdrop-blur-md">
                  <Building2 className="size-3.5 text-amber-300" aria-hidden />
                  {operator}
                </span>
              ) : null}
            </div>
            <h1 className="max-w-4xl text-2xl font-semibold leading-tight tracking-tight text-white sm:text-3xl md:text-4xl lg:text-5xl">
              {pkg.packageName.trim()}
            </h1>
            {shortDescription ? (
              <p className="max-w-3xl text-xs font-normal leading-relaxed text-white/90 sm:text-sm md:text-base">{shortDescription}</p>
            ) : null}
            <footer className="flex flex-col justify-between gap-4 border-t border-white/20 pt-3 sm:flex-row sm:items-center">
              <div>
                <span className="block text-[11px] font-medium uppercase tracking-wider text-white/80">Starting from</span>
                <p className="m-0 flex items-baseline gap-1.5">
                  <strong className="text-2xl font-semibold tracking-tight text-white sm:text-3xl md:text-4xl">
                    {priceLabel ?? "Price on request"}
                  </strong>
                  {priceLabel ? <span className="text-xs font-normal text-white/80 sm:text-sm">/ person</span> : null}
                </p>
              </div>
              {images.length > 1 ? (
                <button
                  type="button"
                  onClick={() => setLightboxOpen(true)}
                  className="inline-flex items-center gap-1.5 self-start rounded-xl bg-white px-4 py-2.5 text-xs font-medium text-neutral-900"
                >
                  View photos ({images.length})
                </button>
              ) : null}
            </footer>
          </figcaption>
        </figure>
      </section>

      {images.length > 1 ? (
        <div className="hidden gap-3 md:grid md:grid-cols-4" role="list" aria-label="Photo thumbnails">
          {images.slice(1, 5).map((image, index) => (
            <button
              key={image.url}
              type="button"
              role="listitem"
              onClick={() => {
                setActiveIndex(index + 1);
                setLightboxOpen(true);
              }}
              className="relative h-28 overflow-hidden rounded-2xl"
            >
              <SafeImage src={image.url} alt="" className="h-full w-full" iconClassName="size-5" />
            </button>
          ))}
        </div>
      ) : null}

      {lightboxOpen && images.length ? (
        <Lightbox
          images={images}
          index={activeIndex}
          title={pkg.packageName}
          onChange={setActiveIndex}
          onClose={() => setLightboxOpen(false)}
        />
      ) : null}
    </header>
  );
}
