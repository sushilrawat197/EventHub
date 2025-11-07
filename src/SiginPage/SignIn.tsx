import React, { useState } from "react";
import { FaLock, FaEnvelope } from "react-icons/fa";
import { AiFillEye } from "react-icons/ai";
import { TbEyeClosed } from "react-icons/tb";
import { Link, useLocation } from "react-router-dom";
import { signIn } from "../services/operations/authApi";
import { useAppDispatch, useAppSelector } from "../reducers/hooks";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import PopUpMessage from "./popUpMassage";
// import OpenRoute from "../route/OpenRoute";

const SignIn: React.FC = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const loading = useAppSelector((state) => state.auth.loading);

  const [inputEmail, setInputEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);

  const from = (location.state?.from || "").replace(/^\/ticketing/, "");

  console.log("PRINTING FROM...",from);
  

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    if (isDisabled) return; // 👈 prevent rapid clicks

    setIsDisabled(true);

    e.preventDefault();
    // console.log("Printing Email=", email);
    dispatch(signIn(inputEmail, password, navigate, dispatch,from));
    // console.log(thunk)
    // 👇 re-enable button after 2 seconds
    setTimeout(() => {
      setIsDisabled(false);
    }, 2000);
  };

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="max-h-[calc(100vh-100px)]  flex items-start justify-center pt-16 p-4">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        <div className="flex flex-col lg:flex-row min-h-[450px]">

          {/* Left Side - Hero Section */}
          <div className="lg:w-1/2 hidden lg:block bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 relative overflow-hidden">
            <div className="absolute inset-0 bg-black/20"></div>
           
            <div className="relative h-full flex flex-col justify-center items-center p-6 text-white">
          
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10 hi">
                <div className="absolute top-8 left-8 w-20 h-20 bg-white rounded-full blur-3xl"></div>
                <div className="absolute bottom-8 right-8 w-24 h-24 bg-white rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full blur-2xl"></div>
              </div>
              
              <div className="relative z-10 text-center">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold mb-3">Welcome Back</h1>
                <p className="text-lg text-blue-100 mb-6 max-w-sm">
                  Sign in to your account and continue your journey with us
                </p>
                <div className="flex items-center justify-center gap-4 text-blue-100">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-sm">Secure Login</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-sm">Fast Access</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span className="text-sm">24/7 Support</span>
                  </div>
                </div>
              </div>
            </div>
        </div>

          {/* Right Side - Login Form */}
          <div className="lg:w-1/2 p-6 lg:p-8 flex flex-col justify-center">
            {/* Header */}
            <div className="text-center mb-6">
              {/* <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <img
                  src="ticketlogo2.jpg"
                  alt="EventHub Logo"
                  className="w-12 h-12 object-contain"
                />
              </div> */}
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign In</h2>
              <p className="text-sm text-gray-600">Enter your credentials to access your account</p>
            </div>

            <form onSubmit={submitHandler} className="space-y-4">
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
                value={inputEmail}
                onChange={(e) => setInputEmail(e.target.value)}
                type="email"
                    placeholder="Enter your email"
                aria-label="Email"
                    className="w-full pl-12 pr-4 py-2 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-300 bg-gray-50 focus:bg-white text-base font-medium"
              />
                </div>
            </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaLock className="w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                  </div>
              <input
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                aria-label="Password"
                    className="w-full pl-12 pr-12 py-2 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-300 bg-gray-50 focus:bg-white text-base font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                      <TbEyeClosed size={20} />
                ) : (
                      <AiFillEye size={20} />
                )}
              </button>
                </div>
            </div>

              {/* Forgot Password */}
              <div className="flex justify-end">
              <Link
                  className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                to={"/forgetpassword"}
              >
                  Forgot your password?
              </Link>
            </div>

            {/* Sign In Button */}
            {!loading ? (
              <button
                type="submit"
                disabled={isDisabled}
                  className={`w-full py-2 rounded-xl font-bold text-base transition-all duration-300 flex items-center justify-center gap-3 ${
                  isDisabled
                      ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
                }`}
              >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Sign In
              </button>
            ) : (
              <button
                disabled
                  className="w-full py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-base flex items-center justify-center gap-3"
              >
                <ClipLoader color="#ffffff" size={20} />
                  <span>Signing In...</span>
              </button>
            )}

              {/* Divider */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-white text-gray-500 font-medium">or continue with</span>
                </div>
            </div>

            {/* Google Sign In */}
            <button
            type="button"
              onClick={() => {
                window.location.href =
                  "https://www.mytag.co.ls/ticketcore-api/oauth2/authorization/google";
              }}
                className="w-full py-3 px-4 border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 flex items-center justify-center gap-3"
            >
              <img title="Google" src="google-icon.svg" className="w-5 h-5" />
              Sign in with Google
            </button>

            {/* Create Account */}
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{" "}
                  <Link 
                    to={"/signup"} 
                    className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                  >
                    Create one now
              </Link>
            </p>
              </div>
          </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
