import { ImCross } from "react-icons/im";
import { FaPhone } from "react-icons/fa";
import { useEffect } from "react";

type Props = {
  setShowNumber: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function EditProfileEmail({ setShowNumber }: Props) {

    useEffect(() => {
    document.body.style.overflow = "hidden"; // disable scroll
    return () => {
      document.body.style.overflow = "auto"; // enable scroll again
    };
  }, []);


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 🔹 Backdrop with blur */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={() => setShowNumber(false)}
      ></div>

      {/* 🔹 Modal Box */}
      <div className="relative bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-md z-50">
        {/* Close button */}
        <span
          onClick={() => setShowNumber(false)}
          className="absolute top-3 right-3 cursor-pointer"
        >
          <ImCross className="text-red-500 text-[18px]" />
        </span>

        {/* Content */}
        <div className="flex flex-col items-center justify-center gap-5">
          <p className="text-lg font-semibold">Change Mobile</p>

          <div className="flex gap-3 w-full">
            <div className="flex items-center gap-3 w-full">
              <FaPhone size={20} className="text-gray-600" />
              <input
                className="flex-1 border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-sky-400"
                type="tel"
                placeholder="Enter new number"
              />
            </div>
          </div>

          <button
            type="button"
         
            className="bg-sky-500 hover:bg-sky-600 text-white w-28 p-2 rounded-md transition"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
