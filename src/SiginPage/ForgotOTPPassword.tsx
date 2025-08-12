import React from "react";
import { useState } from "react";
import { useAppDispatch } from "../reducers/hooks";
import { forgotp_password_resend_OTP} from "../services/operations/authApi";
// import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../reducers/hooks";
// import { varifySignInOTP } from "../services/operations/authApi";
import OtpInput from "react-otp-input";


const ForgotOTPPassword: React.FC = () => {
  const dispatch = useAppDispatch();
  // const navigate = useNavigate();

  // OTP state as array of strings

  const [otp, setOtp] = useState<string>("");

  const userEmail = useAppSelector((state) => state.auth.userEmail);
  // const token = useAppSelector((state) => state.auth.userEmail);
  // console.log(userEmail);
//   const token = localStorage.getItem("tempToken") || "";

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // dispatch(varifySignInOTP(token, otp, dispatch, navigate));
  };

  
  const resendOtpHandler = () => {
    // console.log("Printing User Email",userEmail);
    const email = userEmail;
    dispatch(forgotp_password_resend_OTP(email));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="min-h-screen flex items-center justify-center bg-sky-200 p-4">
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

export default ForgotOTPPassword;
