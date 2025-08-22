import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { FaChevronRight } from "react-icons/fa";

interface TermsProps {
  description: string;
}



export default function TermsAndConditions({description}:TermsProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="pb-16 pt-2 lg:pb-0 lg:pt-0 mt-8">
      {/* Trigger Button */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center text-lg font-medium text-gray-800 hover:text-red-500   "
      >
        Terms & Conditions{" "}
        <span className="ml-1">
          <FaChevronRight />
        </span>
      </button>


      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 ">
          <div className="bg-white text-black w-full max-w-2xl rounded-lg shadow-lg p-6 relative">
            {/* Close Button */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 text-gray-900  cursor-pointer"
            >
              <IoClose size={24} />
            </button>

            {/* Title */}
            <h2 className="text-xl font-semibold mb-4">Terms & Conditions</h2>

            {/* Content */}
            <div className="space-y-3 text-black text-[15px] max-h-[60vh] overflow-y-auto">
              <p>{description}</p>
          
            </div>

            {/* Footer Button */}
            {/* <div className="mt-6 flex justify-end"> */}
            {/* <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Close
              </button> */}
            {/* </div> */}
          </div>
        </div>
      )}
    </div>
  );
}
