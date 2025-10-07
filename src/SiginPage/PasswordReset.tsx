"use client";
import { useEffect, useState } from "react";
import { FaLock } from "react-icons/fa";
import { useAppDispatch } from "../reducers/hooks";
import { resetPassword } from "../services/operations/authApi";
import { useNavigate } from "react-router-dom";
import { setMassage } from "../slices/authSlice";
import hasSequentialPattern from "./hasSequentialPattern";
import PopUpMessage from "./popUpMassage";
import { useAppSelector } from "../reducers/hooks";

export default function PasswordReset() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const [ready, setReady] = useState(false); // 👈 block render initially
  console.log(ready);

  const pwdToken = useAppSelector((state) => state.auth.pwdToken);
  const otp = useAppSelector((state) => state.auth.otp);
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

  useEffect(() => {
    if (!pwdToken) {
      navigate("/login");
    } else {
      setReady(true); // ✅ allow render once token exists
    }
  }, [pwdToken, navigate]);



  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newPass !== confirmPass) {
      dispatch(setMassage("Passwords do not match."));
      // toast.error("Passwords do not match.");
      return;
    } else if (newPass.length < 8) {
      dispatch(setMassage("Passwords must be at least 8 characters."));
      // toast.error("Passwords must be at least 8 characters");
      return;
    } else if (!passwordRegex.test(newPass)) {
      // setError(true);
      dispatch(setMassage("Passwords inclued spacial char."));
      // console.log("Must inclued spacial char", error);
      return;
    } else if (hasSequentialPattern(newPass)) {
      // setHidden(true);
      dispatch(
        setMassage("Password should not contains sequential letters or numbers")
      );
      console.log("Password should not contains sequential letters or numbers");
    }


    if (isDisabled) return; // 👈 prevent rapid clicks

    setIsDisabled(true);
    console.log(otp);

    dispatch(resetPassword(pwdToken, otp, newPass , navigate));

    setTimeout(() => {
      setIsDisabled(false);
    }, 2000);
  };



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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold mb-3">Reset Password</h1>
                <p className="text-lg text-blue-100 mb-6 max-w-sm">
                  Create a strong, secure password for your account
                </p>
                <div className="flex items-center justify-center gap-4 text-blue-100">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-sm">Secure Reset</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-sm">Strong Password</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span className="text-sm">Safe Process</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Password Reset Form */}
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
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Change Password</h2>
              <p className="text-sm text-gray-600">
                Set your new password below
              </p>
            </div>

            <form onSubmit={handleSubmit} className="w-full space-y-4">
              <PopUpMessage />

              {/* New Password Field */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">New Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaLock className="w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                  </div>
                  <input
                    type="password"
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    placeholder="Enter your new password"
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-300 bg-gray-50 focus:bg-white text-base font-medium"
                  />
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Confirm Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaLock className="w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                  </div>
                  <input
                    type="password"
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    placeholder="Confirm your new password"
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-300 bg-gray-50 focus:bg-white text-base font-medium"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isDisabled}
                onClick={() => console.log("Change clicked")}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                Change Password
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
