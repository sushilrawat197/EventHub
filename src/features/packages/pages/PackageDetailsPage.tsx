import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { PackageSearch, RefreshCw } from "lucide-react";
import { useAppSelector } from "@/app/store/hooks";
import { showGlobalPopup } from "@/utils/globalPopup";
import PackageActivities, { ActivityDrawer } from "../components/detail/PackageActivities";
import PackageBookingCard from "../components/detail/PackageBookingCard";
import PackageDetailSkeleton from "../components/detail/PackageDetailSkeleton";
import PackageQuoteModal from "../components/detail/PackageQuoteModal";
import PackageGallery from "../components/detail/PackageGallery";
import PackageInclusions from "../components/detail/PackageInclusions";
import PackageItinerary from "../components/detail/PackageItinerary";
import PackageOverview from "../components/detail/PackageOverview";
import PackagePolicies from "../components/detail/PackagePolicies";
import PackageStayMeals from "../components/detail/PackageStayMeals";
import PackageTransportPickup from "../components/detail/PackageTransportPickup";
import { usePackageDetail } from "../hooks/usePackageDetail";
import type { PackageActivity, PackageDetail } from "../types/packageDetail";
import {
  clean,
  normalizeDepartures,
  normalizePickupPoints,
  normalizeTransport,
  plural,
} from "../utils/packageDetailFormat";
import { fromPriceParts } from "../utils/packageDetailIcons";
import { childAgesComplete, decodeTravellerAges, decodeTravellerCounts, encodeTravellerCounts, travellerOptions } from "../utils/packageReservation";

function StateMessage({
  title,
  message,
  action,
}: {
  title: string;
  message: string;
  action?: { label: string; onClick: () => void };
}) {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-20 text-center">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300">
        <PackageSearch className="size-7" aria-hidden />
      </span>
      <h1 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">{title}</h1>
      <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">{message}</p>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {action ? (
          <button
            type="button"
            onClick={action.onClick}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          >
            <RefreshCw className="size-4" aria-hidden />
            {action.label}
          </button>
        ) : null}
        <Link
          to="/packages"
          className="inline-flex h-10 items-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 hover:border-blue-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        >
          Browse packages
        </Link>
      </div>
    </div>
  );
}

function PackageDetailsView({ pkg }: { pkg: PackageDetail }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const user = useAppSelector((state) => state.user.user);
  const departures = useMemo(() => normalizeDepartures(pkg.departures), [pkg.departures]);
  const transport = useMemo(() => normalizeTransport(pkg.transport), [pkg.transport]);
  const pickupPoints = useMemo(() => normalizePickupPoints(pkg.pickupPoints), [pkg.pickupPoints]);

  const options = useMemo(() => travellerOptions(pkg), [pkg]);
  const presetTravellers = searchParams.get("travellers");
  const [selectedKey, setSelectedKey] = useState<string | undefined>(
    () => searchParams.get("departureId") ?? (departures.length === 1 ? departures[0].key : undefined),
  );
  const [counts, setCounts] = useState<Record<string, number>>(() =>
    decodeTravellerCounts(presetTravellers, options) ??
    Object.fromEntries(options.map((option) => [option.type, option.min])),
  );
  const [ages, setAges] = useState<Record<string, number[]>>(() => decodeTravellerAges(presetTravellers));
  const [ageErrors, setAgeErrors] = useState<Record<string, string>>({});
  const [departureError, setDepartureError] = useState<string>();
  const [openActivity, setOpenActivity] = useState<PackageActivity | null>(null);
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const closeActivity = useCallback(() => setOpenActivity(null), []);

  useEffect(() => {
    if (departures.length === 1 && !selectedKey) {
      setSelectedKey(departures[0].key);
    }
  }, [departures, selectedKey]);

  const selected = departures.find((departure) => departure.key === selectedKey) ?? (departures.length === 1 ? departures[0] : undefined);
  const bookLabel = user ? "Continue Booking" : "Login to proceed";

  function selectDeparture(key: string) {
    setSelectedKey(key);
    setDepartureError(undefined);
  }

  function enquire() {
    const operator = clean(pkg.tourOperatorName) ?? "the tour operator";
    showGlobalPopup({
      variant: "info",
      message: `Enquiries for ${pkg.packageCode.trim()} are handled by ${operator}. Online enquiry is coming soon.`,
    });
  }

  function book() {
    if (!departures.length) {
      enquire();
      return;
    }
    if (!selected) {
      setDepartureError("Please select a departure date to continue.");
      document.getElementById("booking")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    const seated = options
      .filter((option) => option.type !== "INFANT")
      .reduce((sum, option) => sum + (counts[option.type] ?? 0), 0);
    if (seated < 1) {
      setDepartureError("Add at least one traveller.");
      document.getElementById("booking")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    if (selected.seatsLeft != null && seated > selected.seatsLeft) {
      setDepartureError(`Only ${plural(selected.seatsLeft, "seat")} left on this departure.`);
      document.getElementById("booking")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    if (!childAgesComplete(options, counts, ages)) {
      const next: Record<string, string> = {};
      for (const option of options) {
        if (!option.needsAge) continue;
        for (let index = 0; index < (counts[option.type] ?? 0); index += 1) {
          if (ages[option.type]?.[index] == null) next[`${option.type}-${index}`] = "Select age";
        }
      }
      setAgeErrors(next);
      document.getElementById("booking")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    const params = new URLSearchParams({
      departureId: selected.key,
      travellers: encodeTravellerCounts(counts, ages),
    });
    const reviewPath = `${location.pathname.replace(/\/$/, "")}/review?${params.toString()}`;
    if (!user) {
      navigate("/login", { state: { from: `${location.pathname}?${params.toString()}` } });
      return;
    }
    navigate(reviewPath);
  }

  const bookingCard = (anchorId?: string) => (
    <PackageBookingCard
      anchorId={anchorId}
      departures={departures}
      selectedKey={selectedKey}
      error={departureError}
      options={options}
      counts={counts}
      ages={ages}
      ageErrors={ageErrors}
      onSelect={selectDeparture}
      onCount={(type, value) => {
        setCounts((previous) => ({ ...previous, [type]: value }));
        setAges((previous) => (previous[type] ? { ...previous, [type]: previous[type].slice(0, value) } : previous));
        setAgeErrors({});
        setDepartureError(undefined);
      }}
      onAge={(type, index, age) => {
        setAges((previous) => {
          const next = [...(previous[type] ?? [])];
          next[index] = age;
          return { ...previous, [type]: next };
        });
        setAgeErrors((previous) => {
          if (!previous[`${type}-${index}`]) return previous;
          const next = { ...previous };
          delete next[`${type}-${index}`];
          return next;
        });
      }}
      onBook={book}
      onRequestQuote={() => setIsQuoteOpen(true)}
      bookLabel={bookLabel}
    />
  );

  return (
    <>
      <div className="mx-auto max-w-[1200px] px-4 pb-12 pt-6 sm:px-6 sm:pb-16 sm:pt-8 lg:pt-[calc(var(--site-header-height,8rem)-7rem+1.5rem)] lg:pb-12">
        <PackageGallery pkg={pkg} priceLabel={fromPriceParts(pkg).price} />

        <div className="mt-6 grid items-start gap-6 lg:grid-cols-12 lg:gap-8">
          <main className="min-w-0 space-y-6 lg:col-span-8">
            <PackageOverview pkg={pkg} transport={transport} />
            <PackageItinerary pkg={pkg} />
            <PackageActivities pkg={pkg} onOpenActivity={setOpenActivity} />
            <PackageStayMeals pkg={pkg} />
            <PackageTransportPickup transport={transport} pickupPoints={pickupPoints} departures={departures} />
            <PackageInclusions inclusions={pkg.inclusions ?? []} exclusions={pkg.exclusions ?? []} />
            <PackagePolicies paymentTerms={pkg.paymentTerms} cancellationPolicy={pkg.cancellationPolicy} />
            <div className="lg:hidden pt-2">{bookingCard("booking")}</div>
          </main>

          <aside className="hidden lg:sticky lg:top-[calc(var(--site-header-height,8rem)+0.75rem)] lg:col-span-4 lg:block" aria-label="Booking">
            {bookingCard()}
          </aside>
        </div>
      </div>

      {openActivity ? <ActivityDrawer activity={openActivity} onClose={closeActivity} /> : null}

      <PackageQuoteModal
        open={isQuoteOpen}
        pkg={pkg}
        departures={departures}
        initialDepartureKey={selectedKey}
        initialCounts={counts}
        initialAges={ages}
        options={options}
        onClose={() => setIsQuoteOpen(false)}
      />
    </>
  );
}

export default function PackageDetailsPage() {
  const { packageId } = useParams<{ packageId: string }>();
  const { data: pkg, isLoading, isError, isFetching, refetch } = usePackageDetail(packageId);

  let content;
  if (isLoading || (isError && isFetching)) {
    content = <PackageDetailSkeleton />;
  } else if (isError) {
    content = (
      <StateMessage
        title="We couldn't load this package"
        message="Check your connection and try again."
        action={{ label: "Try again", onClick: () => void refetch() }}
      />
    );
  } else if (!pkg || !clean(pkg.packageName)) {
    content = <StateMessage title="Package not found" message="This package may have been removed or is no longer available." />;
  } else {
    content = <PackageDetailsView key={pkg.packageId} pkg={pkg} />;
  }

  return (
    <div className="package-detail-page min-h-screen bg-slate-50 font-jakarta text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      {content}
    </div>
  );
}
