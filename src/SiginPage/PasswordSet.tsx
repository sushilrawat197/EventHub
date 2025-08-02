import { useState } from "react";
import { FaLock } from "react-icons/fa";
import { useAppDispatch } from "../reducers/hooks";
import { setPassword } from "../services/operations/authApi";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../reducers/hooks";
import { ClipLoader } from "react-spinners";
import hasSequentialPattern from "./hasSequentialPattern";
import { setMassage } from "../slices/authSlice";
// import { ImCross } from "react-icons/im";
import PopUpMessage from "./popUpMassage";

export default function PasswordSet() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  // const [error, setError] = useState(false);
  // const [hidden, setHidden] = useState(false);

  const passToken = useAppSelector((state) => state.auth.pwdToken);
  const loading = useAppSelector((state) => state.auth.loading);
  // const massage = useAppSelector((state) => state.auth.massage);

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;



  const handleSubmit = () => {
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

    dispatch(setPassword(passToken, newPass, confirmPass, navigate, dispatch));
  };



  // function clickHandler(){
  //   setHidden(false);
  //   dispatch(setMassage(null));
  // }

// useEffect(() => {
//   return () => {
//     dispatch(setMassage(null)); // 👈 Clean up when SignUp unmounts
//   };
// }, []);


  return (
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
          <h2 className="text-2xl font-bold text-black">Set Password</h2>
          <p className="text-sm text-[#777777]">Enter your password below</p>
         <PopUpMessage/>
        </div>

        <div className="relative">
          <FaLock className="absolute top-3 left-3 text-gray-400" />
          <input
            required
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
            required
            type="password"
            value={confirmPass}
            onChange={(e) => setConfirmPass(e.target.value)}
            placeholder="Confirm New Password"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
          />
        </div>

        {/* {error && (
          <p className="text-sm text-red-400 mt-2">
            Password must include{" "}
            <span className="font-medium ">
              (A–Z, a–z, 0–9, !@#%) and be at least 8 characters.
            </span>
          </p>
        )} */}

        {!loading ? (
          <button
            type="submit"
            onClick={handleSubmit}
            className={`w-full bg-sky-700 hover:bg-sky-600 text-white font-semibold h-10 rounded-lg transition text-base cursor-pointer`}
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
    </div>
  );
}
