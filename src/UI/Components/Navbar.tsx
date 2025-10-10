import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../reducers/hooks";
import ProfileDropdown from "./dasboard/profile/ProfileDropdown";
import { CiSearch } from "react-icons/ci";
import NavHeader from "./navbar/NavHeader";
// import { MdMenu } from "react-icons/md";
// import { RxCross1 } from "react-icons/rx";
import { RiMenuFold4Fill } from "react-icons/ri";
import { RiMenuFold3Fill } from "react-icons/ri";
import { listCitiesByRegion } from "../../services/operations/location/cityApi";

import { listEventsBySearch } from "../../services/operations/eventsApi";
import { setSelectedCity } from "../../slices/citySlice";
import { setFilter } from "../../slices/filter_Slice";
// import { setFilter } from "../../slices/filter_Slice";

const Navbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [searchData, setSearchData] = useState("");
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  const menuRef = useRef<HTMLDivElement>(null);
  const cityRef = useRef<HTMLDivElement>(null);

  const cities = useAppSelector((state) => state?.cities.data || []);
  const [selectedCity, setSelectedCityNav] = useState("Maseru");

  // console.log(cities)

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

  const handleCitySelect = (city: { id: number; label: string }) => {
    setSelectedCityNav(city.label);
    dispatch(setSelectedCity(city.id));
    setCityDropdownOpen(false);
    dispatch(setFilter({ key: "cityId", value: city.id }));
    console.log(city.id);
    dispatch(listEventsBySearch());
  };

  function handleSearch() {
    dispatch(setFilter({ key: "eventName", value: searchData }));
    dispatch(listEventsBySearch());
    navigate("/events");
  }


  // useEffect(() => {
  //   if (selectedCity) {
  //     const preCity = cities.find((item) => item.label === selectedCity);
  //     console.log(preCity);

  //     if (preCity) {
  //       dispatch(setFilter({ key: "cityId", value: preCity.id }))
  //       dispatch(setSelectedCity(preCity.id));
  //       setSelectedCityNav(preCity.label);
  //     }
  //   }
  // }, [cities, dispatch, selectedCity]);

  

  useEffect(() => {
    dispatch(listCitiesByRegion());
  }, [dispatch]);



  useEffect(() => {
     setSearchData("");
     dispatch(setFilter({ key: "eventName", value: "" }));
  }, [navigate,dispatch]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  return (
    <>
      <nav className="bg-gradient-to-r from-blue-600 via-blue-900 to-blue-600 fixed top-0 left-0 w-full z-50 shadow-lg backdrop-blur-sm">
        <div className="flex flex-col mx-auto">
          <div className="container mx-auto flex items-center justify-between px-2 py-2">

            <div className="flex items-center gap-2 lg:gap-6">
              {/* Mobile Menu Toggle */}
              <div className="flex items-center lg:hidden">
                <button className="text-white hover:text-blue-200 transition-colors" title="Menu">
                  <div className="relative w-[30px] h-[30px]">
                    {/* Menu Icon */}
                    <RiMenuFold4Fill
                      onClick={() => setMobileMenuOpen(true)}
                      size={30}
                      className={`absolute top-0 left-0 transition-all duration-300 ease-in-out ${
                        mobileMenuOpen
                          ? "opacity-0 scale-0 rotate-90 pointer-events-none"
                          : "opacity-100 scale-100 rotate-0"
                      }`}
                    />

                    {/* Close Icon */}
                    <RiMenuFold3Fill
                      onClick={() => setMobileMenuOpen(false)}
                      size={30}
                      className={`absolute top-0 left-0 transition-all duration-300 ease-in-out ${
                        mobileMenuOpen
                          ? "opacity-100 scale-100 rotate-0"
                          : "opacity-0 scale-0 rotate-90 pointer-events-none"
                      }`}
                    />
                  </div>
                </button>
              </div>

              {/* Logo */}
              <Link to={"/"} className="flex items-center hover:scale-105 transition-transform duration-200">
                <div className="flex items-center w-20 h-8 bg-white rounded-xl p-1 shadow-lg">
                  <img
                    loading="lazy"
                    className="object-cover rounded-lg w-full h-full"
                    src="logo.jpeg"
                    alt="logo"
                  />
                </div>
                {/* <div className="hidden sm:block ml-3">
                  <h1 className="text-white font-bold text-xl">EventHub</h1>
                  <p className="text-blue-100 text-xs">Discover Events</p>
                </div> */}
              </Link>

              {/* Desktop Search */}
              <div className="hidden lg:flex items-center bg-white rounded-2xl px-4 py-2 w-96 shadow-lg">
                <CiSearch className="text-gray-500 text-xl mr-3" />
                <input
                  value={searchData}
                  onChange={(e) => {
                    setSearchData(e.target.value);
                    
                    // Clear existing timeout
                    if (searchTimeout) {
                      clearTimeout(searchTimeout);
                    }
                    
                    // Set new timeout for debounced search
                    const newTimeout = setTimeout(() => {
                      dispatch(setFilter({ key: "eventName", value: e.target.value }));
                      dispatch(listEventsBySearch());
                    }, 300); // 300ms delay
                    
                    setSearchTimeout(newTimeout);
                  }}
                  type="text"
                  placeholder="Search for events, venues, artists..."
                  className="flex-1 bg-transparent text-gray-900 placeholder-gray-500 focus:outline-none border-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-1 lg:gap-4">
              {/* City Dropdown */}
              <div className="">
                <div ref={cityRef} className="relative">
                  <button
                    className="bg-white text-gray-700 px-4 lg:py-2 py-1 rounded-xl hover:bg-gray-50 transition-all duration-200 flex items-center gap-2 shadow-lg"
                    onClick={() => setCityDropdownOpen((prev) => !prev)}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {selectedCity}
                    <svg className={`w-4 h-4 transition-transform duration-200 ${cityDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {cityDropdownOpen && (
                    <ul className="absolute mt-2 w-48 bg-white/95 backdrop-blur-sm border border-white/20 rounded-xl shadow-2xl z-50 transition-all duration-200">
                      {cities.map((city) => (
                        <li
                          key={city.id}
                          onClick={() => handleCitySelect(city)}
                          className="px-4 py-3 cursor-pointer hover:bg-blue-50 transition-colors duration-200 first:rounded-t-xl last:rounded-b-xl"
                        >
                          {city.label}
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
                    <button className="bg-white/10 backdrop-blur-sm text-white font-semibold px-6 py-2 rounded-xl hover:bg-white/20 hover:scale-105 transition-all duration-200">
                      Sign In
                    </button>
                  </Link>
                </div>
              )}

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
          <>
            <div
              ref={menuRef}
              className="lg:hidden bg-white/95 backdrop-blur-sm shadow-2xl border-t border-white/20 p-6 space-y-4"
            >
              <div className="bg-white justify-center items-center w-full rounded-2xl flex shadow-lg">
                <input
                  value={searchData}
                  onChange={(e) => {
                    setSearchData(e.target.value);
                    
                    // Clear existing timeout
                    if (searchTimeout) {
                      clearTimeout(searchTimeout);
                    }
                    
                    // Set new timeout for debounced search
                    const newTimeout = setTimeout(() => {
                      dispatch(setFilter({ key: "eventName", value: e.target.value }));
                      dispatch(listEventsBySearch());
                    }, 300); // 300ms delay
                    
                    setSearchTimeout(newTimeout);
                  }}
                  type="text"
                  placeholder="Search for events..."
                  className="focus:outline-none border-none bg-transparent p-3 rounded-2xl w-[80%] px-4 text-gray-900 placeholder-gray-500"
                />
                <button className="p-3 text-gray-500 hover:text-gray-700 transition-colors" onClick={handleSearch}>
                  <CiSearch size={20} />
                </button>
              </div>

              <div className="flex flex-col space-y-2">
                <NavLink
                  onClick={() => setMobileMenuOpen(false)}
                  to={"/"}
                  className={({ isActive }) =>
                    `text-lg transition-all duration-200 px-4 py-3 rounded-xl ${
                      isActive
                        ? "text-blue-600 font-semibold bg-blue-50"
                        : "text-gray-700 hover:bg-gray-50"
                    }`
                  }
                >
                  Home
                </NavLink>

                <NavLink
                  to={"/events"}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `text-lg transition-all duration-200 px-4 py-3 rounded-xl ${
                      isActive
                        ? "text-blue-600 font-semibold bg-blue-50"
                        : "text-gray-700 hover:bg-gray-50"
                    }`
                  }
                >
                  Browse Events
                </NavLink>
              </div>

              <div className="border border-gray-200"></div>

              {!user && (
                <Link to={"/login"} onClick={() => setMobileMenuOpen(false)}>
                  <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl text-lg font-semibold hover:scale-105 transition-transform duration-200">
                    Sign In
                  </button>
                </Link>
              )}
            </div>
          </>
        )}
      </nav>
    </>
  );
};

export default Navbar;
