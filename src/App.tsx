import "./App.css";
import ForgotPassword from "./SiginPage/Forgotpassword";
import ForgotPasswordConfirmation from "./SiginPage/ForgotPasswordCofirmation";
import LoginVarifyOtp from "./SiginPage/LoginVarifyOtp";
import OtpVerification from "./SiginPage/OtpVerification";
import PasswordReset from "./SiginPage/PasswordReset";
import PasswordSet from "./SiginPage/PasswordSet";
import SignIn from "./SiginPage/SignIn";
import SignUp from "./SiginPage/SignUp";
import Navbar from "./UI/Components/Navbar";
import HomePage from "./UI/Pages/HomePage";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <>
      <div className="font-lato">
        <Navbar />
        {/* <HeroSection /> */}

        <div className="my-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<SignIn />} />
            <Route path="/forgetpassword" element={<ForgotPassword />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/otpverification" element={<OtpVerification />} />
            <Route path="/setpassword" element={<PasswordSet />} />
            <Route path="/varifylgoinotp" element={<LoginVarifyOtp />} />
            <Route path="/passwordreset" element={<PasswordReset />} />
            <Route path="/passwordresetsuccess" element={<ForgotPasswordConfirmation />} />
          </Routes>
        </div>

        {/* <ForgotPassword />
        <ForgotPasswordConfirmation /> */}
      </div>
    </>
  );
}

export default App;
