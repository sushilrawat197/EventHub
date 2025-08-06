import React, { useState, useEffect, useRef } from "react";
import { RiMenu3Line } from "react-icons/ri";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../reducers/hooks";
import ProfileDropdown from "./ProfileDropdown";
import {
  setAccessToken,
  setAccessTokenExpiry,
  setRefreshToken,
} from "../../slices/authSlice";
import { startAutoTokenRefresh } from "../../token/getNewAccessToken";

type MobileDropdownState = {
  event: boolean;
  ticket: boolean;
};

const Navbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.accessToken);

  // console.log("Printing accessToken ", token);
  //  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    const accessTokenExpiry = localStorage.getItem("accessTokenExpiry");

    if (savedToken) {
      dispatch(setAccessToken(savedToken));
      console.log("accessToken :", savedToken);
    }
    if (refreshToken) {
      dispatch(setRefreshToken(refreshToken));
      console.log("refreshToken :", refreshToken);
    }
    if (accessTokenExpiry) {
      dispatch(setAccessTokenExpiry(accessTokenExpiry));
      console.log("accessTokenExpiry :", accessTokenExpiry);
    }
    if (accessTokenExpiry && refreshToken) {
      startAutoTokenRefresh(accessTokenExpiry, refreshToken);
    }
  }, []);

  // useEffect(() => {
  //   const localToken = localStorage.getItem("accessToken");
  //   setToken(localToken);
  // }, []);

  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const [mobileDropdownOpen, setMobileDropdownOpen] =
    useState<MobileDropdownState>({
      event: false,
      ticket: false,
    });

  const menuRef = useRef<HTMLDivElement>(null); // 👈 Ref for mobile menu

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    }

    if (mobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileMenuOpen]);

  useEffect(() => {}, []);

  return (
    <nav className="bg-sky-500  fixed top-0 left-0 w-full z-50 shadow py-2">
      <div className="container mx-auto flex items-center justify-between px-4 py-3 ">
        {/* Logo */}
        <Link to={"/"}>
          <div className="flex items-center ">
            <img
              className="rounded-lg w-20 h-10"
              src="ticketlogo2.jpg"
              alt="logo"
            />
          </div>
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden lg:flex bg-white  rounded-full px-4 py-1 space-x-4">
          <li className="text-sky-600 hover:text-white cursor-pointer font-medium px-2 py-1 hover:bg-sky-500 rounded-full">
            <Link to={"/"}>Home</Link>
          </li>

          {/* Event Categories */}
          <li className="group relative cursor-pointer text-gray-900 hover:text-white px-2 py-1 hover:bg-sky-500 rounded-full hover:font-medium">
            Event Categories
            <div className="absolute hidden group-hover:block top-full mt-2 left-0 bg-white text-black shadow-md rounded-md min-w-[180px] z-50">
              {[
                "Kids Events",
                "Comedy Shows",
                "Festivals",
                "Music Concerts",
                "Cultural Events",
                "Sports Events",
                "Theater and Performing Arts",
                "Corporate Conferences and Workshops",
              ].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="block px-4 py-2 text-sm hover:bg-sky-500 hover:text-white"
                >
                  {item}
                </a>
              ))}
            </div>
          </li>

          {/* Ticket Categories */}
          <li className="group relative cursor-pointer text-gray-900 hover:text-white px-2 py-1 hover:bg-sky-500 rounded-full hover:font-medium">
            Tickets Categories
            <div className="absolute hidden group-hover:block top-full mt-2 left-0 bg-white text-black shadow-md rounded-md min-w-[180px] z-50">
              {["General Admission", "VIP Access", "VVIP Access"].map(
                (item) => (
                  <a
                    key={item}
                    href="#"
                    className="block px-4 py-2 text-sm hover:bg-sky-500 hover:text-white"
                  >
                    {item}
                  </a>
                )
              )}
            </div>
          </li>

          <li className="text-gray-900 hover:text-white cursor-pointer px-2 py-1 hover:bg-sky-500 rounded-full hover:font-medium">
            Browse Events
          </li>
          <li className="text-gray-900 hover:text-white cursor-pointer px-2 py-1 hover:bg-sky-500 rounded-full hover:font-medium">
            Dashboard
          </li>
          <li className="text-gray-900 hover:text-white cursor-pointer px-2 py-1 hover:bg-sky-500 rounded-full hover:font-medium">
            Contacts
          </li>
        </ul>

        {/* Desktop Buttons */}

        {token === null && (
          <div className="space-x-2 hidden lg:flex">
            <Link to={"/login"}>
              <button className="bg-white text-sky-600 font-medium px-4 py-1 rounded-full border border-sky-300 hover:bg-sky-100 cursor-pointer">
                Sign In
              </button>
            </Link>
          </div>
        )}

        <div className=" flex items-center  ">
          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white  lg:hidden  "
            title="Menu"
          >
            <RiMenu3Line size={30} />
          </button>
          {/* Profile Icon visbile  */}
          {token !== null && (
            <div className=" w-full ">
              {" "}
              <ProfileDropdown />
            </div>
          )}
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div
          ref={menuRef}
          className="lg:hidden  bg-white shadow rounded-lg mx-3 p-4 space-y-2"
        >
          <Link
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            to={"/"}
            className="block text-sky-600 font-medium"
          >
            Home
          </Link>

          {/* Mobile Event Dropdown */}
          <div>
            <button
              onClick={() =>
                setMobileDropdownOpen((prev) => ({
                  ...prev,
                  event: !prev.event,
                }))
              }
              className="w-full text-left text-black font-medium"
            >
              Event Categories
            </button>
            {mobileDropdownOpen.event && (
              <div className="ml-4  space-y-1 text-sm text-gray-600">
                {[
                  "Kids Events",
                  "Comedy Shows",
                  "Festivals",
                  "Music Concerts",
                  "Cultural Events",
                  "Sports Events",
                  "Theater and Performing Arts",
                  "Corporate Conferences and Workshops",
                ].map((item) => (
                  <a
                    key={item}
                    href="#"
                    className="block px-2 py-2 text-sm hover:bg-sky-500 hover:text-white"
                  >
                    {item}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Mobile Ticket Dropdown */}
          <div>
            <button
              onClick={() =>
                setMobileDropdownOpen((prev) => ({
                  ...prev,
                  ticket: !prev.ticket,
                }))
              }
              className="w-full text-left text-black font-medium"
            >
              Tickets Categories
            </button>
            {mobileDropdownOpen.ticket && (
              <div className="ml-4 mt-1 space-y-1 text-sm text-gray-600">
                {["General Admission", "VIP Access", "VVIP Access"].map(
                  (item) => (
                    <a
                      key={item}
                      href="#"
                      className="block px-4 py-2 text-sm hover:bg-sky-500 hover:text-white"
                    >
                      {item}
                    </a>
                  )
                )}
              </div>
            )}
          </div>

          <a href="#" className="block text-black">
            Browse Events
          </a>
          <a href="#" className="block text-black">
            Dashboard
          </a>
          <a href="#" className="block text-black">
            Contacts
          </a>

          <div className=" border border-gray-300"></div>

          {!token && (
            <Link to={"/login"} onClick={() => setMobileMenuOpen(false)}>
              <button className="w-full bg-sky-500 text-white py-2 rounded-full  text-lg">
                Sign In
              </button>
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
