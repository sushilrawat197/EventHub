import { ClipLoader } from "react-spinners";
import { Lock, ShieldCheck } from "lucide-react";

export type PaymentMethodType = "Mpesa" | "Cpay" | "CardPayment" | "EcoCash";

type MethodColorClass = "red" | "green" | "blue" | "orange" | "darkBlue";

type MethodColorConfig = {
  border: string;
  borderDefault: string;
  borderHover: string;
  bgSelected: string;
  text: string;
  dot: string;
  iconBg: string;
  iconBgDefault: string;
};

interface PaymentOptionsProps {
  selectedMethod: PaymentMethodType;
  setSelectedMethod: (method: PaymentMethodType) => void;
  mobile: string;
  setMobile: (mobile: string) => void;
  isValid: boolean;
  paymentLoading: boolean;
  cpayLoading: boolean;
  submitHandler: () => void;
}

export default function PaymentOptions({
  selectedMethod,
  setSelectedMethod,
  mobile,
  setMobile,
  isValid,
  paymentLoading,
  cpayLoading,
  submitHandler,
}: PaymentOptionsProps) {
  return (
    <div className="rounded-2xl sm:rounded-3xl border border-slate-200/90 bg-white p-4 sm:p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="flex size-9 sm:size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400">
            <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">Payment Details</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Choose method & enter mobile number</p>
          </div>
        </div>
        <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
          <ShieldCheck className="size-3.5" />
          <span>Secure</span>
        </div>
      </div>

      <div className="space-y-5">
        {/* Payment Methods */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
            Payment Method
          </label>
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <MethodCard
              method="Mpesa"
              title="M-Pesa"
              subtitle="Mobile Wallet"
              colorClass="red"
              selectedMethod={selectedMethod}
              onClick={() => setSelectedMethod("Mpesa")}
            />
            <MethodCard
              method="Cpay"
              title="C-Pay"
              subtitle="Mobile Wallet"
              colorClass="green"
              selectedMethod={selectedMethod}
              onClick={() => setSelectedMethod("Cpay")}
            />
            <MethodCard
              method="EcoCash"
              title="EcoCash"
              subtitle="Mobile Wallet"
              colorClass="darkBlue"
              selectedMethod={selectedMethod}
              onClick={() => setSelectedMethod("EcoCash")}
            />
            <MethodCard
              method="CardPayment"
              title="Card Payment"
              subtitle="Debit / Credit Card"
              colorClass="orange"
              selectedMethod={selectedMethod}
              onClick={() => setSelectedMethod("CardPayment")}
            />
          </div>
        </div>

        {/* Mobile Input & Submit Button */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">
              {selectedMethod === "CardPayment" ? "Contact Mobile Number" : `Registered ${selectedMethod} Mobile Number`}
            </label>
            <div className="relative">
              <input
                type="tel"
                inputMode="tel"
                placeholder="Enter Mobile Number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all bg-slate-50/60 focus:bg-white text-base font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:bg-slate-900"
                maxLength={12}
              />
            </div>
            <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
              {selectedMethod === "Mpesa"
                ? "You will receive an STK Push prompt on your mobile phone to authorize payment."
                : selectedMethod === "EcoCash"
                  ? "An EcoCash payment prompt will be pushed to your registered number."
                  : selectedMethod === "Cpay"
                    ? "A one-time OTP verification code will be sent to your mobile number."
                    : "A secure card payment gateway will open to complete the transaction."}
            </p>
          </div>

          <button
            type="button"
            onClick={submitHandler}
            disabled={!isValid || Boolean(paymentLoading) || cpayLoading}
            className={`w-full py-3.5 rounded-xl font-bold text-sm sm:text-base transition-all duration-200 flex items-center justify-center gap-2 ${
              isValid
                ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 active:scale-[0.99] cursor-pointer"
                : "bg-slate-200 text-slate-400 cursor-not-allowed dark:bg-slate-800 dark:text-slate-600"
            }`}
          >
            {paymentLoading || cpayLoading ? (
              <>
                <ClipLoader size={16} color="#ffffff" />
                <span>Processing Payment...</span>
              </>
            ) : (
              <>
                <Lock className="size-4" />
                <span>Verify & Pay</span>
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-1.5 pt-1 text-[11px] sm:text-xs text-slate-400 dark:text-slate-500">
            <ShieldCheck className="size-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>256-Bit SSL Encrypted & Protected Payment</span>
          </div>
        </div>
      </div>
    </div>
  );
}

type MethodCardProps = {
  method: PaymentMethodType;
  title: string;
  subtitle: string;
  colorClass: MethodColorClass;
  selectedMethod: PaymentMethodType;
  onClick: () => void;
};

function MethodCard({ method, title, subtitle, colorClass, selectedMethod, onClick }: MethodCardProps) {
  const isSelected = selectedMethod === method;

  const colorMap: Record<MethodColorClass, MethodColorConfig> = {
    red: {
      border: "border-red-500",
      borderDefault: "border-red-200",
      borderHover: "hover:border-red-400",
      bgSelected: "bg-red-50/70 dark:bg-red-500/10",
      text: "text-red-600 dark:text-red-400",
      dot: "bg-red-500",
      iconBg: "bg-red-100 dark:bg-red-500/20",
      iconBgDefault: "bg-red-50 dark:bg-red-500/10",
    },
    green: {
      border: "border-emerald-500",
      borderDefault: "border-emerald-200",
      borderHover: "hover:border-emerald-400",
      bgSelected: "bg-emerald-50/70 dark:bg-emerald-500/10",
      text: "text-emerald-600 dark:text-emerald-400",
      dot: "bg-emerald-500",
      iconBg: "bg-emerald-100 dark:bg-emerald-500/20",
      iconBgDefault: "bg-emerald-50 dark:bg-emerald-500/10",
    },
    blue: {
      border: "border-blue-500",
      borderDefault: "border-blue-200",
      borderHover: "hover:border-blue-400",
      bgSelected: "bg-blue-50/70 dark:bg-blue-500/10",
      text: "text-blue-600 dark:text-blue-400",
      dot: "bg-blue-500",
      iconBg: "bg-blue-100 dark:bg-blue-500/20",
      iconBgDefault: "bg-blue-50 dark:bg-blue-500/10",
    },
    orange: {
      border: "border-orange-500",
      borderDefault: "border-orange-200",
      borderHover: "hover:border-orange-400",
      bgSelected: "bg-orange-50/70 dark:bg-orange-500/10",
      text: "text-orange-600 dark:text-orange-400",
      dot: "bg-orange-500",
      iconBg: "bg-orange-100 dark:bg-orange-500/20",
      iconBgDefault: "bg-orange-50 dark:bg-orange-500/10",
    },
    darkBlue: {
      border: "border-sky-600",
      borderDefault: "border-sky-200",
      borderHover: "hover:border-sky-400",
      bgSelected: "bg-sky-50/70 dark:bg-sky-500/10",
      text: "text-sky-700 dark:text-sky-300",
      dot: "bg-sky-600",
      iconBg: "bg-sky-100 dark:bg-sky-500/20",
      iconBgDefault: "bg-sky-50 dark:bg-sky-500/10",
    },
  };

  const colors = colorMap[colorClass];

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative flex w-full flex-col justify-between rounded-xl sm:rounded-2xl border-2 p-3 text-left transition-all duration-200 cursor-pointer outline-none focus:outline-none focus:ring-0 focus-visible:outline-none ${
        isSelected
          ? `${colors.border} ${colors.bgSelected} shadow-sm`
          : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800/60 dark:hover:border-slate-600"
      }`}
    >
      <div className="flex items-center justify-between w-full">
        <div className={`size-8 rounded-lg flex items-center justify-center transition-colors ${isSelected ? colors.iconBg : colors.iconBgDefault}`}>
          <div className={`size-3.5 rounded-sm ${colors.dot} ${isSelected ? "opacity-100" : "opacity-75"} transition-opacity`} />
        </div>

        {/* Selection Indicator */}
        <div
          className={`size-5 rounded-full flex items-center justify-center transition-all ${
            isSelected
              ? `${colors.dot} text-white shadow-xs`
              : "border-2 border-slate-300 bg-slate-50 dark:border-slate-600 dark:bg-slate-800"
          }`}
        >
          {isSelected ? (
            <svg className="size-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          ) : null}
        </div>
      </div>

      <div className="mt-2.5">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{title}</h3>
        <p className={`mt-0.5 text-[11px] font-semibold ${colors.text} truncate`}>{subtitle}</p>
      </div>
    </button>
  );
}