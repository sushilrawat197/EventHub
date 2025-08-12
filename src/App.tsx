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
import Layout from "./UI/Components/eventsection/Layout";
import { refreshAccessToken } from "./services/operations/refreshToken";
// import axios from "axios";
// import { clearUser, setUser } from "./slices/userSlice";
// import { userEndpoint } from "./services/apis";
// const { GET_USER_API} = userEndpoint;

function App() {
  const dispatch = useAppDispatch();

  // const token=useAppSelector((state)=>state.auth.accessToken);
const user=useAppSelector((state)=>state.user.user);
  // useAuthRestore();
console.log("USER DATA ......",user)
  

// useEffect(() => {
//     async function fetchUser() {
//       try {
//         const response = await axios.get(GET_USER_API, {
//           withCredentials: true,
//           headers: {
//             "X-Client-Source": "WEB",
//           },
//         });

//         if (response.data.status === "SUCCESS") {
//           dispatch(setUser(response.data.data));
//         } else {
//           dispatch(clearUser());
//           // toast.error("Failed to fetch user data");
//         }
//       } catch (error) {
//         if (axios.isAxiosError(error)) {
//           // toast.error(error.response?.data?.message || "User fetch failed");
//           dispatch(clearUser());
//           console.error("Error fetching user:", error.response?.data);
//         } else {
//           console.error("Unknown error:", error);
//         }
//       }
//     }

//     fetchUser();
//   }, [dispatch]);


  

useEffect(() => {
  const init = async () => {
    console.log("Refreshing token...");
    await dispatch(refreshAccessToken()); // wait for refreshToken completion 
    console.log("Fetching user...");
    dispatch(getCurrentUser());
  };
  init();
}, [dispatch]);


  return (
    <>
      <div className="  ">
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
              path="/events"
              element={
                  <Layout /> 
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
