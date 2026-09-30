import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock,
  Copy,
  ExternalLink,
  HelpCircle,
  Mail,
  MapPin,
  MessageSquareQuote,
  Phone,
  Sparkles,
  Ticket,
  User,
  Users,
} from "lucide-react";
import { formatDate, formatMoney, plural } from "../utils/packageDetailFormat";
import { SafeImage } from "../components/detail/primitives";
import { getPackageQuoteDetailApi } from "../api/quotes.api";
import type { PackageQuoteRequestItem } from "../types/packageQuote";

function QuoteStatusBadge({ status }: { status: string }) {
  const value = status?.toUpperCase() ?? "";

  if (value === "QUOTED" || value === "OFFERED") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-50 px-3.5 py-1 text-xs font-bold text-blue-700 shadow-xs dark:border-blue-500/40 dark:bg-blue-950/60 dark:text-blue-300">
        <Sparkles className="size-3 text-blue-600 dark:text-blue-400" />
        Quote Received
      </span>
    );
  }
  if (value === "ACCEPTED" || value === "CONFIRMED" || value === "BOOKED") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-50 px-3.5 py-1 text-xs font-bold text-emerald-700 shadow-xs dark:border-emerald-500/40 dark:bg-emerald-950/60 dark:text-emerald-300">
        <CheckCircle2 className="size-3 text-emerald-600 dark:text-emerald-400" />
        Accepted
      </span>
    );
  }
  if (value === "REJECTED" || value === "CANCELLED" || value === "DECLINED") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-50 px-3.5 py-1 text-xs font-bold text-rose-700 shadow-xs dark:border-rose-500/40 dark:bg-rose-950/60 dark:text-rose-300">
        Cancelled
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-50 px-3.5 py-1 text-xs font-bold text-amber-700 shadow-xs dark:border-amber-500/40 dark:bg-amber-950/60 dark:text-amber-300">
      <Clock className="size-3 text-amber-600 dark:text-amber-400" />
      Pending Review
    </span>
  );
}

export default function QuoteDetailsPage() {
  const { quoteRequestId } = useParams<{ quoteRequestId: string }>();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["package-quote-detail", quoteRequestId],
    queryFn: () => getPackageQuoteDetailApi(quoteRequestId!),
    enabled: Boolean(quoteRequestId),
  });

  const quote = data as PackageQuoteRequestItem | undefined;

  function copyRef() {
    if (!quote?.quoteReference) return;
    navigator.clipboard.writeText(quote.quoteReference);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 pt-28 font-jakarta dark:bg-slate-950 sm:p-6 lg:pt-32">
        <div className="mx-auto max-w-5xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-9 w-32 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
          </div>
          <div className="h-56 animate-pulse rounded-3xl bg-slate-200/80 dark:bg-slate-800/80" />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="h-96 animate-pulse rounded-3xl bg-slate-200/80 dark:bg-slate-800/80 lg:col-span-2" />
            <div className="h-96 animate-pulse rounded-3xl bg-slate-200/80 dark:bg-slate-800/80" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !quote) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 pt-28 font-jakarta dark:bg-slate-950 sm:p-6 lg:pt-20">
        <div className="mx-auto max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-lg dark:border-slate-800 dark:bg-slate-900">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
            <MessageSquareQuote className="size-7" />
          </div>
          <h2 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
            Quote Not Found
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            We couldn't retrieve the details for this quote request. It may have expired or does not exist.
          </p>
          <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={() => void refetch()}
              className="inline-flex h-11 items-center justify-center rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Retry
            </button>
            <Link
              to="/quotes"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              Back to My Quotes
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const packageName =
    quote.packageName ?? quote.package?.packageName ?? "Custom Tour Package";
  const packageCode =
    quote.packageCode ?? quote.package?.packageCode ?? "tour";
  const packageId = quote.packageId ?? quote.package?.packageId;
  const coverImage =
    quote.coverImage ?? quote.package?.coverImage ?? undefined;
  const currency = quote.currency ?? "LSL";

  const departureDate =
    quote.departureDate ?? quote.departure?.date ?? null;
  const returnDate =
    quote.returnDate ?? quote.departure?.returnDate ?? null;

  const quotedAmount = quote.quotedAmount ?? quote.quotedPrice ?? null;
  const agencyNotes =
    quote.adminNotes ?? quote.agencyNotes ?? quote.responseNotes ?? null;

  const travellersCount = [
    quote.adults ? plural(quote.adults, "adult") : "",
    quote.children ? plural(quote.children, "child") : "",
    quote.infants ? plural(quote.infants, "infant") : "",
  ]
    .filter(Boolean)
    .join(", ");

  const customerName =
    quote.customerName ?? quote.customer?.name ?? "Customer";
  const customerEmail = quote.customerEmail ?? quote.customer?.email ?? "";
  const customerPhone = quote.customerPhone ?? quote.customer?.phone ?? "";

  const isQuoted = quotedAmount != null && quotedAmount > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-100/60 p-4 font-jakarta text-slate-900 sm:p-6 lg:pt-20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Navigation & Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/quotes")}
              className="inline-flex size-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-xs transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              aria-label="Back to My Quotes"
            >
              <ArrowLeft className="size-5" />
            </button>
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <Link to="/quotes" className="hover:text-blue-600 transition">
                  My Quotes
                </Link>
                <span>/</span>
                <span className="font-mono text-slate-700 dark:text-slate-300">
                  {quote.quoteReference}
                </span>
              </div>
              <h1 className="mt-0.5 text-xl font-bold tracking-tight sm:text-2xl">
                Quote Request Details
              </h1>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={copyRef}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs transition hover:border-blue-400 hover:text-blue-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
            >
              <Ticket className="size-3.5 text-blue-600" />
              <span>{quote.quoteReference}</span>
              {copied ? (
                <span className="font-sans text-[11px] font-bold text-emerald-600">
                  Copied!
                </span>
              ) : (
                <Copy className="size-3 text-slate-400" />
              )}
            </button>
          </div>
        </div>

        {/* Hero Proposal / Status Banner */}
        {isQuoted ? (
          <div className="relative overflow-hidden rounded-3xl border border-blue-200/90 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-6 text-white shadow-xl sm:p-8">
            <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white backdrop-blur-md">
                    <Sparkles className="size-3 text-amber-300" />
                    Special Custom Quote Received
                  </span>
                  <QuoteStatusBadge status={quote.status} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-blue-100">
                    Operator Proposed Rate
                  </p>
                  <p className="mt-1 text-3xl font-black tracking-tight sm:text-4xl text-white">
                    {formatMoney(quotedAmount, currency)}
                  </p>
                </div>
                {agencyNotes ? (
                  <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-md border border-white/15">
                    <p className="text-xs font-bold uppercase tracking-wider text-blue-200">
                      Message from Operator:
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-white">
                      {agencyNotes}
                    </p>
                  </div>
                ) : null}
              </div>

              {packageId ? (
                <div className="flex flex-col gap-3 sm:flex-row lg:flex-col shrink-0">
                  <Link
                    to={`/packages/${packageCode}/${packageId}`}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-white px-6 text-sm font-bold text-blue-700 shadow-lg transition hover:bg-blue-50 active:scale-95"
                  >
                    View Tour Package
                    <ExternalLink className="size-4" />
                  </Link>
                </div>
              ) : null}
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border border-amber-200/90 bg-gradient-to-r from-amber-50 to-orange-50/70 p-6 shadow-sm dark:border-amber-900/50 dark:from-amber-950/30 dark:to-orange-950/20 sm:p-7">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-3.5">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300">
                  <Clock className="size-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <QuoteStatusBadge status={quote.status} />
                    {quote.createdAt ? (
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        Requested on {formatDate(quote.createdAt)}
                      </span>
                    ) : null}
                  </div>
                  <h2 className="mt-2 text-lg font-bold text-slate-900 dark:text-white">
                    Quote Request is Under Review
                  </h2>
                  <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                    Your customized quote request has been safely delivered to our tour operator. They are preparing a personalized itinerary and pricing tailored to your requested travel dates and group preferences.
                  </p>
                </div>
              </div>

              {packageId ? (
                <Link
                  to={`/packages/${packageCode}/${packageId}`}
                  className="inline-flex shrink-0 items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  View Package Details
                  <ExternalLink className="size-3.5" />
                </Link>
              ) : null}
            </div>
          </div>
        )}

        {/* Content Columns */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main Column */}
          <div className="space-y-6 lg:col-span-2">
            {/* Package Overview Card */}
            <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-7">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
                <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                  <Ticket className="size-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">
                    Package Information
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    The requested tour package details
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-start">
                <SafeImage
                  src={coverImage}
                  alt={packageName}
                  className="h-32 w-full shrink-0 rounded-2xl object-cover shadow-sm sm:h-28 sm:w-36"
                  iconClassName="size-8"
                />
                <div className="min-w-0 flex-1 space-y-2">
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                    {packageName}
                  </h4>

                  <div className="grid grid-cols-1 gap-2 pt-1 text-xs text-slate-600 sm:grid-cols-2 dark:text-slate-300">
                    {departureDate ? (
                      <div className="flex items-center gap-2">
                        <CalendarDays className="size-4 text-blue-600" />
                        <div>
                          <span className="font-semibold text-slate-700 dark:text-slate-200">
                            Departure:{" "}
                          </span>
                          <span>{formatDate(departureDate)}</span>
                        </div>
                      </div>
                    ) : null}

                    {returnDate && returnDate !== departureDate ? (
                      <div className="flex items-center gap-2">
                        <CalendarDays className="size-4 text-indigo-600" />
                        <div>
                          <span className="font-semibold text-slate-700 dark:text-slate-200">
                            Return:{" "}
                          </span>
                          <span>{formatDate(returnDate)}</span>
                        </div>
                      </div>
                    ) : null}

                    {travellersCount ? (
                      <div className="flex items-center gap-2">
                        <Users className="size-4 text-emerald-600" />
                        <div>
                          <span className="font-semibold text-slate-700 dark:text-slate-200">
                            Travellers:{" "}
                          </span>
                          <span>{travellersCount}</span>
                        </div>
                      </div>
                    ) : null}

                    {quote.pickupPointName || quote.pickup?.name ? (
                      <div className="flex items-center gap-2">
                        <MapPin className="size-4 text-rose-600" />
                        <div>
                          <span className="font-semibold text-slate-700 dark:text-slate-200">
                            Pickup:{" "}
                          </span>
                          <span className="truncate">
                            {quote.pickupPointName ?? quote.pickup?.name}
                          </span>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </section>

            {/* User Inquiry / Message Card */}
            <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-7">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
                <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                  <MessageSquareQuote className="size-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">
                    Your Requirements & Inquiry Note
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    The custom requests you submitted for this quote
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50/80 p-4.5 dark:border-slate-800 dark:bg-slate-800/50">
                <p className="whitespace-pre-line text-sm leading-relaxed text-slate-800 dark:text-slate-200">
                  {quote.message || "No additional specific notes were entered."}
                </p>
              </div>
            </section>

            {/* Requested Activities / Add-ons (if any) */}
            {quote.activities && quote.activities.length > 0 ? (
              <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-7">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                    <Sparkles className="size-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">
                      Selected Activities & Add-ons
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Additional activities included in the quote request
                    </p>
                  </div>
                </div>

                <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
                  {quote.activities.map((act) => (
                    <div
                      key={act.activityId}
                      className="flex items-center justify-between py-3 text-sm"
                    >
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        {act.name ?? `Activity #${act.activityId}`}
                      </span>
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                        Qty: {act.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}
          </div>

          {/* Sidebar / Right Column */}
          <div className="space-y-6">
            {/* Contact Details Card */}
            <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
                <div className="flex size-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  <User className="size-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">
                    Contact Details
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Provided during inquiry
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-3 text-xs">
                <div>
                  <span className="text-slate-400">Full Name</span>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {customerName}
                  </p>
                </div>
                {customerEmail ? (
                  <div>
                    <span className="text-slate-400">Email Address</span>
                    <p className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-200">
                      <Mail className="size-3.5 text-blue-600" />
                      {customerEmail}
                    </p>
                  </div>
                ) : null}
                {customerPhone ? (
                  <div>
                    <span className="text-slate-400">Phone Number</span>
                    <p className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-200">
                      <Phone className="size-3.5 text-emerald-600" />
                      {customerPhone}
                    </p>
                  </div>
                ) : null}
              </div>
            </section>

            {/* Travellers Breakdown */}
            <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
                <div className="flex size-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-950/60 dark:text-violet-400">
                  <Users className="size-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">
                    Group Breakdown
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Passenger distribution
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Adults</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {quote.adults ?? 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Children</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {quote.children ?? 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Infants</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {quote.infants ?? 0}
                  </span>
                </div>
                <div className="flex items-center justify-between border-t border-slate-100 pt-2 font-bold dark:border-slate-800">
                  <span className="text-slate-900 dark:text-white">Total Travellers</span>
                  <span className="text-blue-600">
                    {quote.totalTravellers ??
                      (quote.adults ?? 0) +
                      (quote.children ?? 0) +
                      (quote.infants ?? 0)}
                  </span>
                </div>
              </div>
            </section>

            {/* Need Help Card */}
            <section className="rounded-3xl border border-slate-200/80 bg-gradient-to-br from-slate-50 to-blue-50/40 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/60 dark:text-blue-300">
                  <HelpCircle className="size-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">
                    Need Assistance?
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Have questions about your quote?
                  </p>
                </div>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                You can reach our concierge team or check support topics for inquiries regarding travel dates, hotels, and custom packages.
              </p>
              <Link
                to="/helpandsupport"
                className="mt-4 inline-flex h-9 w-full items-center justify-center rounded-xl border border-blue-200 bg-white text-xs font-bold text-blue-700 shadow-2xs hover:bg-blue-50 dark:border-blue-800 dark:bg-slate-800 dark:text-blue-300"
              >
                Contact Help & Support
              </Link>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
