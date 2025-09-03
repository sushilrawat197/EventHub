
import { useEffect, useState } from "react";
import { FaLock } from "react-icons/fa";
import { useAppDispatch } from "../reducers/hooks";
import { changePassword} from "../services/operations/authApi";
import { useNavigate } from "react-router-dom";
import { setMassage } from "../slices/authSlice";
import hasSequentialPattern from "./hasSequentialPattern";
import PopUpMessage from "./popUpMassage";
import { useAppSelector } from "../reducers/hooks";




export default function ChangePassword() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const [newPass, setNewPass] = useState("");
  const [oldPass, setOldPass] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const [ready, setReady] = useState(false); // 👈 block render initially
  console.log(ready)


  const pwdChangeToken = useAppSelector((state) => state.auth.pwdToken);
  const massage = useAppSelector((state) => state.auth.massage);
  const otp = useAppSelector((state) => state.auth.otp);


  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

  useEffect(() => {
    if (!pwdChangeToken
) {
      navigate("/login");
    } else {
      setReady(true); // ✅ allow render once token exists
    }
  }, [pwdChangeToken, navigate]);


 console.log(massage);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
      if (newPass.length < 8) {
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

    dispatch(changePassword(pwdChangeToken, oldPass, newPass , navigate));

    setTimeout(() => {
      setIsDisabled(false);
    }, 2000);
  };


  return (
    <form onSubmit={handleSubmit}>
      <div className="lg:min-h-[calc(100vh-6rem)] min-h-[calc(100vh-40px)] flex items-center justify-center bg-sky-100 p-4">
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
              Your password has been expiered, Set your new password below
            </p>
            <PopUpMessage/>
          </div>

          <div className="relative">
            <FaLock className="absolute top-3 left-3 text-gray-400" />
            <input
              type="password"
              value={oldPass}
              onChange={(e) => setOldPass(e.target.value)}
              placeholder="Old Password"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
            />
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


          <div>
            <button
            type="submit"
            onClick={() => console.log("Change clicked")}
            className="w-full bg-sky-700 hover:bg-sky-600 text-white font-semibold py-2 rounded-md transition cursor-pointer "
          >
            Change
          </button>

          </div>

          
        </div>
      </div>
    </form>
  );
}
