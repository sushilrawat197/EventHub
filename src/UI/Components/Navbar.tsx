import React, { useState, useEffect, useRef } from "react";
import { RiMenu3Line } from "react-icons/ri";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../reducers/hooks";
import ProfileDropdown from "./profile/ProfileDropdown";
import { CiSearch } from "react-icons/ci";
import NavHeader from "./navbar/NavHeader";

const Navbar: React.FC = () => {
  // const token = useAppSelector((state) => state.auth.accessToken);
  // console.log("TOKEN IN NAVBAR: ",token);

  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [cityPopupOpen, setCityPopupOpen] = useState<boolean>(false);
  const [selectedCity, setSelectedCity] = useState<string>("City");

  const menuRef = useRef<HTMLDivElement>(null); // 👈 Ref for mobile menu
  const cityPopupRef = useRef<HTMLDivElement>(null); // 👈 Ref for city popup

  const cities = [
    "New York",
    "Los Angeles",
    "Chicago",
    "Houston",
    "Phoenix",
    "Philadelphia",
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Handle mobile menu click outside
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }

      // Handle city popup click outside
      if (
        cityPopupRef.current &&
        !cityPopupRef.current.contains(event.target as Node)
      ) {
        setCityPopupOpen(false);
      }
    }

    if (mobileMenuOpen || cityPopupOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileMenuOpen, cityPopupOpen]);

  const user = useAppSelector((state) => state.user.user);

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    setCityPopupOpen(false);
  };

  // useEffect(() => {}, []);

  return (
    <>
      <nav className="bg-sky-500 fixed top-0 left-0 w-full z-50 shadow">
        <div className="flex flex-col mx-auto">
          <div className="container mx-auto flex items-center justify-between px-4 py-3">
            {/* Logo */}
            <Link to={"/"}>
              <div className="flex items-center">
                <img
                  className="rounded-lg w-20 h-10"
                  src="ticketlogo2.jpg"
                  alt="logo"
                />
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="bg-white justify-center items-center w-[30%] rounded-full hidden lg:flex">
              <span className="text-xl">
                <CiSearch />
              </span>
              <input
                type="text"
                placeholder="Search for Events, Festivals, Comedy Shows"
                className="focus:outline-none border-none bg-white p-2 border rounded-md w-[80%] px-4"
              />
            </div>

            <ul className="hidden lg:flex w-fit rounded-full px-4 py-1 space-x-4 justify-center items-center relative">
              <li
                className="text-gray-900 bg-white cursor-pointer px-6 py-1 hover:bg-sky-200 rounded-full hover:font-medium relative"
                onClick={() => setCityPopupOpen(!cityPopupOpen)}
              >
                {selectedCity}
                <span className="ml-2">▼</span>
              </li>
            </ul>

            {/* Desktop Buttons */}
            {user === null && (
              <div className="hidden lg:flex">
                <Link to={"/login"}>
                  <button className="bg-white text-sky-600 font-medium px-4 py-2 rounded-full border border-sky-300 hover:bg-sky-100 cursor-pointer">
                    Sign In
                  </button>
                </Link>
              </div>
            )}

            <div className="flex items-center gap-2">
              {/* Mobile Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-white lg:hidden"
                title="Menu"
              >
                <RiMenu3Line size={30} />
              </button>

              {/* Profile Icon visible */}
              {user !== null && (
                <div className="w-full">
                  <ProfileDropdown />
                </div>
              )}
            </div>
          </div>

          <NavHeader />
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div
            ref={menuRef}
            className="lg:hidden bg-white shadow rounded-lg mx-3 p-4 space-y-2"
          >
            <Link
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              to={"/"}
              className="block text-sky-600 font-medium "
            >
              Home
            </Link>

            {/* Mobile Event Dropdown */}
            <div>
              <Link to={"/events"}>
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="w-full text-left text-black font-medium"
                >
                  Browse Events
                </button>
              </Link>
            </div>

            <div className="border border-gray-300"></div>

            {!user && (
              <Link to={"/login"} onClick={() => setMobileMenuOpen(false)}>
                <button className="w-full bg-sky-500 text-white py-2 rounded-full text-lg">
                  Sign In
                </button>
              </Link>
            )}
          </div>
        )}
      </nav>


      {/* City Popup with Black Background Overlay */}
      {cityPopupOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          {/* Black overlay with 40% opacity */}
          <div
            className="absolute inset-0 bg-black/40" // tailwind shortcut for bg-opacity-40
            onClick={() => setCityPopupOpen(false)}
          ></div>

          {/* Popup */}
          <div
            ref={cityPopupRef}
            className="relative z-10 bg-white rounded-lg shadow-lg p-6 w-auto mx-4"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
              Select Your City
            </h3>
            <div className="flex flex-row gap-3 flex-wrap justify-center">
              {cities.map((city, index) => (
                <button
                  key={index}
                  onClick={() => handleCitySelect(city)}
                  className="px-6 py-3 rounded-lg hover:bg-sky-100 hover:text-sky-700 transition-colors duration-200 border border-gray-200 whitespace-nowrap"
                >
                  {city}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCityPopupOpen(false)}
              className="w-full mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
