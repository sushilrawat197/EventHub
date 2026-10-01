import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  Clock,
  Copy,
  Download,
  Hotel,
  Bus,
  Sparkles,
  Loader2,
  Mail,
  MapPin,
  Phone,
  ReceiptText,
  ShieldCheck,
  Ticket,
  User,
  Users,
  UtensilsCrossed,
  X,
  Compass,
  CreditCard,
} from "lucide-react";
import PackageBalancePaymentModal from "@/features/packages/components/payment/PackageBalancePaymentModal";
import OrderPaymentSchedule from "@/features/packages/components/payment/OrderPaymentSchedule";
import { getApiErrorMessage } from "@/lib/api/errors";
import {
  daysBetween,
  formatDate,
  formatMoney,
  formatTime,
  friendlyLabel,
  plural,
} from "@/features/packages/utils/packageDetailFormat";
import { loadReservation } from "@/features/packages/utils/reservationStorage";
import { downloadPackageVoucherApi, getPackageOrderApi } from "../api/orders.api";
import type { PackageOrder } from "../types/packageOrder";

const DEFAULT_PACKAGE_COVER = "/Events1.jpg";
const DEFAULT_ACTIVITY_THUMB = "/activity-fallback.jpg";

function money(amount: number, currency: string) {
  return formatMoney(amount, currency) ?? "";
}

function StatusBadge({ status }: { status: string }) {
  const value = status?.toUpperCase() ?? "";

  if (value === "CONFIRMED" || value === "PAID" || value === "SUCCESS") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 shadow-xs dark:border-emerald-500/40 dark:bg-emerald-950/60 dark:text-emerald-300">
        <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
        Confirmed
      </span>
    );
  }
  if (value === "PARTIALLY_PAID" || value === "PENDING" || value === "INITIAL") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 shadow-xs dark:border-amber-500/40 dark:bg-amber-950/60 dark:text-amber-300">
        <span className="size-2 rounded-full bg-amber-500" />
        Pending
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-50 px-3 py-1 text-xs font-bold text-rose-700 shadow-xs dark:border-rose-500/40 dark:bg-rose-950/60 dark:text-rose-300">
      <span className="size-2 rounded-full bg-rose-500" />
      Cancelled
    </span>
  );
}

function BookingView({ order, refetch }: { order: PackageOrder; refetch?: () => void }) {
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string>();
  const [copied, setCopied] = useState(false);
  const [showCancellationModal, setShowCancellationModal] = useState(false);
  const [showBalancePaymentModal, setShowBalancePaymentModal] = useState(false);

  // Fallback checks from session storage if available
  const stored = loadReservation(order.bookingId);

  // Cover image with multi-tier fallback so an image ALWAYS shows
  const initialCover =
    order.packageInfo?.coverImage ||
    stored?.coverImage ||
    DEFAULT_PACKAGE_COVER;
  const [coverSrc, setCoverSrc] = useState<string>(initialCover);

  const currency = order.pricing?.currency ?? "LSL";
  const startDate = order.departure?.date;
  const endDate = order.departure?.returnDate;
  const start = formatDate(startDate);
  const end = formatDate(endDate);

  // Duration
  const days = startDate && endDate ? daysBetween(startDate, endDate) : null;
  const nights = days && days > 1 ? days - 1 : 1;
  const durationLabel = nights ? `${nights} Nights / ${nights + 1} Days` : "Full Day Tour";

  // Travellers text
  const travellersCount = order.travellers?.total || order.guests?.length || 1;
  const travellersSummary = [
    order.travellers?.adults ? plural(order.travellers.adults, "Adult") : "",
    order.travellers?.children ? `${order.travellers.children} Child` : "",
    order.travellers?.infants ? plural(order.travellers.infants, "Infant") : "",
  ].filter(Boolean).join(", ") || plural(travellersCount, "Traveller");

  // Contact / Guest details
  const primaryGuest = order.guests?.find((g) => g.primary);
  const guestTitle = primaryGuest?.title ?? "";
  const guestFirstName = primaryGuest?.firstName ?? order.contact?.firstName ?? "";
  const guestLastName = primaryGuest?.lastName ?? order.contact?.lastName ?? "";
  const fullName = [guestTitle, guestFirstName, guestLastName].filter(Boolean).join(" ").trim() || "Lead Guest";
  const email = primaryGuest?.email ?? order.contact?.email ?? stored?.leadEmail ?? "—";
  const phone = order.contact?.mobile ?? "—";

  // Booking timestamp
  const bookingDateRaw = order.confirmedAt ?? order.orderDateTime ?? new Date().toISOString();
  const bookingDate = formatDate(bookingDateRaw);
  let bookingTime = "";
  try {
    const d = new Date(bookingDateRaw);
    if (!Number.isNaN(d.getTime())) {
      bookingTime = d.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    }
  } catch {
    bookingTime = "10:00 AM";
  }

  // Payment method
  const paymentMethod = order.payments?.[0]?.paymentType
    ? friendlyLabel(order.payments[0].paymentType)?.toUpperCase()
    : "ONLINE PAYMENT";

  // Inclusions counts
  const hotelsCount = Math.max(1, Math.min(nights, 2));
  const transfersCount = order.pickup ? 2 : 1;
  const activitiesCount = order.activities?.length || 2;

  // Pricing
  const totalAmount = order.pricing?.totalAmount ?? 0;
  const paidAmount = order.pricing?.paidAmount ?? totalAmount;
  const basePrice = order.pricing?.packageAmount ?? totalAmount * 0.95;
  const taxesAndFees =
    (order.pricing?.taxAmount ?? 0) + (order.pricing?.feeAmount ?? 0) ||
    Math.max(0, totalAmount - basePrice);
  const balanceDue = order.pricing?.balanceAmount ?? Math.max(0, totalAmount - paidAmount);

  const isFullyPaid =
    order.paymentStatus === "PAID" ||
    order.paymentStatus === "SUCCESS" ||
    order.paymentStatus === "CONFIRMED" ||
    paidAmount >= totalAmount;

  // Cancellation deadlines
  let cancelPossibleTill = "—";
  let nonRefundableDate = "—";
  if (startDate) {
    try {
      const dep = new Date(startDate);
      if (!Number.isNaN(dep.getTime())) {
        const dead = new Date(dep);
        dead.setDate(dead.getDate() - 1);
        cancelPossibleTill = formatDate(dead.toISOString().slice(0, 10)) ?? "—";
        nonRefundableDate = start ?? "—";
      }
    } catch {
      // fallback
    }
  }

  function copyBookingRef() {
    if (!order.bookingRef) return;
    navigator.clipboard.writeText(order.bookingRef);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function downloadVoucher() {
    setDownloading(true);
    setDownloadError(undefined);
    try {
      const blob = await downloadPackageVoucherApi(order.bookingId);
      const url = window.URL.createObjectURL(new Blob([blob], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = url;
      link.download = `voucher-${order.bookingRef}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setDownloadError(getApiErrorMessage(error, "We couldn't download the voucher."));
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="mx-auto max-w-[1240px] px-4 pb-20 pt-8 sm:px-6 sm:pt-10 lg:pt-[calc(var(--site-header-height,8.75rem)-7rem+2.25rem)] font-jakarta">
      {/* Top Breadcrumb & Quick Reference Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-6">
        <Link
          to="/orders"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-xs transition hover:border-blue-300 hover:bg-blue-50/50 hover:text-blue-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Back to My Bookings
        </Link>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={copyBookingRef}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-mono font-semibold text-slate-700 shadow-xs transition hover:border-blue-300 hover:text-blue-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
          >
            <Ticket className="size-3.5 text-blue-600" />
            <span>REF: {order.bookingRef}</span>
            {copied ? (
              <span className="font-sans text-[11px] font-bold text-emerald-600">Copied!</span>
            ) : (
              <Copy className="size-3 text-slate-400" />
            )}
          </button>
          <StatusBadge status={order.status} />
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8 items-start">
        {/* Left Column (Core Details & Structured Cards) */}
        <div className="space-y-6 lg:col-span-8">
          {/* Card 1: Package Hero with Cover Image & Key Travel Dates */}
          <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
              {/* Prominent Package Cover Image */}
              <div className="relative min-h-[220px] md:min-h-[240px] md:col-span-5 bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <img
                  src={coverSrc}
                  alt={order.packageInfo?.packageName || "Tour Package"}
                  onError={() => setCoverSrc(DEFAULT_PACKAGE_COVER)}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent md:hidden" />
                <div className="absolute bottom-3 left-3 md:hidden">
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-600/90 px-2.5 py-0.5 text-[11px] font-bold text-white shadow-xs backdrop-blur-xs">
                    <Clock className="size-3" />
                    {durationLabel}
                  </span>
                </div>
              </div>

              {/* Package Title, Code & Travel Specs */}
              <div className="p-6 md:col-span-7 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                      Verified Package Booking
                    </span>
                    {order.packageInfo?.packageCode ? (
                      <span className="text-xs font-mono font-semibold text-slate-400">
                        {order.packageInfo.packageCode}
                      </span>
                    ) : null}
                  </div>

                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white leading-snug">
                    {order.packageInfo?.packageName}
                  </h1>

                  <p className="mt-2 text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Users className="size-3.5 text-blue-600" />
                    <span>{travellersSummary}</span>
                  </p>
                </div>

                {/* 3 Travel Specs Grid */}
                <div className="mt-6 grid grid-cols-3 gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
                  <div>
                    <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
                      <CalendarDays className="size-3.5 text-blue-600" />
                      TRAVEL START
                    </p>
                    <p className="mt-1 text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                      {start || "—"}
                    </p>
                  </div>

                  <div>
                    <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
                      <CalendarDays className="size-3.5 text-blue-600" />
                      TRAVEL END
                    </p>
                    <p className="mt-1 text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                      {end || start || "—"}
                    </p>
                  </div>

                  <div>
                    <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
                      <Clock className="size-3.5 text-blue-600" />
                      DURATION
                    </p>
                    <p className="mt-1 text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                      {durationLabel}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Package Inclusions Overview (EventHub Theme) */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="size-4.5 text-blue-600" />
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Package Inclusions
                </h2>
              </div>
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                Included in Package
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              {/* Hotels */}
              <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4 transition hover:bg-blue-50 dark:border-blue-900/40 dark:bg-blue-950/30">
                <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300">
                  <Hotel className="size-4 text-blue-600" />
                  HOTELS
                </p>
                <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
                  {hotelsCount}
                </p>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Accommodations</span>
              </div>

              {/* Transfers */}
              <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-4 transition hover:bg-indigo-50 dark:border-indigo-900/40 dark:bg-indigo-950/30">
                <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
                  <Bus className="size-4 text-indigo-600" />
                  TRANSFERS
                </p>
                <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
                  {transfersCount}
                </p>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Transport Included</span>
              </div>

              {/* Activities */}
              <div className="rounded-xl border border-violet-100 bg-violet-50/50 p-4 transition hover:bg-violet-50 dark:border-violet-900/40 dark:bg-violet-950/30">
                <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-violet-700 dark:text-violet-300">
                  <Compass className="size-4 text-violet-600" />
                  ACTIVITIES
                </p>
                <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
                  {activitiesCount}
                </p>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Sightseeing & Tours</span>
              </div>

              {/* Meals */}
              <div className="rounded-xl border border-teal-100 bg-teal-50/50 p-4 transition hover:bg-teal-50 dark:border-teal-900/40 dark:bg-teal-950/30">
                <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300">
                  <UtensilsCrossed className="size-4 text-teal-600" />
                  MEALS
                </p>
                <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
                  Daily
                </p>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Breakfast Included</span>
              </div>
            </div>
          </div>

          {/* Card 3: Booking Information & Guest Details */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-6">
            <div>
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3.5 dark:border-slate-800">
                <Ticket className="size-4.5 text-blue-600" />
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Booking Information
                </h2>
              </div>

              {/* Row 1: Booking Details Grid */}
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
                    BOOKING ID
                  </p>
                  <p className="mt-1 font-mono text-sm font-bold text-slate-900 dark:text-white">
                    {order.bookingRef}
                  </p>
                </div>

                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
                    BOOKING DATE
                  </p>
                  <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
                    {bookingDate}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {bookingTime}
                  </p>
                </div>

                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
                    PAYMENT METHOD
                  </p>
                  <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white uppercase">
                    {paymentMethod}
                  </p>
                </div>

                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
                    STATUS
                  </p>
                  <div className="mt-1">
                    <StatusBadge status={order.status} />
                  </div>
                </div>
              </div>
            </div>

            {/* Row 2: Primary Guest Details */}
            <div className="border-t border-slate-100 pt-5 dark:border-slate-800">
              <div className="flex items-center gap-2 mb-3.5">
                <User className="size-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Primary Guest Details
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
                    NAME
                  </p>
                  <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    {fullName}
                    <span className="rounded-md bg-blue-50 px-1.5 py-0.5 text-[10px] font-bold text-blue-600 dark:bg-blue-950/50 dark:text-blue-300">
                      Primary
                    </span>
                  </p>
                </div>

                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
                    EMAIL
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white truncate flex items-center gap-1.5">
                    <Mail className="size-3.5 text-slate-400 shrink-0" />
                    <span>{email}</span>
                  </p>
                </div>

                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
                    PHONE
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Phone className="size-3.5 text-slate-400 shrink-0" />
                    <span>{phone}</span>
                  </p>
                </div>
              </div>

              {/* Additional Registered Passengers */}
              {order.guests && order.guests.length > 1 ? (
                <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/40">
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-2.5 flex items-center gap-1.5">
                    <Users className="size-3.5 text-blue-600" />
                    All Registered Travellers ({order.guests.length})
                  </p>
                  <div className="divide-y divide-slate-200/60 dark:divide-slate-700/60">
                    {order.guests.map((guest, idx) => (
                      <div key={idx} className="flex items-center justify-between py-2 text-xs">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {[guest.title, guest.firstName, guest.lastName].filter(Boolean).join(" ")}
                          {guest.primary ? (
                            <span className="ml-1.5 text-[10px] font-bold text-blue-600">(Primary)</span>
                          ) : null}
                        </span>
                        <span className="text-slate-500">
                          {friendlyLabel(guest.type)}
                          {guest.age != null ? ` · ${guest.age} yrs` : ""}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          {/* Card 4: Pickup & Meeting Information */}
          {order.pickup ? (
            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3.5 dark:border-slate-800">
                <MapPin className="size-4.5 text-emerald-600" />
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Pickup & Meeting Details
                </h2>
              </div>

              <div className="mt-4 flex items-start gap-3.5 rounded-xl border border-emerald-100 bg-emerald-50/50 p-4 dark:border-emerald-900/30 dark:bg-emerald-950/20">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300">
                  <MapPin className="size-5" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-bold text-slate-900 dark:text-white text-sm">
                      {order.pickup.name ?? "Designated Pickup Point"}
                    </p>
                    {order.pickup.pickupTime ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200">
                        <Clock className="size-3" />
                        Meeting Time: {formatTime(order.pickup.pickupTime)}
                      </span>
                    ) : null}
                  </div>
                  {order.pickup.location ? (
                    <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {order.pickup.location}
                    </p>
                  ) : null}
                  <p className="mt-2 text-[11px] text-slate-500">
                    * Please arrive at the meeting point 15 minutes before the scheduled time with your booking voucher.
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          {/* Card 5: Included Add-ons & Activities (with thumbnails!) */}
          {order.activities && order.activities.length > 0 ? (
            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Sparkles className="size-4.5 text-amber-500" />
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    Included Activities & Add-ons
                  </h2>
                </div>
                <span className="text-xs text-slate-400">
                  {order.activities.length} {order.activities.length === 1 ? "Activity" : "Activities"}
                </span>
              </div>

              <div className="mt-4 space-y-3">
                {order.activities.map((act) => (
                  <div
                    key={act.activityId}
                    className="flex items-center justify-between gap-4 rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800/40"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={DEFAULT_ACTIVITY_THUMB}
                        alt={act.name}
                        className="size-12 shrink-0 rounded-lg object-cover border border-slate-200 dark:border-slate-700"
                      />
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white text-sm">
                          {act.name}
                        </p>
                        <p className="text-slate-500 text-xs mt-0.5">
                          Quantity: {act.quantity}
                          {act.pricingBasis ? ` · ${friendlyLabel(act.pricingBasis)}` : ""}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-black text-slate-900 dark:text-white text-sm">
                        {money(act.totalAmount, act.currency || currency)}
                      </span>
                      <p className="text-[11px] font-semibold text-emerald-600 flex items-center justify-end gap-1">
                        <Check className="size-3" /> Included
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {/* Card 6: Cancellation Policy */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
                  CANCELLATION POLICY
                </p>
                <p className="mt-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                  {order.cancellation?.summary ||
                    `You can cancel this package until ${cancelPossibleTill}. Cancellation charges vary depending on the cancellation date. The package becomes non-refundable from ${nonRefundableDate}.`}
                </p>
              </div>

              {order.cancellation?.rules && order.cancellation.rules.length > 0 ? (
                <button
                  type="button"
                  onClick={() => setShowCancellationModal(true)}
                  className="self-start rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-xs hover:border-blue-300 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 cursor-pointer"
                >
                  View details
                </button>
              ) : null}
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-xl border border-amber-200/70 bg-amber-50/70 p-3.5 dark:border-amber-900/40 dark:bg-amber-950/20">
                <p className="text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                  CURRENT CANCELLATION CHARGE
                </p>
                <p className="mt-1.5 text-sm font-bold text-slate-900 dark:text-white">
                  {money(basePrice, currency)}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200/70 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-800/40">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  CANCELLATION POSSIBLE TILL
                </p>
                <p className="mt-1.5 text-sm font-bold text-slate-900 dark:text-white">
                  {cancelPossibleTill}
                </p>
              </div>

              <div className="rounded-xl border border-rose-200/70 bg-rose-50/70 p-3.5 dark:border-rose-900/40 dark:bg-rose-950/20">
                <p className="text-[10px] font-bold uppercase tracking-wider text-rose-700 dark:text-rose-300">
                  NON-REFUNDABLE AFTER DEADLINE
                </p>
                <p className="mt-1.5 text-sm font-bold text-rose-600 dark:text-rose-400">
                  {nonRefundableDate}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Sidebar: Payment Summary & Voucher Download) */}
        <div className="space-y-4 lg:sticky lg:top-[calc(var(--site-header-height,8rem)+1rem)] lg:col-span-4">
          {/* Payment Summary Box */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ReceiptText className="size-4.5 text-blue-600" />
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Payment Summary
                </h2>
              </div>
              {isFullyPaid ? (
                <span className="inline-flex items-center rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 uppercase dark:border-emerald-500/40 dark:bg-emerald-950/60 dark:text-emerald-300">
                  FULLY PAID
                </span>
              ) : (
                <span className="inline-flex items-center rounded-full border border-amber-300 bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold text-amber-700 uppercase dark:border-amber-500/40 dark:bg-amber-950/60 dark:text-amber-300">
                  PARTIALLY PAID
                </span>
              )}
            </div>

            {/* Package Total */}
            <div className="mt-5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
                PACKAGE TOTAL
              </p>
              <p className="mt-1 text-2xl sm:text-3xl font-black tracking-tight text-slate-950 dark:text-white">
                {money(totalAmount, currency)}
              </p>
            </div>

            {/* Green Highlight Box: Total Paid */}
            <div className="mt-4 rounded-xl border border-emerald-200/70 bg-emerald-50/80 p-3.5 dark:border-emerald-900/30 dark:bg-emerald-950/30">
              <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                TOTAL PAID
              </p>
              <p className="mt-0.5 text-lg font-black text-emerald-700 dark:text-emerald-400">
                {money(paidAmount, currency)}
              </p>
            </div>

            {/* Divider */}
            <div className="my-5 border-t border-slate-100 dark:border-slate-800" />

            {/* Payment Schedule Timeline */}
            <OrderPaymentSchedule order={order} />

            {/* If balance remains, show Balance Due card below Payment Schedule */}
            {!isFullyPaid && balanceDue > 0 ? (
              <div className="mt-4 rounded-xl border border-amber-200/80 bg-gradient-to-br from-amber-50/90 to-orange-50/70 p-4 dark:border-amber-900/40 dark:from-amber-950/30 dark:to-orange-950/20 shadow-xs">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                      <Clock className="size-3.5" />
                      BALANCE DUE
                    </span>
                    <p className="mt-1 text-2xl font-black text-amber-800 dark:text-amber-400">
                      {money(balanceDue, currency)}
                    </p>
                  </div>
                  {order.paymentPlan?.balanceDueDate ? (
                    <span className="text-[11px] font-semibold text-amber-800 bg-amber-200/60 px-2 py-0.5 rounded-md dark:bg-amber-900/60 dark:text-amber-200">
                      Due by {formatDate(order.paymentPlan.balanceDueDate)}
                    </span>
                  ) : null}
                </div>

                <p className="mt-1.5 text-xs text-amber-800/80 dark:text-amber-300/80">
                  Pay the remaining amount to complete your reservation payment.
                </p>

                <button
                  type="button"
                  onClick={() => setShowBalancePaymentModal(true)}
                  className="mt-3.5 w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 via-amber-700 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm shadow-amber-600/20 transition active:scale-[0.99] cursor-pointer"
                >
                  <CreditCard className="size-4" />
                  <span>Choose Payment Method</span>
                </button>
              </div>
            ) : null}

            {/* Divider */}
            <div className="my-5 border-t border-slate-100 dark:border-slate-800" />

            {/* Price Breakup */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 mb-3">
                PRICE BREAKUP
              </p>

              <div className="space-y-2.5 text-xs sm:text-sm">
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                  <span>Base Price</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {money(basePrice, currency)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                  <span>Taxes & Fees</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {money(taxesAndFees, currency)}
                  </span>
                </div>

                {order.pricing?.activityAmount ? (
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                    <span>Activities & Add-ons</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {money(order.pricing.activityAmount, currency)}
                    </span>
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          {/* Download Voucher Button (EventHub Blue Gradient) */}
          <button
            type="button"
            onClick={() => void downloadVoucher()}
            disabled={downloading}
            className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 transition active:scale-[0.99] disabled:opacity-70 cursor-pointer"
          >
            {downloading ? (
              <Loader2 className="size-4.5 animate-spin" />
            ) : (
              <Download className="size-4.5" />
            )}
            <span>{downloading ? "Preparing voucher…" : "Download Voucher"}</span>
          </button>

          {downloadError ? (
            <p role="alert" className="text-center text-xs font-medium text-rose-600">
              {downloadError}
            </p>
          ) : null}

          {/* Trust & Guarantee Box */}
          <div className="rounded-xl border border-slate-100 bg-white/70 p-3.5 text-center dark:border-slate-800 dark:bg-slate-900/60">
            <p className="flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300">
              <ShieldCheck className="size-4 text-emerald-600" />
              Verified & Protected Booking
            </p>
          </div>
        </div>
      </div>

      {/* Cancellation Rules Modal */}
      {showCancellationModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-xs p-4">
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900">
            <button
              type="button"
              onClick={() => setShowCancellationModal(false)}
              className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 cursor-pointer"
            >
              <X className="size-5" />
            </button>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Cancellation Policy Details
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              {order.cancellation?.summary || "Policy rules set by tour operator"}
            </p>

            <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
              {order.cancellation?.rules?.map((rule, idx) => (
                <div key={idx} className="py-3 text-xs">
                  <div className="flex justify-between font-bold text-slate-800 dark:text-slate-200">
                    <span>
                      {rule.fromDaysBeforeDeparture != null
                        ? `Up to ${rule.fromDaysBeforeDeparture} days before departure`
                        : "Prior to departure"}
                    </span>
                    <span className="text-rose-600">
                      {rule.chargePercentage != null
                        ? `${rule.chargePercentage}% Fee`
                        : `${rule.refundPercentage}% Refund`}
                    </span>
                  </div>
                  {rule.description ? (
                    <p className="mt-1 text-slate-500">{rule.description}</p>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {/* Balance Payment Modal */}
      <PackageBalancePaymentModal
        isOpen={showBalancePaymentModal}
        onClose={() => setShowBalancePaymentModal(false)}
        order={order}
        onPaymentSuccess={() => {
          refetch?.();
        }}
      />
    </div>
  );
}

export default function PackageOrderPage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const id = Number(bookingId);
  const order = useQuery({
    queryKey: ["orders", "package", id],
    queryFn: () => getPackageOrderApi(id),
    enabled: Number.isFinite(id) && id > 0,
  });

  return (
    <div className="min-h-screen bg-slate-50/60 font-jakarta text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      {order.isLoading ? (
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-slate-500">
          <Loader2 className="size-8 animate-spin text-blue-600" aria-hidden />
          <p className="text-sm font-semibold">Loading your booking details…</p>
        </div>
      ) : order.isError || !order.data ? (
        <div className="mx-auto max-w-md px-4 py-24 text-center">
          <h1 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
            We couldn't load this booking
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            {getApiErrorMessage(order.error, "The booking might have expired or you may need to sign in again.")}
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              to="/orders"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
            >
              View My Bookings
            </Link>
            <Link
              to="/"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              Back to Home
            </Link>
          </div>
        </div>
      ) : (
        <BookingView order={order.data} refetch={order.refetch} />
      )}
    </div>
  );
}
