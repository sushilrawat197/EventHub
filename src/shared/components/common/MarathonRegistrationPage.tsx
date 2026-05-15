// TODO: TEMP EVENT-39 FLOW - remove this page once marathon registration flow is retired.
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  FaBuilding,
  FaEnvelope,
  FaIdCard,
  FaMapMarkedAlt,
  FaMobileAlt,
  FaNotesMedical,
  FaRunning,
  FaVenusMars,
  FaShieldAlt,
  FaTshirt,
  FaUser,
  FaUserFriends,
  FaUserMd,
} from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import { useAppDispatch, useAppSelector } from "../../../app/store/hooks";
import {
  getActiveCorporates,
  getMarathonRegistrationByUserId,
  submitMarathonRegistration,
  MARATHON_DISTRICT_OPTIONS,
  type ActiveCorporate,
  type MarathonRegistrationDetails,
  type MarathonRegistrationPayload,
} from "../../../features/booking/api/marathonRegistration";
import {
  getOrderDetails,
  type CategorySelection,
} from "../../../features/booking/api/ticketCategory";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarDays, ChevronDown } from "lucide-react";
import { SPECIAL_EVENT_ID, SPECIAL_MARATHON_REGISTRATION_STASH_KEY } from "@/constants/eventGates";

type MarathonGender = "" | "Male" | "Female" | "Other";

type MarathonRaceCategory =
  | ""
  | "3 KM"
  | "5 KM"
  | "10 KM"
  | "Half Marathon"
  | "Full Marathon";

interface ParticipantFormData {
  participantType: "CORPORATE" | "INDIVIDUAL";
  corporateId: number | null;
  gender: MarathonGender;
  raceCategory: MarathonRaceCategory;
  name: string;
  surname: string;
  dateOfBirth: string;
  identityType: "id" | "passport";
  identityValue: string;
  email: string;
  cellNumber: string;
  medicalCondition: "" | "YES" | "NO";
  medicalConditionDetails: string;
  district: string;
  runningClub: string;
  emergencyContactName: string;
  emergencyNumber: string;
  shirtSize: "XS" | "S" | "M" | "L" | "XL" | "XXL" | "";
  disclaimerAccepted: boolean;
}

type ParticipantFormErrors = Partial<Record<keyof ParticipantFormData, string>>;

const INITIAL_FORM: ParticipantFormData = {
  participantType: "INDIVIDUAL",
  corporateId: null,
  gender: "",
  raceCategory: "",
  name: "",
  surname: "",
  dateOfBirth: "",
  identityType: "id",
  identityValue: "",
  email: "",
  cellNumber: "",
  medicalCondition: "",
  medicalConditionDetails: "",
  district: "",
  runningClub: "",
  emergencyContactName: "",
  emergencyNumber: "",
  shirtSize: "",
  disclaimerAccepted: false,
};

type MarathonLocationState = {
  categories?: CategorySelection[];
  marathonCorporateSuccess?: boolean;
  marathonRegistrationSuccess?: boolean;
  marathonRegistrationParticipantType?: "INDIVIDUAL" | "CORPORATE";
  participantType?: "INDIVIDUAL" | "CORPORATE";
};

const SHIRT_SIZE_OPTIONS: Exclude<ParticipantFormData["shirtSize"], "">[] = [
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
];

const PARTICIPANT_TYPE_LABEL: Record<ParticipantFormData["participantType"], string> = {
  INDIVIDUAL: "Individual",
  CORPORATE: "Corporate",
};

const IDENTITY_TYPE_LABEL: Record<ParticipantFormData["identityType"], string> = {
  id: "LS Citizen ID",
  passport: "Passport",
};

const MEDICAL_CONDITION_LABEL: Record<Exclude<ParticipantFormData["medicalCondition"], "">, string> = {
  YES: "Yes",
  NO: "No",
};

const GENDER_OPTIONS: Exclude<MarathonGender, "">[] = ["Male", "Female", "Other"];

const RACE_CATEGORY_OPTIONS: Exclude<MarathonRaceCategory, "">[] = [
  "3 KM",
  "5 KM",
  "10 KM",
  "Half Marathon",
  "Full Marathon",
];

function isMarathonRaceCategory(value: string): value is Exclude<MarathonRaceCategory, ""> {
  return (RACE_CATEGORY_OPTIONS as string[]).includes(value);
}

/** API expects MALE | FEMALE | OTHER; form UI uses title case. */
function marathonGenderFromApi(raw: string | undefined): MarathonGender {
  const key = (raw ?? "").trim().toLowerCase();
  if (key === "male") return "Male";
  if (key === "female") return "Female";
  if (key === "other") return "Other";
  return "";
}

function parseIsoDateLocal(iso: string): Date | undefined {
  if (!iso.trim()) return undefined;
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return undefined;
  const date = new Date(y, m - 1, d);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function formatIsoLocal(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function formatDobDisplay(iso: string): string {
  const d = parseIsoDateLocal(iso);
  if (!d) return "";
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function SectionCard({
  title,
  subtitle,
  icon,
  iconBgClass,
  children,
  className,
}: {
  title: string;
  subtitle?: string;
  icon: ReactNode;
  iconBgClass: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-xl border border-gray-100 bg-white/95 shadow-sm transition-all hover:shadow-md",
        className
      )}
    >
      <div className="flex shrink-0 items-center gap-3 border-b border-gray-100 bg-slate-50/50 px-4 py-3">
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm shadow-sm ${iconBgClass}`}
        >
          {icon}
        </div>
        <div className="min-w-0 flex-1 leading-tight">
          <h2 className="text-sm font-bold text-gray-800">{title}</h2>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4">{children}</div>
    </section>
  );
}

export default function MarathonRegistrationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams<{ contentName?: string; eventId?: string; bookingId?: string }>();
  const dispatch = useAppDispatch();

  const pathname = location.pathname;
  const isOrderContext = /\/order\/[^/]+\/marathon-registration/.test(pathname);
  /** Ticket-flow marathon (standalone URL, no BookingFlow chrome); legacy `/booking/marathon-registration` redirects here */
  const isStandaloneMarathonRegistration =
    /^\/events\/[^/]+\/[^/]+\/marathon-registration\/?$/.test(pathname);
  const isBookingContext =
    /\/booking\/marathon-registration/.test(pathname) || isStandaloneMarathonRegistration;

  const userId = useAppSelector((state) => state.user.user?.userId);
  const confirmBookingDetails = useAppSelector((state) => state.confirmBooking.booking);

  const bookingIdParam = params.bookingId ? Number(params.bookingId) : null;
  const eventIdParam = params.eventId ? Number(params.eventId) : null;
  const isSpecialEvent =
    eventIdParam !== null && !Number.isNaN(eventIdParam) && eventIdParam === SPECIAL_EVENT_ID;
  const contentName = params.contentName ?? "";

  const locState = (location.state || {}) as MarathonLocationState;
  const categoriesFromState = locState.categories;
  const participantTypeFromLocation = locState.participantType;

  const readOnlyWhenExisting = isOrderContext;

  const [participantForm, setParticipantForm] = useState<ParticipantFormData>(INITIAL_FORM);
  const [participantErrors, setParticipantErrors] = useState<ParticipantFormErrors>({});
  const [dobPopoverOpen, setDobPopoverOpen] = useState(false);
  const [submittingParticipant, setSubmittingParticipant] = useState(false);
  const [activeCorporates, setActiveCorporates] = useState<ActiveCorporate[]>([]);
  const [loadingCorporates, setLoadingCorporates] = useState(false);
  const [registrationData, setRegistrationData] = useState<MarathonRegistrationDetails | null>(null);
  const [loadingRegistration, setLoadingRegistration] = useState(isOrderContext);
  const [orderBootstrapped, setOrderBootstrapped] = useState(false);

  const isExistingRegistration = registrationData !== null;

  const resolvedEventId = isOrderContext
    ? Number(confirmBookingDetails?.event?.eventId)
    : eventIdParam;
  const resolvedTicketCategoryId = isOrderContext
    ? (confirmBookingDetails?.tickets?.[0] as { categoryId?: number } | undefined)?.categoryId ?? null
    : categoriesFromState?.[0]?.categoryId ?? null;
  const resolvedNoOfTicket = isOrderContext
    ? confirmBookingDetails?.tickets?.length ?? null
    : categoriesFromState?.reduce((t, c) => t + c.count, 0) ?? null;

  /**
   * No ticket categories in router state: either restore post-login stash (special event)
   * or send user back to ticket selection. Kept in one effect so we never clear sessionStorage
   * and then let a second effect redirect to tickets before state is restored.
   */
  useEffect(() => {
    if (!isBookingContext) return;
    if (categoriesFromState && categoriesFromState.length > 0) return;

    if (isSpecialEvent) {
      let raw: string | null = null;
      try {
        raw = sessionStorage.getItem(SPECIAL_MARATHON_REGISTRATION_STASH_KEY);
      } catch {
        /* ignore */
      }
      if (raw) {
        const expectedPath = `/events/${contentName}/${eventIdParam}/marathon-registration`;
        let restored = false;
        try {
          const parsed = JSON.parse(raw) as {
            categories?: CategorySelection[];
            participantType?: "INDIVIDUAL" | "CORPORATE";
            returnTo?: string;
          };
          if (
            parsed.returnTo === expectedPath &&
            Array.isArray(parsed.categories) &&
            parsed.categories.length > 0
          ) {
            try {
              sessionStorage.removeItem(SPECIAL_MARATHON_REGISTRATION_STASH_KEY);
            } catch {
              /* ignore */
            }
            navigate(location.pathname, {
              replace: true,
              state: {
                categories: parsed.categories,
                participantType: parsed.participantType ?? "INDIVIDUAL",
              },
            });
            restored = true;
          }
        } catch {
          /* invalid JSON */
        }
        if (!restored) {
          try {
            sessionStorage.removeItem(SPECIAL_MARATHON_REGISTRATION_STASH_KEY);
          } catch {
            /* ignore */
          }
        } else {
          return;
        }
      }
    }

    navigate(`/events/${contentName}/${eventIdParam}/booking/ticket`, { replace: true });
  }, [
    isBookingContext,
    categoriesFromState,
    navigate,
    contentName,
    eventIdParam,
    isSpecialEvent,
    location.pathname,
  ]);

  useEffect(() => {
    if (!isOrderContext || !bookingIdParam || Number.isNaN(bookingIdParam)) return;

    let mounted = true;
    (async () => {
      await dispatch(getOrderDetails(bookingIdParam, navigate, { redirectToOrder: false }));
      if (!mounted) return;
      setLoadingRegistration(true);
      const response = await getMarathonRegistrationByUserId(bookingIdParam);
      if (!mounted) return;
      setLoadingRegistration(false);
      setOrderBootstrapped(true);
      if (!response.success) {
        toast.error(response.message);
        setRegistrationData(null);
        return;
      }
      setRegistrationData(response.data);
    })();

    return () => {
      mounted = false;
    };
  }, [isOrderContext, bookingIdParam, dispatch, navigate]);

  useEffect(() => {
    setParticipantErrors({});
    if (!registrationData) {
      setParticipantForm(INITIAL_FORM);
      return;
    }
    const apiRaceCategory = registrationData.raceCategory ?? "";
    setParticipantForm({
      participantType: registrationData.participantType || "INDIVIDUAL",
      corporateId: registrationData.corporateId ?? null,
      gender: marathonGenderFromApi(registrationData.gender),
      raceCategory: isMarathonRaceCategory(apiRaceCategory) ? apiRaceCategory : "",
      name: registrationData.name || "",
      surname: registrationData.surname || "",
      dateOfBirth: registrationData.dateOfBirth || "",
      identityType: registrationData.identityType === "LS_CITIZEN" ? "id" : "passport",
      identityValue:
        registrationData.identityType === "LS_CITIZEN"
          ? registrationData.idNumber || ""
          : registrationData.passportNumber || "",
      email: registrationData.emailAddress || "",
      cellNumber: registrationData.cellNumber || "",
      medicalCondition:
        registrationData.medicalCondition === "YES" ||
        registrationData.medicalCondition === "UNFIT"
          ? "YES"
          : registrationData.medicalCondition === "NO" ||
              registrationData.medicalCondition === "FIT"
            ? "NO"
            : "",
      medicalConditionDetails: registrationData.medicalConditionDetails || "",
      district: registrationData.district || "",
      runningClub: registrationData.runningClub || "",
      emergencyContactName: registrationData.emergencyContactName || "",
      emergencyNumber: registrationData.emergencyNumber || "",
      shirtSize:
        registrationData.shirtSize ||
        registrationData.tShirtSize ||
        registrationData.tshirtSize ||
        "",
      disclaimerAccepted: !!registrationData.disclaimerAccepted,
    });
  }, [registrationData]);

  useEffect(() => {
    if (registrationData) return;
    const pt = participantTypeFromLocation;
    if (pt !== "CORPORATE" && pt !== "INDIVIDUAL") return;
    setParticipantForm((prev) => {
      if (prev.participantType === pt && (pt === "INDIVIDUAL" ? prev.corporateId === null : true)) {
        return prev;
      }
      return {
        ...prev,
        participantType: pt,
        corporateId: pt === "INDIVIDUAL" ? null : prev.corporateId,
      };
    });
  }, [registrationData, participantTypeFromLocation, location.key]);

  useEffect(() => {
    if (participantForm.participantType !== "CORPORATE") return;
    let isMounted = true;

    const fetchCorporates = async () => {
      setLoadingCorporates(true);
      const response = await getActiveCorporates();
      if (isMounted) {
        setLoadingCorporates(false);
        if (!response.success) {
          toast.error(response.message);
          setActiveCorporates([]);
          return;
        }
        setActiveCorporates(response.data);
      }
    };

    fetchCorporates();

    return () => {
      isMounted = false;
    };
  }, [participantForm.participantType]);

  const handleBack = () => {
    if (isOrderContext && bookingIdParam) {
      navigate(`/order/${bookingIdParam}`);
      return;
    }
    navigate(`/events/${contentName}/${eventIdParam}/booking/ticket`);
  };

  const handleParticipantChange = (key: keyof ParticipantFormData, value: string | boolean | number | null) => {
    setParticipantForm((prev) => ({
      ...prev,
      [key]: value,
    }));
    setParticipantErrors((prev) => {
      if (!prev[key]) return prev;
      return { ...prev, [key]: "" };
    });
  };

  const validateParticipantForm = (data: ParticipantFormData) => {
    const errors: ParticipantFormErrors = {};
    const nameRegex = /^[A-Za-z\s'-]{2,}$/;
    const lsPhoneRegex = /^\d{8}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const idRegex = /^\d{6,20}$/;
    const passportRegex = /^[A-Za-z0-9]{6,20}$/;

    if (!data.name.trim()) errors.name = "Name is required.";
    else if (!nameRegex.test(data.name.trim())) errors.name = "Enter a valid name.";
    
    if (!data.surname.trim()) errors.surname = "Surname is required.";
    else if (!nameRegex.test(data.surname.trim())) errors.surname = "Enter a valid surname.";

    if (!data.dateOfBirth.trim()) {
      errors.dateOfBirth = "Date of birth is required.";
    } else {
      const dob = parseIsoDateLocal(data.dateOfBirth);
      if (!dob) {
        errors.dateOfBirth = "Invalid date of birth.";
      } else {
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        if (dob > today) {
          errors.dateOfBirth = "Date cannot be in the future.";
        } else {
          let age = today.getFullYear() - dob.getFullYear();
          const m = today.getMonth() - dob.getMonth();
          if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
          if (age < 16) errors.dateOfBirth = "Participant must be at least 16 years old.";
          if (age > 120) errors.dateOfBirth = "Enter a valid date of birth.";
        }
      }
    }
    
    if (data.participantType === "CORPORATE" && !data.corporateId) {
      errors.corporateId = "Please select a corporate.";
    }

    if (!data.gender) errors.gender = "Please select gender.";
    if (!data.raceCategory) errors.raceCategory = "Please select a race category.";

    if (!data.identityValue.trim()) {
      errors.identityValue = data.identityType === "id" ? "ID number is required." : "Passport number is required.";
    } else if (data.identityType === "id" && !idRegex.test(data.identityValue.trim())) {
      errors.identityValue = "ID number must be 6-20 digits.";
    } else if (data.identityType === "passport" && !passportRegex.test(data.identityValue.trim())) {
      errors.identityValue = "Passport number must be 6-20 letters or digits.";
    }

    if (!data.email.trim()) errors.email = "Email address is required.";
    else if (!emailRegex.test(data.email.trim())) errors.email = "Enter a valid email address.";
    
    if (!data.cellNumber.trim()) errors.cellNumber = "Cell number is required.";
    else if (!lsPhoneRegex.test(data.cellNumber.trim())) errors.cellNumber = "Cell number must be 8 digits.";

    if (!data.medicalCondition) {
      errors.medicalCondition = "Please select Yes or No.";
    } else if (data.medicalCondition === "YES" && !data.medicalConditionDetails.trim()) {
      errors.medicalConditionDetails = "Please specify the medical condition.";
    }
    
    if (!data.district.trim()) errors.district = "Please select a district.";

    if (!data.emergencyContactName.trim()) {
      errors.emergencyContactName = "Emergency contact is required.";
    } else if (!nameRegex.test(data.emergencyContactName.trim())) {
      errors.emergencyContactName = "Enter a valid name.";
    }

    if (!data.emergencyNumber.trim()) {
      errors.emergencyNumber = "Emergency number is required.";
    } else if (!lsPhoneRegex.test(data.emergencyNumber.trim())) {
      errors.emergencyNumber = "Must be 8 digits.";
    }

    if (!data.shirtSize) errors.shirtSize = "Please select a T-shirt size.";
    if (!data.disclaimerAccepted) errors.disclaimerAccepted = "You must accept the disclaimer.";
    
    return errors;
  };

  const baseInputClass =
    "w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 shadow-sm transition-colors focus:bg-white focus:outline-none focus:ring-2 " +
    "[&:-webkit-autofill]:[-webkit-text-fill-color:#111827] [&:-webkit-autofill]:[-webkit-box-shadow:0_0_0_1000px_#f9fafb_inset] [&:-webkit-autofill]:[box-shadow:0_0_0_1000px_#f9fafb_inset] " +
    "[&:-webkit-autofill:hover]:[-webkit-box-shadow:0_0_0_1000px_#f9fafb_inset] [&:-webkit-autofill:hover]:[box-shadow:0_0_0_1000px_#f9fafb_inset] " +
    "[&:-webkit-autofill:focus]:[-webkit-box-shadow:0_0_0_1000px_#ffffff_inset] [&:-webkit-autofill:focus]:[box-shadow:0_0_0_1000px_#ffffff_inset]";
  const inputRing = (err?: string) => err ? "border-red-400 focus:ring-red-400" : "focus:border-blue-500 focus:ring-blue-500/20";
  const baseLabelClass = "mb-1 flex items-center gap-1.5 text-xs font-semibold text-gray-600";

  const handleParticipantSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errors = validateParticipantForm(participantForm);
    setParticipantErrors(errors);
    if (Object.keys(errors).length > 0) return;
    if (!resolvedEventId || !resolvedTicketCategoryId || !resolvedNoOfTicket) {
      toast.error("Missing event ticket details. Please reselect your tickets.");
      return;
    }

    const normalizePhoneNumber = (value: string) => {
      const digits = value.replace(/\D/g, "");
      if (digits.startsWith("266")) return `+${digits}`;
      if (digits.length === 8) return `+266${digits}`;
      return value.trim();
    };

    const registrationPayload: MarathonRegistrationPayload = {
      participantType: participantForm.participantType,
      corporateId: participantForm.participantType === "CORPORATE" ? participantForm.corporateId : null,
      ticketCategoryId: Number(resolvedTicketCategoryId),
      noOfTicket: Number(resolvedNoOfTicket),
      eventId: Number(resolvedEventId),
      gender: participantForm.gender.toUpperCase(),
      raceCategory: participantForm.raceCategory,
      name: participantForm.name.trim(),
      surname: participantForm.surname.trim(),
      identityType: participantForm.identityType === "id" ? "LS_CITIZEN" : "FOREIGN_NATIONAL",
      idNumber: participantForm.identityType === "id" ? participantForm.identityValue.trim() : null,
      passportNumber: participantForm.identityType === "passport" ? participantForm.identityValue.trim() : null,
      emailAddress: participantForm.email.trim(),
      cellNumber: normalizePhoneNumber(participantForm.cellNumber),
      district: participantForm.district.trim(),
      dateOfBirth: participantForm.dateOfBirth.trim(),
      medicalCondition: participantForm.medicalCondition as "YES" | "NO",
      medicalConditionDetails:
        participantForm.medicalCondition === "YES"
          ? participantForm.medicalConditionDetails.trim()
          : null,
      runningClub: participantForm.runningClub.trim(),
      emergencyContactName: participantForm.emergencyContactName.trim(),
      emergencyNumber: normalizePhoneNumber(participantForm.emergencyNumber),
      shirtSize: participantForm.shirtSize as "XS" | "S" | "M" | "L" | "XL" | "XXL",
      disclaimerAccepted: participantForm.disclaimerAccepted,
    };

    setSubmittingParticipant(true);
    const result = await submitMarathonRegistration(registrationPayload);
    setSubmittingParticipant(false);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    setParticipantForm(INITIAL_FORM);
    setParticipantErrors({});

    if (isBookingContext && categoriesFromState?.length) {
      navigate(`/events/${contentName}/${eventIdParam}/booking/ticket`, {
        replace: true,
        state: {
          marathonRegistrationSuccess: true,
          marathonRegistrationParticipantType: participantForm.participantType,
        },
      });
      return;
    }

    toast.success(result.message || "Registration submitted successfully.");
    if (isOrderContext && bookingIdParam) navigate(`/order/${bookingIdParam}`);
  };

  if (isBookingContext && (!categoriesFromState || categoriesFromState.length === 0)) return null;

  if (isOrderContext && (!orderBootstrapped || loadingRegistration)) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-gray-50/50 px-4 text-sm text-gray-500">
        Loading registration details…
      </div>
    );
  }

  if (isBookingContext && !userId && !isSpecialEvent) {
    return (
      <div className="min-h-[60vh] bg-gray-50/50 px-4 py-10 flex items-center justify-center">
        <div className="w-full max-w-sm rounded-2xl border border-amber-100 bg-white p-6 text-center shadow-lg">
          <FaUser className="mx-auto mb-3 text-3xl text-amber-500" />
          <p className="font-semibold text-gray-800">Sign in required</p>
          <p className="mt-1 text-xs text-gray-600">Log in to complete marathon registration.</p>
          <button
            type="button"
            onClick={handleBack}
            className="mt-5 inline-flex w-full justify-center items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <IoIosArrowBack /> Back to tickets
          </button>
        </div>
      </div>
    );
  }

  const formDisabled = isExistingRegistration && readOnlyWhenExisting;
  /** Standalone `/events/.../marathon-registration` lets users pick Individual vs Corporate on this form. */
  const participantTypeLocked = isBookingContext && !isStandaloneMarathonRegistration;

  return (
    <div
      className={cn(
        "bg-blue-50/50 pb-8 px-4 sm:px-6 md:px-8",
        isStandaloneMarathonRegistration ? "min-h-screen py-6" : "min-h-[calc(100vh-200px)] rounded-lg"
      )}
    >
      <div className="mx-auto w-full max-w-5xl py-4 sm:py-6">
       

        {/* Compact Hero Header */}
        <div className="relative mb-6 overflow-hidden rounded-xl bg-gradient-to-r from-blue-700 via-indigo-600 to-violet-700 p-4 text-white shadow-md">
          <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
          <div className="relative flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
              <FaRunning className="text-xl text-amber-300" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight sm:text-xl">Participant Registration</h1>
              <p className="text-xs text-blue-100">Please provide accurate details for race tracking.</p>
            </div>
          </div>
        </div>

         <button
          type="button"
          onClick={handleBack}
          className="group mb-4 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700"
        >
          <IoIosArrowBack className="text-sm transition-transform group-hover:-translate-x-0.5" />
          {isOrderContext ? "Back to booking" : "Back to ticket selection"}
        </button>

        <form onSubmit={handleParticipantSubmit} className="space-y-4">
          {isExistingRegistration && readOnlyWhenExisting && (
            <div className="flex items-center gap-2 rounded-lg border border-sky-200 bg-sky-50 px-3 py-2 text-xs text-sky-800">
              <FaShieldAlt className="shrink-0 text-sky-600" />
              <span>Registration already exists. Showing saved details.</span>
            </div>
          )}

          <fieldset disabled={formDisabled} className={cn("flex flex-col gap-4", formDisabled && "opacity-80")}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Participant Details Section */}
              <SectionCard
                title="Participant Details"
                icon={<FaUserFriends className="text-white" />}
                iconBgClass="bg-gradient-to-br from-violet-500 to-purple-600"
              >
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className={baseLabelClass}><FaUser className="text-emerald-500" /> Type</label>
                    {participantTypeLocked ? (
                      <div
                        className={cn(
                          baseInputClass,
                          "flex min-h-[2.5rem] cursor-default items-center text-gray-900"
                        )}
                      >
                        {PARTICIPANT_TYPE_LABEL[participantForm.participantType]}
                      </div>
                    ) : (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            className={cn(
                              baseInputClass,
                              "!h-auto min-h-[2.5rem] justify-between gap-2 font-normal text-gray-900 shadow-sm"
                            )}
                          >
                            <span>{PARTICIPANT_TYPE_LABEL[participantForm.participantType]}</span>
                            <ChevronDown className="size-4 shrink-0 opacity-60" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          className="min-w-[var(--radix-dropdown-menu-trigger-width)]"
                          align="start"
                        >
                          <DropdownMenuLabel className="text-xs font-semibold">
                            Participant type
                          </DropdownMenuLabel>
                          <DropdownMenuGroup>
                            <DropdownMenuItem
                              onSelect={() => {
                                handleParticipantChange("participantType", "INDIVIDUAL");
                                handleParticipantChange("corporateId", null);
                              }}
                            >
                              Individual
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onSelect={() =>
                                handleParticipantChange("participantType", "CORPORATE")
                              }
                            >
                              Corporate
                            </DropdownMenuItem>
                          </DropdownMenuGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                  {participantForm.participantType === "CORPORATE" && (
                    <div>
                      <label className={baseLabelClass}><FaBuilding className="text-orange-500" /> Corporate</label>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            disabled={loadingCorporates}
                            className={cn(
                              baseInputClass,
                              inputRing(participantErrors.corporateId),
                              "!h-auto min-h-[2.5rem] justify-between gap-2 font-normal shadow-sm",
                              loadingCorporates && "text-gray-500"
                            )}
                          >
                            <span
                              className={
                                participantForm.corporateId != null && !loadingCorporates
                                  ? "text-gray-900"
                                  : "text-gray-500"
                              }
                            >
                              {loadingCorporates
                                ? "Loading..."
                                : participantForm.corporateId != null
                                  ? activeCorporates.find(
                                      (c) => c.corporateId === participantForm.corporateId
                                    )?.corporateName ?? "Select corporate"
                                  : "Select corporate"}
                            </span>
                            <ChevronDown className="size-4 shrink-0 opacity-60" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          className="min-w-[var(--radix-dropdown-menu-trigger-width)] max-h-[min(280px,70vh)] overflow-y-auto"
                          align="start"
                        >
                          <DropdownMenuLabel className="text-xs font-semibold">
                            Corporate
                          </DropdownMenuLabel>
                          <DropdownMenuGroup>
                            <DropdownMenuItem
                              onSelect={() =>
                                handleParticipantChange("corporateId", null)
                              }
                            >
                              Select corporate
                            </DropdownMenuItem>
                            {activeCorporates.length === 0 && !loadingCorporates ? (
                              <DropdownMenuItem disabled>
                                No corporates available
                              </DropdownMenuItem>
                            ) : (
                              activeCorporates.map((c) => (
                                <DropdownMenuItem
                                  key={c.corporateId}
                                  onSelect={() =>
                                    handleParticipantChange("corporateId", c.corporateId)
                                  }
                                >
                                  {c.corporateName}
                                </DropdownMenuItem>
                              ))
                            )}
                          </DropdownMenuGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      {participantErrors.corporateId && <p className="mt-1 text-[10px] text-red-600">{participantErrors.corporateId}</p>}
                    </div>
                  )}
                  <div>
                    <label className={baseLabelClass}>
                      <FaVenusMars className="text-pink-500" /> Gender
                    </label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          className={cn(
                            baseInputClass,
                            inputRing(participantErrors.gender),
                            "!h-auto min-h-[2.5rem] justify-between gap-2 font-normal text-gray-900 shadow-sm"
                          )}
                        >
                          <span className={participantForm.gender ? "text-gray-900" : "text-gray-500"}>
                            {participantForm.gender || "Select gender"}
                          </span>
                          <ChevronDown className="size-4 shrink-0 opacity-60" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        className="min-w-[var(--radix-dropdown-menu-trigger-width)]"
                        align="start"
                      >
                        <DropdownMenuLabel className="text-xs font-semibold">Gender</DropdownMenuLabel>
                        <DropdownMenuGroup>
                          <DropdownMenuItem onSelect={() => handleParticipantChange("gender", "")}>
                            Select gender
                          </DropdownMenuItem>
                          {GENDER_OPTIONS.map((opt) => (
                            <DropdownMenuItem
                              key={opt}
                              onSelect={() => handleParticipantChange("gender", opt)}
                            >
                              {opt}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    {participantErrors.gender && (
                      <p className="mt-1 text-[10px] text-red-600">{participantErrors.gender}</p>
                    )}
                  </div>
                  <div>
                    <label className={baseLabelClass}>
                      <FaRunning className="text-amber-600" /> Race category
                    </label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          className={cn(
                            baseInputClass,
                            inputRing(participantErrors.raceCategory),
                            "!h-auto min-h-[2.5rem] justify-between gap-2 font-normal text-gray-900 shadow-sm"
                          )}
                        >
                          <span className={participantForm.raceCategory ? "text-gray-900" : "text-gray-500"}>
                            {participantForm.raceCategory || "Select race category"}
                          </span>
                          <ChevronDown className="size-4 shrink-0 opacity-60" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        className="min-w-[var(--radix-dropdown-menu-trigger-width)] max-h-[min(320px,70vh)] overflow-y-auto"
                        align="start"
                      >
                        <DropdownMenuLabel className="text-xs font-semibold">Race category</DropdownMenuLabel>
                        <DropdownMenuGroup>
                          <DropdownMenuItem onSelect={() => handleParticipantChange("raceCategory", "")}>
                            Select race category
                          </DropdownMenuItem>
                          {RACE_CATEGORY_OPTIONS.map((opt) => (
                            <DropdownMenuItem
                              key={opt}
                              onSelect={() => handleParticipantChange("raceCategory", opt)}
                            >
                              {opt}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    {participantErrors.raceCategory && (
                      <p className="mt-1 text-[10px] text-red-600">{participantErrors.raceCategory}</p>
                    )}
                  </div>
                  <div className="sm:col-span-2">
                    <label className={baseLabelClass}><FaNotesMedical className="text-violet-500" /> Do you have any medical condition(s) we should be aware of?</label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          className={cn(
                            baseInputClass,
                            inputRing(participantErrors.medicalCondition),
                            "!h-auto min-h-[2.5rem] w-full justify-between gap-2 font-normal shadow-sm"
                          )}
                        >
                          <span
                            className={
                              participantForm.medicalCondition ? "text-gray-900" : "text-gray-500"
                            }
                          >
                            {participantForm.medicalCondition
                              ? MEDICAL_CONDITION_LABEL[participantForm.medicalCondition]
                              : "Select Yes or No"}
                          </span>
                          <ChevronDown className="size-4 shrink-0 opacity-60" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        className="min-w-[var(--radix-dropdown-menu-trigger-width)]"
                        align="start"
                      >
                        <DropdownMenuLabel className="text-xs font-semibold">
                          Medical condition
                        </DropdownMenuLabel>
                        <DropdownMenuGroup>
                          <DropdownMenuItem
                            onSelect={() => {
                              handleParticipantChange("medicalCondition", "");
                              handleParticipantChange("medicalConditionDetails", "");
                            }}
                          >
                            Select Yes or No
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={() => {
                              handleParticipantChange("medicalCondition", "YES");
                            }}
                          >
                            Yes
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={() => {
                              handleParticipantChange("medicalCondition", "NO");
                              handleParticipantChange("medicalConditionDetails", "");
                            }}
                          >
                            No
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    {participantErrors.medicalCondition && (
                      <p className="mt-1 text-[10px] text-red-600">{participantErrors.medicalCondition}</p>
                    )}
                    {participantForm.medicalCondition === "YES" && (
                      <div className="mt-3">
                        <label className={baseLabelClass}>If yes, please specify:</label>
                        <input
                          type="text"
                          value={participantForm.medicalConditionDetails}
                          onChange={(e) =>
                            handleParticipantChange("medicalConditionDetails", e.target.value)
                          }
                          className={cn(
                            baseInputClass,
                            inputRing(participantErrors.medicalConditionDetails)
                          )}
                          placeholder="Enter medical condition details"
                        />
                        {participantErrors.medicalConditionDetails && (
                          <p className="mt-1 text-[10px] text-red-600">
                            {participantErrors.medicalConditionDetails}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </SectionCard>

              {/* Identity & Name Section */}
              <SectionCard
                title="Identity & Name"
                icon={<FaIdCard className="text-white" />}
                iconBgClass="bg-gradient-to-br from-cyan-500 to-blue-600"
              >
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className={baseLabelClass}>First Name</label>
                    <input
                      type="text"
                      value={participantForm.name}
                      onChange={(e) => handleParticipantChange("name", e.target.value)}
                      className={cn(baseInputClass, inputRing(participantErrors.name))}
                    />
                    {participantErrors.name && <p className="mt-1 text-[10px] text-red-600">{participantErrors.name}</p>}
                  </div>
                  <div>
                    <label className={baseLabelClass}>Surname</label>
                    <input
                      type="text"
                      value={participantForm.surname}
                      onChange={(e) => handleParticipantChange("surname", e.target.value)}
                      className={cn(baseInputClass, inputRing(participantErrors.surname))}
                    />
                    {participantErrors.surname && <p className="mt-1 text-[10px] text-red-600">{participantErrors.surname}</p>}
                  </div>
                  <div>
                    <label className={baseLabelClass}><FaIdCard className="text-indigo-500" /> ID Type</label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          className={cn(
                            baseInputClass,
                            "!h-auto min-h-[2.5rem] justify-between gap-2 font-normal text-gray-900 shadow-sm"
                          )}
                        >
                          <span>{IDENTITY_TYPE_LABEL[participantForm.identityType]}</span>
                          <ChevronDown className="size-4 shrink-0 opacity-60" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        className="min-w-[var(--radix-dropdown-menu-trigger-width)]"
                        align="start"
                      >
                        <DropdownMenuLabel className="text-xs font-semibold">
                          ID type
                        </DropdownMenuLabel>
                        <DropdownMenuGroup>
                          <DropdownMenuItem
                            onSelect={() =>
                              handleParticipantChange("identityType", "id")
                            }
                          >
                            LS Citizen ID
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={() =>
                              handleParticipantChange("identityType", "passport")
                            }
                          >
                            Passport
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div>
                    <label className={baseLabelClass}>{participantForm.identityType === "id" ? "ID Number" : "Passport Number"}</label>
                    <input
                      type="text"
                      value={participantForm.identityValue}
                      onChange={(e) => handleParticipantChange("identityValue", e.target.value)}
                      className={cn(baseInputClass, inputRing(participantErrors.identityValue))}
                    />
                    {participantErrors.identityValue && <p className="mt-1 text-[10px] text-red-600">{participantErrors.identityValue}</p>}
                  </div>
                  <div className="sm:col-span-2">
                    <label className={baseLabelClass}>
                      <CalendarDays className="size-3.5 text-sky-600" /> Date of birth
                    </label>
                    <Popover open={dobPopoverOpen} onOpenChange={setDobPopoverOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          className={cn(
                            baseInputClass,
                            inputRing(participantErrors.dateOfBirth),
                            "!h-auto min-h-[2.5rem] w-full justify-between gap-2 font-normal shadow-sm"
                          )}
                        >
                          <span
                            className={
                              participantForm.dateOfBirth ? "text-gray-900" : "text-gray-500"
                            }
                          >
                            {participantForm.dateOfBirth
                              ? formatDobDisplay(participantForm.dateOfBirth)
                              : "Pick date of birth"}
                          </span>
                          <CalendarDays className="size-4 shrink-0 opacity-60" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 shadow-lg" align="start">
                        <Calendar
                          mode="single"
                          selected={parseIsoDateLocal(participantForm.dateOfBirth)}
                          onSelect={(d) => {
                            handleParticipantChange("dateOfBirth", d ? formatIsoLocal(d) : "");
                            setDobPopoverOpen(false);
                          }}
                          className="rounded-lg border"
                          captionLayout="dropdown"
                          disabled={(date) => date > new Date()}
                          startMonth={new Date(1920, 0)}
                          endMonth={new Date()}
                          defaultMonth={
                            parseIsoDateLocal(participantForm.dateOfBirth) ?? new Date(2000, 0)
                          }
                        />
                      </PopoverContent>
                    </Popover>
                    {participantErrors.dateOfBirth && (
                      <p className="mt-1 text-[10px] text-red-600">{participantErrors.dateOfBirth}</p>
                    )}
                  </div>
                </div>
              </SectionCard>

              {/* Contact Section */}
              <SectionCard
                title="Contact Details"
                icon={<FaEnvelope className="text-white" />}
                iconBgClass="bg-gradient-to-br from-rose-500 to-pink-600"
              >
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className={baseLabelClass}><FaEnvelope className="text-rose-500" /> Email</label>
                    <input
                      type="email"
                      value={participantForm.email}
                      onChange={(e) => handleParticipantChange("email", e.target.value)}
                      className={cn(baseInputClass, inputRing(participantErrors.email))}
                    />
                    {participantErrors.email && <p className="mt-1 text-[10px] text-red-600">{participantErrors.email}</p>}
                  </div>
                  <div>
                    <label className={baseLabelClass}><FaMobileAlt className="text-teal-500" /> Cell Number</label>
                    <input
                      type="tel"
                      value={participantForm.cellNumber}
                      onChange={(e) => handleParticipantChange("cellNumber", e.target.value)}
                      className={cn(baseInputClass, inputRing(participantErrors.cellNumber))}
                    />
                    {participantErrors.cellNumber && <p className="mt-1 text-[10px] text-red-600">{participantErrors.cellNumber}</p>}
                  </div>
                  <div>
                    <label className={baseLabelClass}><FaMapMarkedAlt className="text-amber-500" /> District</label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          className={cn(
                            baseInputClass,
                            inputRing(participantErrors.district),
                            "!h-auto min-h-[2.5rem] w-full justify-between gap-2 font-normal shadow-sm"
                          )}
                        >
                          <span
                            className={participantForm.district ? "text-gray-900" : "text-gray-500"}
                          >
                            {participantForm.district || "Select district"}
                          </span>
                          <ChevronDown className="size-4 shrink-0 opacity-60" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        className="min-w-[var(--radix-dropdown-menu-trigger-width)] max-h-[min(280px,70vh)] overflow-y-auto"
                        align="start"
                      >
                        <DropdownMenuLabel className="text-xs font-semibold">District</DropdownMenuLabel>
                        <DropdownMenuGroup>
                          <DropdownMenuItem onSelect={() => handleParticipantChange("district", "")}>
                            Select district
                          </DropdownMenuItem>
                          {MARATHON_DISTRICT_OPTIONS.map((dName) => (
                            <DropdownMenuItem
                              key={dName}
                              onSelect={() => handleParticipantChange("district", dName)}
                            >
                              {dName}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    {participantErrors.district && <p className="mt-1 text-[10px] text-red-600">{participantErrors.district}</p>}
                  </div>
                  <div className="sm:col-span-2">
                    <label className={baseLabelClass}>Running club</label>
                    <input
                      type="text"
                      value={participantForm.runningClub}
                      onChange={(e) => handleParticipantChange("runningClub", e.target.value)}
                      placeholder="Optional — e.g. club name"
                      className={cn(baseInputClass)}
                    />
                  </div>
                </div>
              </SectionCard>

              {/* Kit & Emergency Section */}
              <SectionCard
                title="Kit & Emergency"
                icon={<FaTshirt className="text-white" />}
                iconBgClass="bg-gradient-to-br from-amber-500 to-orange-500"
              >
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className={baseLabelClass}><FaTshirt className="text-fuchsia-500" /> T-shirt Size</label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          className={cn(
                            baseInputClass,
                            inputRing(participantErrors.shirtSize),
                            "!h-auto min-h-[2.5rem] justify-between gap-2 font-normal shadow-sm"
                          )}
                        >
                          <span
                            className={
                              participantForm.shirtSize ? "text-gray-900" : "text-gray-500"
                            }
                          >
                            {participantForm.shirtSize || "Select size"}
                          </span>
                          <ChevronDown className="size-4 shrink-0 opacity-60" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        className="min-w-[var(--radix-dropdown-menu-trigger-width)]"
                        align="start"
                      >
                        <DropdownMenuLabel className="text-xs font-semibold">
                          T-shirt size
                        </DropdownMenuLabel>
                        <DropdownMenuGroup>
                          <DropdownMenuItem
                            onSelect={() => handleParticipantChange("shirtSize", "")}
                          >
                            Select size
                          </DropdownMenuItem>
                          {SHIRT_SIZE_OPTIONS.map((size) => (
                            <DropdownMenuItem
                              key={size}
                              onSelect={() =>
                                handleParticipantChange("shirtSize", size)
                              }
                            >
                              {size}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    {participantErrors.shirtSize && <p className="mt-1 text-[10px] text-red-600">{participantErrors.shirtSize}</p>}
                  </div>
                  <div>
                    <label className={baseLabelClass}><FaUserMd className="text-red-500" /> Emg. Contact</label>
                    <input
                      type="text"
                      value={participantForm.emergencyContactName}
                      onChange={(e) => handleParticipantChange("emergencyContactName", e.target.value)}
                      className={cn(baseInputClass, inputRing(participantErrors.emergencyContactName))}
                    />
                    {participantErrors.emergencyContactName && <p className="mt-1 text-[10px] text-red-600">{participantErrors.emergencyContactName}</p>}
                  </div>
                  <div>
                    <label className={baseLabelClass}><FaMobileAlt className="text-red-400" /> Emg. Number</label>
                    <input
                      type="tel"
                      value={participantForm.emergencyNumber}
                      onChange={(e) => handleParticipantChange("emergencyNumber", e.target.value)}
                      className={cn(baseInputClass, inputRing(participantErrors.emergencyNumber))}
                    />
                    {participantErrors.emergencyNumber && <p className="mt-1 text-[10px] text-red-600">{participantErrors.emergencyNumber}</p>}
                  </div>
                </div>
              </SectionCard>
            </div>

            <div className="rounded-lg border border-red-100 bg-red-50/50 p-3">
              <label className="flex cursor-pointer items-start gap-2">
                <input
                  type="checkbox"
                  checked={participantForm.disclaimerAccepted}
                  onChange={(e) => handleParticipantChange("disclaimerAccepted", e.target.checked)}
                  className="mt-0.5 h-3.5 w-3.5 rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                <span className="text-xs text-gray-700 leading-tight">
                  <span className="font-bold text-red-700">Fitness Warranty:</span> I warrant that I am physically fit and sufficiently trained to participate.
                </span>
              </label>
              {participantErrors.disclaimerAccepted && <p className="mt-1 ml-6 text-[10px] text-red-600">{participantErrors.disclaimerAccepted}</p>}
            </div>

            {(!isExistingRegistration || !readOnlyWhenExisting) && (
              <button
                type="submit"
                disabled={!participantForm.disclaimerAccepted || submittingParticipant}
                className={cn(
                  "mt-2 w-full rounded-lg py-2.5 text-sm font-bold shadow-sm transition-all",
                  participantForm.disclaimerAccepted && !submittingParticipant
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "cursor-not-allowed bg-gray-200 text-gray-400"
                )}
              >
                {submittingParticipant ? "Submitting…" : "Submit Registration"}
              </button>
            )}
          </fieldset>
        </form>
      </div>
    </div>
  );
}