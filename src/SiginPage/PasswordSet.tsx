
import { useState } from "react";
import { FaLock } from "react-icons/fa";
import { useAppDispatch } from "../reducers/hooks";
import { setPassword } from "../services/operations/authApi";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../reducers/hooks";


export default function PasswordSet() {
  const dispatch=useAppDispatch();
  const navigate=useNavigate();
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const passToken = useAppSelector((state) => state.auth.pwdToken);

  const handleSubmit=()=>{
    dispatch(setPassword(passToken,newPass,confirmPass,navigate));
  }


  return (
    <div className="min-h-screen flex items-center justify-center bg-sky-200 p-4">
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
          <h2 className="text-2xl font-bold text-black">Set Password</h2>
          <p className="text-sm text-[#777777]">Set your password below</p>
        </div>

        <div className="relative">
          <FaLock className="absolute top-3 left-3 text-gray-400" />
          <input
            type="password"
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

        <button
          type="button"
          onClick={handleSubmit}
          className="w-full bg-sky-700 hover:bg-sky-600 text-white font-semibold py-2 rounded-md transition"
        >
          Set Password
        </button>
      </div>
    </div>
  );
}
