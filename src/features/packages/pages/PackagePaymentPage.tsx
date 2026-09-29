import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link, Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import { AlertTriangle, ArrowLeft, Clock, Loader2, LockKeyhole, LogIn } from "lucide-react";
import { useAppSelector } from "@/app/store/hooks";
import PaymentOptions, { type PaymentMethodType } from "@/features/payment/components/payment-ordersummay/PaymentOptions";
import { getApiErrorMessage, isTimeoutError } from "@/lib/api/errors";
import ScrollToTop from "@/shared/components/common/ScrollToTop";
import {
  packageCardInitiateApi,
  packageCpayInitiateApi,
  packageCpayPayApi,
  packageEcoCashPayApi,
  packageMpesaPayApi,
  packagePaymentStatusApi,
} from "../api/packagePayment.api";
import ReservationSummary from "../components/payment/ReservationSummary";
import { useCountdown } from "../hooks/useCountdown";
import type { StoredPackageReservation } from "../types/packageReservation";
import { formatDate } from "../utils/packageDetailFormat";
import { loadReservation, saveReservation } from "../utils/reservationStorage";

const POLL_INTERVAL_MS = 5000;
const CARD_TIMEOUT_MS = 5 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

function isValidMobile(value: string) {
  return value.length >= 8 && value.length <= 12;
}

export default function PackagePaymentPage() {
  const { bookingId = "" } = useParams();
  const location = useLocation();
  const fromState = location.state as StoredPackageReservation | null;
  const [entry] = useState<StoredPackageReservation | null>(() =>
    fromState?.reservation?.bookingId === Number(bookingId) ? fromState : loadReservation(bookingId),
  );

  if (!entry) return <MissingReservation />;
  if (entry.paid) return <Navigate to={`/packages/booking/${bookingId}/confirmed`} replace state={entry} />;
  return <PaymentScreen entry={entry} />;
}

function PaymentScreen({ entry }: { entry: StoredPackageReservation }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = useAppSelector((state) => state.user.user) !== null;
  const { reservation } = entry;

  useEffect(() => {
    // signIn sets this events-flow flag whenever it redirects back; packages don't use it.
    localStorage.removeItem("dairectnavigate");
  }, []);

  function goToLogin() {
    navigate("/login", { state: { from: location.pathname } });
  }
  const bookingId = reservation.bookingId;

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType>("Mpesa");
  const [mobile, setMobile] = useState(() => (entry.leadMobile ?? "").replace(/\D/g, "").slice(0, 12));
  const [paying, setPaying] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showTimeout, setShowTimeout] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [cardIframeHtml, setCardIframeHtml] = useState<string | null>(null);
  const [paymentId, setPaymentId] = useState<number | null>(null);
  const inFlight = useRef(false);

  const countdown = useCountdown(reservation.expiresAt);
  const valid = isValidMobile(mobile) && !countdown.expired;

  function onPaid() {
    const paidEntry = { ...entry, paid: true };
    saveReservation(paidEntry);
    navigate(`/packages/booking/${bookingId}/confirmed`, { replace: true, state: paidEntry });
  }

  function onFailure(error: unknown, fallback: string) {
    if (isTimeoutError(error)) setShowTimeout(true);
    else setErrorMessage(getApiErrorMessage(error, fallback));
  }

  async function submitHandler() {
    if (!isLoggedIn) {
      goToLogin();
      return;
    }
    if (inFlight.current || paying || !valid) return;
    inFlight.current = true;
    setPaying(true);
    const payload = { packageBookingId: bookingId, phoneNumber: mobile };
    try {
      switch (selectedMethod) {
        case "Mpesa":
          await packageMpesaPayApi(payload);
          onPaid();
          break;
        case "EcoCash":
          await packageEcoCashPayApi(payload);
          onPaid();
          break;
        case "Cpay":
          await packageCpayInitiateApi(payload);
          setOtp("");
          setShowOtp(true);
          break;
        case "CardPayment": {
          const res = await packageCardInitiateApi(payload);
          const cardPaymentId = res?.packagePaymentId ?? res?.paymentId;
          if (res?.iframeHtml && cardPaymentId) {
            setCardIframeHtml(res.iframeHtml.replace(/<iframe>\s*$/i, "</iframe>"));
            setPaymentId(cardPaymentId);
          } else {
            setErrorMessage("We couldn't start the card payment. Please try again.");
          }
          break;
        }
      }
    } catch (error) {
      onFailure(error, "Payment failed. Please try again.");
    } finally {
      setPaying(false);
      inFlight.current = false;
    }
  }

  async function verifyOtp() {
    if (otp.trim().length < 4) {
      setErrorMessage("Please enter the OTP sent to your phone.");
      return;
    }
    setVerifyingOtp(true);
    try {
      await packageCpayPayApi({ packageBookingId: bookingId, phoneNumber: mobile, otp: otp.trim() });
      setShowOtp(false);
      onPaid();
    } catch (error) {
      setShowOtp(false);
      onFailure(error, "OTP verification failed. Please try again.");
    } finally {
      setVerifyingOtp(false);
    }
  }

  useEffect(() => {
    if (!paymentId) return;
    let active = true;
    const stop = () => {
      active = false;
      window.clearInterval(intervalId);
      window.clearTimeout(timeoutId);
      setCardIframeHtml(null);
      setPaymentId(null);
    };

    const timeoutId = window.setTimeout(() => {
      if (!active) return;
      stop();
      setErrorMessage("Card payment timed out. Please try again.");
    }, CARD_TIMEOUT_MS);

    const intervalId = window.setInterval(async () => {
      if (!active) return;
      try {
        const res = await packagePaymentStatusApi(paymentId);
        if (!active) return;
        const data = res.data;
        if (data?.status === "CONFIRMED" || data?.payment?.status === "SUCCESS") {
          stop();
          onPaid();
        } else if (data?.status === "FAILED" || data?.payment?.status === "FAILED") {
          stop();
          setErrorMessage(res.message ?? "Card payment failed.");
        }
      } catch (error) {
        console.error("Package payment polling error", error);
      }
    }, POLL_INTERVAL_MS);

    return () => {
      active = false;
      window.clearInterval(intervalId);
      window.clearTimeout(timeoutId);
    };
    // onPaid only depends on stable entry/bookingId
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentId]);

  useEffect(() => {
    if (!cardIframeHtml) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [cardIframeHtml]);

  return (
    <div className="min-h-screen bg-slate-50 font-jakarta text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <ScrollToTop />

      {cardIframeHtml ? (
        <div className="fixed inset-0 z-50 overflow-hidden bg-white">
          <div className="h-screen w-screen" dangerouslySetInnerHTML={{ __html: cardIframeHtml }} />
          <style>{`iframe { width: 100vw !important; height: 100vh !important; border: none !important; }`}</style>
        </div>
      ) : null}

      <div className="mx-auto max-w-[1100px] px-4 pb-16 pt-6 sm:px-6 sm:pt-8 lg:px-8 lg:pt-[calc(var(--site-header-height,8rem)-7rem+1.5rem)]">
        <Link
          to={entry.packagePath || "/packages"}
          className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 shadow-sm hover:border-blue-200 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Back to package
        </Link>

        <header className="mb-6 mt-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-600 dark:text-blue-300">Secure checkout</p>
          <h1 className="mt-1.5 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl dark:text-white">Complete your payment</h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            Your place is held. Pay now to confirm{" "}
            <span className="font-semibold text-slate-900 dark:text-white">{reservation.bookingRef}</span>.
          </p>
        </header>

        <div className="grid items-start gap-6 lg:grid-cols-12">
          <div className="min-w-0 lg:col-span-7">
            {isLoggedIn ? (
              <PaymentOptions
                selectedMethod={selectedMethod}
                setSelectedMethod={setSelectedMethod}
                mobile={mobile}
                setMobile={setMobile}
                isValid={valid}
                paymentLoading={paying}
                cpayLoading={false}
                submitHandler={submitHandler}
              />
            ) : (
              <LoginRequired onLogin={goToLogin} disabled={countdown.expired} />
            )}
          </div>
          <div className="lg:sticky lg:top-[calc(var(--site-header-height,8rem)+0.75rem)] lg:col-span-5">
            <ReservationSummary
              reservation={reservation}
              coverImage={entry.coverImage}
              pickupLabel={entry.pickupLabel}
              notice={<ExpiryBanner expiresAt={reservation.expiresAt} countdown={countdown} />}
            />
          </div>
        </div>
      </div>

      {showOtp ? (
        <Dialog title="Verify OTP" onClose={verifyingOtp ? undefined : () => setShowOtp(false)}>
          <p className="text-center text-sm text-slate-600 dark:text-slate-300">
            A verification code has been sent to <span className="font-semibold">{mobile}</span>.
          </p>
          <input
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            autoFocus
            value={otp}
            maxLength={6}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            onKeyDown={(e) => e.key === "Enter" && verifyOtp()}
            placeholder="Enter OTP"
            aria-label="OTP"
            className="mt-5 w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-center text-lg font-semibold tracking-widest focus:border-blue-600 focus:ring-2 focus:ring-blue-300 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
          <div className="mt-6 flex justify-end gap-2">
            <button
              type="button"
              disabled={verifyingOtp}
              onClick={() => setShowOtp(false)}
              className="h-11 rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={verifyingOtp}
              onClick={verifyOtp}
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white shadow hover:bg-blue-700 disabled:opacity-70"
            >
              {verifyingOtp ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
              {verifyingOtp ? "Processing..." : "Verify & Pay"}
            </button>
          </div>
        </Dialog>
      ) : null}

      {showTimeout ? (
        <Dialog title="Payment request timed out" onClose={() => setShowTimeout(false)}>
          <p className="text-center text-sm text-slate-600 dark:text-slate-300">
            We did not get a response in time. If you approved the payment on your phone, it may still go through — check your
            messages before trying again.
          </p>
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={() => setShowTimeout(false)}
              className="h-11 rounded-xl bg-blue-600 px-7 text-sm font-semibold text-white shadow hover:bg-blue-700"
            >
              OK
            </button>
          </div>
        </Dialog>
      ) : null}

      {errorMessage ? (
        <Dialog title="Payment failed" tone="error" onClose={() => setErrorMessage(null)}>
          <p className="text-center text-sm text-slate-600 dark:text-slate-300">{errorMessage}</p>
          <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => navigate("/support")}
              className="h-11 rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Contact support
            </button>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              className="h-11 rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white shadow hover:bg-blue-700"
            >
              Try again
            </button>
          </div>
        </Dialog>
      ) : null}
    </div>
  );
}

function ExpiryBanner({
  expiresAt,
  countdown,
}: {
  expiresAt: string | null;
  countdown: ReturnType<typeof useCountdown>;
}) {
  if (countdown.remainingMs === undefined) return null;

  if (countdown.expired) {
    return (
      <div role="alert" className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-3 text-sm text-rose-800 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200">
        <AlertTriangle className="mt-0.5 size-5 shrink-0" aria-hidden />
        <p>
          This reservation has expired. Please{" "}
          <Link to="/packages" className="font-semibold underline">
            reserve again
          </Link>{" "}
          to continue.
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 rounded-xl border border-amber-200/80 bg-amber-50 px-3.5 py-3 text-sm text-amber-950 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100">
      <Clock className="size-5 shrink-0" aria-hidden />
      <p>
        {countdown.remainingMs > DAY_MS ? (
          <>Reservation held until <span className="font-semibold">{formatDate(expiresAt)}</span>. Complete payment to confirm it.</>
        ) : (
          <>
            Complete payment within <span className="font-mono font-bold tabular-nums">{countdown.label}</span> to keep this reservation.
          </>
        )}
      </p>
    </div>
  );
}

function Dialog({
  title,
  tone = "default",
  onClose,
  children,
}: {
  title: string;
  tone?: "default" | "error";
  onClose?: () => void;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!onClose) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900"
      >
        {tone === "error" ? (
          <span className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-red-50 text-red-600 dark:bg-red-500/15">
            <AlertTriangle className="size-6" aria-hidden />
          </span>
        ) : null}
        <h2 className="mb-2 text-center text-xl font-bold text-slate-900 dark:text-white">{title}</h2>
        {children}
      </div>
    </div>
  );
}

function LoginRequired({ onLogin, disabled }: { onLogin: () => void; disabled: boolean }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-10 dark:border-slate-800 dark:bg-slate-900">
      <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300">
        <LockKeyhole className="size-7" aria-hidden />
      </span>
      <h2 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">Log in to complete payment</h2>
      <p className="mx-auto mt-2 max-w-sm text-sm text-slate-600 dark:text-slate-300">
        Your reservation is saved. Log in to your account and you'll come straight back here to pay.
      </p>
      <button
        type="button"
        onClick={onLogin}
        disabled={disabled}
        className="mt-6 inline-flex h-11 w-full max-w-xs items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white shadow-lg hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600 disabled:shadow-none"
      >
        <LogIn className="size-4" aria-hidden /> Log in to pay
      </button>
    </div>
  );
}

function MissingReservation() {
  return (
    <div className="mx-auto max-w-md px-4 py-16 text-center font-jakarta">
      <h1 className="text-xl font-bold text-slate-900 dark:text-white">Reservation not found</h1>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
        We couldn't find this reservation in your current session. Please reserve the package again.
      </p>
      <Link
        to="/packages"
        className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white hover:bg-blue-700"
      >
        Browse packages
      </Link>
    </div>
  );
}
