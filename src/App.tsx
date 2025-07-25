import "./App.css";
import ForgotPassword from "./SiginPage/Forgotpassword";
import ForgotPasswordConfirmation from "./SiginPage/ForgotPasswordCofirmation";
import OtpVerification from "./SiginPage/OtpVerification";
import PasswordReset from "./SiginPage/PasswordReset";
import PasswordSet from "./SiginPage/PasswordSet";
import SignIn from "./SiginPage/SignIn";
import SignUp from "./SiginPage/SignUp";
import ContactPage from "./UI/Components/ContactUs";
import Footer from "./UI/Components/Footer";
import Navbar from "./UI/Components/Navbar";
import PosterRanking from "./UI/Components/PosterRanking";
import SellWithEase from "./UI/Components/SellWithEase";
import TicketPlans from "./UI/Components/TicketPlans";
import UpcomingEvents from "./UI/Components/UpcomingEvents";
import WhatsApppop from "./UI/Components/Whatsapppop";
import WhyChoose from "./UI/Components/WhyChoose";
import HeroSection from "./UI/Pages/HeroSection";

function App() {
  return (
    <>
      <div className="font-lato">
        <Navbar />
        <HeroSection />
        <UpcomingEvents />
        <WhyChoose />
        <PosterRanking />
        <SellWithEase />
        <TicketPlans />
        <ContactPage />
        <WhatsApppop />
        <Footer />
        <SignIn />
        <ForgotPassword />
        <ForgotPasswordConfirmation />
        <OtpVerification />
        <PasswordReset />
        <PasswordSet />
        <SignUp />
      </div>
    </>
  );
}

export default App;
