import { ClipLoader } from "react-spinners";

export type PaymentMethodType = "Mpesa" | "Cpay" | "CardPayment" | "EcoCash";

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
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Payment Details</h1>
          <p className="text-sm text-gray-600">Complete your secure payment</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Methods */}
        <div>
          <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-5 h-5 bg-green-100 rounded-md flex items-center justify-center">
              <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            Payment Method
          </h2>

          <div className="grid grid-cols-1 gap-3">
            <MethodCard
              method="Mpesa"
              title="M-Pesa"
              subtitle="Most Popular"
              colorClass="green"
              selectedMethod={selectedMethod}
              onClick={() => setSelectedMethod("Mpesa")}
            />
            <MethodCard
              method="Cpay"
              title="C-Pay"
              subtitle="Secure & Fast"
              colorClass="blue"
              selectedMethod={selectedMethod}
              onClick={() => setSelectedMethod("Cpay")}
            />
            <MethodCard
              method="EcoCash"
              title="EcoCash"
              subtitle="Mobile Wallet"
              colorClass="amber"
              selectedMethod={selectedMethod}
              onClick={() => setSelectedMethod("EcoCash")}
            />
            <MethodCard
              method="CardPayment"
              title="Card Payment"
              subtitle="Debit / Credit Card"
              colorClass="purple"
              selectedMethod={selectedMethod}
              onClick={() => setSelectedMethod("CardPayment")}
            />
          </div>
        </div>

        {/* Mobile Input & Submit */}
        <div>
          <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-5 h-5 bg-purple-100 rounded-md flex items-center justify-center">
              <svg className="w-3 h-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            Mobile Number
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Enter your registered Mobile Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter Mobile Number"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-all duration-300 bg-gray-50 focus:bg-white text-base"
                  maxLength={12}
                />
              </div>
            </div>

            <button
              onClick={submitHandler}
              disabled={!isValid || Boolean(paymentLoading) || cpayLoading}
              className={`w-full py-3 rounded-lg font-bold text-base transition-all duration-300 flex items-center justify-center gap-2 ${
                isValid
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
                  : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }`}
            >
              {paymentLoading || cpayLoading ? (
                <>
                  <ClipLoader size={16} color="#ffffff" />
                  <span>Processing Payment...</span>
                </>
              ) : (
                <span>Verify & Pay</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Colorful MethodCard Component with Checkmark
function MethodCard({ method, title, subtitle, colorClass, selectedMethod, onClick }: any) {
  const isSelected = selectedMethod === method;

  // Define color mappings for selected vs default states
  const colorMap: Record<string, any> = {
    green: {
      border: "border-green-500",
      borderDefault: "border-green-200",
      borderHover: "hover:border-green-400",
      bgSelected: "bg-green-50",
      text: "text-green-600",
      dot: "bg-green-500",
      iconBg: "bg-green-100",
      iconBgDefault: "bg-green-50"
    },
    blue: {
      border: "border-blue-500",
      borderDefault: "border-blue-200",
      borderHover: "hover:border-blue-400",
      bgSelected: "bg-blue-50",
      text: "text-blue-600",
      dot: "bg-blue-500",
      iconBg: "bg-blue-100",
      iconBgDefault: "bg-blue-50"
    },
    amber: {
      border: "border-amber-500",
      borderDefault: "border-amber-200",
      borderHover: "hover:border-amber-400",
      bgSelected: "bg-amber-50",
      text: "text-amber-600",
      dot: "bg-amber-500",
      iconBg: "bg-amber-100",
      iconBgDefault: "bg-amber-50"
    },
    purple: {
      border: "border-purple-500",
      borderDefault: "border-purple-200",
      borderHover: "hover:border-purple-400",
      bgSelected: "bg-purple-50",
      text: "text-purple-600",
      dot: "bg-purple-500",
      iconBg: "bg-purple-100",
      iconBgDefault: "bg-purple-50"
    },
  };

  const colors = colorMap[colorClass];

  return (
    <div
      className={`group relative p-4 border-2 rounded-2xl transition-all duration-300 cursor-pointer ${
        isSelected
          ? `${colors.border} ${colors.bgSelected} shadow-md`
          : `${colors.borderDefault} bg-white ${colors.borderHover} hover:shadow-sm`
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          
          {/* Main Icon Shape */}
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-300 ${isSelected ? colors.iconBg : colors.iconBgDefault}`}>
            <div className={`w-6 h-6 rounded-md ${colors.dot} ${isSelected ? "opacity-100" : "opacity-70"} transition-opacity`}></div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
            {/* Colored Subtitle & Dot (Always visible) */}
            <div className="flex items-center gap-2 mt-0.5">
              <div className={`w-2 h-2 rounded-full ${colors.dot}`}></div>
              <span className={`text-sm font-medium ${colors.text}`}>
                {subtitle}
              </span>
            </div>
          </div>
        </div>
        
        {/* Selection Indicator (Tick mark or empty circle) */}
        <div>
          {isSelected ? (
            <div className={`w-7 h-7 rounded-full flex items-center justify-center ${colors.dot} shadow-sm transition-transform duration-300 scale-110`}>
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          ) : (
            <div className="w-7 h-7 rounded-full border-2 border-gray-200 bg-gray-50 transition-colors duration-300"></div>
          )}
        </div>
      </div>
    </div>
  );
}