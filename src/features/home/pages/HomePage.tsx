import HeroSection from "./HeroSection";
import UpcomingEvents from "../components/UpcomingEvents";
// import WhyChoose from "../../../UI/Components/WhyChoose";
// import PosterRanking from "../../../UI/Components/PosterRanking";
// import ContactPage from "../components/ContactUs";
import Footer from "../components/Footer";
// import SellWithEase from "../../../UI/Components/SellWithEase";
import ThreeImgComponent from "../components/ThreeImageComponent";
import ContactPage from "../components/ContactUs";
import ChatPopup from "../components/ChatPopup";

export default function HomePage() {


  return (
    <>
      <HeroSection />
      <div className="px-3 ">
        <UpcomingEvents />
        {/* <WhyChoose />
        <PosterRanking />  */}
        <ThreeImgComponent/>
        {/* <SellWithEase />  */}
        {/* <TicketPlans />  */}
        <ContactPage />

        <ChatPopup /> 
      </div>
      <Footer />
    </>
  );
}
