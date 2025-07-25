import React, { useEffect, useState } from "react";
import { FaLock, FaEnvelope } from "react-icons/fa";
import { AiFillEye } from "react-icons/ai";
import { TbEyeClosed } from "react-icons/tb";

const SignIn: React.FC = () => {
  const [] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-sky-200 to-white p-4">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg flex flex-col md:flex-row overflow-hidden">
        <div className="hidden md:flex md:w-1/2 flex-col justify-center items-center p-6 bg-sky-200">
          <img
            src="mainimg.jpg"
            alt="Slider"
            className="max-w-[90%] h-auto  rounded-xl shadow-lg transition-all duration-500"
          />
        </div>

        {/* Right Form */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-10 flex flex-col items-center justify-center">
          {/* Logo */}
          <img
            src="ticketlogo2.jpg"
            alt="Ticket  Logo"
            className="w-24 h-12 object-contain mb-4   "
          />

          {/* <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center ">
            Sign in
            <div className="w-16 h-1 bg-sky-700 mt-1 rounded-full mx-auto" />
          </h2> */}

          <form className="w-full max-w-sm space-y-3">
            {/* Email */}
            <div className="relative">
              <FaEnvelope className="absolute top-3 left-3 text-gray-400" />
              <input
                type="email"
                placeholder="Email"
                aria-label="Email"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-base"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <FaLock className="absolute top-3 left-3 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                aria-label="Password"
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-base"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <TbEyeClosed size={18} />
                ) : (
                  <AiFillEye size={18} />
                )}
              </button>
            </div>

            {/* Forgot */}
            <div className="text-right">
              <a href="#" className="text-sm text-sky-600 hover:underline">
                Forgot password?
              </a>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              className="w-full bg-sky-700 hover:bg-sky-600 text-white font-semibold py-2 rounded-lg transition text-base"
            >
              Sign in
            </button>

            {/* OR Divider */}
            <div className="flex items-center my-4">
              <div className="flex-grow h-px bg-gray-300" />
              <span className="px-2 text-sm text-gray-500">or</span>
              <div className="flex-grow h-px bg-gray-300" />
            </div>

            {/* Google Sign In */}
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 border border-gray-400 py-2 rounded-lg text-sm font-medium text-[#777777] hover:bg-gray-100 transition"
            >
              <img title="Google" src="google-icon.svg" className="w-4 h-4" />{" "}
              Sign in with Google
            </button>

            {/* Create Account */}
            <p className="text-center text-sm mt-4">
              Are you new?{" "}
              <a href="#" className="text-sky-600 hover:underline">
                Create an Account
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
