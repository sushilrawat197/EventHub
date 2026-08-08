import ScrollToTop from "../components/common/ScrollToTop";
import Navbar from "../components/common/Navbar";
import { Outlet } from "react-router-dom";

// MainLayout.tsx
export default function MainLayout() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      {/* Must clear fixed top bar (all sizes) + NavHeader (lg+) */}
      <div className="mt-16 lg:mt-28">
        <Outlet />
      </div>
    </>
  );
}
