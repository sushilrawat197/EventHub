import React, { useState, useEffect, useRef } from "react";
import { RiMenu3Line } from "react-icons/ri";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../reducers/hooks";
import ProfileDropdown from "./profile/ProfileDropdown";
import { CiSearch } from "react-icons/ci";
import NavHeader from "./navbar/NavHeader";

const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState("City");

  const menuRef = useRef<HTMLDivElement>(null);
  const cityRef = useRef<HTMLDivElement>(null);

  const cities = [
    "Maseru",
    "Mafeteng",
    "Mohale's Hoek",
    "Quthing",
    "Thaba Tseka",
    "Qacha's Nek",
    "Berea",
    "Leribe",
    "Botha-Bothe",
    "Mokhotlong",
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
      if (cityRef.current && !cityRef.current.contains(event.target as Node)) {
        setCityDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const user = useAppSelector((state) => state.user.user);

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    setCityDropdownOpen(false);
  };

  return (
    <>
      <nav className="bg-sky-500 fixed top-0 left-0 w-full z-50">
        <div className="flex flex-col mx-auto">
          <div className="container mx-auto flex items-center justify-between px-4 py-3">
            <div className="flex gap-10">
              {/* Logo */}
              <Link to={"/"}>
                <div className="flex items-center">
                  <img
                  loading="lazy"
                    className="rounded-lg w-20 h-10"
                    src="ticketlogo2.jpg"
                    alt="logo"
                  />
                </div>
              </Link>

              {/* Desktop Search */}
              <div className="bg-white justify-center items-center sm:2xl md:2xl w-2xl rounded-full hidden lg:flex">
                <span className="text-xl">
                  <CiSearch />
                </span>
                <input
                  type="text"
                  placeholder="Search for Events, Festivals, Comedy Shows"
                  className="focus:outline-none border-none bg-white p-2 rounded-md w-[80%] px-4"
                />
              </div>
            </div>

            

            <div className="flex items-center">
              {/* City Dropdown */}
              <div className="hidden lg:flex w-fit rounded-full px-4 py-1 space-x-4 justify-center items-center relative">
                <div ref={cityRef} className="relative">
                  <button
                    className="text-gray-900 whitespace-nowrap bg-white cursor-pointer px-6 py-1 hover:bg-sky-200 rounded-full hover:font-medium flex items-center"
                    onClick={() => setCityDropdownOpen((prev) => !prev)}
                  >
                    {selectedCity}
                    <span className="ml-2">▼</span>
                  </button>

                  {cityDropdownOpen && (
                    <ul className="absolute mt-3 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50 transition-all duration-200">
                      {cities.map((city, index) => (
                        <li
                          key={index}
                          onClick={() => handleCitySelect(city)}
                          className="px-4 py-2 cursor-pointer hover:bg-sky-100"
                        >
                          {city}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>



              {/* Sign In */}
              {user === null && (
                <div className="hidden lg:flex">
                  <Link to={"/login"}>
                    <button className="bg-white text-sky-600 font-medium px-4 py-2 rounded-full border border-sky-300 hover:bg-sky-100 cursor-pointer">
                      Sign In
                    </button>
                  </Link>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <div className="items-center gap-2 lg:hidden">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="text-white"
                  title="Menu"
                >
                  <RiMenu3Line size={30} />
                </button>
              </div>
              
              {/* Profile Dropdown */}
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
              onClick={() => setMobileMenuOpen(false)}
              to={"/"}
              className="block text-sky-600 font-medium"
            >
              Home
            </Link>

            <Link
              to={"/events"}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-black font-medium"
            >
              Browse Events
            </Link>

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
    </>
  );
};

export default Navbar;
