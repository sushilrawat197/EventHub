import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "../../../../reducers/hooks";
import { setPayMessage } from "../../../../slices/payTicketSlice";

export default function BookingErrorPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const payMessage = useAppSelector((state) => state.pay.payMessege);

  // 🧹 CLEANUP: clear payment state on unmount
  useEffect(() => {
    return () => {
      dispatch(setPayMessage(""));
    };
  }, [dispatch]);

  // Agar payMessage empty hai ya null, kuch render na kare
  if (!payMessage) return null;

  return (
    <div className="fixed inset-0 z-[50] flex items-center justify-center bg-black/40 px-4">
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

        <p className="text-gray-600 mb-6">{payMessage}</p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            className="w-full sm:w-auto px-4 py-2 rounded-xl border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            onClick={() => {
              dispatch(setPayMessage(""));
              navigate("/");
            }}
          >
            Back to Home
          </button>

          <button
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600"
            onClick={() => {
              dispatch(setPayMessage(""));
              navigate("/support");
            }}
          >
            Contact Support
          </button>
        </div>
      </motion.div>
    </div>
  );
}
