import HeroSection from "./HeroSection";
import UpcomingEvents from "../Components/UpcomingEvents";
import WhyChoose from "../Components/WhyChoose";
import PosterRanking from "../Components/PosterRanking";
// import SellWithEase from "../Components/SellWithEase";
// import TicketPlans from "../Components/TicketPlans";
import ContactPage from "../Components/ContactUs";
import Footer from "../Components/Footer";

// import WhatsApppop from "../Components/Whatsapppop";
// import Footer from "../Components/Footer";

export default function HomePage() {
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
