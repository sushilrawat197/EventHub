import React, { useState } from "react";
import { FaLock, FaEnvelope } from "react-icons/fa";
import { AiFillEye } from "react-icons/ai";
import { TbEyeClosed } from "react-icons/tb";
import { Link } from "react-router-dom";
import { signIn } from "../services/operations/authApi";
import { useAppDispatch, useAppSelector } from "../reducers/hooks";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import PopUpMessage from "./popUpMassage";
// import OpenRoute from "../route/OpenRoute";

const SignIn: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const loading = useAppSelector((state) => state.auth.loading);

  const [inputEmail, setInputEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    if (isDisabled) return; // 👈 prevent rapid clicks

    setIsDisabled(true);

    e.preventDefault();
    // console.log("Printing Email=", email);
    dispatch(signIn(inputEmail, password, navigate, dispatch));
    // console.log(thunk)
    // 👇 re-enable button after 2 seconds
    setTimeout(() => {
      setIsDisabled(false);
    }, 2000);
  };

  const [showPassword, setShowPassword] = useState(false);
  //   const handleGoogleClick = () => {
  //   window.location.href = "https://thedemonstrate.com/GenericAuthService/oauth2/authorization/google";
  // };

  return (
    <div className="lg:min-h-[calc(100vh-6rem)] min-h-[calc(100vh-40px)] flex items-center justify-center bg-sky-100 p-4 ">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg flex flex-col md:flex-row ">
        <div className="hidden md:flex md:w-1/2 flex-col justify-center items-center p-6 bg-sky-200">
          <img
            src="mainimg.jpg"
            alt="Slider"
            className="max-w-[90%] h-auto  rounded-xl shadow-lg"
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
          <div className="w-full px-11 text-center pb-3"></div>

          {/* <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center ">
            Sign in
            <div className="w-16 h-1 bg-sky-700 mt-1 rounded-full mx-auto" />
          </h2> */}

          <form onSubmit={submitHandler} className="w-full max-w-sm space-y-3">
            {/* Email */}

            <PopUpMessage />
            <div className="relative">
              <FaEnvelope className="absolute top-3 left-3 text-gray-400" />
              <input
                required
                value={inputEmail}
                onChange={(e) => setInputEmail(e.target.value)}
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
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                aria-label="Password"
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-base"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 cursor-pointer "
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
              <Link
                className="text-sm text-sky-600 hover:underline"
                to={"/forgetpassword"}
              >
                Forgot password?
              </Link>
            </div>

            {/* Sign In Button */}

            {!loading ? (
              <button
                type="submit"
                disabled={isDisabled}
                className={`w-full bg-sky-700 hover:bg-sky-600 text-white font-semibold h-10 rounded-lg transition text-base ${
                  isDisabled
                    ? "cursor-not-allowed opacity-70"
                    : "cursor-pointer"
                }`}
              >
                Login
              </button>
            ) : (
              <button
                disabled
                className="flex flex-col items-center justify-center w-full bg-sky-700 text-white h-10 rounded-lg transition text-base cursor-pointer select-none "
              >
                <ClipLoader color="#ffffff" size={20} />
              </button>
            )}

            {/* OR Divider */}
            <div className="flex items-center my-4">
              <div className="flex-grow h-px bg-gray-300" />
              <span className="px-2 text-sm text-gray-500">or</span>
              <div className="flex-grow h-px bg-gray-300" />
            </div>


            {/* Google Sign In */}
            <button
            type="button"
              onClick={() => {
                window.location.href =
                  "https://thedemonstrate.com/ticketcore-api/oauth2/authorization/google";
              }}
              className="w-full bg-blue-100 cursor-pointer flex items-center justify-center gap-2 border border-sky-500 py-2 rounded-lg text-sm font-medium text-[#777777] hover:bg-gray-100 transition"
            >
              <img title="Google" src="google-icon.svg" className="w-4 h-4" />
              Sign in with Google
            </button>


            {/* Create Account */}
            <p className="text-center text-sm mt-4">
              Are you new?{" "}
              <Link to={"/signup"} className="text-sky-600 hover:underline">
                Create an Account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
