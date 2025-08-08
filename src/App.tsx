import OpenRoute from "./route/OpenRoute";
import ProtectedRoute from "./route/ProtectedRoute";
import ForgotPassword from "./SiginPage/Forgotpassword";
import ForgotPasswordConfirmation from "./SiginPage/ForgotPasswordCofirmation";
import LoginVarifyOtp from "./SiginPage/LoginVarifyOtp";
import OtpVerification from "./SiginPage/OtpVerification";
import PasswordReset from "./SiginPage/PasswordReset";
import PasswordSet from "./SiginPage/PasswordSet";
import SignIn from "./SiginPage/SignIn";
import SignUp from "./SiginPage/SignUp";
// import { useAuthRestore } from "./token/callingAutoTokenRefresh";
import Navbar from "./UI/Components/Navbar";
import ProfileCard from "./UI/Components/profile/ProfileCard";
import HomePage from "./UI/Pages/HomePage";
import { Route, Routes } from "react-router-dom";
import { useAppDispatch } from "./reducers/hooks";
import { useEffect } from "react";
import { getCurrentUser } from "./services/operations/userApi";
import { useAppSelector } from "./reducers/hooks";

function App() {
  const dispatch = useAppDispatch();

  // const token=useAppSelector((state)=>state.auth.accessToken);
  const user=useAppSelector((state)=>state.user.user);
  // useAuthRestore();

  
  

  useEffect(() => {
    // ✅ Page load hone pe user fetch karo
    dispatch(getCurrentUser());
  }, []);

  
console.log("USER DATA ......",user)
 

  return (
    <>
      <div className="font-lato">
        <Navbar />
        {/* <HeroSection /> */}

        <div className="my-8">
          <Routes>
            <Route path="/" element={<HomePage />} />

            <Route
              path="/login"
              element={
                <OpenRoute>
                  <SignIn />
                </OpenRoute>
              }
            />
            <Route path="/forgetpassword" element={<ForgotPassword />} />
            <Route
              path="/signup"
              element={
                <OpenRoute>
                  <SignUp />
                </OpenRoute>
              }
            />
            <Route
              path="/otpverification"
              element={
                <OpenRoute>
                  <OtpVerification />
                </OpenRoute>
              }
            />
            <Route
              path="/setpassword"
              element={
                <OpenRoute>
                  <PasswordSet />
                </OpenRoute>
              }
            />
            <Route
              path="/varifylgoinotp"
              element={
                <OpenRoute>
                  <LoginVarifyOtp />
                </OpenRoute>
              }
            />
            <Route
              path="/passwordreset"
              element={
                <OpenRoute>
                  <PasswordReset />
                </OpenRoute>
              }
            />
            <Route
              path="/passwordresetsuccess"
              element={
                <OpenRoute>
                  <ForgotPasswordConfirmation />
                </OpenRoute>
              }
            />
            <Route
              path="/editprofile"
              element={
                <ProtectedRoute>
                  <ProfileCard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>

        {/* <ForgotPassword />
        <ForgotPasswordConfirmation /> */}
      </div>
    </>
  );
}

export default App;
