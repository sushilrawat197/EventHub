import React, { useState, useEffect } from "react";
import OtpInput from "react-otp-input";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { cPayPayment } from "../../../services/operations/ticketCategory";

const VerifyTicketOtp: React.FC = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const { state } = useLocation();
  const mobile = state?.mobile;

  const [otp, setOtp] = useState<string>("");
  const [timer, setTimer] = useState<number>(60);

  // =============== TIMER ===============
  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  // =============== SUBMIT OTP ===============
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      toast.error("Please enter valid 6-digit OTP");
      return;
    }

    const res = await cPayPayment(Number(bookingId), otp, mobile, navigate);

    if (res.success) {
      toast.success("Ticket verified successfully!");
      navigate(`/booking-confirmed/${bookingId}`, { replace: true });
    } else {
      toast.error(res.message);
    }
  };

  
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 animate-scaleIn">
        <h2 className="text-2xl font-bold text-center mb-6">
          Verify Ticket OTP
        </h2>

        <p className="text-center text-gray-600 mb-4">
          OTP sent to your mobile number
          <br />
          <span className="font-semibold">{mobile}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* OTP FIELD */}
          <div className="flex justify-center">
            <OtpInput
              value={otp}
              onChange={setOtp}
              numInputs={6}
              renderInput={(props) => (
                <input
                  {...props}
                  className="w-10 h-12 text-center border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-xl font-bold bg-gray-50"
                  placeholder="-"
                />
              )}
              containerStyle={{ justifyContent: "center", gap: 12 }}
            />
          </div>

          {/* SUBMIT BTN */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 rounded-xl hover:opacity-95 transition"
          >
            Verify OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyTicketOtp;
