import { SPECIAL_EVENT_ID } from "@/constants/eventGates";
import { NavLink } from "react-router-dom";

export default function NavHeader() {
  const navItems = [
    { label: "Home", path: "/" },
    { label: "Browse Events", path: "/events" },
    { label: "Marathon Event", path: `/events/marathon-event/${SPECIAL_EVENT_ID} ` }
  ];

  return (
    <div className="w-full bg-white mx-auto hidden lg:block border-t border-gray-200 py-4">
      <div className="container mx-auto px-4 py-1">
        <ul className="lg:flex items-center text-gray-800 gap-5 hidden">
          {navItems.map((item, index) => (
            <li key={index}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `text-[18px] font-bold transition-all duration-200 px-3 py-1.5 rounded-xl ${
                    isActive
                      ? "text-blue-600 bg-blue-50 shadow-sm"
                      : "text-gray-800 hover:text-blue-600 hover:bg-gray-50"
                  }`
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

