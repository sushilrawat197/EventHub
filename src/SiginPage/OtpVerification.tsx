import React from "react";
import { useState } from "react";
import { useAppDispatch } from "../reducers/hooks";
import { resendOTP, sendOtp } from "../services/operations/authApi";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../reducers/hooks";
import OtpInput from "react-otp-input";
import { ClipLoader } from "react-spinners";

const OtpVerification: React.FC = () => {
  // const OTP_LENGTH = 6;

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // OTP state as array of strings
  // const [otp, setOtp] = useState<string[]>(new Array(OTP_LENGTH).fill(""));

  const [otp, setOtp] = useState<string>("");
  const [isDisabled, setIsDisabled] = useState(false); 

  const userEmail = useAppSelector((state) => state.auth.userEmail);
   const loading = useAppSelector((state) => state.auth.loading);
  // console.log(userEmail);

  // Handler for OTP input change

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
     if (isDisabled) return; // 👈 prevent rapid clicks
    setIsDisabled(true); // 👈 disable button
    dispatch(sendOtp(otp, userEmail, navigate));
     setTimeout(() => {
      setIsDisabled(false);
    }, 2000);
  };

  const resendOtpHandler = () => {
    // console.log("Printing User Email",userEmail);
    const email = userEmail;
    dispatch(resendOTP(email));
  };

  

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
            <button
              type="button"
              onClick={resendOtpHandler}
              className="text-sky-600 hover:underline font-medium cursor-pointer "
            >
              Resend OTP
            </button>
          </p>
        </div>
      </div>
    </form>
  );
};

export default OtpVerification;
