import { useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { Check } from "lucide-react";
import ScrollToTop from "@/shared/components/common/ScrollToTop";
import BookingSprinkles from "../components/payment/BookingSprinkles";
import type { StoredPackageReservation } from "../types/packageReservation";
import { formatMoney } from "../utils/packageDetailFormat";
import { loadReservation } from "../utils/reservationStorage";

export default function PackageBookingConfirmedPage() {
  const { bookingId = "" } = useParams();
  const location = useLocation();
  const fromState = location.state as StoredPackageReservation | null;
  const [entry] = useState<StoredPackageReservation | null>(() =>
    fromState?.reservation?.bookingId === Number(bookingId) ? fromState : loadReservation(bookingId),
  );
  const reservation = entry?.reservation;
  const paidLabel = reservation ? formatMoney(reservation.payment.amountDueNow, reservation.pricing.currency) : undefined;
  const remainingAmount = reservation?.payment.balanceAmount ?? 0;
  const remainingLabel = reservation ? formatMoney(remainingAmount, reservation.pricing.currency) : undefined;

  return (
    <div className="relative flex min-h-[calc(100dvh-4.5rem)] items-center bg-[radial-gradient(ellipse_at_top,_rgba(16,185,129,0.16),_transparent_46%),linear-gradient(180deg,#f8fafc_0%,#f1f5f9_100%)] px-4 py-8 font-jakarta sm:min-h-[calc(100dvh-4rem)] lg:min-h-[calc(100dvh-7rem)] dark:bg-slate-950">
      <ScrollToTop />
      <BookingSprinkles />

      <div className="relative mx-auto w-full max-w-md">
        <article className="overflow-hidden rounded-[1.35rem] border border-slate-200/80 bg-white shadow-[0_28px_60px_-36px_rgba(15,23,42,0.55)] dark:border-slate-800 dark:bg-slate-900">
          <div className="h-1.5 bg-gradient-to-r from-emerald-500 via-amber-300 to-sky-400" aria-hidden />

          <header className="px-5 pb-1 pt-5 text-center">
            <span className="mx-auto flex size-11 items-center justify-center rounded-full bg-emerald-600 text-white shadow-[0_10px_24px_-10px_rgba(5,150,105,0.9)]">
              <Check className="size-5 stroke-[2.75]" aria-hidden />
            </span>
            <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-700 dark:text-emerald-300">
              Confirmed
            </p>
            <h1 className="mt-1 text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
              You&apos;re booked
            </h1>
            <p className="mx-auto mt-1 max-w-xs text-xs leading-5 text-slate-500 dark:text-slate-400">
              {entry?.leadEmail ? (
                <>
                  Details will be sent to <span className="font-semibold text-slate-700 dark:text-slate-200">{entry.leadEmail}</span>.
                </>
              ) : (
                "The operator will contact you with trip details."
              )}
            </p>
          </header>

          {reservation && paidLabel ? (
            <dl className="mx-5 mb-4 mt-4 space-y-2.5 border-t border-slate-100 pt-4 text-sm dark:border-slate-800">
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-slate-500 dark:text-slate-400">Paid</dt>
                <dd className="text-base font-semibold tabular-nums text-slate-950 dark:text-white">{paidLabel}</dd>
              </div>
              {remainingAmount > 0 && remainingLabel ? (
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-slate-500 dark:text-slate-400">Remaining</dt>
                  <dd className="text-base font-semibold tabular-nums text-slate-950 dark:text-white">{remainingLabel}</dd>
                </div>
              ) : null}
            </dl>
          ) : (
            <p className="px-5 py-4 text-center text-sm text-slate-500">
              Booking <span className="font-mono font-semibold text-slate-800 dark:text-slate-100">{bookingId}</span> is confirmed.
            </p>
          )}

          <div className="grid grid-cols-2 gap-2 border-t border-slate-100 px-4 py-3 dark:border-slate-800">
            <Link
              to={`/order/${bookingId}/package`}
              className="inline-flex h-10 items-center justify-center rounded-full bg-slate-950 text-xs font-semibold text-white hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
            >
              View booking
            </Link>
            <Link
              to="/"
              className="inline-flex h-10 items-center justify-center rounded-full border border-slate-200 text-xs font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Back to home
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
}
