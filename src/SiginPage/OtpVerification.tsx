import React, { useEffect } from "react";
import { useState } from "react";
import { useAppDispatch } from "../reducers/hooks";
import { resendOTP, sendOtp } from "../services/operations/authApi";
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
  const loading = useAppSelector((state) => state.auth.loading);
  const [ready, setReady] = useState(false); // 👈 block render initially



useEffect(() => {
    // Only allow access of this route when user has filled the signup form
    if (!userEmail) {
      navigate("/signup");
    } else {
      setReady(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, userEmail]);
 

  const resendOtpHandler = () => {
    // console.log("Printing User Email",userEmail);
    const email = userEmail;
    dispatch(resendOTP(email));
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

  const otpContext = useAppSelector((state) => state.auth.otpContext);
  useEffect(() => {
    console.log("otpContext : ", otpContext);
  }, [otpContext]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // if (otpContext === "signupOTP") {
    //   dispatch(sendOtp(otp, userEmail, navigate));
    // }
    //  else if (otpContext === "signup") {
    //   dispatch(verifySignupOtp(otp));
    // } else if (otpContext === "forgot") {
    //   dispatch(verifyForgotPasswordOtp(otp));
    // }
    if (isDisabled) return; // 👈 prevent rapid clicks
    setIsDisabled(true); // 👈 disable button
    setTimeout(() => {
      setIsDisabled(false);
    }, 2000);
    dispatch(sendOtp(otp, userEmail, navigate));
  };

  if (!ready) return null; // ⛔️ Block rendering before token check

  return (
    <form onSubmit={handleSubmit}>
      <div className="min-h-screen flex items-center justify-center bg-sky-100 p-4">
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
          <p className="text-sm text-[#777777] mb-3">
            We have sent an OTP to your e-mail address
          </p>

          <PopUpMessage/>

          <div className="flex justify-center gap-2 mb-8 mt-2">
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

          {!loading ? (
            <button
              type="submit"
              disabled={isDisabled}
              className={`w-full bg-sky-700 hover:bg-sky-600 text-white font-semibold h-10 rounded-lg transition text-base ${
                isDisabled ? "cursor-not-allowed opacity-70" : "cursor-pointer"
              }`}
            >
              Sign up
            </button>
          ) : (
            <button
              disabled
              className="flex flex-col items-center justify-center w-full bg-sky-700 text-white h-10 rounded-lg transition text-base cursor-not-allowed"
            >
              <ClipLoader color="#ffffff" size={20} />
            </button>
          )}

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

export default OtpVerification;
