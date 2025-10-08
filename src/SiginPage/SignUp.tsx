import React, { useState } from "react";
import { FaEnvelope } from "react-icons/fa";
import { signUp } from "../services/operations/authApi";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../reducers/hooks";
import { ClipLoader } from "react-spinners";
import PopUpMessage from "./popUpMassage";

export default function SignUp() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState("");
  const [isDisabled, setIsDisabled] = useState(false); // 👈 new state

  const loading = useAppSelector((state) => state.auth.loading);



  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isDisabled) return; // 👈 prevent rapid clicks
    setIsDisabled(true); // 👈 disable button
    dispatch(signUp(email, navigate, dispatch));
    // 👇 re-enable button after 2 seconds
    setTimeout(() => {
      setIsDisabled(false);
    }, 2000);
  };


  return (
    <div className="max-h-[calc(100vh-120px)]  flex items-start justify-center pt-16 p-4">
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold mb-3">Join Mytag</h1>
                <p className="text-lg text-blue-100 mb-6 max-w-sm">
                  Create your account and start discovering amazing events
                </p>
                <div className="flex items-center justify-center gap-4 text-blue-100">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-sm">Easy Signup</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-sm">Quick Access</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span className="text-sm">Secure Process</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Sign Up Form */}
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
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h2>
              <p className="text-sm text-gray-600">
                Enter your email address to get started
              </p>
            </div>

            <form onSubmit={submitHandler} className="w-full space-y-4">
              <PopUpMessage />

              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaEnvelope className="w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                  </div>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-300 bg-gray-50 focus:bg-white text-base font-medium"
                  />
                </div>
              </div>

              {/* Submit Button */}
              {!loading ? (
                <button
                  type="submit"
                  disabled={isDisabled}
                  className={`w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                    isDisabled
                      ? "cursor-not-allowed opacity-70"
                      : "cursor-pointer"
                  }`}
                >
                  Create Account
                </button>
              ) : (
                <button
                  disabled
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-3"
                >
                  <ClipLoader color="#ffffff" size={20} />
                  <span>Creating Account...</span>
                </button>
              )}

              {/* Sign In Link */}
              <div className="text-center pt-4">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
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
}
