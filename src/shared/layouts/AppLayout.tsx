import ScrollToTop from "../components/common/ScrollToTop";
import Navbar from "../components/common/Navbar";
import { Outlet } from "react-router-dom";


// MainLayout.tsx
export default function MainLayout() {
  return (
    <>
    <ScrollToTop /> 
      <Navbar />
      <div className="lg:mt-24 mt-10 md:mt-20"><Outlet/></div>
    </>
  );
}
