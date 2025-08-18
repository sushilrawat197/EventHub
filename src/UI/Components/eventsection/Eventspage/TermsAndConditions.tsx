import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { FaChevronRight } from "react-icons/fa";

export default function TermsAndConditions() {
  const [open, setOpen] = useState(false);

  return (
    <div>
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
              <p>1. Tickets once booked cannot be exchanged or refunded.</p>
              <p>
                2. The organizer reserves the right to change or cancel the
                event at any time.
              </p>
              <p>
                3. Entry is restricted to individuals above the specified age
                limit.
              </p>
              <p>
                4. Please carry a valid government ID proof for verification.
              </p>
              <p>5. Outside food and beverages are strictly prohibited.</p>
              <p>
                6. By attending, you agree to comply with venue safety
                guidelines.
              </p>
              <p>
                7. Misbehavior or misconduct will lead to immediate removal from
                the venue.
              </p>
              <p>
                8. The organizer holds no responsibility for loss or theft of
                personal belongings.
              </p>
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
