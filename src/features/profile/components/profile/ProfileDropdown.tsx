import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { logout } from "../../../auth/api/authApi";
import { useAppDispatch, useAppSelector } from "../../../../app/store/hooks";
import { Link, useNavigate } from "react-router-dom";
import { FiChevronRight } from "react-icons/fi";
import { GoPersonFill } from "react-icons/go";
import { RiEdit2Fill } from "react-icons/ri";
import { RiNotificationBadgeLine } from "react-icons/ri";
import { LuTickets } from "react-icons/lu";
import { BsChatDots } from "react-icons/bs";
import { FaGears } from "react-icons/fa6";
import { FaRegUserCircle } from "react-icons/fa";
import { ClipLoader } from "react-spinners";

const menuItems = [
  {
    title: "Notifications",
    icon: <RiNotificationBadgeLine />,
    path: "/notifications",
  },
  {
    title: "Your Orders",
    subtitle: "Track your order details",
    icon: <LuTickets />,
    path: "/orders",
  },
  {
    title: "Help & Support",
    subtitle: "Contact us for any query",
    icon: <BsChatDots />,
    path: "/helpandsupport",
  },
  {
    title: "Settings",
    subtitle: "Profile settings and more",
    icon: <FaGears />,
    path: "/settings",
  },
];

export default function ProfileDropdown() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(false);
  const [animateMenu, setAnimateMenu] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const loading = useAppSelector((state) => state.auth.loading);

  const user = useAppSelector((state) => state.user.user);

  const menuRef = useRef(null);

  const handleSubmit = () => {
    dispatch(logout(navigate, dispatch));
  };

  useEffect(() => {
    if (!openMenu) {
      setAnimateMenu(false);
      document.body.style.overflow = "";
      return;
    }
    const id = requestAnimationFrame(() => setAnimateMenu(true));
    document.body.style.overflow = "hidden";
    return () => {
      cancelAnimationFrame(id);
      document.body.style.overflow = "";
    };
  }, [openMenu]);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !(menuRef.current as HTMLElement).contains(event.target as Node)
      ) {
        handleClose();
      }
    }

    if (openMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMenu]);

  const handleClose = () => {
    setAnimateMenu(false);
    // wait for animation to finish before unmounting
    setTimeout(() => setOpenMenu(false), 300);
  };


  return (
    <div className="relative z-50">
      {/* Trigger Button */}
      <div
        className="cursor-pointer text-white p-2 w-fit hover:bg-white/10 rounded-xl transition-all duration-300 group"
        onClick={() => setOpenMenu(true)}
      >
        <div className="flex items-center justify-center gap-3">
          {user?.avatarUrl ? (
            <div className="flex justify-center items-center text-white gap-2">
              <div className="rounded-full w-10 h-10 ring-2 ring-white/30 group-hover:ring-white/50 transition-all duration-300">
                <img
                  src={user?.avatarUrl}
                  alt="Profile"
                  loading="lazy"
                  onLoad={() => setLoaded(true)}
                  className={`
                    rounded-full w-10 h-10 object-cover overflow-hidden
                    transition-all duration-500 ease-in-out
                    ${
                      loaded
                        ? "opacity-100 blur-0"
                        : "opacity-0 blur-md"
                    }
                  `}
                />
              </div>
            </div>
          ) : (
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-all duration-300">
              <FaRegUserCircle size={24} />
            </div>
          )}

          <div className="hidden lg:flex items-center justify-center gap-2">
            <div className="text-right">
              <p className="text-sm font-semibold">Hello! {user?.firstName?.slice(0, 8)}</p>
              {/* <p className="text-xs text-blue-100">Profile</p> */}
            </div>
            <svg className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>


      {/* Overlay + drawer portaled to body so backdrop-filter stacks above page content */}
      {openMenu &&
        createPortal(
          <>
            <div
              className="fixed inset-0 z-[9998] bg-slate-950/50 backdrop-blur-md supports-[backdrop-filter]:bg-slate-950/40"
              style={{ WebkitBackdropFilter: "blur(12px)" }}
              onClick={handleClose}
              aria-hidden
            />

            <div
              ref={menuRef}
              className={`fixed right-0 top-0 z-[9999] flex h-dvh max-h-[100dvh] w-[min(100vw-1rem,280px)] flex-col bg-white shadow-2xl transition-transform duration-300 ease-out border-l border-gray-100 ${
                animateMenu ? "translate-x-0" : "translate-x-full"
              }`}
            >
            {/* Header */}
            <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white p-5 relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white rounded-full blur-xl"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-white rounded-full blur-lg"></div>
              </div>
              
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-3 border-2 border-white/30 shadow-lg">
                  {user?.avatarUrl ? (
                    <img
                      src={user?.avatarUrl}
                      alt="Profile"
                      loading="lazy"
                      onLoad={() => setLoaded(true)}
                      className={`
                        rounded-xl w-12 h-12 object-cover overflow-hidden
                        transition-all duration-500 ease-in-out
                        ${
                          loaded
                            ? "opacity-100 blur-0"
                            : "opacity-0 blur-md"
                        }
                      `}
                    />
                  ) : (
                    <GoPersonFill size={24} className="text-white" />
                  )}
                </div>

                <h2 className="text-lg font-bold mb-1">
                  {user?.firstName ? user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1) : 'User'}
                </h2>
                <p className="text-blue-100 text-xs mb-3">Welcome back!</p>

                <Link to={"/my-profile/edit-profile"} onClick={() => setOpenMenu(false)}>
                  <div className="group flex items-center gap-1 bg-white/20 backdrop-blur-sm hover:bg-white/30 px-3 py-1.5 rounded-lg transition-all duration-300 cursor-pointer">
                    <RiEdit2Fill size={14} />
                    <span className="text-xs font-medium">Edit Profile</span>
                    <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              </div>
            </div>


            {/* Menu Items */}
            <div className="flex min-h-0 flex-1 flex-col overflow-y-auto py-4 px-3">
              {menuItems.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    if (item.path) navigate(item.path);
                    handleClose();
                  }}
                  className="group flex items-center justify-between p-3 hover:bg-blue-50 cursor-pointer rounded-lg transition-all duration-300 hover:shadow-sm mb-1"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 group-hover:bg-blue-200 rounded-lg flex items-center justify-center transition-colors duration-300">
                      <div className="text-blue-600 group-hover:text-blue-700 text-lg">{item.icon}</div>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 group-hover:text-blue-700 transition-colors text-sm">
                        {item.title}
                      </p>
                      {item.subtitle && (
                        <p className="text-xs text-gray-500 group-hover:text-gray-600 transition-colors">
                          {item.subtitle}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="group-hover:translate-x-1 transition-transform duration-300">
                    <FiChevronRight className="text-gray-400 group-hover:text-blue-600 text-sm" />
                  </div>
                </div>
              ))}


              <div className="px-3 pt-3 border-t border-gray-100">
                {loading ? (
                  <div className="w-full bg-gradient-to-r from-red-500 to-red-600 py-3 text-white rounded-xl font-medium transition-all duration-300 flex items-center justify-center shadow-md">
                    <ClipLoader color="#ffffff" size={16} />
                    <span className="ml-2 text-sm">Signing out...</span>
                  </div>
                ) : (
                  <button
                    onClick={handleSubmit}
                    className="group w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 py-3 text-white rounded-xl font-medium transition-all duration-300 flex items-center justify-center shadow-md hover:shadow-lg transform hover:scale-105"
                  >
                    <svg className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span className="text-sm">Sign Out</span>
                  </button>
                )}
              </div>
            </div>
            </div>
          </>,
          document.body
        )}
    </div>
  );
}
