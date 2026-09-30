import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";
import {
  CalendarDays,
  Clock,
  ExternalLink,
  Eye,
  Loader2,
  MapPin,
  MessageSquareQuote,
  Search,
  Sparkles,
  Users,
} from "lucide-react";
import { formatDate, formatMoney, plural } from "../utils/packageDetailFormat";
import { SafeImage } from "../components/detail/primitives";
import { listMyPackageQuotesApi } from "../api/quotes.api";

function QuoteStatusBadge({ status }: { status: string }) {
  const value = status?.toUpperCase() ?? "";

  if (value === "QUOTED" || value === "OFFERED") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700 dark:border-blue-500/40 dark:bg-blue-950/60 dark:text-blue-300">
        <Sparkles className="size-3 text-blue-600 dark:text-blue-400" />
        Quote Received
      </span>
    );
  }
  if (value === "ACCEPTED" || value === "CONFIRMED" || value === "BOOKED") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:border-emerald-500/40 dark:bg-emerald-950/60 dark:text-emerald-300">
        <span className="size-1.5 rounded-full bg-emerald-500" />
        Accepted
      </span>
    );
  }
  if (value === "REJECTED" || value === "CANCELLED" || value === "DECLINED") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-700 dark:border-rose-500/40 dark:bg-rose-950/60 dark:text-rose-300">
        Cancelled
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 dark:border-amber-500/40 dark:bg-amber-950/60 dark:text-amber-300">
      <Clock className="size-3 text-amber-600 dark:text-amber-400" />
      Pending Review
    </span>
  );
}

export default function MyQuotesPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  // TanStack Infinite Query for quotes list
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status, refetch } =
    useInfiniteQuery({
      queryKey: ["package-quotes", "my"],
      queryFn: ({ pageParam = 0 }) => listMyPackageQuotesApi(pageParam, 10),
      initialPageParam: 0,
      getNextPageParam: (lastPage) => {
        if (lastPage.last) return undefined;
        return lastPage.page + 1;
      },
    });

  const allQuotes = data?.pages.flatMap((page) => page.content) ?? [];

  // Filtered quotes based on search
  const filteredQuotes = allQuotes.filter((quote) => {
    const packageName = quote.packageName ?? quote.package?.packageName ?? "";
    const ref = quote.quoteReference ?? "";
    return (
      searchTerm.trim() === "" ||
      packageName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ref.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Intersection Observer for infinite scrolling
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    });
    observer.observe(target);
    return () => {
      observer.unobserve(target);
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/40 p-4 font-jakarta text-slate-900 sm:p-6 lg:pt-20 dark:from-slate-950 dark:to-slate-900 dark:text-slate-100">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
        {/* Header with Search Banner */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 p-6 text-white sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3.5">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-white/20 shadow-xs backdrop-blur-md">
                <MessageSquareQuote className="size-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight sm:text-2xl">My Quotes</h1>
                <p className="text-xs text-blue-100 sm:text-sm">
                  Track custom travel quotes and agency proposals
                </p>
              </div>
            </div>

            <div className="relative w-full sm:w-96">
              <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by Quote Reference or Package"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-white/20 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm outline-none transition focus:ring-2 focus:ring-white/40"
              />
            </div>
          </div>
        </div>

        {/* Content Body */}
        {status === "pending" ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center gap-3 py-16 text-slate-500">
            <Loader2 className="size-8 animate-spin text-blue-600" />
            <p className="text-sm font-semibold">Loading your quote requests…</p>
          </div>
        ) : status === "error" ? (
          <div className="py-16 text-center">
            <p className="text-sm font-medium text-rose-600">Failed to load quotes.</p>
            <button
              type="button"
              onClick={() => void refetch()}
              className="mt-3 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        ) : filteredQuotes.length === 0 ? (
          <div className="py-20 text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
              <MessageSquareQuote className="size-7" />
            </div>
            <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
              No quote requests found
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {searchTerm
                ? "Try searching with a different keyword."
                : "You have not submitted any custom quote requests yet."}
            </p>
            <Link
              to="/packages"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700"
            >
              Browse Tour Packages
              <ExternalLink className="size-3.5" />
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredQuotes.map((quote) => {
              const packageName =
                quote.packageName ?? quote.package?.packageName ?? "Custom Tour Package";
              const coverImage =
                quote.coverImage ?? quote.package?.coverImage ?? undefined;
              const departureDate =
                quote.departureDate ?? quote.departure?.date ?? null;
              const returnDate =
                quote.returnDate ?? quote.departure?.returnDate ?? null;
              const currency = quote.currency ?? "LSL";
              const quotedAmount = quote.quotedAmount ?? quote.quotedPrice;

              const travellersCount = [
                quote.adults ? plural(quote.adults, "adult") : "",
                quote.children ? plural(quote.children, "child") : "",
                quote.infants ? plural(quote.infants, "infant") : "",
              ]
                .filter(Boolean)
                .join(", ");

              return (
                <div
                  key={quote.quoteRequestId}
                  onClick={() => navigate(`/quotes/${quote.quoteRequestId}`)}
                  className="group flex cursor-pointer flex-col gap-4 p-5 transition hover:bg-blue-50/40 sm:p-6 lg:flex-row lg:items-center lg:justify-between dark:hover:bg-slate-800/50"
                >
                  {/* Left: Image & Details */}
                  <div className="flex items-start gap-4">
                    <SafeImage
                      src={coverImage}
                      alt={packageName}
                      className="size-16 shrink-0 rounded-2xl object-cover shadow-xs sm:size-20"
                      iconClassName="size-8"
                    />
                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <QuoteStatusBadge status={quote.status} />
                        <span className="font-mono text-xs font-semibold text-slate-500">
                          #{quote.quoteReference}
                        </span>
                        {quote.createdAt ? (
                          <span className="text-[11px] text-slate-400">
                            · {formatDate(quote.createdAt)}
                          </span>
                        ) : null}
                      </div>

                      <h3 className="font-bold text-slate-900 group-hover:text-blue-700 dark:text-white dark:group-hover:text-blue-400 sm:text-base">
                        {packageName}
                      </h3>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                        {departureDate ? (
                          <span className="flex items-center gap-1">
                            <CalendarDays className="size-3.5 text-blue-600" />
                            {formatDate(departureDate)}
                            {returnDate && returnDate !== departureDate
                              ? ` → ${formatDate(returnDate)}`
                              : ""}
                          </span>
                        ) : null}

                        {travellersCount ? (
                          <span className="flex items-center gap-1">
                            <Users className="size-3.5 text-indigo-600" />
                            {travellersCount}
                          </span>
                        ) : null}

                        {quote.pickupPointName || quote.pickup?.name ? (
                          <span className="hidden items-center gap-1 sm:flex">
                            <MapPin className="size-3.5 text-emerald-600" />
                            {quote.pickupPointName ?? quote.pickup?.name}
                          </span>
                        ) : null}
                      </div>

                      {quote.message ? (
                        <p className="line-clamp-1 text-xs text-slate-600 dark:text-slate-300">
                          <span className="font-semibold text-slate-700 dark:text-slate-200">Note: </span>
                          {quote.message}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  {/* Right: Quoted Amount & Action */}
                  <div className="flex items-center justify-between border-t border-slate-100 pt-3 lg:border-t-0 lg:pt-0 gap-4">
                    {quotedAmount != null && quotedAmount > 0 ? (
                      <div className="text-left lg:text-right">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                          Quoted Price
                        </span>
                        <p className="text-lg font-black text-slate-900 dark:text-white">
                          {formatMoney(quotedAmount, currency)}
                        </p>
                      </div>
                    ) : (
                      <div className="text-left lg:text-right">
                        <span className="text-xs text-slate-400">Status</span>
                        <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                          Awaiting Operator
                        </p>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/quotes/${quote.quoteRequestId}`);
                      }}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-xs transition hover:border-blue-400 hover:bg-blue-50/60 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    >
                      <Eye className="size-3.5" />
                      View Details
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Load more trigger for infinite scroll */}
            <div ref={loadMoreRef} className="py-4 text-center">
              {isFetchingNextPage ? (
                <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                  <Loader2 className="size-4 animate-spin text-blue-600" />
                  Loading more quotes…
                </div>
              ) : hasNextPage ? (
                <button
                  type="button"
                  onClick={() => void fetchNextPage()}
                  className="text-xs font-semibold text-blue-600 hover:underline"
                >
                  Load more quotes
                </button>
              ) : (
                <p className="text-[11px] text-slate-400">All quotes loaded</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
