import { lazy, useState } from "react";
import OpenRoute from "./route/OpenRoute";
import ProtectedRoute from "./route/ProtectedRoute";
import ForgotPassword from "./SiginPage/Forgotpassword";
import ForgotPasswordConfirmation from "./SiginPage/ForgotPasswordCofirmation";
import LoginVarifyOtp from "./SiginPage/ForgotVarifyOtp";
import OtpVerification from "./SiginPage/OtpVerification";
import PasswordReset from "./SiginPage/PasswordReset";
import PasswordSet from "./SiginPage/PasswordSet";
import SignIn from "./SiginPage/SignIn";
import SignUp from "./SiginPage/SignUp";
import ProfileCard from "./UI/Components/dasboard/profile/ProfileCard";
const HomePage = lazy(() => import("./UI/Pages/HomePage"));
import { Route, Routes } from "react-router-dom";
import { useAppDispatch } from "./reducers/hooks";
import { useEffect } from "react";
const Layout = lazy(() => import("./UI/Components/eventsection/Layout"));
import { refreshAccessToken } from "./services/operations/refreshToken";
import Layouteventspage from "./UI/Components/eventsection/Eventspage/Layouteventspage";
import HelpAndSupport from "./UI/Components/HelpAndSupport";
import BookingFlow from "./UI/Components/eventsection/Eventsprocess/BookingFlow";
import MainLayout from "./UI/Layout/AppLayout";
import ForgotVarifyOtp from "./SiginPage/ForgotVarifyOtp";
import SpinnerLoading from "./UI/Components/common/SpinnerLoading";
import ChangePassword from "./SiginPage/ChangePassword";


function App() {
  const dispatch = useAppDispatch();

  const [bootLoading, setBootLoading] = useState(true); // ✅ app booting state

  useEffect(() => {
    async function init() {
      await dispatch(refreshAccessToken()); // refresh token call
      setBootLoading(false);               // boot complete
    }
    init();
  }, [dispatch]);

  if (bootLoading) {
    return <SpinnerLoading />;  // spinner while refresh token loads
  }
  
  
  return (
    <>

      <Routes>

        <Route element={<MainLayout />}>

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
              <Route path="/verifyforgototp" element={<ForgotVarifyOtp />} />
              <Route path="/change-password" element={<ChangePassword/>} />

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

              <Route path="/events" element={<Layout />} />

              <Route
                path="/my-profile/edit-profile"
                element={
                  <ProtectedRoute>
                    <ProfileCard />
                  </ProtectedRoute>
                }
              />

              <Route path="/events/:contentName/:parentCategoryId" element={<Layouteventspage />} />
              <Route path="/helpandsupport" element={<HelpAndSupport />} />
              
        </Route>

        {/* <Route path="/booking/:id" element={<BookingFlow />} /> */}

               <Route path="/events/:contentName/:contentId/booking" element={<BookingFlow />} />

      </Routes>

     
    </>
  );
}

export default App;
