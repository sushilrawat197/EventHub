import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  CalendarDays,
  Check,
  Clock,
  Loader2,
  Mail,
  MessageSquareQuote,
  Minus,
  Plus,
  Send,
  User,
  X,
} from "lucide-react";
import { useAppSelector } from "@/app/store/hooks";
import { getApiErrorMessage } from "@/lib/api/errors";
import { useRequestQuote } from "../../hooks/useRequestQuote";
import type { PackageDetail } from "../../types/packageDetail";
import type { PackageQuoteRequest } from "../../types/packageReservation";
import { clean, type DepartureView } from "../../utils/packageDetailFormat";
import { DEFAULT_COUNTRY_CODE, MAX_PER_TYPE, TITLES, type TravellerOption } from "../../utils/packageReservation";

interface AdultGuest {
  title: string;
  firstName: string;
  lastName: string;
}

interface ChildGuest {
  firstName: string;
  lastName: string;
  age: number | "";
}

interface InfantGuest {
  firstName: string;
  lastName: string;
  age: number;
}

interface PackageQuoteModalProps {
  open: boolean;
  pkg: PackageDetail;
  departures: DepartureView[];
  initialDepartureKey?: string;
  initialCounts: Record<string, number>;
  initialAges: Record<string, number[]>;
  options: TravellerOption[];
  onClose: () => void;
}

export default function PackageQuoteModal({
  open,
  pkg,
  departures,
  initialDepartureKey,
  initialCounts,
  initialAges,
  onClose,
}: PackageQuoteModalProps) {
  const navigate = useNavigate();
  const titleId = useId();
  const user = useAppSelector((state) => state.user.user);
  const quoteMutation = useRequestQuote();

  // Selected departure
  const [selectedKey, setSelectedKey] = useState<string>(
    () => initialDepartureKey ?? (departures.length ? departures[0].key : "")
  );

  // Traveller counts
  const [adultCount, setAdultCount] = useState<number>(() => Math.max(1, initialCounts.ADULT ?? 1));
  const [childCount, setChildCount] = useState<number>(() => Math.max(0, initialCounts.CHILD ?? 0));
  const [infantCount, setInfantCount] = useState<number>(() => Math.max(0, initialCounts.INFANT ?? 0));

  // Lead Adult Contact Information
  const [leadTitle, setLeadTitle] = useState("Mr");
  const [leadFirstName, setLeadFirstName] = useState("");
  const [leadLastName, setLeadLastName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadCountryCode, setLeadCountryCode] = useState(DEFAULT_COUNTRY_CODE);
  const [leadMobile, setLeadMobile] = useState("");

  // Additional Adults (index 0 is Adult 2, etc.)
  const [additionalAdults, setAdditionalAdults] = useState<AdultGuest[]>([]);

  // Children (index 0 is Child 1, etc.)
  const [children, setChildren] = useState<ChildGuest[]>([]);

  // Infants
  const [infants, setInfants] = useState<InfantGuest[]>([]);

  // Requirements / Message
  const [message, setMessage] = useState("");

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize or reset form state when modal opens
  useEffect(() => {
    if (!open) return;

    quoteMutation.reset();
    setErrors({});

    // Pre-fill departure
    const currentDep = initialDepartureKey ?? (departures.length ? departures[0].key : "");
    setSelectedKey(currentDep);

    // Counts
    const adults = Math.max(1, initialCounts.ADULT ?? 1);
    const kids = Math.max(0, initialCounts.CHILD ?? 0);
    const infs = Math.max(0, initialCounts.INFANT ?? 0);
    setAdultCount(adults);
    setChildCount(kids);
    setInfantCount(infs);

    // Pre-fill user contact info if logged in
    if (user) {
      setLeadFirstName(clean(user.firstName) ?? "");
      setLeadLastName(clean(user.lastName) ?? "");
      setLeadEmail(clean(user.email) ?? "");

      const rawMobile = (user.mobile ?? "").trim().replace(/\s+/g, "");
      let code = DEFAULT_COUNTRY_CODE;
      let num = rawMobile;

      if (rawMobile.startsWith("+")) {
        const match = rawMobile.match(/^(\+\d{1,4})(.*)$/);
        if (match) {
          code = match[1];
          num = match[2];
        }
      } else if (rawMobile.startsWith("91") && rawMobile.length >= 12) {
        code = "+91";
        num = rawMobile.slice(2);
      } else if (rawMobile.startsWith("266") && rawMobile.length >= 11) {
        code = "+266";
        num = rawMobile.slice(3);
      }
      setLeadCountryCode(code);
      setLeadMobile(num.replace(/\D/g, ""));
    }

    // Initialize additional adults
    const extraAdultsCount = Math.max(0, adults - 1);
    setAdditionalAdults(
      Array.from({ length: extraAdultsCount }, () => ({
        title: "Mr",
        firstName: "",
        lastName: "",
      }))
    );

    // Initialize children with existing ages if any
    const initialChildAges = initialAges.CHILD ?? [];
    setChildren(
      Array.from({ length: kids }, (_, i) => ({
        firstName: "",
        lastName: "",
        age: initialChildAges[i] != null ? initialChildAges[i] : "",
      }))
    );

    // Initialize infants
    const initialInfantAge = initialAges.INFANT?.[0];
    setInfants(
      Array.from({ length: infs }, () => ({
        firstName: "",
        lastName: "",
        age: initialInfantAge != null ? initialInfantAge : 0,
      }))
    );

    setMessage("");

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open, initialDepartureKey, departures, initialCounts, initialAges, user]);

  // Adjust additional adults when adultCount changes
  useEffect(() => {
    const extraNeeded = Math.max(0, adultCount - 1);
    setAdditionalAdults((prev) => {
      if (prev.length === extraNeeded) return prev;
      if (prev.length < extraNeeded) {
        return [
          ...prev,
          ...Array.from({ length: extraNeeded - prev.length }, () => ({
            title: "Mr",
            firstName: "",
            lastName: "",
          })),
        ];
      }
      return prev.slice(0, extraNeeded);
    });
  }, [adultCount]);

  // Adjust children when childCount changes
  useEffect(() => {
    setChildren((prev) => {
      if (prev.length === childCount) return prev;
      if (prev.length < childCount) {
        return [
          ...prev,
          ...Array.from({ length: childCount - prev.length }, () => ({
            firstName: "",
            lastName: "",
            age: "" as number | "",
          })),
        ];
      }
      return prev.slice(0, childCount);
    });
  }, [childCount]);

  // Adjust infants when infantCount changes
  useEffect(() => {
    setInfants((prev) => {
      if (prev.length === infantCount) return prev;
      if (prev.length < infantCount) {
        return [
          ...prev,
          ...Array.from({ length: infantCount - prev.length }, () => ({
            firstName: "",
            lastName: "",
            age: 0,
          })),
        ];
      }
      return prev.slice(0, infantCount);
    });
  }, [infantCount]);

  // Escape key handler
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !quoteMutation.isPending) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, quoteMutation.isPending]);

  if (!open) return null;

  const selectedDeparture = departures.find((d) => d.key === selectedKey);

  function validateForm() {
    const newErrors: Record<string, string> = {};

    if (departures.length > 0 && !selectedKey) {
      newErrors.departure = "Please select a departure date.";
    }

    if (!leadFirstName.trim()) {
      newErrors.leadFirstName = "First name is required.";
    }
    if (!leadLastName.trim()) {
      newErrors.leadLastName = "Last name is required.";
    }

    if (!leadEmail.trim()) {
      newErrors.leadEmail = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(leadEmail.trim())) {
      newErrors.leadEmail = "Please enter a valid email address.";
    }

    if (!leadMobile.trim()) {
      newErrors.leadMobile = "Mobile number is required.";
    } else if (leadMobile.replace(/\D/g, "").length < 6) {
      newErrors.leadMobile = "Please enter a valid mobile number.";
    }

    // Validate child ages
    children.forEach((child, index) => {
      if (child.age === "" || child.age == null) {
        newErrors[`childAge_${index}`] = `Please select age for Child ${index + 1}.`;
      }
    });

    return newErrors;
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      const firstErrorEl = document.querySelector("[aria-invalid='true']");
      firstErrorEl?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    const depId = selectedKey ? Number(selectedKey) : departures[0]?.key ? Number(departures[0].key) : 0;

    // Build human-friendly traveller & special requests summary for travel agency
    const guestLines: string[] = [];
    guestLines.push(`• Lead Adult: ${leadTitle} ${leadFirstName.trim()} ${leadLastName.trim()} (Email: ${leadEmail.trim()}, Phone: ${leadCountryCode} ${leadMobile.trim()})`);

    additionalAdults.forEach((adult, i) => {
      const name = `${adult.title} ${adult.firstName.trim()} ${adult.lastName.trim()}`.trim();
      guestLines.push(`• Adult ${i + 2}: ${name || "Guest " + (i + 2)}`);
    });

    children.forEach((child, i) => {
      const name = `${child.firstName.trim()} ${child.lastName.trim()}`.trim();
      guestLines.push(`• Child ${i + 1}: ${name || "Child " + (i + 1)} (Age: ${child.age} yrs)`);
    });

    infants.forEach((infant, i) => {
      const name = `${infant.firstName.trim()} ${infant.lastName.trim()}`.trim();
      guestLines.push(`• Infant ${i + 1}: ${name || "Infant " + (i + 1)} (Age: ${infant.age} yrs)`);
    });

    const fullMessage = [
      message.trim() ? `Inquiry / Special Requirements:\n${message.trim()}` : "",
      `Guest Details Breakdown:\n${guestLines.join("\n")}`,
    ]
      .filter(Boolean)
      .join("\n\n");

    const payload: PackageQuoteRequest = {
      packageId: pkg.packageId,
      departureId: depId,
      adults: adultCount,
      children: childCount,
      infants: infantCount,
      activities: [],
      customer: {
        name: `${leadFirstName.trim()} ${leadLastName.trim()}`,
        email: leadEmail.trim(),
        phone: `${leadCountryCode}${leadMobile.replace(/\D/g, "")}`,
      },
      message: fullMessage,
    };

    quoteMutation.mutate(payload);
  }

  const result = quoteMutation.data;
  const quoteError = quoteMutation.isError
    ? getApiErrorMessage(quoteMutation.error, "We couldn't submit your quote request. Please try again.")
    : undefined;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 font-jakarta backdrop-blur-md bg-slate-950/60 transition-all">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close quote dialog"
        className="absolute inset-0 bg-transparent cursor-default"
        onClick={() => !quoteMutation.isPending && onClose()}
      />

      {/* Modal Dialog Card */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-2xl transition-all dark:border-slate-800 dark:bg-slate-900"
      >
        {/* Top colored accent bar */}
        <div className="h-1.5 w-full shrink-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={quoteMutation.isPending}
          className="absolute right-4.5 top-4.5 z-10 rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:opacity-40 dark:hover:bg-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
        >
          <X className="size-5" aria-hidden />
          <span className="sr-only">Close</span>
        </button>

        {result ? (
          /* Success Screen */
          <div className="p-6 sm:p-8 overflow-y-auto text-center">
            <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50/50 dark:bg-emerald-950/50 dark:text-emerald-400 dark:ring-emerald-950/30">
              <Check className="size-8 stroke-[2.5]" aria-hidden />
            </div>

            <h2 id={titleId} className="mt-4 text-2xl font-bold text-slate-950 dark:text-white">
              Quote Request Submitted!
            </h2>

            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300 max-w-md mx-auto">
              {result.message ||
                "Your customized quote inquiry has been sent to the tour operator. They will review your traveller details and get back to you shortly with tailored pricing."}
            </p>

            {result.quoteReference ? (
              <div className="mt-5 inline-flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50/80 px-4 py-2.5 text-sm text-emerald-900 dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-200">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  Quote Reference:
                </span>
                <span className="font-mono font-bold text-base">{result.quoteReference}</span>
              </div>
            ) : null}

            <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-left text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-850 dark:text-slate-300 max-w-md mx-auto">
              <p className="font-semibold text-slate-800 dark:text-slate-100 mb-1">Inquiry Details:</p>
              <p>• <strong>Package:</strong> {pkg.packageName}</p>
              {selectedDeparture ? <p>• <strong>Departure:</strong> {selectedDeparture.start} → {selectedDeparture.end || selectedDeparture.start}</p> : null}
              <p>• <strong>Travellers:</strong> {adultCount} Adult{adultCount > 1 ? "s" : ""}{childCount > 0 ? `, ${childCount} Child${childCount > 1 ? "ren" : ""}` : ""}{infantCount > 0 ? `, ${infantCount} Infant${infantCount > 1 ? "s" : ""}` : ""}</p>
              <p>• <strong>Contact:</strong> {leadFirstName} {leadLastName} ({leadEmail})</p>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  navigate("/quotes");
                }}
                className="inline-flex h-11 flex-1 items-center justify-center rounded-xl bg-blue-600 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.99]"
              >
                View My Quotes
              </button>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-11 flex-1 items-center justify-center rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Form Content */
          <form onSubmit={handleSubmit} className="flex flex-col min-h-0 flex-1">
            {/* Scrollable Form Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
              {/* Header */}
              <div className="flex items-start gap-3.5">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 ring-4 ring-blue-50/60 dark:bg-blue-950/60 dark:text-blue-400 dark:ring-blue-900/30">
                  <MessageSquareQuote className="size-6" aria-hidden />
                </div>
                <div className="min-w-0 pr-6">
                  {/* <div className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-semibold text-blue-700 dark:bg-blue-950/80 dark:text-blue-300">
                    <Sparkles className="size-3" aria-hidden />
                    Custom Quote & Inquiries
                  </div> */}
                  <h2 id={titleId} className="mt-1 text-xl font-bold text-slate-950 dark:text-white">
                    Request a Quote
                  </h2>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    Fill in your traveller details and specific preferences. The operator will contact you with customized rates.
                  </p>
                </div>
              </div>

              {/* Package Summary Box */}
              {/* <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-3.5 dark:border-blue-500/20 dark:bg-blue-950/30">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                      Selected Package
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                      {pkg.packageName}
                    </h3>
                  </div>
                  {pkg.tourOperatorName ? (
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Operator: <strong className="text-slate-700 dark:text-slate-200">{pkg.tourOperatorName}</strong>
                    </span>
                  ) : null}
                </div>
              </div> */}

              {/* Departure Date Selector */}
              {departures.length > 0 ? (
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Departure Date <span className="text-rose-500">*</span>
                  </label>
                  {departures.length === 1 ? (
                    <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-sm font-medium text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100">
                      <CalendarDays className="size-4 text-blue-600 dark:text-blue-400" />
                      <span>{departures[0].start} → {departures[0].end || departures[0].start}</span>
                    </div>
                  ) : (
                    <div className="relative">
                      <select
                        value={selectedKey}
                        onChange={(e) => {
                          setSelectedKey(e.target.value);
                          setErrors((prev) => {
                            const next = { ...prev };
                            delete next.departure;
                            return next;
                          });
                        }}
                        aria-invalid={Boolean(errors.departure)}
                        className={`h-11 w-full rounded-xl border bg-white px-3.5 text-sm font-medium text-slate-900 outline-none transition focus:ring-2 dark:bg-slate-850 dark:text-slate-100 ${errors.departure
                          ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/20"
                          : "border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 dark:border-slate-700"
                          }`}
                      >
                        <option value="" disabled>
                          Select departure date
                        </option>
                        {departures.map((dep) => (
                          <option key={dep.key} value={dep.key}>
                            {dep.start} → {dep.end || dep.start} {dep.seatsLeft != null ? `(${dep.seatsLeft} seats left)` : ""}
                          </option>
                        ))}
                      </select>
                      {errors.departure ? (
                        <p className="mt-1 text-xs font-medium text-rose-600 dark:text-rose-400">{errors.departure}</p>
                      ) : null}
                    </div>
                  )}
                </div>
              ) : null}

              {/* Travellers Counter Section */}
              <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-750 dark:bg-slate-800/40">
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-2 dark:border-slate-700">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Number of Travellers
                  </span>
                  {/* <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400">
                    <Users className="size-3.5" />
                    <span>{adultCount + childCount + infantCount} {plural(adultCount + childCount + infantCount, "Guest")}</span>
                  </span> */}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Adults */}
                  <div className="flex items-center justify-between rounded-xl bg-white p-2.5 shadow-2xs border border-slate-100 dark:bg-slate-800 dark:border-slate-700">
                    <div>
                      <strong className="block text-xs font-bold text-slate-800 dark:text-slate-200">Adults</strong>
                      <span className="text-[11px] text-slate-400">Age 18+</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        disabled={adultCount <= 1}
                        onClick={() => setAdultCount((c) => Math.max(1, c - 1))}
                        className="flex size-7 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 dark:border-slate-700 dark:text-slate-300"
                      >
                        <Minus className="size-3" />
                      </button>
                      <span className="w-5 text-center text-xs font-bold text-slate-900 dark:text-white">{adultCount}</span>
                      <button
                        type="button"
                        disabled={adultCount >= MAX_PER_TYPE}
                        onClick={() => setAdultCount((c) => Math.min(MAX_PER_TYPE, c + 1))}
                        className="flex size-7 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 dark:border-slate-700 dark:text-slate-300"
                      >
                        <Plus className="size-3" />
                      </button>
                    </div>
                  </div>

                  {/* Children */}
                  <div className="flex items-center justify-between rounded-xl bg-white p-2.5 shadow-2xs border border-slate-100 dark:bg-slate-800 dark:border-slate-700">
                    <div>
                      <strong className="block text-xs font-bold text-slate-800 dark:text-slate-200">Children</strong>
                      <span className="text-[11px] text-slate-400">Age 2-17</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        disabled={childCount <= 0}
                        onClick={() => setChildCount((c) => Math.max(0, c - 1))}
                        className="flex size-7 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 dark:border-slate-700 dark:text-slate-300"
                      >
                        <Minus className="size-3" />
                      </button>
                      <span className="w-5 text-center text-xs font-bold text-slate-900 dark:text-white">{childCount}</span>
                      <button
                        type="button"
                        disabled={childCount >= MAX_PER_TYPE}
                        onClick={() => setChildCount((c) => Math.min(MAX_PER_TYPE, c + 1))}
                        className="flex size-7 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 dark:border-slate-700 dark:text-slate-300"
                      >
                        <Plus className="size-3" />
                      </button>
                    </div>
                  </div>

                  {/* Infants */}
                  <div className="flex items-center justify-between rounded-xl bg-white p-2.5 shadow-2xs border border-slate-100 dark:bg-slate-800 dark:border-slate-700">
                    <div>
                      <strong className="block text-xs font-bold text-slate-800 dark:text-slate-200">Infants</strong>
                      <span className="text-[11px] text-slate-400">Age 0-2</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        disabled={infantCount <= 0}
                        onClick={() => setInfantCount((c) => Math.max(0, c - 1))}
                        className="flex size-7 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 dark:border-slate-700 dark:text-slate-300"
                      >
                        <Minus className="size-3" />
                      </button>
                      <span className="w-5 text-center text-xs font-bold text-slate-900 dark:text-white">{infantCount}</span>
                      <button
                        type="button"
                        disabled={infantCount >= 5}
                        onClick={() => setInfantCount((c) => Math.min(5, c + 1))}
                        className="flex size-7 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 dark:border-slate-700 dark:text-slate-300"
                      >
                        <Plus className="size-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lead Adult / Primary Contact Form */}
              <div className="space-y-4 rounded-2xl border border-slate-200 p-4 sm:p-5 dark:border-slate-750">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <User className="size-4 text-blue-600 dark:text-blue-400" />
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Lead Adult / Contact Details
                    </h3>
                  </div>
                  <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                    Primary Contact
                  </span>
                </div>

                <div className="grid gap-3 sm:grid-cols-[100px_1fr_1fr]">
                  {/* Title */}
                  <div>
                    <label className="block mb-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Title
                    </label>
                    <select
                      value={leadTitle}
                      onChange={(e) => setLeadTitle(e.target.value)}
                      className="h-10 w-full rounded-xl border border-slate-200 bg-white px-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-850 dark:text-slate-100"
                    >
                      {TITLES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* First Name */}
                  <div>
                    <label className="block mb-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
                      First Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. John"
                      value={leadFirstName}
                      aria-invalid={Boolean(errors.leadFirstName)}
                      onChange={(e) => {
                        setLeadFirstName(e.target.value);
                        setErrors((prev) => {
                          const next = { ...prev };
                          delete next.leadFirstName;
                          return next;
                        });
                      }}
                      className={`h-10 w-full rounded-xl border px-3 text-sm text-slate-900 outline-none transition focus:ring-2 dark:bg-slate-850 dark:text-slate-100 ${errors.leadFirstName
                        ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/20"
                        : "border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 dark:border-slate-700"
                        }`}
                    />
                    {errors.leadFirstName ? (
                      <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">{errors.leadFirstName}</p>
                    ) : null}
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className="block mb-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Last Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Doe"
                      value={leadLastName}
                      aria-invalid={Boolean(errors.leadLastName)}
                      onChange={(e) => {
                        setLeadLastName(e.target.value);
                        setErrors((prev) => {
                          const next = { ...prev };
                          delete next.leadLastName;
                          return next;
                        });
                      }}
                      className={`h-10 w-full rounded-xl border px-3 text-sm text-slate-900 outline-none transition focus:ring-2 dark:bg-slate-850 dark:text-slate-100 ${errors.leadLastName
                        ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/20"
                        : "border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 dark:border-slate-700"
                        }`}
                    />
                    {errors.leadLastName ? (
                      <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">{errors.leadLastName}</p>
                    ) : null}
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {/* Email */}
                  <div>
                    <label className="block mb-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                        <Mail className="size-4" />
                      </div>
                      <input
                        type="email"
                        placeholder="john@example.com"
                        value={leadEmail}
                        aria-invalid={Boolean(errors.leadEmail)}
                        onChange={(e) => {
                          setLeadEmail(e.target.value);
                          setErrors((prev) => {
                            const next = { ...prev };
                            delete next.leadEmail;
                            return next;
                          });
                        }}
                        className={`h-10 w-full rounded-xl border pl-9 pr-3 text-sm text-slate-900 outline-none transition focus:ring-2 dark:bg-slate-850 dark:text-slate-100 ${errors.leadEmail
                          ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/20"
                          : "border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 dark:border-slate-700"
                          }`}
                      />
                    </div>
                    {errors.leadEmail ? (
                      <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">{errors.leadEmail}</p>
                    ) : null}
                  </div>

                  {/* Mobile Number with Country Code */}
                  <div>
                    <label className="block mb-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Mobile Number <span className="text-rose-500">*</span>
                    </label>
                    <div
                      className={`flex h-10 w-full overflow-hidden rounded-xl border transition focus-within:ring-2 dark:bg-slate-850 ${errors.leadMobile
                        ? "border-rose-400 focus-within:border-rose-500 focus-within:ring-rose-500/20"
                        : "border-slate-200 focus-within:border-blue-500 focus-within:ring-blue-500/20 dark:border-slate-700"
                        }`}
                    >
                      <input
                        type="text"
                        placeholder="+266"
                        value={leadCountryCode}
                        onChange={(e) => {
                          let code = e.target.value.replace(/[^\d+]/g, "").slice(0, 5);
                          if (code && !code.startsWith("+")) code = `+${code}`;
                          setLeadCountryCode(code);
                        }}
                        className="w-16 shrink-0 border-r border-slate-200 bg-slate-50/60 px-2 text-center text-xs font-semibold text-slate-800 outline-none dark:border-slate-700 dark:bg-slate-800/40 dark:text-slate-100"
                      />
                      <input
                        type="tel"
                        placeholder="e.g. 50000000"
                        value={leadMobile}
                        aria-invalid={Boolean(errors.leadMobile)}
                        onChange={(e) => {
                          setLeadMobile(e.target.value.replace(/\D/g, "").slice(0, 15));
                          setErrors((prev) => {
                            const next = { ...prev };
                            delete next.leadMobile;
                            return next;
                          });
                        }}
                        className="min-w-0 flex-1 border-0 bg-transparent px-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-slate-100"
                      />
                    </div>
                    {errors.leadMobile ? (
                      <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">{errors.leadMobile}</p>
                    ) : null}
                  </div>
                </div>
              </div>

              {/* Additional Adults Section (if adultCount > 1) */}
              {additionalAdults.length > 0 ? (
                <div className="space-y-3 rounded-2xl border border-slate-200 p-4 dark:border-slate-750">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Additional Adult Details ({additionalAdults.length})
                  </h3>
                  <div className="space-y-2.5">
                    {additionalAdults.map((adult, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-[80px_1fr_1fr] gap-2.5 rounded-xl bg-slate-50/70 p-2.5 dark:bg-slate-800/40"
                      >
                        <select
                          value={adult.title}
                          onChange={(e) => {
                            const val = e.target.value;
                            setAdditionalAdults((prev) => {
                              const updated = [...prev];
                              updated[index] = { ...updated[index], title: val };
                              return updated;
                            });
                          }}
                          className="h-9 rounded-lg border border-slate-200 bg-white px-2 text-xs font-medium text-slate-800 outline-none dark:border-slate-700 dark:bg-slate-850 dark:text-slate-100"
                        >
                          {TITLES.map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                        <input
                          type="text"
                          placeholder={`Adult ${index + 2} First Name`}
                          value={adult.firstName}
                          onChange={(e) => {
                            const val = e.target.value;
                            setAdditionalAdults((prev) => {
                              const updated = [...prev];
                              updated[index] = { ...updated[index], firstName: val };
                              return updated;
                            });
                          }}
                          className="h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-xs text-slate-900 outline-none placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-850 dark:text-slate-100"
                        />
                        <input
                          type="text"
                          placeholder="Last Name"
                          value={adult.lastName}
                          onChange={(e) => {
                            const val = e.target.value;
                            setAdditionalAdults((prev) => {
                              const updated = [...prev];
                              updated[index] = { ...updated[index], lastName: val };
                              return updated;
                            });
                          }}
                          className="h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-xs text-slate-900 outline-none placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-850 dark:text-slate-100"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* Child Details Section (if childCount > 0) */}
              {children.length > 0 ? (
                <div className="space-y-3 rounded-2xl border border-blue-200 bg-blue-50/30 p-4 dark:border-blue-500/20 dark:bg-blue-950/20">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-blue-900 dark:text-blue-200">
                      Child Details ({children.length})
                    </h3>
                    <span className="text-[11px] text-blue-600 dark:text-blue-300">
                      Age is required for accurate quote
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {children.map((child, index) => {
                      const childAgeErr = errors[`childAge_${index}`];
                      return (
                        <div
                          key={index}
                          className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_130px] gap-2.5 rounded-xl bg-white p-3 shadow-2xs border border-blue-100 dark:bg-slate-800 dark:border-slate-700"
                        >
                          <input
                            type="text"
                            placeholder={`Child ${index + 1} First Name (Optional)`}
                            value={child.firstName}
                            onChange={(e) => {
                              const val = e.target.value;
                              setChildren((prev) => {
                                const updated = [...prev];
                                updated[index] = { ...updated[index], firstName: val };
                                return updated;
                              });
                            }}
                            className="h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-xs text-slate-900 outline-none placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-850 dark:text-slate-100"
                          />
                          <input
                            type="text"
                            placeholder="Last Name (Optional)"
                            value={child.lastName}
                            onChange={(e) => {
                              const val = e.target.value;
                              setChildren((prev) => {
                                const updated = [...prev];
                                updated[index] = { ...updated[index], lastName: val };
                                return updated;
                              });
                            }}
                            className="h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-xs text-slate-900 outline-none placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-850 dark:text-slate-100"
                          />
                          <div>
                            <select
                              value={child.age}
                              aria-invalid={Boolean(childAgeErr)}
                              onChange={(e) => {
                                const val = e.target.value === "" ? "" : Number(e.target.value);
                                setChildren((prev) => {
                                  const updated = [...prev];
                                  updated[index] = { ...updated[index], age: val };
                                  return updated;
                                });
                                setErrors((prev) => {
                                  const next = { ...prev };
                                  delete next[`childAge_${index}`];
                                  return next;
                                });
                              }}
                              className={`h-9 w-full rounded-lg border px-2.5 text-xs font-semibold outline-none transition dark:bg-slate-850 dark:text-slate-100 ${childAgeErr
                                ? "border-rose-400 text-rose-700 focus:border-rose-500 focus:ring-rose-500/20"
                                : "border-slate-200 text-slate-900 focus:border-blue-500 dark:border-slate-700"
                                }`}
                            >
                              <option value="" disabled>
                                Select Age *
                              </option>
                              {Array.from({ length: 16 }, (_, i) => i + 2).map((a) => (
                                <option key={a} value={a}>
                                  {a} years old
                                </option>
                              ))}
                            </select>
                            {childAgeErr ? (
                              <p className="mt-1 text-[11px] font-medium text-rose-600 dark:text-rose-400">
                                {childAgeErr}
                              </p>
                            ) : null}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : null}

              {/* Infant Details Section (if infantCount > 0) */}
              {infants.length > 0 ? (
                <div className="space-y-3 rounded-2xl border border-slate-200 p-4 dark:border-slate-750">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Infant Details ({infants.length})
                  </h3>
                  <div className="space-y-2">
                    {infants.map((infant, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-1 sm:grid-cols-[1fr_120px] gap-2.5 rounded-xl bg-slate-50/70 p-2.5 dark:bg-slate-800/40"
                      >
                        <input
                          type="text"
                          placeholder={`Infant ${index + 1} Name (Optional)`}
                          value={infant.firstName}
                          onChange={(e) => {
                            const val = e.target.value;
                            setInfants((prev) => {
                              const updated = [...prev];
                              updated[index] = { ...updated[index], firstName: val };
                              return updated;
                            });
                          }}
                          className="h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-xs text-slate-900 outline-none placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-850 dark:text-slate-100"
                        />
                        <select
                          value={infant.age}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setInfants((prev) => {
                              const updated = [...prev];
                              updated[index] = { ...updated[index], age: val };
                              return updated;
                            });
                          }}
                          className="h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-850 dark:text-slate-100"
                        >
                          <option value={0}>Under 1 yr</option>
                          <option value={1}>1 year old</option>
                          <option value={2}>2 years old</option>
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* Message / Custom Inquiries */}
              <div className="space-y-2">
                {/* <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Preferences / Custom Requirements (Optional)
                  </label>
                  <span className="text-[11px] text-slate-400">{message.length}/500</span>
                </div> */}

                {/* Quick Topic Chips */}
                {/* <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {QUICK_TOPICS.map((topic) => (
                    <button
                      key={topic}
                      type="button"
                      onClick={() => handleTopicClick(topic)}
                      className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 shadow-2xs transition hover:border-blue-300 hover:bg-blue-50/70 hover:text-blue-700 active:scale-95 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-blue-500/40 dark:hover:bg-blue-950/40 dark:hover:text-blue-300"
                    >
                      + {topic}
                    </button>
                  ))}
                </div> */}

                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  maxLength={500}
                  placeholder="e.g. We need flight assistance, connecting hotel rooms, dietary preferences, or custom dates..."
                  className="mt-1.5 w-full resize-none rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 transition outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-850 dark:text-slate-100 dark:placeholder:text-slate-500"
                />
              </div>

              {/* Trust assurance */}
              <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3.5 py-2.5 text-xs text-slate-500 dark:bg-slate-800/40 dark:text-slate-400">
                <Clock className="size-4 shrink-0 text-blue-600 dark:text-blue-400" />
                <span>No advance payment needed to request a quote. The agency usually replies within 2-4 hours.</span>
              </div>

              {quoteError ? (
                <div className="flex items-center gap-2 rounded-xl bg-rose-50 p-3 text-xs text-rose-700 dark:bg-rose-950/50 dark:text-rose-300">
                  <AlertCircle className="size-4 shrink-0" />
                  <span>{quoteError}</span>
                </div>
              ) : null}
            </div>

            {/* Modal Actions Footer */}
            <div className="shrink-0 flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/80 px-6 py-4 dark:border-slate-800 dark:bg-slate-900/90">
              <button
                type="button"
                onClick={onClose}
                disabled={quoteMutation.isPending}
                className="h-11 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50 active:scale-[0.99] disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={quoteMutation.isPending}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 text-sm font-bold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {quoteMutation.isPending ? (
                  <Loader2 className="size-4.5 animate-spin" />
                ) : (
                  <Send className="size-4" />
                )}
                <span>{quoteMutation.isPending ? "Submitting Quote…" : "Submit Quote Request"}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>,
    document.body
  );
}
