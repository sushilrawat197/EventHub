import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useAppSelector } from "@/app/store/hooks";
import { getApiErrorMessage } from "@/lib/api/errors";
import PackageDetailSkeleton from "../components/detail/PackageDetailSkeleton";
import ActivitySelection from "../components/review/ActivitySelection";
import GuestDetailsForm from "../components/review/GuestDetailsForm";
import QuoteRequestDialog from "../components/review/QuoteRequestDialog";
import ReviewSummary from "../components/review/ReviewSummary";
import TripSelection from "../components/review/TripSelection";
import { usePackageDetail } from "../hooks/usePackageDetail";
import { usePackagePreview } from "../hooks/usePackagePreview";
import { useRequestQuote } from "../hooks/useRequestQuote";
import { useReservePackage } from "../hooks/useReservePackage";
import type { PackageDetail } from "../types/packageDetail";
import type { PackageQuoteRequest, StoredPackageReservation } from "../types/packageReservation";
import { saveReservation } from "../utils/reservationStorage";
import {
  byDisplayOrder,
  clean,
  normalizeDepartures,
  normalizePickupPoints,
} from "../utils/packageDetailFormat";
import {
  DEFAULT_COUNTRY_CODE,
  buildReservationPayload,
  childAgesComplete,
  decodeTravellerAges,
  decodeTravellerCounts,
  emptyGuest,
  guestSlots,
  optionalActivities,
  travellerOptions,
  travellersFromCounts,
  validateGuest,
  type GuestErrors,
  type GuestForm,
} from "../utils/packageReservation";

function newIdempotencyKey(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function ReviewForm({ pkg }: { pkg: PackageDetail }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.user.user);
  const reserve = useReservePackage();
  const quote = useRequestQuote();
  const [quoteOpen, setQuoteOpen] = useState(false);

  const departures = useMemo(() => normalizeDepartures(pkg.departures), [pkg.departures]);
  const allPickups = useMemo(() => normalizePickupPoints(pkg.pickupPoints), [pkg.pickupPoints]);
  const options = useMemo(() => travellerOptions(pkg), [pkg]);
  const addOns = useMemo(() => optionalActivities(pkg), [pkg]);
  const currency = clean(pkg.pricing?.currency) ?? options[0]?.currency ?? "LSL";

  const initialDeparture =
    departures.find((departure) => departure.key === searchParams.get("departureId") && departure.bookable)?.key ??
    departures.find((d) => d.bookable)?.key ??
    departures[0]?.key;

  const lockedCounts = useMemo(
    () => decodeTravellerCounts(searchParams.get("travellers"), options),
    [searchParams, options],
  );

  const [departureKey, setDepartureKey] = useState<string | undefined>(initialDeparture);
  const [pickupKey, setPickupKey] = useState<string>();
  const [counts] = useState<Record<string, number>>(
    () => lockedCounts ?? Object.fromEntries(options.map((option) => [option.type, option.min])),
  );
  const [ages] = useState<Record<string, number[]>>(() => {
    const decoded = decodeTravellerAges(searchParams.get("travellers"));
    for (const option of options) {
      if (!option.needsAge) continue;
      const count = (lockedCounts ?? {})[option.type] ?? option.min;
      const list = decoded[option.type] ? [...decoded[option.type]] : [];
      const defaultAge = option.type === "INFANT" ? (option.minAge ?? 1) : (option.minAge ?? 5);
      while (list.length < count) {
        list.push(defaultAge);
      }
      decoded[option.type] = list;
    }
    return decoded;
  });
  const [activityQty, setActivityQty] = useState<Record<number, number>>({});
  const [guests, setGuests] = useState<Record<string, GuestForm>>({});
  const [attempted, setAttempted] = useState(false);
  const idempotency = useRef<{ payload: string; key: string } | null>(null);

  const departure = departures.find((item) => item.key === departureKey);
  const pickups = useMemo(
    () => allPickups.filter((point) => point.departureId == null || String(point.departureId) === departureKey),
    [allPickups, departureKey],
  );
  const pickup = pickups.find((point) => point.key === pickupKey) ?? pickups[0];

  useEffect(() => {
    if (pickups.length > 0 && (!pickupKey || !pickups.some((point) => point.key === pickupKey))) {
      setPickupKey(pickups[0].key);
    }
  }, [pickups, pickupKey]);

  const slots = useMemo(() => guestSlots(options, counts, ages), [options, counts, ages]);

  const leadDefaults = useMemo<GuestForm>(() => {
    const base = emptyGuest("ADULT");
    if (!user) return base;
    const rawMobile = (user.mobile ?? "").trim().replace(/\s+/g, "");
    let countryCode = DEFAULT_COUNTRY_CODE;
    let mobileNumber = rawMobile;

    if (rawMobile.startsWith("+")) {
      const match = rawMobile.match(/^(\+\d{1,4})(.*)$/);
      if (match) {
        countryCode = match[1];
        mobileNumber = match[2];
      }
    } else if (rawMobile.startsWith("91") && rawMobile.length >= 12) {
      countryCode = "+91";
      mobileNumber = rawMobile.slice(2);
    } else if (rawMobile.startsWith("266") && rawMobile.length >= 11) {
      countryCode = "+266";
      mobileNumber = rawMobile.slice(3);
    }

    return {
      ...base,
      firstName: clean(user.firstName) ?? "",
      lastName: clean(user.lastName) ?? "",
      email: clean(user.email) ?? "",
      mobileCountryCode: countryCode,
      mobileNumber: mobileNumber.replace(/\D/g, ""),
    };
  }, [user]);

  const resolvedGuests = useMemo(
    () =>
      Object.fromEntries(
        slots.map((slot) => [slot.key, guests[slot.key] ?? (slot.primary ? leadDefaults : emptyGuest(slot.type))]),
      ),
    [slots, guests, leadDefaults],
  );

  const seatedTravellers = options
    .filter((option) => option.type !== "INFANT")
    .reduce((sum, option) => sum + (counts[option.type] ?? 0), 0);

  const travellerRows = useMemo(
    () =>
      options
        .map((option) => ({ type: option.type, label: option.label, quantity: counts[option.type] ?? 0 }))
        .filter((row) => row.quantity > 0),
    [options, counts],
  );

  const agesReady = childAgesComplete(options, counts, ages);
  const previewRequest = useMemo(() => {
    if (!departureKey || travellerRows.length === 0 || !agesReady) return null;
    if (pickups.length > 0 && !pickupKey) return null;
    const departureId = Number(departureKey);
    if (!Number.isFinite(departureId)) return null;
    const pickupPointId = pickupKey ? Number(pickupKey) : undefined;
    return {
      packageId: pkg.packageId,
      departureId,
      ...(pickupPointId != null && Number.isFinite(pickupPointId) ? { pickupPointId } : {}),
      travellers: travellersFromCounts(options, counts, ages),
    };
  }, [pkg.packageId, departureKey, pickupKey, pickups.length, travellerRows.length, agesReady, options, counts, ages]);

  const preview = usePackagePreview(previewRequest);
  const quoteCurrency = clean(preview.data?.pricing?.currency) ?? currency;
  const priceError = preview.isError
    ? getApiErrorMessage(preview.error, "We couldn't calculate the price. Please try again.")
    : undefined;

  const errors = useMemo(() => {
    const departureError = !departureKey ? "Please select a departure date." : undefined;
    const pickupError = departureKey && pickups.length && !pickupKey ? "Please select a pickup point." : undefined;
    const ageErrors: Record<string, string> = {};
    for (const option of options) {
      if (!option.needsAge) continue;
      for (let index = 0; index < (counts[option.type] ?? 0); index += 1) {
        if (ages[option.type]?.[index] == null) ageErrors[`${option.type}-${index}`] = "Select age";
      }
    }
    const guestErrors: Record<string, GuestErrors> = {};
    for (const slot of slots) {
      const slotErrors = validateGuest(resolvedGuests[slot.key], slot.primary, slot.type);
      if (Object.keys(slotErrors).length) guestErrors[slot.key] = slotErrors;
    }
    const travellerError =
      seatedTravellers === 0
        ? "Add at least one traveller."
        : departure?.seatsLeft != null && seatedTravellers > departure.seatsLeft
          ? `Only ${departure.seatsLeft} ${departure.seatsLeft === 1 ? "seat" : "seats"} left on this departure. Go back to the package to change travellers.`
          : undefined;
    const valid =
      !departureError && !pickupError && !travellerError && !Object.keys(ageErrors).length && !Object.keys(guestErrors).length;
    return { departureError, pickupError, ageErrors, guestErrors, travellerError, valid };
  }, [departureKey, departure?.seatsLeft, pickups.length, pickupKey, options, counts, ages, slots, resolvedGuests, seatedTravellers]);

  const shown = attempted ? errors : { departureError: undefined, pickupError: undefined, ageErrors: {}, guestErrors: {}, travellerError: undefined };

  function updateGuest(key: string, patch: Partial<GuestForm>) {
    setGuests((previous) => ({ ...previous, [key]: { ...resolvedGuests[key], ...patch } }));
  }

  function scrollToFirstError() {
    requestAnimationFrame(() => {
      const target =
        document.querySelector<HTMLElement>("[role=alert]") ?? document.querySelector<HTMLElement>("[aria-invalid=true]");
      target?.scrollIntoView({ behavior: "smooth", block: "center" });
      if (target instanceof HTMLInputElement || target instanceof HTMLSelectElement) target.focus({ preventScroll: true });
    });
  }

  function submit() {
    setAttempted(true);
    if (!errors.valid || !departureKey) {
      scrollToFirstError();
      return;
    }

    const payload = buildReservationPayload({
      pkg,
      departureId: Number(departureKey),
      pickupPointId: pickupKey ? Number(pickupKey) : undefined,
      options,
      counts,
      ages,
      activityQty,
      slots,
      guests: resolvedGuests,
    });

    const serialized = JSON.stringify(payload);
    if (idempotency.current?.payload !== serialized) {
      idempotency.current = { payload: serialized, key: newIdempotencyKey() };
    }

    const leadForm = lead ? resolvedGuests[lead.key] : undefined;

    reserve.mutate(
      { payload, idempotencyKey: idempotency.current.key },
      {
        onSuccess: (reservation) => {
          const entry: StoredPackageReservation = {
            reservation,
            packagePath,
            coverImage: clean(cover),
            pickupLabel: pickup ? [pickup.name ?? pickup.address, pickup.time].filter(Boolean).join(" · ") : undefined,
            leadMobile: leadForm?.mobileNumber,
            leadEmail: clean(leadForm?.email),
          };
          saveReservation(entry);
          navigate(`/packages/booking/${reservation.bookingId}/payment`, { replace: true, state: entry });
        },
      },
    );
  }

  const packagePath = window.location.pathname.replace(/\/review\/?$/, "");
  const lead = slots.find((slot) => slot.primary);
  const cover = byDisplayOrder(pkg.media ?? []).sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary))[0]?.mediaUrl;
  const submitError = reserve.isError ? getApiErrorMessage(reserve.error, "We couldn't reserve this package. Please try again.") : undefined;
  const leadForm = lead ? resolvedGuests[lead.key] : undefined;
  const customerName = [leadForm?.firstName, leadForm?.lastName].map((part) => part?.trim()).filter(Boolean).join(" ");
  const quoteError = quote.isError ? getApiErrorMessage(quote.error, "We couldn't submit your quote request. Please try again.") : undefined;

  function openQuote() {
    setAttempted(true);
    if (!errors.valid || !departureKey) {
      scrollToFirstError();
      return;
    }
    quote.reset();
    setQuoteOpen(true);
  }

  function submitQuote(message: string) {
    if (!departureKey || !leadForm) return;
    const codeRaw = leadForm.mobileCountryCode.trim() || DEFAULT_COUNTRY_CODE;
    const code = codeRaw.startsWith("+") ? codeRaw : `+${codeRaw}`;
    const pickupPointId = pickupKey ? Number(pickupKey) : undefined;
    const activities = Object.entries(activityQty)
      .filter(([, quantity]) => quantity > 0)
      .map(([activityId, quantity]) => ({ activityId: Number(activityId), quantity }));
    const payload: PackageQuoteRequest = {
      packageId: pkg.packageId,
      departureId: Number(departureKey),
      adults: counts.ADULT ?? 0,
      children: counts.CHILD ?? 0,
      infants: counts.INFANT ?? 0,
      ...(pickupPointId != null && Number.isFinite(pickupPointId) ? { pickupPointId } : {}),
      activities,
      customer: {
        name: customerName,
        email: leadForm.email.trim(),
        phone: `${code}${leadForm.mobileNumber.replace(/\D/g, "")}`,
      },
      message,
    };
    quote.mutate(payload);
  }

  return (
    <div className="mx-auto max-w-[1200px] px-4 pb-12 pt-8 sm:px-6 sm:pb-16 sm:pt-10 lg:pt-[calc(var(--site-header-height,9.5rem)-7rem+2rem)] lg:pb-12">
      <header className="relative mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between min-h-[44px]">
        <div className="z-10 flex shrink-0">
          <Link
            to={packagePath}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 shadow-xs transition hover:border-blue-300 hover:bg-blue-50/50 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          >
            <ArrowLeft className="size-4" aria-hidden />
            <span>Back to package</span>
          </Link>
        </div>

        <div className="text-left sm:pointer-events-none sm:absolute sm:inset-x-0 sm:text-center sm:px-44">
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Review your booking
          </h1>
          <p className="mt-0.5 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 truncate">
            {pkg.packageName.trim()}
          </p>
        </div>

        <div className="hidden sm:block w-36 shrink-0 pointer-events-none" aria-hidden="true" />
      </header>

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-12 lg:gap-8">
        <div className="min-w-0 space-y-6 lg:col-span-8">
          <TripSelection
            pkg={pkg}
            image={clean(cover)}
            departures={departures}
            departureKey={departureKey}
            onDeparture={setDepartureKey}
            pickups={pickups}
            pickupKey={pickupKey}
            onPickup={setPickupKey}
            departureError={shown.departureError}
            pickupError={shown.pickupError}
            travellerRows={travellerRows}
          />
          <ActivitySelection
            activities={addOns}
            quantities={activityQty}
            maxQuantity={seatedTravellers}
            onChange={(id, quantity) => setActivityQty((previous) => ({ ...previous, [id]: quantity }))}
          />
          <GuestDetailsForm slots={slots} guests={resolvedGuests} errors={shown.guestErrors} onChange={updateGuest} />
        </div>

        <aside className="lg:sticky lg:top-[calc(var(--site-header-height,8rem)+0.75rem)] lg:col-span-4" aria-label="Booking summary">
          <ReviewSummary
            packageName={pkg.packageName.trim()}
            image={clean(cover)}
            departure={departure}
            pickup={pickup}
            travellers={travellerRows}
            payment={preview.data?.payment}
            currency={quoteCurrency}
            pricePending={preview.isFetching}
            priceError={priceError}
            priceHint={
              !agesReady
                ? "Select each child and infant age to see the price."
                : pickups.length > 0 && !pickupKey
                  ? "Select a pickup point to see the price."
                  : undefined
            }
            submitting={reserve.isPending}
            submitError={submitError}
            onSubmit={submit}
            onRequestQuote={openQuote}
          />
        </aside>
      </div>

      <QuoteRequestDialog
        open={quoteOpen}
        packageName={pkg.packageName.trim()}
        customerName={customerName || undefined}
        submitting={quote.isPending}
        error={quoteError}
        result={quote.data}
        onClose={() => {
          if (quote.isPending) return;
          setQuoteOpen(false);
        }}
        onSubmit={submitQuote}
      />
    </div>
  );
}

function KeyedReview({ pkg }: { pkg: PackageDetail }) {
  const [searchParams] = useSearchParams();
  const key = `${pkg.packageId}:${searchParams.get("departureId") ?? ""}:${searchParams.get("travellers") ?? ""}`;
  return <ReviewForm key={key} pkg={pkg} />;
}

export default function PackageReviewPage() {
  const { packageId } = useParams<{ packageId: string }>();
  const { data: pkg, isLoading, isError, refetch } = usePackageDetail(packageId);

  let content;
  if (isLoading) content = <PackageDetailSkeleton />;
  else if (isError || !pkg) {
    content = (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">We couldn't load this package</h1>
        <div className="mt-6 flex justify-center gap-2">
          <button
            type="button"
            onClick={() => void refetch()}
            className="h-10 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Try again
          </button>
          <Link to="/packages" className="inline-flex h-10 items-center rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-800">
            Browse packages
          </Link>
        </div>
      </div>
    );
  } else content = <KeyedReview pkg={pkg} />;

  return (
    <div className="min-h-screen bg-slate-100 font-jakarta text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      {content}
    </div>
  );
}
