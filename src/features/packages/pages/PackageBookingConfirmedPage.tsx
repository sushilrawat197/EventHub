import { useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import ScrollToTop from "@/shared/components/common/ScrollToTop";
import ReservationSummary from "../components/payment/ReservationSummary";
import type { StoredPackageReservation } from "../types/packageReservation";
import { loadReservation } from "../utils/reservationStorage";

export default function PackageBookingConfirmedPage() {
  const { bookingId = "" } = useParams();
  const location = useLocation();
  const fromState = location.state as StoredPackageReservation | null;
  const [entry] = useState<StoredPackageReservation | null>(() =>
    fromState?.reservation?.bookingId === Number(bookingId) ? fromState : loadReservation(bookingId),
  );

  return (
    <div className="min-h-[calc(100vh-200px)] bg-slate-50 font-jakarta dark:bg-slate-950">
      <ScrollToTop />
      <div className="mx-auto max-w-xl px-4 py-10 sm:py-14">
        <div className="text-center">
          <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15">
            <CheckCircle2 className="size-9" aria-hidden />
          </span>
          <h1 className="mt-4 text-2xl font-extrabold text-slate-900 dark:text-white">Payment successful</h1>
          <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-300">
            {entry?.leadEmail ? (
              <>
                Your booking is confirmed. Details will be sent to <span className="font-semibold">{entry.leadEmail}</span>.
              </>
            ) : (
              "Your booking is confirmed. The operator will contact you with trip details."
            )}
          </p>
        </div>

        {entry ? (
          <div className="mt-8">
            <ReservationSummary
              reservation={entry.reservation}
              coverImage={entry.coverImage}
              pickupLabel={entry.pickupLabel}
              paid
            />
          </div>
        ) : null}

        <div className="mt-8 grid gap-2 sm:grid-cols-2">
          <Link
            to="/packages"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          >
            Explore more packages
          </Link>
          <Link
            to="/"
            className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-800 hover:border-blue-300 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
