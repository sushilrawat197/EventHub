import React, { useEffect } from "react";
import { useState } from "react";
import { useAppDispatch } from "../reducers/hooks";
import { resend_2fa_otp, resendOTP, sendOtp, verify_2fa_otp } from "../services/operations/authApi";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../reducers/hooks";
import OtpInput from "react-otp-input";
import { ClipLoader } from "react-spinners";
import PopUpMessage from "./popUpMassage";

const OtpVerification: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [otp, setOtp] = useState<string>("");
  const [isDisabled, setIsDisabled] = useState(false);

  const userEmail = useAppSelector((state) => state.auth.userEmail);
  const otpContext = useAppSelector((state) => state.auth.otpContext);
  const tempToken = useAppSelector((state) => state.auth.tempToken);
  const signupToken=useAppSelector((state)=>state.auth.signupToken)
  const loading = useAppSelector((state) => state.auth.loading);
  const [ready, setReady] = useState(false); // 👈 block render initially

  console.log(tempToken);


useEffect(() => {
  // Signup flow → email exist karna chahiye
  // 2FA flow → tempToken exist karna chahiye
  if (userEmail || tempToken) {
    setReady(true); // ✅ ready ho jaaye dono cases me
  } else {
    navigate("/signup"); // ❌ dono missing → redirect
  }
}, [navigate, userEmail, tempToken]);



  const resendOtpHandler = () => {


    if (otpContext=="2FA") {
      dispatch(resend_2fa_otp(tempToken));

    } else if(otpContext=="signup") {
       dispatch(resendOTP(userEmail));
    }
   
   

     setTimer(60);
  };
  

  const [timer, setTimer] = useState<number>(60); // 2 minutes in seconds
  // === Timer useEffect ===

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTime) => prevTime - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Format time mm:ss
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (time % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };



  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isDisabled) return; // 👈 prevent rapid clicks
    setIsDisabled(true); // 👈 disable button
    setTimeout(() => {
      setIsDisabled(false);
    }, 2000);

    if (otpContext=="2FA") {
      dispatch(verify_2fa_otp(tempToken,otp,navigate));
    } else if(otpContext=="signup"){
       dispatch(sendOtp(otp, userEmail, signupToken , navigate));
    }

  };


  if (!ready) return null; // ⛔️ Block rendering before token check

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-start justify-center pt-16 p-4">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        <div className="flex flex-col lg:flex-row min-h-[450px]">
          {/* Left Side - Hero Section */}
          <div className="lg:w-1/2 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 relative overflow-hidden">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative h-full flex flex-col justify-center items-center p-6 text-white">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-8 left-8 w-20 h-20 bg-white rounded-full blur-3xl"></div>
                <div className="absolute bottom-8 right-8 w-24 h-24 bg-white rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full blur-2xl"></div>
              </div>
              
              <div className="relative z-10 text-center">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold mb-3">Verify OTP</h1>
                <p className="text-lg text-blue-100 mb-6 max-w-sm">
                  We've sent a verification code to your email address
                </p>
                <div className="flex items-center justify-center gap-4 text-blue-100">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-sm">Secure Code</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-sm">Quick Verify</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span className="text-sm">Safe Process</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - OTP Form */}
          <div className="lg:w-1/2 p-6 lg:p-8 flex flex-col justify-center">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <img
                  src="ticketlogo2.jpg"
                  alt="EventHub Logo"
                  className="w-8 h-8 object-contain"
                />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Enter OTP</h2>
              <p className="text-sm text-gray-600">
                We have sent an OTP to your email address
              </p>
            </div>

            <form onSubmit={handleSubmit} className="w-full space-y-6">
              <PopUpMessage />

              {/* OTP Input Section */}
              <div className="space-y-4">
                <label className="text-sm font-semibold text-gray-700 text-center block">
                  Enter 6-digit verification code
                </label>
                <div className="flex justify-center">
                  <OtpInput
              value={otp}
              onChange={(otp: string) => setOtp(otp)}
              numInputs={6}
              renderInput={(props) => (
                <input
                  {...props}
                  placeholder="-"
                  style={{
                    boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                  }}
                  className="w-10 h-12 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500  text-lg"
                />
              )}
              containerStyle={{
                justifyContent: "space-between",
                gap: "0 6px",
              }}
            />
                </div>
              </div>

              {/* Verify Button */}
              {!loading ? (
                <button
                  type="submit"
                  disabled={isDisabled}
                  className={`w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                    isDisabled ? "cursor-not-allowed opacity-70" : "cursor-pointer"
                  }`}
                >
                  Verify OTP
                </button>
              ) : (
                <button
                  disabled
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-3"
                >
                  <ClipLoader color="#ffffff" size={20} />
                  <span>Verifying...</span>
                </button>
              )}

              {/* Resend OTP with Timer */}
              <div className="text-center pt-4">
                <p className="text-sm text-gray-600">
                  Didn't receive code?{" "}
                  {timer > 0 ? (
                    <span className="text-blue-600 opacity-50 font-medium ml-1 cursor-pointer underline">
                      Resend OTP in {formatTime(timer)}
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={resendOtpHandler}
                      className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                    >
                      Resend OTP
                    </button>
                  )}
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpVerification;
