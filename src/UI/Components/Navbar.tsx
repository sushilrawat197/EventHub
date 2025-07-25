import React, { useState } from "react";
import { RiMenu3Line } from "react-icons/ri";

type MobileDropdownState = {
  event: boolean;
  ticket: boolean;
};

const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] =
    useState<MobileDropdownState>({
      event: false,
      ticket: false,
    });

  return (
    <nav className="bg-[#0ea5e9]  fixed top-0 left-0 w-full z-50 shadow">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <div className="flex items-center ">
          <img
            className="rounded-lg w-20 h-10"
            src="ticketlogo2.jpg"
            alt="logo"
          />
        </div>

        {/* Desktop Nav */}
        <ul className="hidden lg:flex bg-white  rounded-full px-4 py-1 space-x-4">
          <li className="text-sky-600 hover:text-white cursor-pointer font-medium px-2 py-1 hover:bg-sky-500 rounded-full">
            Home
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
        <div className="space-x-2 hidden lg:flex">
          <button className="bg-white text-sky-600 font-medium px-4 py-1 rounded-full border border-sky-300 hover:bg-sky-100">
            Sign In
          </button>
        </div>

        {/* Mobile Toggle */}
        <div className="lg:hidden  ">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white  "
            title="Menu"
          >
            <RiMenu3Line size={30} />
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-2 bg-white shadow rounded-lg mx-4 p-4 space-y-2">
          <a href="#" className="block text-sky-600 font-medium">
            Home
          </a>

          {/* Mobile Event Dropdown */}
          <div>
            <button
              onClick={() =>
                setMobileDropdownOpen((prev) => ({
                  ...prev,
                  event: !prev.event,
                }))
              }
              className="w-full text-left text-gray-700 font-medium"
            >
              Event Categories
            </button>
            {mobileDropdownOpen.event && (
              <div className="ml-4 mt-1 space-y-1 text-sm text-gray-600">
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
              className="w-full text-left text-gray-700 font-medium"
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

          <a href="#" className="block text-gray-600">
            Browse Events
          </a>
          <a href="#" className="block text-gray-600">
            Dashboard
          </a>
          <a href="#" className="block text-gray-600">
            Contacts
          </a>

          <hr className="my-2" />

          <button className="w-full bg-sky-500 text-white py-1 rounded-full ">
            Sign In
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
