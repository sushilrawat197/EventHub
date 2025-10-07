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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with blur */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setShowNumber(false)}
      ></div>

      {/* Modal Box */}
      <div className="relative bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md z-50 border border-gray-100">
        {/* Close button */}
        <button
          onClick={() => setShowNumber(false)}
          className="absolute top-4 right-4 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
        >
          <ImCross className="text-gray-600 text-sm" />
        </button>

        {/* Content */}
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FaPhone className="text-blue-600 text-2xl" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Change Mobile Number</h3>
            <p className="text-gray-600">Enter your new phone number to update your profile</p>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-300 bg-gray-50 focus:bg-white"
                  type="tel"
                  placeholder="Enter new number"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setShowNumber(false)}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Update Number
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
