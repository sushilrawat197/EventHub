import "./App.css";
import ForgotPassword from "./SiginPage/Forgotpassword";
import LoginVarifyOtp from "./SiginPage/LoginVarifyOtp";
import OtpVerification from "./SiginPage/OtpVerification";
import PasswordSet from "./SiginPage/PasswordSet";
import SignIn from "./SiginPage/SignIn";
import SignUp from "./SiginPage/SignUp";
import Navbar from "./UI/Components/Navbar";
import HomePage from "./UI/Pages/HomePage";
import { Route,Routes } from "react-router-dom";



function App() {
  return (
    <>
      <div className="font-lato">
        <Navbar />
        {/* <HeroSection /> */}

        <div className="mt-7">
          <Routes>
          <Route path="/" element={<HomePage />}/>
          <Route path="/login" element={<SignIn />}/>
          <Route path="/forgetpassword" element={<ForgotPassword/>}/>
          <Route path="/signup" element={<SignUp/>}/>
          <Route path="/otpvarification" element={<OtpVerification/>}/>
          <Route path="/setpassword" element={<PasswordSet/>}/>
          <Route path="/varifylgoinotp" element={<LoginVarifyOtp/>}/>
          
        </Routes>

        </div>
       

       
        {/* <ForgotPassword />
        <ForgotPasswordConfirmation />
        <OtpVerification />
        <PasswordReset />
        <PasswordSet />
        <SignUp /> */}
      </div>
    </>
  );
}

export default App;
