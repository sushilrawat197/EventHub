import React, { useEffect } from "react";
import { FaEnvelope } from "react-icons/fa";
import { useAppDispatch } from "../reducers/hooks";
import { useNavigate } from "react-router-dom";
import { forgot_passwordOtp } from "../services/operations/authApi";
import { useState } from "react";
import { useAppSelector } from "../reducers/hooks";
import { ClipLoader } from "react-spinners";
import { setMassage } from "../slices/authSlice";

const ForgotPassword: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [inputEmail, setInputEmail] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);

   const loading = useAppSelector((state) => state.auth.loading);
   const {massage}= useAppSelector((state) => state.auth);

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
      if (isDisabled) return; // 👈 prevent rapid clicks

    setIsDisabled(true);
    e.preventDefault();
    dispatch(forgot_passwordOtp(inputEmail, dispatch, navigate));
     setTimeout(() => {
      setIsDisabled(false);
    }, 2000);
  };

  useEffect(()=>{
    return()=>{
      setMassage(null);
    }
  })
  
  
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold mb-3">Reset Password</h1>
                <p className="text-lg text-blue-100 mb-6 max-w-sm">
                  Don't worry! We'll help you regain access to your account
                </p>
                <div className="flex items-center justify-center gap-4 text-blue-100">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-sm">Secure Reset</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-sm">Quick Process</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span className="text-sm">24/7 Support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Reset Form */}
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
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Forgot Password</h2>
              <p className="text-sm text-gray-600">
                {massage ? massage : "Please confirm your registered email address"}
              </p>
            </div>

            <form className="w-full space-y-4" onSubmit={submitHandler}>
              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaEnvelope className="w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                  </div>
                  <input
                    value={inputEmail}
                    onChange={(e) => setInputEmail(e.target.value)}
                    required
                    type="email"
                    placeholder="Enter your email address"
                    aria-label="Email"
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-300 bg-gray-50 focus:bg-white text-base font-medium"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition-all duration-300 text-base"
                  onClick={() => window.history.back()}
                >
                  Cancel
                </button>

                {!loading ? (
                  <button
                    type="submit"
                    disabled={isDisabled}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    Submit
                  </button>
                ) : (
                  <button
                    disabled
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-3"
                  >
                    <ClipLoader color="#ffffff" size={20} />
                    <span>Sending...</span>
                  </button>
                )}
              </div>

              {/* Back to Login */}
              <div className="text-center pt-4">
                <p className="text-sm text-gray-600">
                  Remember your password?{" "}
                  <button
                    type="button"
                    className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                    onClick={() => window.history.back()}
                  >
                    Sign In
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
