import { useEffect, useState, type ReactNode } from "react";
import { GrFormSubtract } from "react-icons/gr";
import { IoMdAdd } from "react-icons/io";
import { AnimatePresence, motion } from "framer-motion";
// import PrimaryButton from "../PrimaryButton";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  listAllTicketCategoriesByShowId,
  reserveTicket,
} from "@/features/booking/services/booking.service";
import { clearTicketCategories } from "../../../store/ticketCategory";
import { useAppDispatch, useAppSelector } from "../../../../../app/store/hooks";
import { setEventsErrorMsg } from "../../../../events/store/eventSlice";
import EventsErrorPage from "../../../../events/components/EventErrorsd";
import ScrollToTop from "../../../../../shared/components/common/ScrollToTop";
import {
  isSpecialMarathonEvent,
  isSpecialMarathonNewFormEvent,
  SPECIAL_MARATHON_REGISTRATION_STASH_KEY,
} from "@/constants/eventGates";
import type { MarathonRegistrationMode } from "@/features/booking/types/marathon";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Building2, Check, CreditCard, Globe2, UserRound } from "lucide-react";

type ChoiceCardProps = {
  name: string;
  checked: boolean;
  onChange: () => void;
  title: string;
  icon: ReactNode;
};

function ChoiceCard({ name, checked, onChange, title, icon }: ChoiceCardProps) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-center gap-3 rounded-xl border px-3.5 py-3 transition-all duration-200",
        checked
          ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500/25"
          : "border-gray-200 bg-white hover:border-blue-200 hover:bg-blue-50/50"
      )}
    >
      <input
        type="radio"
        name={name}
        className="sr-only"
        checked={checked}
        onChange={onChange}
      />
      <span
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors",
          checked ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-500"
        )}
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1 text-left text-sm font-semibold text-gray-900">
        {title}
      </span>
      <span
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors",
          checked
            ? "border-blue-600 bg-blue-600 text-white"
            : "border-gray-300 bg-white text-transparent"
        )}
        aria-hidden="true"
      >
        <Check className="h-3 w-3" strokeWidth={3} />
      </span>
    </label>
  );
}

const TicketSelection = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const ticketCategory = useAppSelector(
    (state) => state.ticketCategory.data || []
  );
  const ticketCategoryLoading = useAppSelector(
    (state) => state.ticketCategory.loading
  );

  const showId = useAppSelector((state) => state.ticket.showId);
  //("SHOW ID", showId);

  const { contentName, eventId } = useParams();
  const eventIdNum = Number(eventId);
  const isSpecialMarathon = isSpecialMarathonEvent(eventIdNum);
  const isSpecialNewForm = isSpecialMarathonNewFormEvent(eventIdNum);

  const userId = useAppSelector((state) => state.user.user?.userId);


  const [showMarathonSuccessPopup, setShowMarathonSuccessPopup] = useState(false);
  const [marathonSuccessParticipantType, setMarathonSuccessParticipantType] = useState<
    "INDIVIDUAL" | "CORPORATE"
  >("CORPORATE");
  const [loading, setLoading] = useState(false);
  const [participantDialogOpen, setParticipantDialogOpen] = useState(false);
  const [marathonParticipantType, setMarathonParticipantType] = useState<
    "INDIVIDUAL" | "CORPORATE"
  >("INDIVIDUAL");
  const [marathonRegistrationMode, setMarathonRegistrationMode] =
    useState<MarathonRegistrationMode>("ONLINE");

  const [selectedTickets, setSelectedTickets] = useState<{
    [key: number]: number;
  }>({});

  const handleAdd = (id: number) => {
    setSelectedTickets((prev) => {
      if (isSpecialMarathon) {
        const selectedCount = Object.values(prev).reduce(
          (total, count) => total + count,
          0
        );

        if (selectedCount >= 1) return prev;

        return {
          ...prev,
          [id]: 1,
        };
      }

      return {
        ...prev,
        [id]: Math.min((prev[id] || 0) + 1, 10), // max 10 tickets
      };
    });
  };

  const handleRemove = (id: number) => {
    setSelectedTickets((prev) => ({
      ...prev,
      [id]: Math.max((prev[id] || 0) - 1, 0), // not less than 0
    }));
  };

  const categories = Object.entries(selectedTickets)
    .filter(([, cnt]) => cnt > 0) // zero tickets mat bhejo
    .map(([id, cnt]) => ({
      categoryId: Number(id),
      count: cnt,
    }));
  const totalSelectedTickets = categories.reduce(
    (total, category) => total + category.count,
    0
  );

  const marathonRegistrationPath = `/events/${contentName}/${eventId}/marathon-registration`;

  function openSpecialParticipantDialog() {
    if (!categories.length) {
      window.alert("Add at least one ticket!");
      return;
    }
    setMarathonParticipantType("INDIVIDUAL");
    setMarathonRegistrationMode("ONLINE");
    setParticipantDialogOpen(true);
  }

  function proceedToIndividualMarathonRegistration(
    registrationMode: MarathonRegistrationMode = "ONLINE"
  ) {
    if (!categories.length) {
      window.alert("Add at least one ticket!");
      return;
    }
    if (userId) {
      navigate(marathonRegistrationPath, {
        state: {
          categories,
          participantType: "INDIVIDUAL",
          registrationMode,
        },
      });
      return;
    }
    try {
      sessionStorage.setItem(
        SPECIAL_MARATHON_REGISTRATION_STASH_KEY,
        JSON.stringify({
          categories,
          participantType: "INDIVIDUAL" as const,
          registrationMode,
          returnTo: marathonRegistrationPath,
        })
      );
    } catch {
      /* ignore quota / private mode */
    }
    navigate("/login", { state: { from: marathonRegistrationPath } });
  }

  function confirmMarathonParticipantChoice() {
    if (!categories.length) {
      window.alert("Add at least one ticket!");
      return;
    }
    if (marathonParticipantType === "CORPORATE") {
      navigate(marathonRegistrationPath, {
        state: { categories, participantType: "CORPORATE" },
      });
      setParticipantDialogOpen(false);
      return;
    }
    proceedToIndividualMarathonRegistration(marathonRegistrationMode);
    setParticipantDialogOpen(false);
  }

  async function clickHandlerReserveFlow() {
    if (loading) return;
    if (!userId) {
      dispatch(
        setEventsErrorMsg(
          "You need to login to proceed. Do you want to login now?"
        )
      );
      return;
    }
    if (!categories.length) {
      window.alert("Add at least one ticket!");
      return;
    }
    try {
      setLoading(true);
      const res = await dispatch(reserveTicket(categories));

      if (res?.success) {
        navigate(`/events/${contentName}/${eventId}/booking/reviewandpay`, {
          replace: true,
        });
      } else {
        console.log(res);
      }
    } catch (err) {
      console.error("Reservation failed", err);
    } finally {
      setLoading(false);
    }
  }

  function handlePrimaryAction() {
    if (loading) return;
    if (isSpecialNewForm) {
      proceedToIndividualMarathonRegistration();
      return;
    }
    if (isSpecialMarathon) {
      openSpecialParticipantDialog();
      return;
    }
    if (!userId) {
      dispatch(
        setEventsErrorMsg(
          "You need to login to proceed. Do you want to login now?"
        )
      );
      return;
    }
    if (!categories.length) {
      window.alert("Add at least one ticket!");
      return;
    }
    void clickHandlerReserveFlow();
  }

  const singleD_T = localStorage.getItem("dairectnavigate");
  const readableEventName = decodeURIComponent(contentName || "event")
    .replace(/-/g, " ")
    .trim();

  //("PRINTING DIRECTNAVIGATE VALUE: ",singleD_T);

  useEffect(() => {
    if (!showId) {
      navigate(`/events/${contentName}/${eventId}`, { replace: true });
    } else {
      dispatch(listAllTicketCategoriesByShowId(Number(showId)));
    }

    return () => {
      dispatch(clearTicketCategories());
    };
  }, [dispatch, showId, contentName, eventId, navigate]);

  useEffect(() => {
    const st = location.state as {
      marathonRegistrationSuccess?: boolean;
      marathonRegistrationParticipantType?: "INDIVIDUAL" | "CORPORATE";
      marathonCorporateSuccess?: boolean;
    } | null;
    const legacyCorporate = st?.marathonCorporateSuccess === true;
    const unified = st?.marathonRegistrationSuccess === true;
    if (unified || legacyCorporate) {
      setMarathonSuccessParticipantType(
        st?.marathonRegistrationParticipantType ??
          (legacyCorporate ? "CORPORATE" : "INDIVIDUAL")
      );
      setShowMarathonSuccessPopup(true);
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.pathname, location.state, navigate]);

  return (
    <div className="min-h-[calc(100vh-200px)] bg-gradient-to-br from-gray-50 to-blue-50">
      <AnimatePresence>
        {showMarathonSuccessPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/55 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ y: 28, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="relative overflow-hidden w-full max-w-md rounded-3xl border border-white/50 bg-white/85 shadow-[0_24px_70px_-20px_rgba(37,99,235,0.55)] p-6 text-center"
            >
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute -top-10 -left-8 h-28 w-28 rounded-full bg-blue-300/30 blur-2xl" />
                <div className="absolute -bottom-12 -right-8 h-32 w-32 rounded-full bg-purple-300/30 blur-2xl" />
                <span className="absolute left-8 top-9 h-2 w-2 rounded-full bg-blue-500/70 animate-ping" />
                <span className="absolute right-12 top-12 h-1.5 w-1.5 rounded-full bg-violet-500/70 animate-ping [animation-delay:220ms]" />
                <span className="absolute left-14 bottom-14 h-1.5 w-1.5 rounded-full bg-cyan-500/70 animate-ping [animation-delay:380ms]" />
                <span className="absolute right-16 bottom-16 h-2 w-2 rounded-full bg-emerald-500/70 animate-ping [animation-delay:140ms]" />
              </div>

              <div className="relative z-10 mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg">
                <svg
                  className="h-7 w-7 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <h3 className="relative z-10 text-xl font-bold text-slate-900 mb-2">
                Your registration is pending approval from your employer
              </h3>
              <p className="relative z-10 text-sm text-slate-700 mb-6">
                {marathonSuccessParticipantType === "CORPORATE" ? (
                  <>
                    You have successfully registered for the {readableEventName}.
                    The participant ticket will be issued by the HR department once
                    your registration is approved.
                  </>
                ) : (
                  <>
                    You have successfully registered for the {readableEventName}. The
                    participant ticket will be issued by organizer once your payment
                    is confirmed.
                  </>
                )}
              </p>

              <button
                type="button"
                onClick={() => {
                  setShowMarathonSuccessPopup(false);
                  navigate("/");
                }}
                className="relative z-10 w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg"
              >
                OK
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <ScrollToTop />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <EventsErrorPage />

        {/* Header Section */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={() => {
                if (singleD_T) {
                  navigate(`/events/${contentName}/${eventId}/booking/venue`, {
                    replace: true,
                  });
                } else {
                  navigate(
                    `/events/${contentName}/${eventId}/booking/datetime`,
                    {
                      replace: true,
                    }
                  );
                }
              }}
              className="group flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
            >
              <svg
                className="w-3 h-3 group-hover:-translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span>{singleD_T ? "Back to venue" : "Back to Date & Time"}</span>
            </button>
          </div>
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-1">
            Select Tickets
          </h1>
          <p className="text-sm text-gray-600">
            Choose your ticket categories and quantities
          </p>
        </div>

        {/* Ticket Categories */}
        <div className="space-y-4 mb-8">
          {ticketCategoryLoading ? (
            <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-6 flex items-center justify-center gap-3 text-gray-600">
              <svg
                className="w-5 h-5 animate-spin text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
              <span className="font-medium">Loading ticket categories...</span>
            </div>
          ) : (
            ticketCategory.map((ticket) => (
            <div
              key={ticket.categoryId}
              className={`group bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl ${
                (ticket.capacity ?? 0) < 1
                  ? "opacity-60 cursor-not-allowed border-gray-300"
                  : "border-gray-200 hover:border-blue-300"
              }`}
            >
              <div className="p-6">
                <div className="flex justify-between items-center">
                  {/* Ticket Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          {ticket.name}
                        </h3>
                        <div className="flex items-center gap-4">
                          <p className="text-2xl font-bold text-blue-600">
                            M{ticket.price}
                          </p>
                          <div className="flex items-center gap-2">
                            {ticket.capacity < 10 && ticket.capacity > 0 && (
                              <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-medium">
                                <svg
                                  className="w-3 h-3"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                Fast Filling
                              </span>
                            )}
                            {ticket.capacity <= 0 && (
                              <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium">
                                <svg
                                  className="w-3 h-3"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                Sold Out
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  {ticket.capacity >= 1 && (
                    <div className="flex items-center gap-3">
                      <div className="flex items-center bg-gray-50 rounded-xl border-2 border-gray-200">
                        <button
                          onClick={() => handleRemove(ticket.categoryId)}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-l-xl transition-all duration-200"
                        >
                          <GrFormSubtract className="w-4 h-4" />
                        </button>

                        <div className="px-4 py-2 min-w-[3rem] text-center">
                          <span className="text-lg font-bold text-gray-900">
                            {selectedTickets[ticket.categoryId] || 0}
                          </span>
                        </div>

                        <button
                          onClick={() => handleAdd(ticket.categoryId)}
                          disabled={
                            isSpecialMarathon && totalSelectedTickets >= 1
                          }
                          className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-r-xl transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-gray-600"
                        >
                          <IoMdAdd className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            ))
          )}
        </div>

        {/* Proceed Button */}
        <div className="flex justify-center">
          <div className="flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={handlePrimaryAction}
              disabled={
                loading ||
                ((!!userId || isSpecialMarathon) && categories.length === 0)
              }
              className={`group px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300
      flex items-center gap-3
      ${
        loading
          ? "bg-gray-400 text-gray-700 cursor-not-allowed"
          : !userId && !isSpecialMarathon
          ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
          : categories.length === 0
          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
          : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
      }`}
            >
              {loading ? (
                <>
                  <svg
                    className="w-5 h-5 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                  Processing…
                </>
              ) : (
                <>
                  <span>
                    {!userId && !isSpecialMarathon
                      ? "Login to Proceed"
                      : categories.length === 0
                      ? "Select Tickets"
                      : isSpecialNewForm
                      ? "Continue to registration"
                      : isSpecialMarathon
                      ? "Choose participant"
                      : "Review & Pay"}
                  </span>
                  <svg
                    className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </>
              )}
            </button>

            {isSpecialMarathon && !isSpecialNewForm && (
              <AlertDialog
                open={participantDialogOpen}
                onOpenChange={setParticipantDialogOpen}
              >
                <AlertDialogContent className="w-[min(100vw-1.5rem,24rem)] max-w-md gap-0 overflow-hidden border-0 bg-white p-0 shadow-2xl sm:max-w-md">
                  <div className="bg-gradient-to-br from-blue-600 to-blue-800 px-5 py-4 text-white">
                    <AlertDialogHeader className="gap-1 text-left sm:text-left">
                      <AlertDialogTitle className="text-lg font-bold tracking-tight text-white">
                        How are you registering?
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-left text-sm text-blue-100">
                        Individual needs a signed-in account.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                  </div>

                  <div className="space-y-4 px-5 py-4">
                    <fieldset className="space-y-2 border-0 p-0">
                      <legend className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Participant type
                      </legend>
                      <ChoiceCard
                        name="marathon-participant-type"
                        checked={marathonParticipantType === "INDIVIDUAL"}
                        onChange={() => {
                          setMarathonParticipantType("INDIVIDUAL");
                          setMarathonRegistrationMode("ONLINE");
                        }}
                        title="Individual"
                        icon={<UserRound className="h-4 w-4" />}
                      />
                      <ChoiceCard
                        name="marathon-participant-type"
                        checked={marathonParticipantType === "CORPORATE"}
                        onChange={() => setMarathonParticipantType("CORPORATE")}
                        title="Corporate"
                        icon={<Building2 className="h-4 w-4" />}
                      />
                    </fieldset>

                    {marathonParticipantType === "INDIVIDUAL" && (
                      <fieldset className="space-y-2 border-0 p-0">
                        <legend className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Payment method
                        </legend>
                        <div className="grid grid-cols-2 gap-2">
                          <ChoiceCard
                            name="marathon-registration-mode"
                            checked={marathonRegistrationMode === "ONLINE"}
                            onChange={() => setMarathonRegistrationMode("ONLINE")}
                            title="Online"
                            icon={<Globe2 className="h-4 w-4" />}
                          />
                          <ChoiceCard
                            name="marathon-registration-mode"
                            checked={marathonRegistrationMode === "OFFLINE"}
                            onChange={() => setMarathonRegistrationMode("OFFLINE")}
                            title="Offline"
                            icon={<CreditCard className="h-4 w-4" />}
                          />
                        </div>
                      </fieldset>
                    )}
                  </div>

                  <AlertDialogFooter className="m-0 gap-2 rounded-none border-t border-gray-100 bg-gray-50/80 px-5 py-3.5 sm:justify-between">
                    <AlertDialogCancel
                      type="button"
                      className="rounded-xl border-gray-200 bg-white font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </AlertDialogCancel>
                    <Button
                      type="button"
                      className="rounded-xl bg-blue-600 px-6 font-semibold text-white hover:bg-blue-700"
                      onClick={() => confirmMarathonParticipantChoice()}
                    >
                      Continue
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketSelection;
