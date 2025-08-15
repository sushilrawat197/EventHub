import HeroSection from "./HeroSection";
import UpcomingEvents from "../Components/UpcomingEvents";
import WhyChoose from "../Components/WhyChoose";
import PosterRanking from "../Components/PosterRanking";
// import SellWithEase from "../Components/SellWithEase";
// import TicketPlans from "../Components/TicketPlans";
import ContactPage from "../Components/ContactUs";
import Footer from "../Components/Footer";
import { useEffect, useState } from "react";
import SpinnerLoading from "../Components/common/SpinnerLoading";

// import WhatsApppop from "../Components/Whatsapppop";
// import Footer from "../Components/Footer";

export default function HomePage() {
    const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <SpinnerLoading/>
    );
  }

  return (
    <>
      <div className="px-3">
        <HeroSection />

        <UpcomingEvents />
        <WhyChoose />
        <PosterRanking />
        {/* <SellWithEase /> */}
        {/* <TicketPlans /> */}
        <ContactPage />
        
        {/* <WhatsApppop /> */}
      </div>
      <Footer />
    </>
  );
}
