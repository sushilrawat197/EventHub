import { FaUser } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";

export function MarathonRegistrationLoadingScreen() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center bg-gray-50/50 px-4 text-sm text-gray-500">
      Loading registration details…
    </div>
  );
}

export interface MarathonSignInRequiredScreenProps {
  onBack: () => void;
}

export function MarathonSignInRequiredScreen({ onBack }: MarathonSignInRequiredScreenProps) {
  return (
    <div className="min-h-[60vh] bg-gray-50/50 px-4 py-10 flex items-center justify-center">
      <div className="w-full max-w-sm rounded-2xl border border-amber-100 bg-white p-6 text-center shadow-lg">
        <FaUser className="mx-auto mb-3 text-3xl text-amber-500" />
        <p className="font-semibold text-gray-800">Sign in required</p>
        <p className="mt-1 text-xs text-gray-600">Log in to complete marathon registration.</p>
        <button
          type="button"
          onClick={onBack}
          className="mt-5 inline-flex w-full justify-center items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <IoIosArrowBack /> Back to tickets
        </button>
      </div>
    </div>
  );
}

export interface MarathonIndividualSignInRequiredScreenProps {
  onSignIn: () => void;
  onBack: () => void;
}

export function MarathonIndividualSignInRequiredScreen({
  onSignIn,
  onBack,
}: MarathonIndividualSignInRequiredScreenProps) {
  return (
    <div className="min-h-[60vh] bg-gray-50/50 px-4 py-10 flex items-center justify-center">
      <div className="w-full max-w-sm rounded-2xl border border-amber-100 bg-white p-6 text-center shadow-lg">
        <FaUser className="mx-auto mb-3 text-3xl text-amber-500" />
        <p className="font-semibold text-gray-800">Sign in required</p>
        <p className="mt-1 text-xs text-gray-600">
          Individual registration requires an account. Sign in to continue on this page.
        </p>
        <button
          type="button"
          onClick={onSignIn}
          className="mt-5 inline-flex w-full justify-center items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Sign in
        </button>
        <button
          type="button"
          onClick={onBack}
          className="mt-2 inline-flex w-full justify-center items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
        >
          <IoIosArrowBack /> Back to tickets
        </button>
      </div>
    </div>
  );
}
