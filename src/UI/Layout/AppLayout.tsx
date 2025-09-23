import Navbar from "../Components/Navbar";
import { Outlet } from "react-router-dom";


// MainLayout.tsx
export default function MainLayout() {
  return (
    <>
      <Navbar />
      <div className="lg:mt-24 mt-10 md:mt-20"><Outlet/></div>
    </>
  );
}
