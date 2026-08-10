import { useCallback, useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

const base = import.meta.env.BASE_URL;

const HERO_BANNERS = [
  {
    src: `${base}Events1.jpg`,
    title: "Live Events",
    subtitle: "Book tickets in seconds",
  },
  {
    src: `${base}Events3.jpg`,
    title: "Festival Nights",
    subtitle: "Discover shows near you",
  },
  {
    src: `${base}Events5.jpg`,
    title: "Concert Ready",
    subtitle: "Your ticket destination",
  },
  {
    src: `${base}Events7.jpg`,
    title: "Scan & Go",
    subtitle: "No lines — just vibes",
  },
  {
    src: `${base}mainimg00.jpg`,
    title: "MyTag Experience",
    subtitle: "Seamless digital entry",
  },
];

function shouldLoadImage(index: number, current: number, total: number) {
  // Current + neighbors only (handles loop edges)
  const prev = (current - 1 + total) % total;
  const next = (current + 1) % total;
  return index === current || index === prev || index === next;
}

const HeroSection = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [loaded, setLoaded] = useState<Record<number, boolean>>({ 0: false });
  const [ready, setReady] = useState(false);

  const onSelect = useCallback((carouselApi: CarouselApi) => {
    if (!carouselApi) return;
    setCurrent(carouselApi.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!api) return;
    onSelect(api);
    api.on("select", onSelect);
    api.on("reInit", onSelect);
    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api, onSelect]);

  // Preload first hero image ASAP
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = HERO_BANNERS[0].src;
    document.head.appendChild(link);
    return () => {
      link.remove();
    };
  }, []);

  // Preload current + neighbor images into browser cache
  useEffect(() => {
    const total = HERO_BANNERS.length;
    const indexes = [
      current,
      (current + 1) % total,
      (current - 1 + total) % total,
    ];

    indexes.forEach((index) => {
      const src = HERO_BANNERS[index]?.src;
      if (!src) return;
      const img = new Image();
      img.decoding = "async";
      img.src = src;
    });
  }, [current]);

  // Start autoplay only after first image is ready (reduces jank)
  useEffect(() => {
    if (!api || !ready) return;
    const id = window.setInterval(() => {
      api.scrollNext();
    }, 4500);
    return () => window.clearInterval(id);
  }, [api, ready]);

  // Fallback: don't block autoplay forever if image load event is missed
  useEffect(() => {
    const id = window.setTimeout(() => setReady(true), 2500);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <section
      className="relative z-0 mx-auto mt-4 mb-8 w-full sm:mt-6 sm:mb-10 lg:mt-42"
      aria-label="MyTag hero"
    >
      <Carousel
        setApi={setApi}
        opts={{ loop: true, align: "center", skipSnaps: false }}
        className="w-full"
      >
        <CarouselContent className="-ml-3 sm:-ml-4 lg:-ml-5">
          {HERO_BANNERS.map((banner, index) => {
            const isActive = current === index;
            const load = shouldLoadImage(index, current, HERO_BANNERS.length);
            const isFirst = index === 0;

            return (
              <CarouselItem
                key={banner.src}
                className="basis-[88%] pl-3 sm:basis-[72%] sm:pl-4 lg:basis-[58%] lg:pl-5 xl:basis-[52%]"
              >
                <div
                  className={cn(
                    "relative overflow-hidden rounded-2xl bg-slate-900 will-change-transform sm:rounded-3xl",
                    "transition-transform duration-300 ease-out",
                    isActive ? "scale-100" : "scale-[0.96]",
                  )}
                >
                  <div className="relative aspect-[16/9] w-full bg-slate-800 sm:aspect-[2/1] lg:aspect-[2.2/1]">
                    {load ? (
                      <img
                        src={banner.src}
                        alt={banner.title}
                        width={1200}
                        height={545}
                        decoding="async"
                        loading={isFirst ? "eager" : "lazy"}
                        fetchPriority={isFirst ? "high" : "low"}
                        draggable={false}
                        onLoad={() => {
                          setLoaded((prev) => ({ ...prev, [index]: true }));
                          if (isFirst) setReady(true);
                        }}
                        className={cn(
                          "absolute inset-0 h-full w-full object-cover transition-opacity duration-300",
                          loaded[index] ? "opacity-100" : "opacity-0",
                        )}
                      />
                    ) : (
                      <div className="absolute inset-0 animate-pulse bg-slate-800" />
                    )}

                    {/* Bottom black overlay (all cards) */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent" />

                    {/* Stronger black overlay on side (inactive) cards */}
                    <div
                      className={cn(
                        "pointer-events-none absolute inset-0 bg-black transition-opacity duration-300",
                        isActive ? "opacity-0" : "opacity-55",
                      )}
                      aria-hidden
                    />

                    {/* Caption on overlay */}
                    <div
                      className={cn(
                        "absolute inset-x-0 bottom-0 z-10 px-4 pb-4 transition-opacity duration-300 sm:px-6 sm:pb-5 lg:px-8 lg:pb-6",
                        isActive ? "opacity-100" : "opacity-80",
                      )}
                    >
                      <div className="mb-1.5 flex items-center gap-2">
                        <span className="inline-block h-1 w-5 rounded-full bg-sky-300" />
                        <span
                          className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60 sm:text-[11px]"
                          style={{
                            fontFamily:
                              "var(--font-jakarta), 'Plus Jakarta Sans', sans-serif",
                          }}
                        >
                          Featured
                        </span>
                      </div>
                      <p
                        className="truncate text-lg font-semibold tracking-tight text-white sm:text-xl lg:text-2xl"
                        style={{
                          fontFamily:
                            "var(--font-outfit), 'Plus Jakarta Sans', sans-serif",
                        }}
                      >
                        {banner.title}
                      </p>
                      <p
                        className="mt-0.5 truncate text-xs text-white/70 sm:text-sm"
                        style={{
                          fontFamily:
                            "var(--font-jakarta), 'Plus Jakarta Sans', sans-serif",
                        }}
                      >
                        {banner.subtitle}
                      </p>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>

        <CarouselPrevious className="left-2 z-10 hidden size-10 border border-gray-200 bg-white/95 text-gray-800 shadow-md hover:bg-white sm:left-4 sm:flex lg:left-8" />
        <CarouselNext className="right-2 z-10 hidden size-10 border border-gray-200 bg-white/95 text-gray-800 shadow-md hover:bg-white sm:right-4 sm:flex lg:right-8" />
      </Carousel>

      <div className="mt-4 flex items-center justify-center gap-2 sm:mt-5">
        {HERO_BANNERS.map((_, index) => (
          <button
            key={index}
            type="button"
            aria-label={`Go to banner ${index + 1}`}
            onClick={() => api?.scrollTo(index)}
            className={cn(
              "h-1 rounded-full transition-all duration-300",
              current === index
                ? "w-8 bg-blue-600"
                : "w-5 bg-gray-300 hover:bg-gray-400",
            )}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
