import { useEffect } from "react";
import Navbar from "../Components/Navbar";
import { Outlet, useLocation, useNavigate } from "react-router-dom";


// MainLayout.tsx
export default function MainLayout() {
    const navigate = useNavigate();

  const location = useLocation();
  const rawFrom = location.state?.from;
  const from = rawFrom ? rawFrom.replace(/^\/ticketing/, "") : "/";
  console.log("PRINTING FROM...",from);

  useEffect(() => {
    if (from) {
      navigate(from, { replace: true, state: {} });
    }
  }, [from, navigate]);
  return (
    <>
      <Navbar />
      <div className="lg:mt-24 mt-10 md:mt-20"><Outlet/></div>
    </>
  );
}
