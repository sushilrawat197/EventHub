import React, {  useState } from "react";
import { FaEnvelope } from "react-icons/fa";
import { signUp } from "../services/operations/authApi";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../reducers/hooks";
// import { useAppSelector } from "../reducers/hooks";
// import { userEmail } from "../slices/authSlice";

export default function SignUp() {
 
  const navigate = useNavigate();
   const dispatch=useAppDispatch();
   
  const [email, setEmail] = useState("");


  const submitHandler = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // console.log("Printing Email=", email);
    dispatch(signUp(email, navigate,dispatch));
    // console.log(thunk)
  };

  

  return (
    <form onSubmit={submitHandler}>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-sky-200 to-white p-4">
        <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg flex flex-col md:flex-row overflow-hidden">
          <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-10 flex flex-col justify-center">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <img
                src="ticketlogo2.jpg"
                alt="Ticket  Logo"
                className="h-[2.2rem]"
              />
            </div>

            {/* Heading */}
            {/* <h2 className="text-2xl font-bold text-center text-black mb-4">
            Sign Up
          </h2> */}

            <div className="relative mb-4">
              <FaEnvelope className="absolute top-3 left-3 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-sky-700 hover:bg-sky-600 text-white font-semibold py-2 rounded-md transition"
            >
              Sign Up
            </button>
          </div>

          <div className="hidden md:flex md:w-1/2 flex-col justify-center items-center p-6 bg-sky-200">
            <img
              src="mainimg.jpg"
              alt="Slider"
              className="max-w-[90%] h-auto  rounded-xl shadow-lg transition-all duration-500"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
