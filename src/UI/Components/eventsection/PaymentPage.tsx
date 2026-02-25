import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../reducers/hooks";
import {
  cancelBooking,
  cardPay,
  cPayPayment,
  getPaymentStatus,
  normalCPayInitiate,
  ticketPay,
} from "../../../services/operations/ticketCategory";
import { useNavigate, useParams } from "react-router-dom";
import BookingErrorPage from "./Eventsprocess/BookingError";
import { ClipLoader } from "react-spinners";
import ScrollToTop from "../common/ScrollToTop";
import { toast } from "react-toastify";
import { setPayMessage } from "../../../slices/payTicketSlice";
import type { PaymentMethodType } from "../payment-ordersummay/PaymentOptions";
import PaymentOptions from "../payment-ordersummay/PaymentOptions";
import OrderSummary from "../payment-ordersummay/OrderSummary";

// Import our new components


export default function PaymentPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [showCardIframe, setShowCardIframe] = useState(false);
  const [cardIframeHtml, setCardIframeHtml] = useState<string | null>(null);
  const [paymentId, setPaymentId] = useState<number | null>(null);

  const { contentName, eventId } = useParams();

  // Added EcoCash to the type
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType>("Mpesa");
  const [mobile, setMobile] = useState("");
  const [cpayLoading, setcPayloading] = useState<boolean>(false);
  const [isValid, setIsValid] = useState<boolean>(false);

  const reserveTicket = useAppSelector((state) => state.reserveTicket.booking);
  const bookingId = useAppSelector((state) => state.ticket.bookingId);
  const paymentLoading = useAppSelector((state) => state.pay.payTicketLoading);
  const [paymentVerifyLoading, setPaymentVerifyLoading] = useState(false);

  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [otp, setOtp] = useState("");

  const eventDate = reserveTicket
    ? new Date(reserveTicket.showDate).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "";

  const eventTime = reserveTicket
    ? new Date(`1970-01-01T${reserveTicket.showTime}`).toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    : "";

  async function backHandler() {
    setcPayloading(true);
    if (bookingId) {
      const res = await dispatch(cancelBooking(bookingId));
      if (res.success) {
        navigate(`/events/${contentName}/${eventId}/booking/ticket`, { replace: true });
      }
    }
    setcPayloading(false);
  }

  async function submitHandler() {
    // Both Cpay and EcoCash use normalCPayInitiate for now
    if (selectedMethod === "Cpay") {
      setcPayloading(true);
      const res = await normalCPayInitiate(bookingId, mobile, dispatch);
      if (res.success) setShowOtpPopup(true);
      setcPayloading(false);
      return;
    }

    if (selectedMethod === "Mpesa" || selectedMethod === "EcoCash") {
      dispatch(ticketPay(bookingId, mobile, navigate));
      return;
    }

    if (selectedMethod === "CardPayment") {
      const res = await dispatch(cardPay(bookingId, mobile));
      if (res.success && res.iframeHtml && res.paymentId) {
        setCardIframeHtml(res.iframeHtml);
        setPaymentId(res.paymentId);
        setShowCardIframe(true);
      }
    }
  }

  async function verifyOtpHandler() {
    if (!otp.trim()) {
      toast.error("Please enter OTP");
      return;
    }
    setPaymentVerifyLoading(true);
    await cPayPayment(bookingId, mobile, otp, navigate, dispatch);
    setShowOtpPopup(false);
    setPaymentVerifyLoading(false);
  }

  // --- useEffects remain exactly the same ---
  useEffect(() => {
    if (!paymentId) return;
    let isActive = true;
    const POLL_INTERVAL = 5000;
    const TIMEOUT_DURATION = 3 * 60 * 1000;

    const timeoutId = setTimeout(() => {
      if (!isActive) return;
      isActive = false;
      clearInterval(intervalId);
      setShowCardIframe(false);
      dispatch(setPayMessage("Payment timed out. Please try again."));
    }, TIMEOUT_DURATION);

    const intervalId = setInterval(async () => {
      if (!isActive) return;
      try {
        const res = await getPaymentStatus(paymentId);
        const data = res.data.data;
        if (data.status === "CONFIRMED" || data.payment?.status === "SUCCESS") {
          isActive = false;
          clearInterval(intervalId);
          clearTimeout(timeoutId);
          setShowCardIframe(false);
          navigate(`/order/${data.bookingId}`, { replace: true });
          return;
        }
        if (data.status === "FAILED" || data.payment?.status === "FAILED") {
          isActive = false;
          clearInterval(intervalId);
          clearTimeout(timeoutId);
          setShowCardIframe(false);
          dispatch(setPayMessage(res.data.message));
          return;
        }
      } catch (error) {
        console.error("Polling error", error);
      }
    }, POLL_INTERVAL);

    return () => {
      isActive = false;
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, [paymentId, navigate]);

  useEffect(() => {
    if (showCardIframe) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [showCardIframe]);

  useEffect(() => {
    if (!bookingId) {
      navigate("/events");
      return;
    }
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (reserveTicket && bookingId) {
        dispatch(cancelBooking(bookingId));
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [reserveTicket, bookingId, navigate, dispatch]);

  useEffect(() => {
    setIsValid(mobile.length >= 8 && mobile.length <= 12);
  }, [mobile]);

  return (
    <div className="min-h-[calc(100vh-200px)] bg-gradient-to-br from-gray-50 to-blue-50">
      {showCardIframe && cardIframeHtml && (
        <div className="fixed inset-0 z-50 bg-white overflow-hidden">
          <div className="w-screen h-screen" dangerouslySetInnerHTML={{ __html: cardIframeHtml }} />
          <style>{`iframe { width: 100vw !important; height: 100vh !important; border: none !important; }`}</style>
        </div>
      )}

      <ScrollToTop />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <BookingErrorPage />

        {/* OTP Popup */}
        {showOtpPopup && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 animate-fadeIn">
            {/* ... Your existing OTP modal code ... */}
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-8 w-[95%] max-w-lg shadow-2xl border border-white/40 animate-scaleIn">
              <h2 className="text-2xl font-bold text-gray-800 text-center mb-3">Verify OTP</h2>
              <p className="text-sm text-gray-600 text-center mb-6">A verification code has been sent to your mobile number.</p>
              <input type="text" value={otp} maxLength={6} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} placeholder="Enter OTP" className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-lg text-center tracking-widest font-semibold focus:border-blue-600 focus:ring-2 focus:ring-blue-300 focus:outline-none bg-white shadow-sm" />
              <div className="flex items-center justify-end gap-2 mt-6">
                <button disabled={cpayLoading} onClick={backHandler} className="px-7 py-3 rounded-xl bg-red-500 text-white hover:bg-red-600 font-medium transition hover:scale-[1.03]">
                  {!cpayLoading ? "Cancel" : "Processing..."}
                </button>
                <button disabled={paymentVerifyLoading} onClick={verifyOtpHandler} className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg transition-transform hover:scale-[1.03]">
                  {paymentVerifyLoading ? <><ClipLoader size={16} color="#ffffff" /><span>Processing...</span></> : <span>Verify & Pay</span>}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* LEFT: Payment Options Component */}
          <div className="lg:col-span-3">
            <PaymentOptions
              selectedMethod={selectedMethod}
              setSelectedMethod={setSelectedMethod}
              mobile={mobile}
              setMobile={setMobile}
              isValid={isValid}
              paymentLoading={Boolean(paymentLoading)}
              cpayLoading={cpayLoading}
              submitHandler={submitHandler}
            />
          </div>

          {/* RIGHT: Order Summary Component */}
          <div className="lg:col-span-2">
            <OrderSummary reserveTicket={reserveTicket} eventDate={eventDate} eventTime={eventTime} />
          </div>
        </div>
      </div>
    </div>
  );
}