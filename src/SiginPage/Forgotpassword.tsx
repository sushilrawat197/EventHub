import React from "react";
import { FaEnvelope } from "react-icons/fa";
import { useAppDispatch } from "../reducers/hooks";
import { useNavigate } from "react-router-dom";
import { forgot_passwordOtp } from "../services/operations/authApi";
import { useState } from "react";
import { useAppSelector } from "../reducers/hooks";
import { ClipLoader } from "react-spinners";

const ForgotPassword: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [inputEmail, setInputEmail] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);

   const loading = useAppSelector((state) => state.auth.loading);

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
      if (isDisabled) return; // 👈 prevent rapid clicks

    setIsDisabled(true);
    e.preventDefault();
    dispatch(forgot_passwordOtp(inputEmail, dispatch, navigate));
     setTimeout(() => {
      setIsDisabled(false);
    }, 2000);
  };

  return (
   
      <div className="min-h-screen flex items-center justify-center bg-sky-100 p-4">
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-6 sm:p-8 flex flex-col items-center">
          <img
            src="ticketlogo2.jpg"
            alt="MyTag Logo"
            className="w-20 h-20 object-contain mb-4 rounded"
          />

          <h2 className="text-xl sm:text-2xl font-bold text-black mb-1 text-center">
            Forgot Password
          </h2>
          <p className="text-sm text-[#777777] text-center mb-6">
            Please confirm your registered email address
          </p>

          <form className="w-full space-y-4" onSubmit={submitHandler}>
            <div className="relative">
              <FaEnvelope className="absolute top-3 left-3 text-gray-400" />
              <input
                value={inputEmail}
                onChange={(e) => setInputEmail(e.target.value)}
                required
                type="email"
                placeholder="Email"
                aria-label="Email"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-sky-500 text-base"
              />
            </div>

            <div className="flex justify-between gap-2">
              <button
                type="button"
                className="w-1/2 bg-gray-300 hover:bg-gray-400 text-black font-semibold py-2 rounded-full transition text-base cursor-pointer "
                onClick={() => window.history.back()}
              >
                Cancel
              </button>

              <div className="flex justify-center items-center w-1/2 text-center bg-sky-700 hover:bg-sky-600 text-white font-semibold py-2 rounded-full transition text-base cursor-pointer ">
                
                  {!loading ? (
              <button
                type="submit"
                disabled={isDisabled}
                className={`w-1/2  text-white font-semibold py-2 rounded-full transition text-base cursor-pointer  `}
              >
                Submit
              </button>
            ) : (
              <button
                disabled
                className={`w-1/2 flex flex-col items-center justify-centerfont-semibold py-2 rounded-full transition text-base cursor-pointer${
                  isDisabled ? "cursor-not-allowed opacity-70" : "cursor-pointer"
                } `}
              >
                <ClipLoader color="#ffffff" size={20} />
              </button>
            )}

                
              </div>
            </div>
          </form>
        </div>
      </div>
   
  );
};

export default ForgotPassword;
