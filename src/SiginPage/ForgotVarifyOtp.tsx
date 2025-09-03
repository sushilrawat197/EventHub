import React from "react";
import { useState } from "react";
import { useAppDispatch } from "../reducers/hooks";
import { forgotp_password_resend_OTP, varifyFogotOtp} from "../services/operations/authApi";
import { useAppSelector } from "../reducers/hooks";
// import { varifySignInOTP } from "../services/operations/authApi";
import OtpInput from "react-otp-input";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ForgotVarifyOtp: React.FC = () => {

  const resetToken=useAppSelector((state)=>state.auth.pwdToken);


  const dispatch = useAppDispatch();
  const navigate = useNavigate();


  const [otp, setOtp] = useState<string>("");

  // === New State for Timer ===
  const [timer, setTimer] = useState<number>(10); // 2 minutes in seconds



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



  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault();
    
    dispatch(varifyFogotOtp(resetToken,otp,dispatch,navigate));
  };


  // Format time mm:ss
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (time % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

    const resendOtpHandler = () => {
    dispatch(forgotp_password_resend_OTP(resetToken));
    setTimer(10); // Reset timer to 2 minutes again
  };



  return (
    <form onSubmit={handleSubmit}>
      <div className="lg:min-h-[calc(100vh-6rem)] min-h-[calc(100vh-40px)] flex items-center justify-center bg-sky-200 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm text-center">
          {/* Logo */}
          <div className="mb-6">
            <img
              src="ticketlogo2.jpg"
              alt="logo"
              className="mx-auto h-[2.2rem] mb-4 rounded"
            />
          </div>

          <h2 className="text-2xl sm:text-3xl font-semibold text-black mb-1">
            Enter OTP
          </h2>
          <p className="text-sm text-[#777777] mb-8">
            We have sent an OTP to your e-mail address
          </p>

          <div className="flex justify-center gap-2 mb-8">
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
                  className="w-10 h-12 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-lg"
                />
              )}
              containerStyle={{
                justifyContent: "space-between",
                gap: "0 6px",
              }}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-sky-700 hover:bg-sky-600 text-white font-semibold py-2 rounded-md transition text-base cursor-pointer "
          >
            Verify
          </button>

          <p className="text-sm text-[#777777] mt-4">
            Didn’t receive code?{" "}
            {timer > 0 ? (
              <span className="text-blue-600 opacity-50 font-medium ml-1 cursor-pointer underline">
                Resend OTP in {formatTime(timer)}
              </span>
            ) : (
              <button
                type="button"
                onClick={resendOtpHandler}
                className="text-sky-600 hover:underline font-medium cursor-pointer"
              >
                Resend OTP
              </button>
              
            )}

          </p>
        </div>
      </div>
    </form>
  );
};

export default ForgotVarifyOtp;
