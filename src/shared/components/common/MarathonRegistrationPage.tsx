// TODO: TEMP EVENT-39 FLOW - remove this page once marathon registration flow is retired.
import { FaRunning } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import { cn } from "@/lib/utils";
import { MarathonRegistrationForm } from "./marathonRegistration/MarathonRegistrationForm";
import {
  MarathonIndividualSignInRequiredScreen,
  MarathonRegistrationLoadingScreen,
  MarathonSignInRequiredScreen,
} from "./marathonRegistration/MarathonRegistrationGateScreens";
import { useMarathonRegistrationPage } from "./marathonRegistration/useMarathonRegistrationPage";

export default function MarathonRegistrationPage() {
  const {
    isOrderContext,
    isStandaloneMarathonRegistration,
    gateState,
    handleBack,
    handleSignInForIndividual,
    ...formProps
  } = useMarathonRegistrationPage();

  if (gateState.hidePage) return null;

  if (gateState.showLoadingRegistration) {
    return <MarathonRegistrationLoadingScreen />;
  }

  if (gateState.showGenericSignIn) {
    return <MarathonSignInRequiredScreen onBack={handleBack} />;
  }

  if (gateState.showIndividualSignIn) {
    return (
      <MarathonIndividualSignInRequiredScreen
        onSignIn={handleSignInForIndividual}
        onBack={handleBack}
      />
    );
  }

  return (
    <div
      className={cn(
        "bg-blue-50/50 pb-8 px-4 sm:px-6 md:px-8",
        isStandaloneMarathonRegistration ? "min-h-screen py-6" : "min-h-[calc(100vh-200px)] rounded-lg"
      )}
    >
      <div className="mx-auto w-full max-w-5xl py-4 sm:py-6">
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

        <MarathonRegistrationForm {...formProps} />
      </div>
    </div>
  );
}
