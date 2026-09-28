import type { ReactNode } from "react";
import { CalendarDays, MapPin, Users } from "lucide-react";
import type { PackageReservationResponse } from "../../types/packageReservation";
import { formatDate, formatMoney, friendlyLabel, plural } from "../../utils/packageDetailFormat";
import { Badge, SafeImage } from "../detail/primitives";

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
}: {
  reservation: PackageReservationResponse;
  coverImage?: string;
  pickupLabel?: string;
  paid?: boolean;
}) {
  const { pricing, payment, departure } = reservation;
  const money = (amount: number | null | undefined) => formatMoney(amount ?? 0, pricing.currency);
  const isDeposit = payment.paymentType?.toUpperCase() === "DEPOSIT" && payment.balanceAmount > 0;
  const start = formatDate(departure.date);
  const end = formatDate(departure.returnDate);

  return (
    <aside className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)] dark:border-slate-800 dark:bg-slate-900">
      <div className="flex gap-4 border-b border-slate-100 p-5 dark:border-slate-800">
        <SafeImage
          src={coverImage}
          alt=""
          className="size-16 shrink-0 rounded-2xl object-cover"
          iconClassName="size-5"
        />
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {reservation.package.packageCode}
          </p>
          <h2 className="mt-0.5 line-clamp-2 text-base font-bold text-slate-900 dark:text-white">
            {reservation.package.packageName.trim()}
          </h2>
        </div>
      </div>

      <div className="space-y-5 p-5 text-sm">
        <div className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-800/60">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Booking reference</p>
            <p className="font-mono text-base font-bold text-slate-900 dark:text-white">{reservation.bookingRef}</p>
          </div>
          <Badge tone={paid ? "green" : "amber"}>{paid ? "Paid" : (friendlyLabel(reservation.status) ?? "Pending")}</Badge>
        </div>

        <dl className="space-y-3">
          {start ? (
            <Row label="Departure" icon={<CalendarDays className="size-4" aria-hidden />}>
              {start}
              {end && end !== start ? ` → ${end}` : ""}
            </Row>
          ) : null}
          {pickupLabel ? (
            <Row label="Pickup" icon={<MapPin className="size-4" aria-hidden />}>
              {pickupLabel}
            </Row>
          ) : null}
          <Row label="Travellers" icon={<Users className="size-4" aria-hidden />}>
            {travellersText(reservation.travellers)}
          </Row>
        </dl>

        <dl className="space-y-2 border-t border-slate-100 pt-4 dark:border-slate-800">
          <Row label="Package">{money(pricing.packageAmount)}</Row>
          {pricing.activityAmount > 0 ? <Row label="Activities">{money(pricing.activityAmount)}</Row> : null}
          {pricing.taxAmount > 0 ? <Row label="Taxes">{money(pricing.taxAmount)}</Row> : null}
          {pricing.feeAmount > 0 ? <Row label="Fees">{money(pricing.feeAmount)}</Row> : null}
          <div className="flex justify-between gap-4 pt-1">
            <dt className="font-semibold text-slate-900 dark:text-white">Total</dt>
            <dd className="text-base font-extrabold text-slate-900 dark:text-white">{money(pricing.totalAmount)}</dd>
          </div>
        </dl>

        <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-4 dark:border-blue-500/20 dark:bg-blue-500/10">
          <div className="flex items-baseline justify-between gap-4">
            <p className="font-semibold text-blue-900 dark:text-blue-100">
              {paid ? "Amount paid" : isDeposit ? "Deposit due now" : "Amount due now"}
            </p>
            <p className="text-xl font-extrabold text-blue-700 dark:text-blue-300">{money(payment.amountDueNow)}</p>
          </div>
          {isDeposit ? (
            <p className="mt-1.5 text-xs text-blue-900/70 dark:text-blue-100/70">
              Remaining {money(payment.balanceAmount)}
              {payment.balanceDueDate ? ` due by ${formatDate(payment.balanceDueDate)}` : ""}.
            </p>
          ) : null}
        </div>
      </div>
    </aside>
  );
}
