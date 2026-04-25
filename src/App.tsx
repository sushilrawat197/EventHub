import { lazy, Suspense, type ReactNode, useState } from "react";
import OpenRoute from "./app/routes/OpenRoute";
import ProtectedRoute from "./app/routes/ProtectedRoute";
const ForgotPassword = lazy(() => import("./features/auth/Forgotpassword"));
const ForgotPasswordConfirmation = lazy(() => import("./features/auth/ForgotPasswordCofirmation"));
const LoginVarifyOtp = lazy(() => import("./features/auth/ForgotVarifyOtp"));
const OtpVerification = lazy(() => import("./features/auth/OtpVerification"));
const PasswordReset = lazy(() => import("./features/auth/PasswordReset"));
const PasswordSet = lazy(() => import("./features/auth/PasswordSet"));
const SignIn = lazy(() => import("./features/auth/SignIn"));
const SignUp = lazy(() => import("./features/auth/SignUp"));
const ProfileCard = lazy(() => import("./UI/Components/dasboard/profile/ProfileCard"));
const HomePage = lazy(() => import("./features/home/pages/HomePage"));
import { Route, Routes } from "react-router-dom";
import { useAppDispatch } from "./app/store/hooks";
import { useEffect } from "react";
const Layout = lazy(() => import("./UI/Components/eventsection/Layout"));

const Layouteventspage = lazy(() => import("./UI/Components/eventsection/Eventspage/Layouteventspage"));
const HelpAndSupport = lazy(() => import("./UI/Components/HelpAndSupport"));
// import BookingFlow from "./UI/Components/eventsection/Eventsprocess/BookingFlow";
import MainLayout from "./shared/layouts/AppLayout";
import SpinnerLoading from "./shared/components/common/SpinnerLoading";
const ChangePassword = lazy(() => import("./features/auth/ChangePassword"));
const BookingFlow = lazy(() => import("./UI/Components/eventsection/Eventsprocess/BookingFlow"));
const VenueSelection = lazy(() => import("./UI/Components/eventsection/Eventsprocess/EventProcessWithRoute/VenueSelection"));
const DateTimeSelection = lazy(() => import("./UI/Components/eventsection/Eventsprocess/EventProcessWithRoute/DateTimeSelection"));
const TicketSelection = lazy(() => import("./UI/Components/eventsection/Eventsprocess/EventProcessWithRoute/TicketSelection"));
const ReviewAndPay = lazy(() => import("./UI/Components/eventsection/Eventsprocess/EventProcessWithRoute/ReviewAndPay"));
const PaymentPage = lazy(() => import("./UI/Components/eventsection/PaymentPage"));
const BookingConfirmed = lazy(() => import("./shared/components/common/BookingConfirmPage"));
const BookingOrder = lazy(() => import("./UI/Components/dasboard/BookingOrder"));
const RateAndReview = lazy(() => import("./shared/components/common/RateAndReview"));
import { refreshAccessToken } from "./services/tokenManager";

function withSuspense(element: ReactNode) {
  return <Suspense fallback={<SpinnerLoading />}>{element}</Suspense>;
}


function App() {
  const dispatch = useAppDispatch();

  const [bootLoading, setBootLoading] = useState(true); // ✅ app booting state

  // useEffect(() => {
  //   async function init() {
  //     await dispatch(refreshAccessToken()); // refresh token call
  //     setBootLoading(false); // boot complete
  //   }
  //   init();
  // }, [dispatch]);


    useEffect(() => {
    async function init() {
      try {
        console.log("Attempting to restore session...");
        const success = await dispatch(refreshAccessToken());

        if (success) {
          console.log("✅ Session restored successfully");
        } else {
          console.log("ℹ️ No active session found");
        }
      } catch (error) {
        console.error("❌ Boot initialization failed:", error);
      } finally {
        setBootLoading(false);
      }
    }

    init();
  }, [dispatch]);


  if (process.env.NODE_ENV === "production") {
    console.log = function () {};
    console.error = function () {};
    console.warn = function () {};
  }

  if (bootLoading) {
    return <SpinnerLoading />; // spinner while refresh token loads
  }

  
  return (
    <>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={withSuspense(<HomePage />)} />

          <Route
            path="/login"
            element={
              <OpenRoute>
                {withSuspense(<SignIn />)}
              </OpenRoute>
            }
          />

          <Route path="/forgetpassword" element={withSuspense(<ForgotPassword />)} />
          <Route path="/verifyforgototp" element={withSuspense(<LoginVarifyOtp />)} />
          <Route path="/change-password" element={withSuspense(<ChangePassword />)} />

          <Route
            path="/signup"
            element={
              <OpenRoute>
                {withSuspense(<SignUp />)}
              </OpenRoute>
            }
          />

          <Route
            path="/otpverification"
            element={
              <OpenRoute>
                {withSuspense(<OtpVerification />)}
              </OpenRoute>
            }
          />
          <Route
            path="/setpassword"
            element={
              <OpenRoute>
                {withSuspense(<PasswordSet />)}
              </OpenRoute>
            }
          />
          <Route
            path="/varifylgoinotp"
            element={
              <OpenRoute>
                {withSuspense(<LoginVarifyOtp />)}
              </OpenRoute>
            }
          />
          <Route
            path="/passwordreset"
            element={
              <OpenRoute>
                {withSuspense(<PasswordReset />)}
              </OpenRoute>
            }
          />
          <Route
            path="/passwordresetsuccess"
            element={
              <OpenRoute>
                {withSuspense(<ForgotPasswordConfirmation />)}
              </OpenRoute>
            }
          />

          <Route path="/events" element={withSuspense(<Layout />)} />

          <Route
            path="/my-profile/edit-profile"
            element={
              <ProtectedRoute>
                {withSuspense(<ProfileCard />)}
              </ProtectedRoute>
            }
          />

          <Route
            path="/events/:contentName/:eventId"
            element={withSuspense(<Layouteventspage />)}
          />
          <Route path="/helpandsupport" element={withSuspense(<HelpAndSupport />)} />

          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                {withSuspense(<BookingOrder />)}
              </ProtectedRoute>
            }
          />

          <Route
            path="order/:bookingId"
            element={
              <ProtectedRoute>
                {withSuspense(<BookingConfirmed />)}
              </ProtectedRoute>
            }
          />

          <Route
            path="/rate-and-review"
            element={
              <ProtectedRoute>
                {withSuspense(<RateAndReview />)}
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
          element={withSuspense(<BookingFlow />)}
        >
          <Route path="venue" element={withSuspense(<VenueSelection />)} />
          <Route path="datetime" element={withSuspense(<DateTimeSelection />)} />

          <Route path="ticket" element={withSuspense(<TicketSelection />)} />
          <Route
            path="reviewandpay"
            element={
              <ProtectedRoute>
                {withSuspense(<ReviewAndPay />)}
              </ProtectedRoute>
            }
          />
          
          <Route
            path="payment"
            element={
              <ProtectedRoute>
                {withSuspense(<PaymentPage />)}
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;
