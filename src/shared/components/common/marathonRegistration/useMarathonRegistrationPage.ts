import { useEffect, useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  getActiveCorporatesApi,
  getMarathonRegistrationByUserIdApi,
  submitMarathonRegistrationApi,
} from "@/features/booking/api/marathon.api";
import type {
  ActiveCorporate,
  MarathonRegistrationDetails,
  MarathonRegistrationMode,
} from "@/features/booking/types/marathon";
import { useMarathonEmailRegistrationCheck } from "@/features/booking/hooks/useMarathonEmailRegistrationCheck";
import {
  reserveTicket,
  type CategorySelection,
} from "@/features/booking/services/booking.service";
import { getOrderDetails } from "@/features/orders/services/orders.service";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import {
  isSpecialMarathonEvent,
  isSpecialMarathonNewFormEvent,
  isOfflineMarathonIndividual,
  MARATHON_ONLINE_PAYMENT_ENABLED,
  normalizeMarathonRegistrationMode,
  SPECIAL_MARATHON_REGISTRATION_STASH_KEY,
  SPECIAL_NEW_FORM_CORPORATE,
} from "@/constants/eventGates";
import {
  buildRegistrationPayload,
  shouldSkipOnlineCheckout,
  treatsAsOfflineIndividual,
} from "./buildRegistrationPayload";
import { INITIAL_FORM, type MarathonLocationState, type ParticipantFormData } from "./types";
import { mapRegistrationDetailsToForm } from "./utils";
import { validateParticipantForm } from "./validateParticipantForm";

export function useMarathonRegistrationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams<{ contentName?: string; eventId?: string; bookingId?: string }>();
  const dispatch = useAppDispatch();

  const pathname = location.pathname;
  const isOrderContext = /\/order\/[^/]+\/marathon-registration/.test(pathname);
  const isStandaloneMarathonRegistration =
    /^\/events\/[^/]+\/[^/]+\/marathon-registration\/?$/.test(pathname);
  const isBookingContext =
    /\/booking\/marathon-registration/.test(pathname) || isStandaloneMarathonRegistration;

  const userId = useAppSelector((state) => state.user.user?.userId);
  const confirmBookingDetails = useAppSelector((state) => state.confirmBooking.booking);

  const bookingIdParam = params.bookingId ? Number(params.bookingId) : null;
  const eventIdParam = params.eventId ? Number(params.eventId) : null;
  const isSpecialMarathon =
    eventIdParam !== null && !Number.isNaN(eventIdParam) && isSpecialMarathonEvent(eventIdParam);
  const isSpecialNewForm =
    eventIdParam !== null && !Number.isNaN(eventIdParam) && isSpecialMarathonNewFormEvent(eventIdParam);
  const contentName = params.contentName ?? "";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname, location.key]);

  const locState = (location.state || {}) as MarathonLocationState;
  const categoriesFromState = locState.categories;
  const participantTypeFromLocation = locState.participantType;
  const registrationModeFromLocation = normalizeMarathonRegistrationMode(locState.registrationMode);
  const isOfflineIndividual = isOfflineMarathonIndividual(
    participantTypeFromLocation,
    registrationModeFromLocation,
    isSpecialNewForm
  );

  const readOnlyWhenExisting = isOrderContext;

  const [participantForm, setParticipantForm] = useState<ParticipantFormData>(INITIAL_FORM);
  const [participantErrors, setParticipantErrors] = useState<
    Partial<Record<keyof ParticipantFormData, string>>
  >({});
  const [dobPopoverOpen, setDobPopoverOpen] = useState(false);
  const [submittingParticipant, setSubmittingParticipant] = useState(false);
  const [activeCorporates, setActiveCorporates] = useState<ActiveCorporate[]>([]);
  const [loadingCorporates, setLoadingCorporates] = useState(false);
  const [registrationData, setRegistrationData] = useState<MarathonRegistrationDetails | null>(null);
  const [loadingRegistration, setLoadingRegistration] = useState(isOrderContext);
  const [orderBootstrapped, setOrderBootstrapped] = useState(false);
  const [retryingPayment, setRetryingPayment] = useState(false);

  const isExistingRegistration = registrationData !== null;

  const resolvedEventId = isOrderContext
    ? Number(confirmBookingDetails?.event?.eventId)
    : eventIdParam;
  const resolvedTicketCategoryId = isOrderContext
    ? (confirmBookingDetails?.tickets?.[0] as { categoryId?: number } | undefined)?.categoryId ??
      null
    : categoriesFromState?.[0]?.categoryId ?? null;
  const resolvedNoOfTicket = isOrderContext
    ? (confirmBookingDetails?.tickets?.length ?? null)
    : (categoriesFromState?.reduce((t, c) => t + c.count, 0) ?? null);

  const emailCheckEnabled = !(isExistingRegistration && readOnlyWhenExisting);
  const {
    loading: emailCheckLoading,
    error: emailCheckError,
    outcome: emailCheckOutcome,
    handleEmailBlur,
    isRegistrationBlocked,
  } = useMarathonEmailRegistrationCheck({
    eventId: resolvedEventId,
    email: participantForm.email,
    enabled: emailCheckEnabled && resolvedEventId != null && !Number.isNaN(resolvedEventId),
  });

  const isCorporateParticipant =
    (participantTypeFromLocation ?? participantForm.participantType) === "CORPORATE";

  const canRetryPendingPayment =
    MARATHON_ONLINE_PAYMENT_ENABLED &&
    !isOfflineIndividual &&
    emailCheckOutcome.type === "pending_payment" &&
    !isCorporateParticipant &&
    (emailCheckOutcome.bookingId != null ||
      (isBookingContext && !!categoriesFromState?.length));

  const handleRetryPayment = async () => {
    if (emailCheckOutcome.type !== "pending_payment") return;
    if (isOfflineIndividual || !MARATHON_ONLINE_PAYMENT_ENABLED) {
      toast.error("Online payment is not available for offline registration.");
      return;
    }

    if (emailCheckOutcome.bookingId != null) {
      navigate(`/order/${emailCheckOutcome.bookingId}`);
      return;
    }

    if (!isBookingContext || !categoriesFromState?.length) {
      toast.error("Ticket details are unavailable. Please return to ticket selection.");
      return;
    }

    setRetryingPayment(true);
    const res = await dispatch(
      reserveTicket(categoriesFromState, emailCheckOutcome.registrationId)
    );
    setRetryingPayment(false);

    if (!res?.success) return;

    navigate(`/events/${contentName}/${eventIdParam}/booking/reviewandpay`, {
      replace: true,
    });
  };

  useEffect(() => {
    if (!isBookingContext) return;
    if (categoriesFromState && categoriesFromState.length > 0) return;

    if (isSpecialMarathon) {
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
            registrationMode?: MarathonRegistrationMode;
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
                ...(parsed.participantType !== "CORPORATE"
                  ? {
                      registrationMode: normalizeMarathonRegistrationMode(parsed.registrationMode),
                    }
                  : {}),
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
    isSpecialMarathon,
    location.pathname,
  ]);

  useEffect(() => {
    if (!isBookingContext || isSpecialNewForm || MARATHON_ONLINE_PAYMENT_ENABLED) return;
    if (!categoriesFromState?.length) return;
    if ((participantTypeFromLocation ?? "INDIVIDUAL") !== "INDIVIDUAL") return;

    const rawMode = locState.registrationMode;
    const normalizedMode = normalizeMarathonRegistrationMode(rawMode);
    if (rawMode === normalizedMode) return;

    navigate(location.pathname, {
      replace: true,
      state: {
        categories: categoriesFromState,
        participantType: participantTypeFromLocation ?? "INDIVIDUAL",
        registrationMode: normalizedMode,
      },
    });
  }, [
    isBookingContext,
    isSpecialNewForm,
    categoriesFromState,
    participantTypeFromLocation,
    locState.registrationMode,
    location.pathname,
    navigate,
  ]);

  useEffect(() => {
    if (!isOrderContext || !bookingIdParam || Number.isNaN(bookingIdParam)) return;

    let mounted = true;
    (async () => {
      await dispatch(getOrderDetails(bookingIdParam, navigate, { redirectToOrder: false }));
      if (!mounted) return;
      setLoadingRegistration(true);
      const response = await getMarathonRegistrationByUserIdApi(bookingIdParam);
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
    setParticipantForm(mapRegistrationDetailsToForm(registrationData, isSpecialNewForm));
  }, [registrationData, isSpecialNewForm]);

  useEffect(() => {
    if (registrationData) return;
    const pt = participantTypeFromLocation;
    if (pt !== "CORPORATE" && pt !== "INDIVIDUAL") return;
    setParticipantForm((prev) => {
      const expectedCorporateId =
        pt === "CORPORATE" && isSpecialNewForm
          ? SPECIAL_NEW_FORM_CORPORATE.corporateId
          : pt === "INDIVIDUAL"
            ? null
            : prev.corporateId;
      if (prev.participantType === pt && prev.corporateId === expectedCorporateId) {
        return prev;
      }
      return {
        ...prev,
        participantType: pt,
        corporateId: expectedCorporateId,
      };
    });
  }, [registrationData, participantTypeFromLocation, location.key, isSpecialNewForm]);

  useEffect(() => {
    if (participantForm.participantType !== "CORPORATE") return;

    if (isSpecialNewForm) {
      setLoadingCorporates(false);
      setActiveCorporates([SPECIAL_NEW_FORM_CORPORATE]);
      setParticipantForm((prev) =>
        prev.corporateId === SPECIAL_NEW_FORM_CORPORATE.corporateId
          ? prev
          : { ...prev, corporateId: SPECIAL_NEW_FORM_CORPORATE.corporateId }
      );
      return;
    }

    let isMounted = true;

    const fetchCorporates = async () => {
      setLoadingCorporates(true);
      const response = await getActiveCorporatesApi();
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
  }, [participantForm.participantType, isSpecialNewForm]);

  const handleBack = () => {
    if (isOrderContext && bookingIdParam) {
      navigate(`/order/${bookingIdParam}`);
      return;
    }
    navigate(`/events/${contentName}/${eventIdParam}/booking/ticket`);
  };

  const handleParticipantChange = (
    key: keyof ParticipantFormData,
    value: string | boolean | number | null
  ) => {
    setParticipantForm((prev) => ({
      ...prev,
      [key]: value,
    }));
    setParticipantErrors((prev) => {
      if (!prev[key]) return prev;
      return { ...prev, [key]: "" };
    });
  };

  const handleParticipantSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errors = validateParticipantForm(participantForm, {
      isSpecialNewForm,
      isOfflineIndividual,
    });
    setParticipantErrors(errors);
    if (Object.keys(errors).length > 0) return;
    if (isRegistrationBlocked) {
      toast.error("This email is already registered and booking is confirmed.");
      return;
    }
    if (participantForm.participantType === "INDIVIDUAL" && !userId) {
      toast.error("Please sign in to register as an individual.");
      return;
    }
    if (!resolvedEventId || !resolvedTicketCategoryId || !resolvedNoOfTicket) {
      toast.error("Missing event ticket details. Please reselect your tickets.");
      return;
    }

    const registrationPayload = buildRegistrationPayload({
      participantForm,
      isSpecialNewForm,
      isOfflineIndividual,
      resolvedEventId,
      resolvedTicketCategoryId,
      resolvedNoOfTicket,
    });

    setSubmittingParticipant(true);
    const result = await submitMarathonRegistrationApi(registrationPayload);
    setSubmittingParticipant(false);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    setParticipantForm(INITIAL_FORM);
    setParticipantErrors({});

    if (isBookingContext && categoriesFromState?.length) {
      const offlineFlow = treatsAsOfflineIndividual(
        participantForm,
        isSpecialNewForm,
        isOfflineIndividual
      );

      if (shouldSkipOnlineCheckout(participantForm, isSpecialNewForm, isOfflineIndividual)) {
        navigate(`/events/${contentName}/${eventIdParam}/booking/ticket`, {
          replace: true,
          state: {
            marathonRegistrationSuccess: true,
            marathonRegistrationParticipantType: offlineFlow
              ? "INDIVIDUAL_OFFLINE"
              : participantForm.participantType,
          },
        });
        return;
      }

      if (!MARATHON_ONLINE_PAYMENT_ENABLED) {
        toast.error("Online payment is currently unavailable. Please use offline registration.");
        return;
      }

      const res = await dispatch(
        reserveTicket(categoriesFromState, result.registrationId)
      );
      if (!res?.success) return;
      navigate(`/events/${contentName}/${eventIdParam}/booking/reviewandpay`, {
        replace: true,
      });
      return;
    }

    toast.success(result.message || "Registration submitted successfully.");
    if (isOrderContext && bookingIdParam) navigate(`/order/${bookingIdParam}`);
  };

  const marathonRegistrationPath = `/events/${contentName}/${eventIdParam}/marathon-registration`;
  const effectiveParticipantType =
    participantTypeFromLocation ?? participantForm.participantType;
  const requiresIndividualLogin =
    isSpecialMarathon && effectiveParticipantType === "INDIVIDUAL" && !userId;

  const handleSignInForIndividual = () => {
    if (categoriesFromState?.length) {
      try {
        sessionStorage.setItem(
          SPECIAL_MARATHON_REGISTRATION_STASH_KEY,
          JSON.stringify({
            categories: categoriesFromState,
            participantType: "INDIVIDUAL" as const,
            registrationMode: registrationModeFromLocation,
            returnTo: marathonRegistrationPath,
          })
        );
      } catch {
        /* ignore */
      }
    }
    navigate("/login", { state: { from: marathonRegistrationPath } });
  };

  const formDisabled = isExistingRegistration && readOnlyWhenExisting;
  const participantTypeLocked =
    isBookingContext &&
    (isSpecialNewForm ||
      participantTypeFromLocation === "INDIVIDUAL" ||
      participantTypeFromLocation === "CORPORATE");

  const gateState = {
    hidePage: isBookingContext && (!categoriesFromState || categoriesFromState.length === 0),
    showLoadingRegistration: isOrderContext && (!orderBootstrapped || loadingRegistration),
    showGenericSignIn: isBookingContext && !userId && !isSpecialMarathon,
    showIndividualSignIn: requiresIndividualLogin,
  };

  return {
    isOrderContext,
    isStandaloneMarathonRegistration,
    isSpecialNewForm,
    isOfflineIndividual,
    participantForm,
    participantErrors,
    dobPopoverOpen,
    setDobPopoverOpen,
    submittingParticipant,
    activeCorporates,
    loadingCorporates,
    emailCheckLoading,
    emailCheckError,
    emailCheckOutcome,
    handleEmailBlur,
    isRegistrationBlocked,
    canRetryPendingPayment,
    retryingPayment,
    handleRetryPayment,
    handleBack,
    handleParticipantChange,
    handleParticipantSubmit,
    handleSignInForIndividual,
    formDisabled,
    participantTypeLocked,
    registrationModeFromLocation,
    participantTypeFromLocation,
    isExistingRegistration,
    readOnlyWhenExisting,
    gateState,
  };
}
