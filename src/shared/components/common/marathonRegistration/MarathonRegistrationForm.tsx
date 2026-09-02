import type { FormEvent } from "react";
import {
  FaBuilding,
  FaEnvelope,
  FaIdCard,
  FaMapMarkedAlt,
  FaMobileAlt,
  FaMoneyBillWave,
  FaNotesMedical,
  FaRunning,
  FaShieldAlt,
  FaShoePrints,
  FaTshirt,
  FaUser,
  FaUserFriends,
  FaUserMd,
  FaVenusMars,
} from "react-icons/fa";
import {
  MARATHON_DISTRICT_OPTIONS,
  MARATHON_OFFLINE_PAYMENT_TYPES,
  type ActiveCorporate,
  type MarathonEmailCheckOutcome,
  type MarathonRegistrationMode,
} from "@/features/booking/types/marathon";
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
import { SPECIAL_NEW_FORM_CORPORATE } from "@/constants/eventGates";
import {
  formatMarathonShoeSizeLabel,
  MARATHON_SHOE_SIZE_OPTIONS,
} from "@/constants/marathonRegistrationPolicy";
import MarathonRegistrationTermsSection from "../MarathonRegistrationTermsSection";
import { SectionCard } from "./SectionCard";
import { baseInputClass, baseLabelClass, inputRing } from "./formStyles";
import {
  GENDER_OPTIONS,
  IDENTITY_TYPE_LABEL,
  MEDICAL_CONDITION_LABEL,
  PARTICIPANT_TYPE_LABEL,
  RACE_CATEGORY_NEW_FORM_OPTIONS,
  RACE_CATEGORY_OPTIONS,
  SHIRT_SIZE_OPTIONS,
  type ParticipantFormData,
  type ParticipantFormErrors,
} from "./types";
import { formatDobDisplay, formatIsoLocal, parseIsoDateLocal } from "./utils";

export interface MarathonRegistrationFormProps {
  handleParticipantSubmit: (e: FormEvent<HTMLFormElement>) => void | Promise<void>;
  isExistingRegistration: boolean;
  readOnlyWhenExisting: boolean;
  participantForm: ParticipantFormData;
  participantErrors: ParticipantFormErrors;
  handleParticipantChange: (
    key: keyof ParticipantFormData,
    value: string | boolean | number | null
  ) => void;
  handleEmailBlur: () => void;
  emailCheckLoading: boolean;
  emailCheckError: string | null;
  emailCheckOutcome: MarathonEmailCheckOutcome;
  canRetryPendingPayment: boolean;
  handleRetryPayment: () => void | Promise<void>;
  retryingPayment: boolean;
  dobPopoverOpen: boolean;
  setDobPopoverOpen: (open: boolean) => void;
  isSpecialNewForm: boolean;
  participantTypeLocked: boolean;
  registrationModeFromLocation: MarathonRegistrationMode;
  isOfflineIndividual: boolean;
  activeCorporates: ActiveCorporate[];
  loadingCorporates: boolean;
  submittingParticipant: boolean;
  isRegistrationBlocked: boolean;
}

export function MarathonRegistrationForm({
  handleParticipantSubmit,
  isExistingRegistration,
  readOnlyWhenExisting,
  participantForm,
  participantErrors,
  handleParticipantChange,
  handleEmailBlur,
  emailCheckLoading,
  emailCheckError,
  emailCheckOutcome,
  canRetryPendingPayment,
  handleRetryPayment,
  retryingPayment,
  dobPopoverOpen,
  setDobPopoverOpen,
  isSpecialNewForm,
  participantTypeLocked,
  registrationModeFromLocation,
  isOfflineIndividual,
  activeCorporates,
  loadingCorporates,
  submittingParticipant,
  isRegistrationBlocked,
}: MarathonRegistrationFormProps) {
  const formDisabled = isExistingRegistration && readOnlyWhenExisting;
  const raceCategoryOptions = isSpecialNewForm
    ? RACE_CATEGORY_NEW_FORM_OPTIONS
    : RACE_CATEGORY_OPTIONS;

  return (
    <form onSubmit={handleParticipantSubmit} className="space-y-4">
      {isExistingRegistration && readOnlyWhenExisting && (
        <div className="flex items-center gap-2 rounded-lg border border-sky-200 bg-sky-50 px-3 py-2 text-xs text-sky-800">
          <FaShieldAlt className="shrink-0 text-sky-600" />
          <span>Registration already exists. Showing saved details.</span>
        </div>
      )}

      <fieldset disabled={formDisabled} className={cn("flex flex-col gap-4", formDisabled && "opacity-80")}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
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
                  onBlur={handleEmailBlur}
                  className={cn(
                    baseInputClass,
                    inputRing(participantErrors.email || (emailCheckOutcome.type === "confirmed_blocked" ? emailCheckOutcome.message : undefined))
                  )}
                />
                {emailCheckLoading && (
                  <p className="mt-1 text-[10px] text-gray-500">Checking registration status…</p>
                )}
                {participantErrors.email && <p className="mt-1 text-[10px] text-red-600">{participantErrors.email}</p>}
                {!emailCheckLoading && emailCheckError && (
                  <p className="mt-1 text-[10px] text-red-600">{emailCheckError}</p>
                )}
                {!emailCheckLoading && emailCheckOutcome.type === "confirmed_blocked" && (
                  <p className="mt-1 text-[10px] text-red-600">{emailCheckOutcome.message}</p>
                )}
                {!emailCheckLoading && emailCheckOutcome.type === "already_registered" && (
                  <div className="mt-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2">
                    <p className="text-[10px] text-amber-800">{emailCheckOutcome.message}</p>
                  </div>
                )}
                {!emailCheckLoading && emailCheckOutcome.type === "pending_payment" && (
                  <div className="mt-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2">
                    <p className="text-[10px] text-amber-800">{emailCheckOutcome.message}</p>
                    {canRetryPendingPayment && (
                      <button
                        type="button"
                        onClick={() => void handleRetryPayment()}
                        disabled={retryingPayment}
                        className="mt-2 text-[10px] font-semibold text-amber-900 underline underline-offset-2 hover:text-amber-950 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {retryingPayment ? "Redirecting…" : "Continue to payment"}
                      </button>
                    )}
                  </div>
                )}
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

          {/* Participant Details Section */}
          <SectionCard
            title="Participant Details"
            icon={<FaUserFriends className="text-white" />}
            iconBgClass="bg-gradient-to-br from-violet-500 to-purple-600"
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {!isSpecialNewForm && (
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
                    {participantForm.participantType === "INDIVIDUAL" &&
                      registrationModeFromLocation && (
                        <span className="ml-1.5 text-xs font-medium text-gray-500">
                          · {registrationModeFromLocation === "OFFLINE" ? "Offline" : "Online"}
                        </span>
                      )}
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
              )}
              {participantForm.participantType === "CORPORATE" && (
                <div>
                  <label className={baseLabelClass}><FaBuilding className="text-orange-500" /> Corporate</label>
                  {isSpecialNewForm ? (
                    <div
                      className={cn(
                        baseInputClass,
                        "flex min-h-[2.5rem] cursor-default items-center truncate text-gray-900"
                      )}
                      title={SPECIAL_NEW_FORM_CORPORATE.corporateName}
                    >
                      {SPECIAL_NEW_FORM_CORPORATE.corporateName}
                    </div>
                  ) : (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        disabled={loadingCorporates}
                        className={cn(
                          baseInputClass,
                          inputRing(participantErrors.corporateId),
                          "!h-auto min-h-[2.5rem] w-full justify-between gap-2 overflow-hidden font-normal shadow-sm",
                          loadingCorporates && "text-gray-500"
                        )}
                      >
                        <span
                          className={cn(
                            "min-w-0 flex-1 truncate text-left",
                            participantForm.corporateId != null && !loadingCorporates
                              ? "text-gray-900"
                              : "text-gray-500"
                          )}
                          title={
                            participantForm.corporateId != null
                              ? activeCorporates.find(
                                  (c) => c.corporateId === participantForm.corporateId
                                )?.corporateName
                              : undefined
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
                              className="truncate"
                              title={c.corporateName}
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
                  )}
                  {participantErrors.corporateId && <p className="mt-1 text-[10px] text-red-600">{participantErrors.corporateId}</p>}
                </div>
              )}
              {isOfflineIndividual && (
                <div>
                  <label className={baseLabelClass}>
                    <FaMoneyBillWave className="text-blue-500" /> Payment type
                  </label>
                  {/*add checkbox to accept payment type*/}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        disabled={formDisabled}
                        className={cn(
                          baseInputClass,
                          inputRing(participantErrors.paymentType),
                          "!h-auto min-h-[2.5rem] justify-between gap-2 font-normal shadow-sm"
                        )}
                      >
                        <span
                          className={
                            participantForm.paymentType ? "text-gray-900" : "text-gray-500"
                          }
                        >
                          {participantForm.paymentType
                            ? MARATHON_OFFLINE_PAYMENT_TYPES.find(
                                (p) => p.key === participantForm.paymentType
                              )?.label ?? "Select payment type"
                            : "Select payment type"}
                        </span>
                        <ChevronDown className="size-4 shrink-0 opacity-60" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="min-w-[var(--radix-dropdown-menu-trigger-width)]"
                      align="start"
                    >
                      <DropdownMenuLabel className="text-xs font-semibold">
                        Payment type
                      </DropdownMenuLabel>
                      <DropdownMenuGroup>
                        {MARATHON_OFFLINE_PAYMENT_TYPES.map((option) => (
                          <DropdownMenuItem
                            key={option.key}
                            onSelect={() =>
                              handleParticipantChange("paymentType", option.key)
                            }
                          >
                            {option.label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  {participantErrors.paymentType && (
                    <p className="mt-1 text-[10px] text-red-600">
                      {participantErrors.paymentType}
                    </p>
                  )}
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
                      {raceCategoryOptions.map((opt) => (
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

          {/* Race Kit & Emergency Contact Section */}
          <SectionCard
            title="Race Kit & Emergency Contact"
            icon={<FaTshirt className="text-white" />}
            iconBgClass="bg-gradient-to-br from-amber-500 to-orange-500"
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
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
              {!isSpecialNewForm && (
              <div>
                <label className={baseLabelClass}><FaShoePrints className="text-amber-600" /> Shoe size</label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className={cn(
                        baseInputClass,
                        inputRing(participantErrors.shoeSize),
                        "!h-auto min-h-[2.5rem] justify-between gap-2 font-normal shadow-sm"
                      )}
                    >
                      <span
                        className={
                          participantForm.shoeSize ? "text-gray-900" : "text-gray-500"
                        }
                      >
                        {participantForm.shoeSize
                          ? formatMarathonShoeSizeLabel(participantForm.shoeSize)
                          : "Select size"}
                      </span>
                      <ChevronDown className="size-4 shrink-0 opacity-60" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="min-w-[var(--radix-dropdown-menu-trigger-width)]"
                    align="start"
                  >
                    <DropdownMenuLabel className="text-xs font-semibold">
                      Shoe size
                    </DropdownMenuLabel>
                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        onSelect={() => handleParticipantChange("shoeSize", "")}
                      >
                        Select size
                      </DropdownMenuItem>
                      {MARATHON_SHOE_SIZE_OPTIONS.map((size) => (
                        <DropdownMenuItem
                          key={size}
                          onSelect={() =>
                            handleParticipantChange("shoeSize", size)
                          }
                        >
                          {formatMarathonShoeSizeLabel(size)}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
                {participantErrors.shoeSize && <p className="mt-1 text-[10px] text-red-600">{participantErrors.shoeSize}</p>}
              </div>
              )}
              {!isSpecialNewForm && (
              <>
              <div>
                <label className={baseLabelClass}><FaUserMd className="text-red-500" /> Medical Aid name</label>
                <input
                  type="text"
                  value={participantForm.medicalAidName}
                  onChange={(e) => handleParticipantChange("medicalAidName", e.target.value)}
                  placeholder="Optional"
                  className={cn(baseInputClass, inputRing(participantErrors.medicalAidName))}
                />
                {participantErrors.medicalAidName && <p className="mt-1 text-[10px] text-red-600">{participantErrors.medicalAidName}</p>}
              </div>
              <div>
                <label className={baseLabelClass}><FaMobileAlt className="text-red-400" /> Medical Aid number</label>
                <input
                  type="tel"
                  value={participantForm.medicalAidNumber}
                  onChange={(e) => handleParticipantChange("medicalAidNumber", e.target.value)}
                  placeholder="Optional"
                  className={cn(baseInputClass, inputRing(participantErrors.medicalAidNumber))}
                />
                {participantErrors.medicalAidNumber && <p className="mt-1 text-[10px] text-red-600">{participantErrors.medicalAidNumber}</p>}
              </div>
              </>
              )}
              <div>
                <label className={baseLabelClass}><FaUserFriends className="text-indigo-500" /> Emergency contact name</label>
                <input
                  type="text"
                  value={participantForm.emergencyContactName}
                  onChange={(e) => handleParticipantChange("emergencyContactName", e.target.value)}
                  className={cn(baseInputClass, inputRing(participantErrors.emergencyContactName))}
                />
                {participantErrors.emergencyContactName && <p className="mt-1 text-[10px] text-red-600">{participantErrors.emergencyContactName}</p>}
              </div>
              <div>
                <label className={baseLabelClass}><FaMobileAlt className="text-indigo-400" /> Emergency contact number</label>
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

        <MarathonRegistrationTermsSection
          newForm={isSpecialNewForm}
          accepted={participantForm.disclaimerAccepted}
          onAcceptedChange={(accepted) =>
            handleParticipantChange("disclaimerAccepted", accepted)
          }
          error={participantErrors.disclaimerAccepted}
          disabled={formDisabled}
        />

        {(!isExistingRegistration || !readOnlyWhenExisting) && (
          <button
            type="submit"
            disabled={
              !participantForm.disclaimerAccepted ||
              submittingParticipant ||
              isRegistrationBlocked ||
              emailCheckLoading
            }
            className={cn(
              "mt-2 w-full rounded-lg py-2.5 text-sm font-bold shadow-sm transition-all",
              participantForm.disclaimerAccepted &&
                !submittingParticipant &&
                !isRegistrationBlocked &&
                !emailCheckLoading
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "cursor-not-allowed bg-gray-200 text-gray-400"
            )}
          >
            {submittingParticipant ? "Submitting…" : "Submit Registration"}
          </button>
        )}
      </fieldset>
    </form>
  );
}
