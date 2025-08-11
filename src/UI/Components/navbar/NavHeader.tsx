import { Link } from "react-router-dom";

export default function NavHeader() {
  return (
    <div className="w-full bg-gray-100  mx-auto hidden lg:block">
      <div className="container mx-auto px-4 py-2 ">
        <ul className="lg:flex items-center text-black gap-5 hidden  ">
          <Link to={"/"}>
            <li className="text-lg">Home</li>
          </Link>
          <Link to={"/events"}>
            <li className="text-lg">Browse Event</li>
          </Link>
        </ul>
      </div>
    </div>
  );
}
