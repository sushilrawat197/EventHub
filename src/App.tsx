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
// import BookingFlow from "./UI/Components/eventsection/Eventsprocess/BookingFlow";
import MainLayout from "./UI/Layout/AppLayout";
import ForgotVarifyOtp from "./SiginPage/ForgotVarifyOtp";
import SpinnerLoading from "./UI/Components/common/SpinnerLoading";
import ChangePassword from "./SiginPage/ChangePassword";
import BookingFlow from "./UI/Components/eventsection/Eventsprocess/BookingFlow";
import VenueSelection from "./UI/Components/eventsection/Eventsprocess/EventProcessWithRoute/VenueSelection";
import DateTimeSelection from "./UI/Components/eventsection/Eventsprocess/EventProcessWithRoute/DateTimeSelection";
import TicketSelection from "./UI/Components/eventsection/Eventsprocess/EventProcessWithRoute/TicketSelection";
import ReviewAndPay from "./UI/Components/eventsection/Eventsprocess/EventProcessWithRoute/ReviewAndPay";
import PaymentPage from "./UI/Components/eventsection/PaymentPage";
import BookingConfirmed from "./UI/Components/common/BookingConfirmPage";
import BookingOrder from "./UI/Components/dasboard/BookingOrder";
// import TicketSelection from "./UI/Components/eventsection/Eventsprocess/EventProcessWithRoute/TicketSelection";
// import ReviewAndPay from "./UI/Components/eventsection/Eventsprocess/EventProcessWithRoute/ReviewAndPay";

function App() {
  const dispatch = useAppDispatch();

  const [bootLoading, setBootLoading] = useState(true); // ✅ app booting state

  useEffect(() => {
    async function init() {
      await dispatch(refreshAccessToken()); // refresh token call
      setBootLoading(false); // boot complete
    }
    init();
  }, [dispatch]);

  if (bootLoading) {
    return <SpinnerLoading />; // spinner while refresh token loads
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
          <Route path="/change-password" element={<ChangePassword />} />

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

          <Route
            path="/events/:contentName/:eventId"
            element={<Layouteventspage />}
          />
          <Route path="/helpandsupport" element={<HelpAndSupport />} />

            <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <BookingOrder />
            </ProtectedRoute>
          }
        />

         <Route
          path="order/:bookingId"
          element={
            <ProtectedRoute>
              <BookingConfirmed />
            </ProtectedRoute>
          }
        />



        </Route>

        {/* <Route
          path="/bookingconfirmed/:bookingId"
          element={
            <ProtectedRoute>
              <BookingConfirmed />
            </ProtectedRoute>
          }
        /> */}

      
        {/* Normal Route End */}

        {/* BOOKING ROUTE START */}

        <Route
          path="/events/:contentName/:eventId/booking/*"
          element={<BookingFlow />}
        >
          <Route path="venue" element={<VenueSelection />} />
          <Route path="datetime" element={<DateTimeSelection />} />

          <Route path="ticket" element={<TicketSelection />} />
          <Route
            path="reviewandpay"
            element={
              <ProtectedRoute>
                <ReviewAndPay />
              </ProtectedRoute>
            }
          />

          <Route
            path="payment"
            element={
              <ProtectedRoute>
                <PaymentPage />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;
