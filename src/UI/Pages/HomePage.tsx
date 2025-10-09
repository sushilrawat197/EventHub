import HeroSection from "./HeroSection";
import UpcomingEvents from "../Components/UpcomingEvents";
// import WhyChoose from "../Components/WhyChoose";
// import PosterRanking from "../Components/PosterRanking";
// import ContactPage from "../Components/ContactUs";
import Footer from "../Components/Footer";
// import SellWithEase from "../Components/SellWithEase";
import ThreeImgComponent from "../Components/threeImageComponent";
import ContactPage from "../Components/ContactUs";

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

        {/* <WhatsApppop />  */}
      </div>
      <Footer />
    </>
  );
}
