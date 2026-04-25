import HeroSection from "./HeroSection";
import UpcomingEvents from "../../../UI/Components/UpcomingEvents";
// import WhyChoose from "../../../UI/Components/WhyChoose";
// import PosterRanking from "../../../UI/Components/PosterRanking";
// import ContactPage from "../../../UI/Components/ContactUs";
import Footer from "../../../UI/Components/Footer";
// import SellWithEase from "../../../UI/Components/SellWithEase";
import ThreeImgComponent from "../../../UI/Components/ThreeImageComponent";
import ContactPage from "../../../UI/Components/ContactUs";
import WhatsApppop from "../../../UI/Components/Whatsapppop";

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
