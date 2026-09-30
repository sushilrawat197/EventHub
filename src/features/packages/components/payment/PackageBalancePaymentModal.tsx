import { useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  CreditCard,
  Loader2,
  Lock,
  Phone,
  ShieldCheck,
  Smartphone,
  Wallet,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { getApiErrorMessage, isTimeoutError } from "@/lib/api/errors";
import {
  packageCardInitiateApi,
  packageCpayInitiateApi,
  packageCpayPayApi,
  packageEcoCashPayApi,
  packageMpesaPayApi,
  packagePaymentStatusApi,
  type PaymentPurpose,
} from "../../api/packagePayment.api";
import { formatMoney } from "../../utils/packageDetailFormat";
import type { PackageOrder } from "@/features/orders/types/packageOrder";

export type PaymentMethodType = "Mpesa" | "Cpay" | "CardPayment" | "EcoCash";

interface PackageBalancePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: PackageOrder;
  onPaymentSuccess: () => void;
}

const POLL_INTERVAL_MS = 5000;
const CARD_TIMEOUT_MS = 5 * 60 * 1000;

function isValidMobile(value: string) {
  return value.length >= 8 && value.length <= 12;
}

export default function PackageBalancePaymentModal({
  isOpen,
  onClose,
  order,
  onPaymentSuccess,
}: PackageBalancePaymentModalProps) {
  const currency = order.pricing?.currency ?? "LSL";
  const totalAmount = order.pricing?.totalAmount ?? 0;
  const paidAmount = order.pricing?.paidAmount ?? 0;
  const balanceDue = order.pricing?.balanceAmount ?? Math.max(0, totalAmount - paidAmount);

  // Method & form states
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType>("Mpesa");
  const [mobile, setMobile] = useState(() => (order.contact?.mobile ?? "").replace(/\D/g, "").slice(0, 12));
  const [paying, setPaying] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showTimeout, setShowTimeout] = useState(false);

  // C-Pay OTP states
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  // Card Payment iframe states
  const [cardIframeHtml, setCardIframeHtml] = useState<string | null>(null);
  const [paymentId, setPaymentId] = useState<number | null>(null);

  // Success state inside modal
  const [isSuccess, setIsSuccess] = useState(false);

  const inFlight = useRef(false);
  const valid = isValidMobile(mobile);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setMobile((order.contact?.mobile ?? "").replace(/\D/g, "").slice(0, 12));
      setErrorMessage(null);
      setShowTimeout(false);
      setShowOtp(false);
      setOtp("");
      setIsSuccess(false);
      setCardIframeHtml(null);
      setPaymentId(null);
    }
  }, [isOpen, order]);

  // Escape key handler
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !paying && !verifyingOtp && !cardIframeHtml) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, paying, verifyingOtp, cardIframeHtml, onClose]);

  // Card Payment polling
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
          handlePaymentComplete();
        } else if (data?.status === "FAILED" || data?.payment?.status === "FAILED") {
          stop();
          setErrorMessage(res.message ?? "Card payment failed.");
        }
      } catch (err) {
        console.error("Card payment status polling error:", err);
      }
    }, POLL_INTERVAL_MS);

    return () => {
      active = false;
      window.clearInterval(intervalId);
      window.clearTimeout(timeoutId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentId]);

  function handlePaymentComplete() {
    setIsSuccess(true);
    toast.success("Balance payment completed successfully!");
    onPaymentSuccess();
    setTimeout(() => {
      onClose();
    }, 1800);
  }

  function onFailure(error: unknown, fallback: string) {
    if (isTimeoutError(error)) {
      setShowTimeout(true);
    } else {
      setErrorMessage(getApiErrorMessage(error, fallback));
    }
  }

  async function submitHandler() {
    if (inFlight.current || paying || !valid) return;
    inFlight.current = true;
    setPaying(true);
    setErrorMessage(null);

    const payload = {
      packageBookingId: order.bookingId,
      phoneNumber: mobile,
      purpose: "BALANCE" as PaymentPurpose,
    };

    try {
      switch (selectedMethod) {
        case "Mpesa":
          await packageMpesaPayApi(payload);
          handlePaymentComplete();
          break;
        case "EcoCash":
          await packageEcoCashPayApi(payload);
          handlePaymentComplete();
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
    setErrorMessage(null);
    try {
      await packageCpayPayApi({
        packageBookingId: order.bookingId,
        phoneNumber: mobile,
        otp: otp.trim(),
        purpose: "BALANCE" as PaymentPurpose,
      });
      setShowOtp(false);
      handlePaymentComplete();
    } catch (error) {
      setShowOtp(false);
      onFailure(error, "OTP verification failed. Please try again.");
    } finally {
      setVerifyingOtp(false);
    }
  }

  if (!isOpen) return null;

  return (
    <>
      {/* Fullscreen Card Payment Iframe */}
      {cardIframeHtml ? (
        <div className="fixed inset-0 z-[60] overflow-hidden bg-white">
          <div className="absolute top-3 right-3 z-10">
            <button
              type="button"
              onClick={() => {
                setCardIframeHtml(null);
                setPaymentId(null);
              }}
              className="rounded-full bg-slate-900/80 px-3 py-1.5 text-xs font-semibold text-white shadow-md hover:bg-slate-900"
            >
              Cancel Payment
            </button>
          </div>
          <div className="h-screen w-screen" dangerouslySetInnerHTML={{ __html: cardIframeHtml }} />
          <style>{`iframe { width: 100vw !important; height: 100vh !important; border: none !important; }`}</style>
        </div>
      ) : null}

      {/* Main Modal Backdrop */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs font-jakarta overflow-y-auto"
        onClick={paying || verifyingOtp ? undefined : onClose}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Pay Remaining Balance"
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-lg rounded-2xl sm:rounded-3xl bg-white p-5 sm:p-7 shadow-2xl dark:border dark:border-slate-800 dark:bg-slate-900 my-auto"
        >
          {/* Close Button */}
          <button
            type="button"
            disabled={paying || verifyingOtp}
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition disabled:opacity-50 cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="size-5" />
          </button>

          {/* Success Confirmation State */}
          {isSuccess ? (
            <div className="py-8 text-center">
              <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 animate-bounce">
                <CheckCircle2 className="size-10" />
              </div>
              <h3 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
                Balance Payment Successful!
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                Your remaining balance of{" "}
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {formatMoney(balanceDue, currency)}
                </span>{" "}
                has been received. Your booking is now fully confirmed!
              </p>
              <div className="mt-6 flex justify-center">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <div>
              {/* Header */}
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex size-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400">
                  <Wallet className="size-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Pay Remaining Balance
                  </h2>
                  {/* <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                    Booking REF: <span className="font-bold text-blue-600 dark:text-blue-400">{order.bookingRef}</span>
                  </p> */}
                </div>
              </div>

              {/* Balance Amount Due Banner */}
              <div className="mt-4 rounded-xl border border-amber-200/80 bg-gradient-to-r from-amber-50/80 via-amber-50 to-orange-50/50 p-4 dark:border-amber-900/40 dark:from-amber-950/30 dark:to-orange-950/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                      BALANCE AMOUNT DUE
                    </p>
                    <p className="mt-0.5 text-2xl font-black tracking-tight text-amber-800 dark:text-amber-400">
                      {formatMoney(balanceDue, currency)}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-bold text-amber-800 dark:bg-amber-900/60 dark:text-amber-200">
                      PURPOSE: BALANCE
                    </span>
                    {order.paymentPlan?.balanceDueDate ? (
                      <p className="mt-1 text-[11px] text-amber-700/80 dark:text-amber-300/80">
                        Due: {order.paymentPlan.balanceDueDate}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>

              {/* Error banner */}
              {errorMessage ? (
                <div className="mt-3 flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-300">
                  <AlertTriangle className="size-4 shrink-0 text-rose-600 mt-0.5" />
                  <div className="flex-1">
                    <p>{errorMessage}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setErrorMessage(null)}
                    className="text-rose-600 hover:text-rose-800 dark:text-rose-400"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>
              ) : null}

              {/* 4 Interactive Payment Method Cards */}
              <div className="mt-4 space-y-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                    Choose Payment Method
                  </label>
                  <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                    <MethodOptionCard
                      method="Mpesa"
                      title="M-Pesa"
                      subtitle="Mobile Wallet"
                      color="red"
                      selected={selectedMethod === "Mpesa"}
                      onClick={() => setSelectedMethod("Mpesa")}
                    />
                    <MethodOptionCard
                      method="EcoCash"
                      title="EcoCash"
                      subtitle="Mobile Wallet"
                      color="blue"
                      selected={selectedMethod === "EcoCash"}
                      onClick={() => setSelectedMethod("EcoCash")}
                    />
                    <MethodOptionCard
                      method="Cpay"
                      title="C-Pay"
                      subtitle="Mobile Wallet"
                      color="green"
                      selected={selectedMethod === "Cpay"}
                      onClick={() => setSelectedMethod("Cpay")}
                    />
                    <MethodOptionCard
                      method="CardPayment"
                      title="Card Payment"
                      subtitle="Credit / Debit"
                      color="orange"
                      selected={selectedMethod === "CardPayment"}
                      onClick={() => setSelectedMethod("CardPayment")}
                    />
                  </div>
                </div>

                {/* Mobile Number Input */}
                <div className="pt-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    {selectedMethod === "CardPayment"
                      ? "Contact Mobile Number"
                      : `Mobile Number`}
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      inputMode="tel"
                      placeholder="e.g. 58123456"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                      maxLength={12}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                    <Phone className="absolute right-3.5 top-3 size-4 text-slate-400 pointer-events-none" />
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                    {selectedMethod === "Mpesa"
                      ? "You will receive an STK Push prompt on your mobile phone to authorize payment."
                      : selectedMethod === "EcoCash"
                        ? "An EcoCash payment prompt will be pushed to your registered number."
                        : selectedMethod === "Cpay"
                          ? "A one-time OTP verification code will be sent to your mobile phone."
                          : "A secure card payment gateway will open to complete the transaction."}
                  </p>
                </div>

                {/* Submit Action Button */}
                <button
                  type="button"
                  onClick={submitHandler}
                  disabled={!valid || paying}
                  className="w-full h-11 rounded-xl bg-gradient-to-r from-amber-600 via-amber-700 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-amber-600/25 transition active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                >
                  {paying ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      <span>Processing Payment...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="size-4" />
                      <span>
                        Pay {formatMoney(balanceDue, currency)} Balance with {selectedMethod === "CardPayment" ? "Card" : selectedMethod}
                      </span>
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-1.5 pt-1 text-[11px] text-slate-400 dark:text-slate-500">
                  <ShieldCheck className="size-3.5 text-emerald-600" />
                  <span>256-Bit SSL Encrypted & Protected Payment</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* C-Pay OTP Verification Modal */}
      {showOtp ? (
        <div className="fixed inset-0 z-[65] flex items-center justify-center bg-black/60 px-4 backdrop-blur-xs font-jakarta">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <h3 className="text-center text-lg font-bold text-slate-900 dark:text-white">
              Verify C-Pay OTP
            </h3>
            <p className="mt-1 text-center text-xs text-slate-600 dark:text-slate-300">
              A verification code has been sent to <span className="font-semibold text-slate-900 dark:text-white">{mobile}</span>.
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
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                disabled={verifyingOtp}
                onClick={() => setShowOtp(false)}
                className="h-10 rounded-xl border border-slate-200 px-4 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={verifyingOtp || otp.trim().length < 4}
                onClick={verifyOtp}
                className="inline-flex h-10 items-center gap-2 rounded-xl bg-blue-600 px-5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-60 cursor-pointer"
              >
                {verifyingOtp ? <Loader2 className="size-3.5 animate-spin" /> : null}
                {verifyingOtp ? "Verifying..." : "Verify & Pay"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Timeout Alert Modal */}
      {showTimeout ? (
        <div className="fixed inset-0 z-[65] flex items-center justify-center bg-black/60 px-4 backdrop-blur-xs font-jakarta">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Payment Request Timed Out
            </h3>
            <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">
              We did not receive a response in time. If you approved the payment prompt on your mobile phone, it may still go through — please check your SMS messages or refresh the page before trying again.
            </p>
            <div className="mt-5 flex justify-center">
              <button
                type="button"
                onClick={() => setShowTimeout(false)}
                className="h-10 rounded-xl bg-blue-600 px-6 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 cursor-pointer"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function MethodOptionCard({
  method,
  title,
  subtitle,
  color,
  selected,
  onClick,
}: {
  method: PaymentMethodType;
  title: string;
  subtitle: string;
  color: "red" | "blue" | "green" | "orange";
  selected: boolean;
  onClick: () => void;
}) {
  const colorStyles = {
    red: {
      border: "border-red-500 dark:border-red-500",
      bgSelected: "bg-red-50/60 dark:bg-red-950/25",
      text: "text-red-700 dark:text-red-400",
      iconBg: "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-300",
      indicator: "border-red-500 bg-red-500",
    },
    blue: {
      border: "border-blue-500 dark:border-blue-500",
      bgSelected: "bg-blue-50/60 dark:bg-blue-950/25",
      text: "text-blue-700 dark:text-blue-400",
      iconBg: "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300",
      indicator: "border-blue-500 bg-blue-500",
    },
    green: {
      border: "border-emerald-500 dark:border-emerald-500",
      bgSelected: "bg-emerald-50/60 dark:bg-emerald-950/25",
      text: "text-emerald-700 dark:text-emerald-400",
      iconBg: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300",
      indicator: "border-emerald-500 bg-emerald-500",
    },
    orange: {
      border: "border-amber-500 dark:border-amber-500",
      bgSelected: "bg-amber-50/60 dark:bg-amber-950/25",
      text: "text-amber-700 dark:text-amber-400",
      iconBg: "bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-300",
      indicator: "border-amber-500 bg-amber-500",
    },
  }[color];

  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex items-center gap-2.5 rounded-xl border-2 p-2.5 text-left transition cursor-pointer ${selected
        ? `${colorStyles.border} ${colorStyles.bgSelected}`
        : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800/60"
        }`}
    >
      <div className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${colorStyles.iconBg}`}>
        {method === "CardPayment" ? (
          <CreditCard className="size-4" />
        ) : (
          <Smartphone className="size-4" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{title}</p>
        <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{subtitle}</p>
      </div>
      <div
        className={`size-4 rounded-full border-2 flex items-center justify-center ${selected
          ? `${colorStyles.indicator}`
          : "border-slate-300 dark:border-slate-600"
          }`}
      >
        {selected ? <span className="size-1.5 rounded-full bg-white" /> : null}
      </div>
    </button>
  );
}
