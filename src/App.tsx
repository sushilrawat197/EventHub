import { lazy } from "react";
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
import ProfileCard from "./UI/Components/profile/ProfileCard";
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


function App() {
  const dispatch = useAppDispatch();

  // const token=useAppSelector((state)=>state.auth.accessToken);

  // const user=useAppSelector((state)=>state.user.user);

  // console.log("USER DATA ......",user)

  useEffect(() => {
    const init = async () => {
      // console.log("Refreshing token...");
      await dispatch(refreshAccessToken()); // wait for refreshToken completion
    };
    init();
  }, [dispatch]);

  

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
                path="/editprofile"
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
