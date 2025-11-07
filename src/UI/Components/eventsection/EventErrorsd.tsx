// BookingErrorPage.tsx
import { useLocation, useNavigate } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "../../../reducers/hooks";
import { setEventsErrorMsg } from "../../../slices/eventSlice";
import { createPortal } from "react-dom";
import { useEffect } from "react";

export default function EventsErrorPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const eventErroMsg = useAppSelector((state) => state.events.eventErrorMsg);
  //(eventErroMsg);

 useEffect(() => {
  if (!eventErroMsg) return;

  document.body.style.overflow = "hidden";
  return () => {
    document.body.style.overflow = "auto";
  };
}, [eventErroMsg]);

  if (!eventErroMsg) return null;

  const handleClose = () => dispatch(setEventsErrorMsg(""));
  const handleLogin = () => {
    handleClose();
    navigate("/login", { state: { from: location.pathname } });
  };
  const handleBrowseEvents = () => {
    handleClose();
    navigate("/events");
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 20 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 text-center border border-gray-100"
      >
        {/* Icon */}
        <div className="mx-auto mb-4 w-16 h-16 flex items-center justify-center rounded-full bg-red-500/20">
          <AlertTriangle className="text-red-600 w-10 h-10" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Failed</h2>

        {/* Message */}
        <p className="text-gray-700 text-base mb-6">{eventErroMsg}</p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {location.pathname.includes("/ticket") ? (
            <>
              <button
                onClick={handleLogin}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl font-semibold shadow hover:shadow-md transition-all flex items-center justify-center gap-2"
              >
                Login to Continue
              </button>
              <button
                onClick={handleClose}
                className="flex-1 border border-gray-300 hover:bg-gray-100 text-gray-700 px-4 py-3 rounded-xl font-semibold transition-all"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={handleBrowseEvents}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl font-semibold shadow hover:shadow-md transition-all"
            >
              Browse More Events
            </button>
          )}
        </div>
      </motion.div>
    </div>,
    document.body
  );
}
