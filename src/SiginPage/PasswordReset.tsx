"use client";
import { useState } from "react";
import { FaLock } from "react-icons/fa";
import { useAppSelector } from "../reducers/hooks";
import { TbPasswordUser } from "react-icons/tb";
import { useAppDispatch } from "../reducers/hooks";
import { resetPassword } from "../services/operations/authApi";
import { useNavigate } from "react-router-dom";
import { setMassage } from "../slices/authSlice";
import hasSequentialPattern from "./hasSequentialPattern";
import PopUpMessage from "./popUpMassage";

export default function PasswordReset() {
  const dispatch=useAppDispatch();
  const navigate=useNavigate()
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [otp, setOtp] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);

 

  const token = useAppSelector((state) => state.auth.pwdToken);
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
  
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
      dispatch(setMassage("Password should not contains sequential letters or numbers"));
      console.log("Password should not contains sequential letters or numbers");
    }

       if (isDisabled) return; // 👈 prevent rapid clicks

      setIsDisabled(true);
      
      
      dispatch(resetPassword(token,newPass, confirmPass,otp,navigate));
       setTimeout(() => {
      setIsDisabled(false);
    }, 2000);
     
    };

  // console.log(token);

  return (
    <form onSubmit={handleSubmit}>
      <div className="min-h-screen flex items-center justify-center bg-sky-100 p-4">
        <div className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-lg text-center space-y-6">
          {/* Logo */}
          <div className="flex justify-center">
            <img
              src="ticketlogo2.jpg"
              alt="Ticket  Logo"
              className="h-[2.2rem]"
            />
          </div>

          <div>
            
            <h2 className="text-2xl font-bold text-black">Change Password</h2>
            <p className="text-sm text-[#777777] pb-1">
              Set your new password below
            </p>
            <PopUpMessage/>
          </div>

          <div className="relative">
            <FaLock className="absolute top-3 left-3 text-gray-400" />
            <input
              type="text"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              placeholder="New Password"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
            />
          </div>

          <div className="relative">
            <FaLock className="absolute top-3 left-3 text-gray-400" />
            <input
              type="password"
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              placeholder="Confirm Password"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
            />
          </div>

          <div className="relative">
            <TbPasswordUser className="absolute top-3 left-3 text-gray-400" />
            <input
            required
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter otp"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
            />
          </div>

          <button
            type="submit"
            onClick={() => console.log("Change clicked")}
            className="w-full bg-sky-700 hover:bg-sky-600 text-white font-semibold py-2 rounded-md transition cursor-pointer "
          >
            Change
          </button>
        </div>
      </div>
    </form>
  );
}
