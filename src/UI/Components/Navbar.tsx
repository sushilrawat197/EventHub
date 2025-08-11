import React, { useState, useEffect, useRef } from "react";
import { RiMenu3Line } from "react-icons/ri";
import { Link } from "react-router-dom";
import {useAppSelector } from "../../reducers/hooks";
import ProfileDropdown from "./profile/ProfileDropdown";
import { CiSearch } from "react-icons/ci";

const Navbar: React.FC = () => {

  // const token = useAppSelector((state) => state.auth.accessToken);
  // console.log("TOKEN IN NAVBAR: ",token);

  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
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

   const user=useAppSelector((state)=>state.user.user);



  // useEffect(() => {}, []);

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
        <ul className="hidden lg:flex bg-white  rounded-full px-4 py-1 space-x-4 w-[30%] justify-center items-center">
          <li className="text-sky-600 hover:text-white cursor-pointer font-medium px-2 py-1 hover:bg-sky-500 rounded-full">
            <Link to={"/"}>Home</Link>
          </li>

          {/* Event Categories */}
         <Link to={"/events"}> <li className="group relative cursor-pointer text-gray-900 hover:text-white px-2 py-1 hover:bg-sky-500 rounded-full hover:font-medium">
            Browse Events
          </li></Link>


          {/* Ticket Categories */}
          {/* <li className="group relative cursor-pointer text-gray-900 hover:text-white px-2 py-1 hover:bg-sky-500 rounded-full hover:font-medium">
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
          </li> */}

          {/* <li className="text-gray-900 hover:text-white cursor-pointer px-2 py-1 hover:bg-sky-500 rounded-full hover:font-medium">
            Browse Events
          </li> */}
          {/* <li className="text-gray-900 hover:text-white cursor-pointer px-2 py-1 hover:bg-sky-500 rounded-full hover:font-medium">
            Dashboard
          </li>
          <li className="text-gray-900 hover:text-white cursor-pointer px-2 py-1 hover:bg-sky-500 rounded-full hover:font-medium">
            Contacts
          </li> */}
        </ul>

        <div className="bg-white justify-center items-center w-[30%] rounded-full hidden lg:flex">
          <span className="text-xl"><CiSearch/></span>
        <input type="text" placeholder="Seach for Events, Festivals, Comedy Shows" className="focus:outline-none border-none bg-white p-2 borde rounded-md w-[80%] px-4"></input>

        </div>


        {/* Desktop Buttons */}

        {user === null && (
          <div className=" hidden lg:flex">
            <Link to={"/login"}>
              <button className="bg-white text-sky-600 font-medium px-4 py-2 rounded-full border border-sky-300 hover:bg-sky-100 cursor-pointer">
                Sign In
              </button>
            </Link>
          </div>
        )}


        <div className={`flex items-center gap-2`} >
          {/* Mobile Toggle */}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`text-white  lg:hidden`}
            title="Menu"
          >
            <RiMenu3Line size={30} />
          </button>


          {/* Profile Icon visbile  */}
          {user !== null && (
            <div className=" w-full ">  
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
            <Link to={"/events"}>
            <button
              onClick={
               () => setMobileMenuOpen(!mobileMenuOpen)
              }
              className="w-full text-left text-black font-medium"
            >
              Browse Events
            </button></Link>


           
          </div>

          {/* Mobile Ticket Dropdown */}
          

          

          <div className=" border border-gray-300"></div>

          {!user && (
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
