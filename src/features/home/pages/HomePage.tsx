import HeroSection from "./HeroSection";
import UpcomingEvents from "../components/UpcomingEvents";
// import WhyChoose from "../../../UI/Components/WhyChoose";
// import PosterRanking from "../../../UI/Components/PosterRanking";
// import ContactPage from "../components/ContactUs";
import Footer from "../components/Footer";
// import SellWithEase from "../../../UI/Components/SellWithEase";
import ThreeImgComponent from "../components/ThreeImageComponent";
import ContactPage from "../components/ContactUs";
import WhatsApppop from "../components/Whatsapppop";

export default function HomePage() {


  return (
    <>
      <div className="px-3">
        <HeroSection />
        <UpcomingEvents />
        {/* <WhyChoose />
        <PosterRanking />  */}
        <ThreeImgComponent/>
        {/* <SellWithEase />  */}
        {/* <TicketPlans />  */}
        <ContactPage />

        <WhatsApppop /> 
      </div>
      <Footer />
    </>
  );
}
