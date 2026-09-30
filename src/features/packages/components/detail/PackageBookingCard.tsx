import { useId } from "react";
import { AlertCircle, CalendarDays, ChevronDown, MessageSquareQuote, ShieldCheck, ShieldX, Users } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatAgeRange, friendlyLabel, plural, type DepartureView } from "../../utils/packageDetailFormat";
import { ageChoices, MAX_PER_TYPE, type TravellerOption } from "../../utils/packageReservation";
import { Badge } from "./primitives";

function departureLabel(departure: DepartureView) {
  const range = departure.end && departure.end !== departure.start ? `${departure.start} → ${departure.end}` : departure.start;
  const extra = departure.bookable && departure.seatsLeft != null
    ? plural(departure.seatsLeft, "seat") + " left"
    : !departure.bookable && departure.status
      ? departure.status
      : undefined;
  return { range: range || "Departure", extra };
}

export function RefundBadge({ refundability }: { refundability?: string | null }) {
  const label = friendlyLabel(refundability);
  if (!label) return null;
  const refundable = refundability?.toUpperCase() !== "NON_REFUNDABLE";
  return (
    <Badge tone={refundable ? "green" : "amber"} icon={refundable ? ShieldCheck : ShieldX}>
      {label}
    </Badge>
  );
}

interface BookingProps {
  anchorId?: string;
  departures: DepartureView[];
  selectedKey?: string;
  error?: string;
  options: TravellerOption[];
  counts: Record<string, number>;
  ages: Record<string, number[]>;
  ageErrors?: Record<string, string>;
  onSelect: (key: string) => void;
  onCount: (type: string, value: number) => void;
  onAge: (type: string, index: number, age: number) => void;
  onBook: () => void;
  onRequestQuote?: () => void;
  bookLabel?: string;
}

function StepButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled?: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="flex size-7 shrink-0 items-center justify-center rounded-full border border-neutral-300 bg-white text-sm font-semibold text-neutral-700 shadow-sm transition-all hover:border-blue-600 hover:bg-blue-50 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-neutral-300 disabled:hover:bg-white disabled:hover:text-neutral-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-blue-400 dark:hover:bg-slate-700 dark:hover:text-white"
    >
      {children}
    </button>
  );
}

export default function PackageBookingCard({
  anchorId,
  departures,
  selectedKey,
  error,
  options,
  counts,
  ages,
  ageErrors,
  onSelect,
  onCount,
  onAge,
  onBook,
  onRequestQuote,
  bookLabel = "Continue Booking",
}: BookingProps) {
  const uid = useId();
  const errorId = `${uid}-departure-error`;
  const singleDeparture = departures.length === 1 ? departures[0] : null;
  const selected = departures.find((departure) => departure.key === selectedKey) ?? singleDeparture ?? undefined;
  const seated = options
    .filter((option) => option.type !== "INFANT")
    .reduce((sum, option) => sum + (counts[option.type] ?? 0), 0);
  const guests = options.reduce((sum, option) => sum + (counts[option.type] ?? 0), 0);

  return (
    <aside
      id={anchorId}
      className="scroll-mt-40 flex w-full flex-col gap-6 rounded-2xl border border-blue-200 bg-white p-5 shadow-[0_12px_32px_rgba(37,99,235,0.12)] ring-1 ring-blue-600/10 dark:border-blue-500/30 dark:bg-slate-900 dark:shadow-none dark:ring-blue-400/20 print:hidden"
    >
      <header className="flex items-center justify-between gap-3 border-b border-neutral-100 pb-4 dark:border-slate-800">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
          Book this package
        </span>
      </header>

      <div className="flex flex-col gap-6">
        {/* Departure Field */}
        <fieldset className="m-0 space-y-2 border-0 p-0" aria-describedby={error ? errorId : undefined}>
          <label
            htmlFor={singleDeparture ? undefined : `${uid}-departure`}
            className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-slate-300"
          >
            {singleDeparture ? "Departure Date" : "Select Departure Date"}
          </label>
          {singleDeparture ? (
            <div className="flex w-full items-center justify-between rounded-xl border border-neutral-300 bg-white py-2.5 pl-3.5 pr-3 text-sm font-semibold text-neutral-900 shadow-xs dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100">
              <span className="flex items-center gap-2 truncate">
                <CalendarDays className="size-4 shrink-0 text-blue-600 dark:text-blue-400" aria-hidden />
                <span>{departureLabel(singleDeparture).range}</span>
              </span>
              {departureLabel(singleDeparture).extra ? (
                <span className="ml-2 shrink-0 text-xs font-normal text-neutral-500 dark:text-slate-400">
                  {departureLabel(singleDeparture).extra}
                </span>
              ) : null}
            </div>
          ) : departures.length > 1 ? (
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger
                id={`${uid}-departure`}
                className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl border border-neutral-300 bg-white py-2.5 pl-3.5 pr-3 text-left text-sm font-medium text-neutral-900 shadow-sm outline-none transition-all focus-visible:border-blue-600 focus-visible:ring-2 focus-visible:ring-blue-600/20 data-[state=open]:border-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              >
                <span className={selected ? "truncate" : "truncate text-neutral-500 dark:text-slate-400"}>
                  {selected ? departureLabel(selected).range : "Choose a departure date"}
                </span>
                <ChevronDown className="size-4 shrink-0 text-neutral-400" aria-hidden />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-(--radix-dropdown-menu-trigger-width) rounded-xl p-1">
                <DropdownMenuGroup>
                  {departures.map((departure) => {
                    const { range, extra } = departureLabel(departure);
                    const active = departure.key === selectedKey;
                    return (
                      <DropdownMenuItem
                        key={departure.key}
                        disabled={!departure.bookable}
                        onSelect={() => onSelect(departure.key)}
                        className={`cursor-pointer rounded-lg px-3 py-2 ${active ? "bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-200" : ""}`}
                      >
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-medium">{range}</span>
                          {extra ? <span className="block text-xs font-normal text-neutral-500 dark:text-slate-400">{extra}</span> : null}
                        </span>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <p className="rounded-xl bg-neutral-50 p-3 text-sm text-neutral-600 dark:bg-slate-800/60 dark:text-slate-300">
              No departure dates available. Send an enquiry for custom dates.
            </p>
          )}
          {error ? (
            <p id={errorId} role="alert" className="m-0 flex items-center gap-1.5 text-xs font-medium text-rose-600 dark:text-rose-400">
              <AlertCircle className="size-4 shrink-0" aria-hidden />
              {error}
            </p>
          ) : null}
        </fieldset>

        {/* Travelers Counter Section */}
        {options.length ? (
          <section className="space-y-4 rounded-xl border border-blue-100 bg-blue-50/80 p-4 dark:border-blue-500/20 dark:bg-blue-500/10">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-200">
                Travelers & Guests
              </span>
              <span className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-300">
                <Users className="size-3.5" /> {guests}
              </span>
            </div>

            {options.map((option, index) => {
              const count = counts[option.type] ?? 0;
              const age = formatAgeRange(option.minAge, option.maxAge);
              const seatRoom =
                selected?.seatsLeft != null && option.type !== "INFANT" ? count + Math.max(0, selected.seatsLeft - seated) : MAX_PER_TYPE;
              const max = Math.min(MAX_PER_TYPE, seatRoom);
              const choices = ageChoices(option);
              return (
                <article
                  key={option.type}
                  className={`space-y-3 ${index > 0 ? "border-t border-blue-100 pt-3.5 dark:border-blue-500/20" : ""}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <strong className="block text-sm font-semibold text-neutral-900 dark:text-white">{option.label}</strong>
                      {age ? <span className="block text-xs font-normal text-neutral-500 dark:text-slate-400">{age}</span> : null}
                    </div>
                    <div className="flex items-center gap-2" role="group" aria-label={`${option.label} count`}>
                      <StepButton
                        label={`Decrease ${option.label}`}
                        disabled={count <= option.min}
                        onClick={() => onCount(option.type, Math.max(option.min, count - 1))}
                      >
                        -
                      </StepButton>
                      <span className="w-5 text-center text-sm font-bold text-neutral-900 dark:text-white">{count}</span>
                      <StepButton
                        label={`Increase ${option.label}`}
                        disabled={count >= max}
                        onClick={() => onCount(option.type, Math.min(max, count + 1))}
                      >
                        +
                      </StepButton>
                    </div>
                  </div>
                  {option.needsAge && count > 0 ? (
                    <div className="grid grid-cols-2 gap-2.5 pt-1">
                      {Array.from({ length: count }, (_, childIndex) => {
                        const fieldId = `${uid}-age-${option.type}-${childIndex}`;
                        const value = ages[option.type]?.[childIndex];
                        const ageError = ageErrors?.[`${option.type}-${childIndex}`];
                        return (
                          <div key={fieldId} className="block">
                            <span className="mb-1.5 block text-sm font-semibold text-neutral-700 dark:text-slate-200">
                              {option.label} {childIndex + 1} age
                            </span>
                            <Select
                              value={value != null ? String(value) : ""}
                              onValueChange={(selectedAge) => onAge(option.type, childIndex, Number(selectedAge))}
                            >
                              <SelectTrigger
                                id={fieldId}
                                aria-invalid={Boolean(ageError)}
                                className={`h-11 w-full cursor-pointer rounded-xl border bg-white px-3.5 text-sm font-medium text-neutral-900 shadow-sm transition-all focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 dark:bg-slate-900 dark:text-slate-100 ${
                                  ageError ? "border-rose-500" : "border-neutral-300 dark:border-slate-700"
                                }`}
                              >
                                <SelectValue placeholder="Age" />
                              </SelectTrigger>
                              <SelectContent position="popper" className="z-50 max-h-60 min-w-[8.5rem]">
                                {choices.map((choice) => (
                                  <SelectItem key={choice} value={String(choice)} className="cursor-pointer py-2 px-3 text-sm font-medium">
                                    {choice} {choice === 1 ? "year" : "years"}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {ageError ? <span className="mt-1 block text-xs font-medium text-rose-600 dark:text-rose-400">{ageError}</span> : null}
                          </div>
                        );
                      })}
                    </div>
                  ) : null}
                </article>
              );
            })}
          </section>
        ) : null}
      </div>

      {/* CTAs */}
      <nav className="flex flex-col space-y-2 pt-1" aria-label="Booking actions">
        <button
          type="button"
          onClick={onBook}
          disabled={!departures.length}
          className="w-full cursor-pointer rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-md shadow-blue-600/20 transition-all hover:bg-blue-700 hover:shadow-lg active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:shadow-none dark:disabled:bg-slate-800"
        >
          {bookLabel}
        </button>

        {onRequestQuote ? (
          <>
            <div className="relative my-0.5 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-200 dark:border-slate-800" />
              </div>
              <span className="relative bg-white px-2.5 text-[10px] font-semibold uppercase tracking-wider text-neutral-400 dark:bg-slate-900 dark:text-slate-500">
                or
              </span>
            </div>

            <button
              type="button"
              onClick={onRequestQuote}
              className="group flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-blue-600/25 bg-blue-50/70 py-2.5 text-sm font-bold text-blue-700 shadow-xs transition-all hover:border-blue-500 hover:bg-blue-100 hover:text-blue-800 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-blue-500/30 dark:bg-blue-950/40 dark:text-blue-300 dark:hover:border-blue-500/60 dark:hover:bg-blue-900/50"
            >
              <MessageSquareQuote className="size-4.5 text-blue-600 transition-transform duration-200 group-hover:scale-110 dark:text-blue-400" />
              <span>Req a Quote</span>
            </button>
          </>
        ) : null}
      </nav>

      <p className="sr-only">{guests} travellers selected</p>
    </aside>
  );
}

export function PackageMobileBookingBar({
  guestLabel,
  onBook,
  onRequestQuote,
  bookLabel = "Book Now",
}: {
  guestLabel: string;
  onBook: () => void;
  onRequestQuote?: () => void;
  bookLabel?: string;
}) {
  return (
    <footer className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between border-t border-neutral-200/80 bg-white/95 px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] backdrop-blur-md lg:hidden dark:border-slate-800 dark:bg-slate-900/95 print:hidden">
      <div>
        <span className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-slate-400">Travellers</span>
        <p className="m-0 text-base font-bold text-neutral-900 dark:text-white">{guestLabel}</p>
      </div>
      <nav className="flex items-center gap-2" aria-label="Mobile booking actions">
        {onRequestQuote ? (
          <button
            type="button"
            onClick={onRequestQuote}
            className="flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50/70 px-3.5 py-2.5 text-xs font-bold text-blue-700 active:scale-95 dark:border-blue-500/30 dark:bg-blue-950/40 dark:text-blue-300"
          >
            <MessageSquareQuote className="size-3.5 text-blue-600 dark:text-blue-400" />
            <span>Req a Quote</span>
          </button>
        ) : null}
        <button
          type="button"
          onClick={onBook}
          className="rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-600/20 active:scale-95"
        >
          {bookLabel}
        </button>
      </nav>
    </footer>
  );
}