import { NavLink } from "react-router-dom";

export default function NavHeader() {

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Browse Event", path: "/events" },
    // { label: "About", path: "/about" }, 
  ];

  return (
    <div className="w-full bg-gray-100 mx-auto hidden lg:block border border-t-0 border-gray-300">
      <div className="container mx-auto px-4 py-2">
        <ul className="lg:flex items-center text-black gap-5 hidden">
          {navItems.map((item, index) => (
            <li key={index}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `text-lg transition-colors duration-200 ${
                    isActive ? "text-black font-semibold bg-sky-400 px-2 rounded-lg flex justify-center items-center py-1" : "text-black"
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
