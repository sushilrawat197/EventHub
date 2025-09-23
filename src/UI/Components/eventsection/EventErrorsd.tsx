// BookingErrorPage.tsx
import { useLocation, useNavigate } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "../../../reducers/hooks";
import { setEventsErrorMsg } from "../../../slices/eventSlice";
import { createPortal } from "react-dom";

export default function EventsErrorPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const eventErroMsg = useAppSelector((state) => state.events.eventErrorMsg);
  const location = useLocation();
  console.log(eventErroMsg);

  // Agar error message empty/null hai, component render na ho
  if (!eventErroMsg) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full text-center"
      >
        <div className="flex justify-center mb-4">
          <AlertTriangle className="text-red-500 w-16 h-16" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Booking Failed
        </h1>
        <p className="text-gray-600 mb-6">{eventErroMsg}</p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {location.pathname.includes("/ticket") ? (
            <>
              <button
                className="w-full sm:w-auto px-4 py-2 rounded-xl border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                onClick={() => {
                  dispatch(setEventsErrorMsg("")); // clear message
                  navigate("/login",{ state: { from: location.pathname } });
                }}
              >
                Login
              </button>

              <button
                className="w-full sm:w-auto px-4 py-2 rounded-xl border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                onClick={() => {
                  dispatch(setEventsErrorMsg("")); // clear message
                }}
              >
                Cancel
              </button>
            </>
          ):(
             <button
            className="w-full sm:w-auto px-4 py-2 rounded-xl border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            onClick={() => {
              dispatch(setEventsErrorMsg("")); // clear message
              navigate("/events");
            }}
          >
            See more events
          </button>

          )
        
        
        }

         
        </div>

      </motion.div>
    </div>,
    document.body // 👈 ye add karna zaroori hai
  );
}
