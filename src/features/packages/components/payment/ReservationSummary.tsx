import type { ReactNode } from "react";
import { CalendarDays, MapPin, Users } from "lucide-react";
import type { PackageReservationResponse } from "../../types/packageReservation";
import { formatDate, formatMoney, friendlyLabel, plural } from "../../utils/packageDetailFormat";
import { Badge, SafeImage } from "../detail/primitives";
import PaymentScheduleCard from "./PaymentScheduleCard";

function travellersText(t: PackageReservationResponse["travellers"]): string {
  const parts = [
    t.adults ? plural(t.adults, "Adult") : "",
    t.children ? `${t.children} ${t.children === 1 ? "Child" : "Children"}` : "",
    t.infants ? plural(t.infants, "Infant") : "",
    t.other ? `${t.other} Other` : "",
  ].filter(Boolean);
  return parts.length ? parts.join(", ") : plural(t.total, "Traveller");
}

function Row({ label, icon, children }: { label: string; icon?: ReactNode; children: ReactNode }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
        {icon}
        {label}
      </dt>
      <dd className="text-right font-semibold text-slate-900 dark:text-slate-100">{children}</dd>
    </div>
  );
}

export default function ReservationSummary({
  reservation,
  coverImage,
  pickupLabel,
  paid = false,
  notice,
}: {
  reservation: PackageReservationResponse;
  coverImage?: string;
  pickupLabel?: string;
  paid?: boolean;
  notice?: ReactNode;
}) {
  const { pricing, payment, departure } = reservation;
  const money = (amount: number | null | undefined) => formatMoney(amount ?? 0, pricing.currency);
  const isDeposit = payment.paymentType?.toUpperCase() === "DEPOSIT" && payment.balanceAmount > 0;
  const start = formatDate(departure.date);
  const end = formatDate(departure.returnDate);

  return (
    <aside className="overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200/90 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-3.5 sm:gap-4 border-b border-slate-100 p-4 sm:p-5 dark:border-slate-800">
        <SafeImage src={coverImage} alt="" className="size-14 sm:size-16 shrink-0 rounded-xl object-cover" iconClassName="size-5" />
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">Your booking</p>
          <h2 className="mt-0.5 line-clamp-2 text-base sm:text-lg font-bold tracking-tight text-slate-950 dark:text-white">
            {reservation.package.packageName.trim()}
          </h2>
        </div>
      </div>

      <div className="space-y-4 sm:space-y-5 p-4 sm:p-5 text-sm">
        {notice}
        <div className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-3.5 py-3 dark:bg-slate-800/70">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Booking reference</p>
            <p className="mt-0.5 font-mono text-sm font-semibold tracking-wide text-slate-950 dark:text-white">{reservation.bookingRef}</p>
          </div>
          <Badge tone={paid ? "green" : "amber"}>{paid ? "Paid" : (friendlyLabel(reservation.status) ?? "Pending")}</Badge>
        </div>

        <dl className="space-y-3 text-slate-600 dark:text-slate-300">
          {start ? (
            <Row label="Departure" icon={<CalendarDays className="size-4 text-blue-600" aria-hidden />}>
              {start}
              {end && end !== start ? ` → ${end}` : ""}
            </Row>
          ) : null}
          {pickupLabel ? (
            <Row label="Pickup" icon={<MapPin className="size-4 text-emerald-600" aria-hidden />}>
              {pickupLabel}
            </Row>
          ) : null}
          <Row label="Travellers" icon={<Users className="size-4 text-slate-400" aria-hidden />}>
            {travellersText(reservation.travellers)}
          </Row>
        </dl>

        <dl className="space-y-2 border-t border-slate-100 pt-4 text-slate-600 dark:border-slate-800 dark:text-slate-300">
          <Row label="Package">{money(pricing.packageAmount)}</Row>
          {pricing.activityAmount > 0 ? <Row label="Activities">{money(pricing.activityAmount)}</Row> : null}
          {pricing.taxAmount > 0 ? <Row label="Taxes">{money(pricing.taxAmount)}</Row> : null}
          {pricing.feeAmount > 0 ? <Row label="Fees">{money(pricing.feeAmount)}</Row> : null}
          <div className="flex items-baseline justify-between gap-4 pt-2">
            <dt className="font-semibold text-slate-900 dark:text-white">Total</dt>
            <dd className="text-base font-semibold text-slate-950 dark:text-white">{money(pricing.totalAmount)}</dd>
          </div>
        </dl>

        <PaymentScheduleCard
          amountDueNow={payment.amountDueNow}
          balanceAmount={payment.balanceAmount}
          balanceDueDate={payment.balanceDueDate}
          currency={pricing.currency}
          isDeposit={isDeposit}
          paid={paid}
        />
      </div>
    </aside>
  );
}
