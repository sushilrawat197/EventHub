import { useState, useRef, useEffect } from "react";
import { logout } from "../../services/operations/authApi";
import { useAppDispatch, useAppSelector } from "../../reducers/hooks";
import { Link, useNavigate } from "react-router-dom";
import { FiChevronRight } from "react-icons/fi";
import { GoPersonFill } from "react-icons/go";
import { RiEdit2Fill } from "react-icons/ri";
import { LogIn } from "lucide-react";
import { RiNotificationBadgeLine } from "react-icons/ri";
import { LuTickets } from "react-icons/lu";
import { BsChatDots } from "react-icons/bs";
import { FaGears, FaRegCircleUser } from "react-icons/fa6";

const menuItems = [
  {
    title: "Notifications",
    icon: <RiNotificationBadgeLine />,
  },
  {
    title: "Your Orders",
    subtitle: "Track your order details",
    icon: <LuTickets />,
  },
  {
    title: "Help & Support",
    subtitle: "Contact us for any query",
    icon: <BsChatDots />,
  },
  {
    title: "Settings",
    subtitle: "Profile settings and more",
    icon: <FaGears />,
  },
];

export default function ProfileDropdown() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(false);
  const [animateMenu, setAnimateMenu] = useState(false);
  const token = useAppSelector((state) => state.auth.accessToken);
  const menuRef = useRef(null);

  const handleSubmit = () => {
    dispatch(logout(token, navigate, dispatch));
  };

  // Animate in
  useEffect(() => {
    if (openMenu) {
      // start slide-in animation slightly after mounting
      setTimeout(() => setAnimateMenu(true), 10);
    } else {
      setAnimateMenu(false);
    }
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
        className="cursor-pointer bg-sky-500 text-white p-2 rounded-full w-fit"
        onClick={() => setOpenMenu(true)}
      >
        <FaRegCircleUser size={30} />
      </div>

      {/* Dropdown Menu + Overlay */}
      {openMenu && (
        <div className="fixed inset-0 z-40">
          {/* Overlay with fade-in/out */}
          <div
            className={`fixed inset-0 bg-black transition-opacity duration-300 ${
              animateMenu ? "opacity-30" : "opacity-0"
            }`}
            onClick={handleClose}
          ></div>

          {/* Slide-in menu */}
          <div
            ref={menuRef}
            className={`absolute right-0 top-0 h-screen w-[300px] bg-white shadow-lg z-50 transform transition-transform duration-300 ${
              animateMenu ? "translate-x-0" : "translate-x-full"
            }`}
          >
            {/* Header */}
            <div className="drop-shadow-sm flex items-center justify-center flex-col text-white bg-white py-4 rounded-t-lg">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-gray-300 border">
                <GoPersonFill size={40} />
              </div>
              <h2 className="text-2xl text-sky-400 font-semibold mt-1">
                Hello!
              </h2>


              
                <Link to={"/editprofile"}  onClick={() => setOpenMenu(false)} >
                <span
                  className="flex items-center text-sky-400 text-[10px] cursor-pointer space-x-1"
                >
                  <p>Edit Profile</p>
                  <RiEdit2Fill />
                </span>
              </Link>
              

              

            </div>

            {/* Menu Items */}
            <div className="py-4">
              {menuItems.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between px-6 py-5 hover:bg-gray-100 cursor-pointer border-b border-gray-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-xl text-sky-600">{item.icon}</div>
                    <div>
                      <p className="font-medium text-sm text-black">
                        {item.title}
                      </p>
                      {item.subtitle && (
                        <p className="text-xs text-[#777777]">
                          {item.subtitle}
                        </p>
                      )}
                    </div>
                  </div>
                  <FiChevronRight className="text-gray-500" />
                </div>
              ))}

              <div className="px-5">
                <button
                  onClick={handleSubmit}
                  className="w-full bg-sky-500 hover:bg-red-500 py-2 text-white rounded-full font-semibold transition flex items-center justify-center mt-4 border-2 space-x-2"
                >
                  <span>Sign out</span>
                  <LogIn className="text-xl" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
