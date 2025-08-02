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
    <form onSubmit={submitHandler}>
      <div className="h-screen flex items-center justify-center bg-sky-100 p-4">
        <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg flex flex-col md:flex-row">
          <div className="md:w-1/2 py-6 md:p-20 flex flex-col justify-center">
            {/* Logo */}
            <div className="flex justify-center mb-10">
              <img
                src="ticketlogo2.jpg"
                alt="Ticket Logo"
                className="h-[3.2rem]"
              />
            </div>

            {/* Heading */}
            <p className="text-sm text-[#777777] text-center mb-4 flex flex-col gap-1">
              Enter your email address
              <PopUpMessage/>
            </p>

            {/* Input */}
            <div className="relative mb-10">
              <FaEnvelope className="absolute top-3 left-3 text-gray-400" />
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
              />
            </div>

            {/* Submit Button */}
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
          </div>

          {/* Right Image Section */}
          <div className="hidden md:flex md:w-1/2 flex-col justify-center items-center bg-sky-200">
            <img
              src="mainimg.jpg"
              alt="Slider"
              className="max-w-[90%] h-auto rounded-xl shadow-lg"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
