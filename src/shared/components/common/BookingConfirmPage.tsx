import {
  FaDownload,
  FaTicketAlt,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaCreditCard,
} from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "../../../app/store/hooks";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  downloadTicket,
  getOrderDetails,
} from "../../../features/booking/api/ticketCategory";
import {
  getMarathonRegistrationByUserId,
  type MarathonRegistrationDetails,
  submitMarathonRegistration,
  type MarathonRegistrationPayload,
} from "../../../features/booking/api/marathonRegistration";
import { useLockBodyScroll } from "../../../hooks/useLockBodyScroll";
import SpinnerLoading from "./SpinnerLoading";

interface ParticipantFormData {
  name: string;
  surname: string;
  identityType: "id" | "passport";
  identityValue: string;
  email: string;
  cellNumber: string;
  district: string;
  emergencyContactName: string;
  emergencyNumber: string;
  shirtSize: "XS" | "S" | "M" | "L" | "XL" | "XXL" | "";
  disclaimerAccepted: boolean;
}

type ParticipantFormErrors = Partial<Record<keyof ParticipantFormData, string>>;

export default function BookingConfirmed() {
  const dispatch = useAppDispatch();
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [downloading, setDownloading] = useState(false);
  const [showParticipantForm, setShowParticipantForm] = useState(false);
  const [participantForm, setParticipantForm] = useState<ParticipantFormData>({
    name: "",
    surname: "",
    identityType: "id",
    identityValue: "",
    email: "",
    cellNumber: "",
    district: "",
    emergencyContactName: "",
    emergencyNumber: "",
    shirtSize: "",
    disclaimerAccepted: false,
  });
  const [participantErrors, setParticipantErrors] =
    useState<ParticipantFormErrors>({});
  const [submittingParticipant, setSubmittingParticipant] = useState(false);
  const [loadingParticipantRegistration, setLoadingParticipantRegistration] =
    useState(false);
  const [existingRegistration, setExistingRegistration] =
    useState<MarathonRegistrationDetails | null>(null);

  const confirmBookingDetails = useAppSelector(
    (state) => state.confirmBooking.booking
  );
  const currentUser = useAppSelector((state) => state.user.user);
  const isExistingRegistration = existingRegistration !== null;
  useLockBodyScroll(showParticipantForm);

  const [showPopup, setShowPopup] = useState<boolean>(false);
  const loading = useAppSelector((state) => state.confirmBooking.loading);

  const eventDate = confirmBookingDetails
    ? new Date(confirmBookingDetails.show.date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "";

  const eventTime = confirmBookingDetails
    ? new Date(
        `1970-01-01T${confirmBookingDetails.show.time}`
      ).toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    : "";

  const downloadHandler = async () => {
    try {
      setDownloading(true); // disable button + show loader
      const res = await dispatch(downloadTicket(Number(bookingId)));
      if (res.success) {
        setShowPopup(true);
      }
    } finally {
      setDownloading(false); // re-enable button
    }
  };

  const handleParticipantChange = (
    key: keyof ParticipantFormData,
    value: string | boolean
  ) => {
    setParticipantForm((prev) => ({
      ...prev,
      [key]: value,
    }));
    setParticipantErrors((prev) => {
      if (!prev[key]) return prev;
      return { ...prev, [key]: "" };
    });
  };

  const validateParticipantForm = (data: ParticipantFormData) => {
    const errors: ParticipantFormErrors = {};
    const nameRegex = /^[A-Za-z\s'-]{2,}$/;
    const lsPhoneRegex = /^\d{8}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const idRegex = /^\d{6,20}$/;
    const passportRegex = /^[A-Za-z0-9]{6,20}$/;

    if (!data.name.trim()) errors.name = "Name is required.";
    else if (!nameRegex.test(data.name.trim()))
      errors.name = "Enter a valid name.";

    if (!data.surname.trim()) errors.surname = "Surname is required.";
    else if (!nameRegex.test(data.surname.trim()))
      errors.surname = "Enter a valid surname.";

    if (!data.identityValue.trim()) {
      errors.identityValue =
        data.identityType === "id"
          ? "ID number is required."
          : "Passport number is required.";
    } else if (
      data.identityType === "id" &&
      !idRegex.test(data.identityValue.trim())
    ) {
      errors.identityValue = "ID number must be 6-20 digits.";
    } else if (
      data.identityType === "passport" &&
      !passportRegex.test(data.identityValue.trim())
    ) {
      errors.identityValue = "Passport number must be 6-20 letters or digits.";
    }

    if (!data.email.trim()) errors.email = "Email address is required.";
    else if (!emailRegex.test(data.email.trim()))
      errors.email = "Enter a valid email address.";

    if (!data.cellNumber.trim()) errors.cellNumber = "Cell number is required.";
    else if (!lsPhoneRegex.test(data.cellNumber.trim()))
      errors.cellNumber = "Cell number must be 8 digits.";

    if (!data.district.trim()) errors.district = "District is required.";

    if (!data.emergencyContactName.trim()) {
      errors.emergencyContactName = "Emergency contact name is required.";
    } else if (!nameRegex.test(data.emergencyContactName.trim())) {
      errors.emergencyContactName = "Enter a valid emergency contact name.";
    }

    if (!data.emergencyNumber.trim()) {
      errors.emergencyNumber = "Emergency number is required.";
    } else if (!lsPhoneRegex.test(data.emergencyNumber.trim())) {
      errors.emergencyNumber = "Emergency number must be 8 digits.";
    }

    if (!data.shirtSize) errors.shirtSize = "Please select a T-shirt size.";

    if (!data.disclaimerAccepted) {
      errors.disclaimerAccepted = "You must accept the disclaimer.";
    }

    return errors;
  };

  const handleParticipantSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errors = validateParticipantForm(participantForm);
    setParticipantErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const userId = Number(currentUser?.userId);
    if (!userId || Number.isNaN(userId)) {
      toast.error("Unable to identify user. Please login again.");
      return;
    }

    const normalizePhoneNumber = (value: string) => {
      const digits = value.replace(/\D/g, "");
      if (digits.startsWith("266")) return `+${digits}`;
      if (digits.length === 8) return `+266${digits}`;
      return value.trim();
    };

    const registrationPayload: MarathonRegistrationPayload = {
      userId,
      name: participantForm.name.trim(),
      surname: participantForm.surname.trim(),
      identityType:
        participantForm.identityType === "id" ? "LS_CITIZEN" : "FOREIGN_NATIONAL",
      idNumber:
        participantForm.identityType === "id"
          ? participantForm.identityValue.trim()
          : null,
      passportNumber:
        participantForm.identityType === "passport"
          ? participantForm.identityValue.trim()
          : null,
      emailAddress: participantForm.email.trim(),
      cellNumber: normalizePhoneNumber(participantForm.cellNumber),
      district: participantForm.district.trim(),
      emergencyContactName: participantForm.emergencyContactName.trim(),
      emergencyNumber: normalizePhoneNumber(participantForm.emergencyNumber),
      shirtSize: participantForm.shirtSize as
        | "XS"
        | "S"
        | "M"
        | "L"
        | "XL"
        | "XXL",
      disclaimerAccepted: participantForm.disclaimerAccepted,
    };

    setSubmittingParticipant(true);
    submitMarathonRegistration(registrationPayload)
      .then((result) => {
        if (!result.success) {
          toast.error(result.message);
          return;
        }

        toast.success(result.message || "Registration submitted successfully.");
        setShowParticipantForm(false);
        setParticipantForm({
          name: "",
          surname: "",
          identityType: "id",
          identityValue: "",
          email: "",
          cellNumber: "",
          district: "",
          emergencyContactName: "",
          emergencyNumber: "",
          shirtSize: "",
          disclaimerAccepted: false,
        });
        setParticipantErrors({});
      })
      .finally(() => {
        setSubmittingParticipant(false);
      });
  };

  const openParticipantForm = async () => {
    const userId = Number(currentUser?.userId);
    if (!userId || Number.isNaN(userId)) {
      toast.error("Unable to identify user. Please login again.");
      return;
    }

    setLoadingParticipantRegistration(true);
    setParticipantErrors({});
    setExistingRegistration(null);

    const response = await getMarathonRegistrationByUserId(userId);

    if (!response.success) {
      toast.error(response.message);
      setLoadingParticipantRegistration(false);
      return;
    }

    if (response.data) {
      setExistingRegistration(response.data);
      setParticipantForm({
        name: response.data.name || "",
        surname: response.data.surname || "",
        identityType:
          response.data.identityType === "LS_CITIZEN" ? "id" : "passport",
        identityValue:
          response.data.identityType === "LS_CITIZEN"
            ? response.data.idNumber || ""
            : response.data.passportNumber || "",
        email: response.data.emailAddress || "",
        cellNumber: response.data.cellNumber || "",
        district: response.data.district || "",
        emergencyContactName: response.data.emergencyContactName || "",
        emergencyNumber: response.data.emergencyNumber || "",
        shirtSize: response.data.shirtSize || response.data.tShirtSize || "",
        disclaimerAccepted: !!response.data.disclaimerAccepted,
      });
    } else {
      setParticipantForm({
        name: "",
        surname: "",
        identityType: "id",
        identityValue: "",
        email: "",
        cellNumber: "",
        district: "",
        emergencyContactName: "",
        emergencyNumber: "",
        shirtSize: "",
        disclaimerAccepted: false,
      });
    }

    setShowParticipantForm(true);
    setLoadingParticipantRegistration(false);
  };

  useEffect(() => {
    const context = localStorage.getItem("navigateContext");
    if (context === "confirmBooking") {
      dispatch(getOrderDetails(Number(bookingId), navigate));
    }
    return () => {
      localStorage.removeItem("navigateContext");
    };
  }, [bookingId, dispatch, navigate]);

  useEffect(() => {
    dispatch(getOrderDetails(Number(bookingId), navigate));
  }, []);

  if (loading) {
    return <SpinnerLoading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col items-center p-4 sm:p-6 mt-16 lg:mt-28">
      {/* Header Confirmation */}
      <div className="w-full max-w-7xl bg-white shadow-xl rounded-xl p-4 sm:p-5 mb-4 flex items-center justify-center border border-gray-100">
        <div className="text-center">
          <div
            className={`w-8 h-8 sm:w-10 sm:h-10  ${
              confirmBookingDetails?.status === "CONFIRMED"
                ? " bg-green-500"
                : "bg-red-500"
            }   rounded-lg flex items-center justify-center mx-auto mb-2 shadow-lg`}
          >
            {confirmBookingDetails?.status === "CONFIRMED" ? (
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            )}
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
            {confirmBookingDetails?.status}
          </h1>
          <p className="text-gray-600 text-xs sm:text-sm">
            {confirmBookingDetails?.status === "CONFIRMED"
              ? "Your tickets are ready for download"
              : "Your booking has been cancelled"}
          </p>
        </div>
      </div>

      {/* ✅ Popup */}
      {showPopup && (
        <div className="fixed inset-0 backdrop-blur-2xl flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-2xl w-full max-w-md text-center border border-gray-100">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <svg
                className="w-7 h-7 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3"
                />
              </svg>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold mb-2 text-gray-900">
              Ticket Downloaded!
            </h2>
            <p className="text-gray-600 mb-6 text-sm sm:text-base">
              Your ticket has been saved to your downloads folder.
            </p>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-5 mb-6">
              <h3 className="text-base sm:text-lg font-bold mb-1 text-gray-900">
                Share Your Experience
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 mb-3">
                Your feedback helps us improve our service!
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-3 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                onClick={() => navigate("/rate-and-review")}
              >
                Give Feedback
              </button>

              <button
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-2xl font-semibold transition-all duration-300"
                onClick={() => setShowPopup(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Main Content */}
      <div className="w-full max-w-7xl flex flex-col lg:flex-row gap-6 items-stretch">
        {/* LEFT SECTION - Order Summary */}
        <div className="w-full lg:w-2/3">
          {/* Event Details Card */}
          <div className="bg-white shadow-xl rounded-2xl p-6 border border-gray-100 h-full">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Event Image */}
              <div className="relative w-full lg:w-48 h-64 lg:h-48">
                <img
                  src={confirmBookingDetails?.event.eventPoster}
                  alt="Event Poster"
                  className="w-full h-full object-cover rounded-xl shadow-lg"
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-700">
                  {confirmBookingDetails?.event.category}
                </div>
              </div>

              {/* Event Details */}
              <div className="flex-1">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="flex-1">
                    <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">
                      {confirmBookingDetails?.event.eventName}
                    </h2>
                    <p className="text-gray-600 text-sm mb-4">
                      {confirmBookingDetails?.event.eventName}
                    </p>
                  </div>

                  {confirmBookingDetails?.status === "CONFIRMED" && (
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={!downloading ? downloadHandler : undefined}
                        disabled={downloading}
                        className={`relative justify-center bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-semibold text-sm shadow-lg flex items-center gap-2 transition-all duration-300 transform ${
                          downloading
                            ? "opacity-60 cursor-not-allowed"
                            : "hover:from-blue-700 hover:to-blue-800 hover:shadow-xl hover:scale-105"
                        }`}
                      >
                        {downloading ? (
                          <>
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                            <span>Downloading...</span>
                          </>
                        ) : (
                          <>
                            <FaDownload className="w-4 h-4" />
                            <span>Download Tickets</span>
                          </>
                        )}

                        {downloading && (
                          <span className="absolute bottom-0 left-0 h-[2px] bg-white animate-[progress_2s_linear_infinite] w-full"></span>
                        )}
                      </button>
                      {Number(confirmBookingDetails?.event?.eventId) === 39 && (
                        <button
                          type="button"
                          onClick={openParticipantForm}
                          disabled={loadingParticipantRegistration}
                          className={`justify-center text-white px-6 py-3 rounded-xl font-semibold text-sm shadow-lg flex items-center gap-2 transition-all duration-300 transform ${
                            loadingParticipantRegistration
                              ? "bg-red-400 cursor-not-allowed"
                              : "bg-red-600 hover:bg-red-700 hover:shadow-xl hover:scale-105"
                          }`}
                        >
                          {loadingParticipantRegistration ? (
                            <>
                              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                              <span>Loading...</span>
                            </>
                          ) : (
                            "Registration Form"
                          )}
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Event Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <FaMapMarkerAlt className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-semibold text-gray-900">
                        Venue
                      </span>
                    </div>
                    <p className="text-sm font-bold text-gray-900 mb-1">
                      {confirmBookingDetails?.show.venue}
                    </p>
                    <p className="text-xs text-gray-600">
                      {confirmBookingDetails?.show.venueAddress}
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <FaCalendarAlt className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-semibold text-gray-900">
                        Date & Time
                      </span>
                    </div>
                    <p className="text-sm font-bold text-gray-900 mb-1">
                      {eventDate}
                    </p>
                    <p className="text-xs text-gray-600">{eventTime}</p>
                  </div>
                </div>

                {/* Ticket Info */}
                {confirmBookingDetails?.tickets?.length ? (
                  <div className="mt-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <FaTicketAlt className="w-4 h-4 text-purple-600" />
                      <h3 className="text-sm font-bold text-gray-900">
                        Ticket Information
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                      
                      {confirmBookingDetails.tickets.some(
                        (t) => t.seatCode
                      ) && (
                        <div>
                          <p className="font-semibold text-gray-700 mb-1">
                            Seats
                          </p>
                          <p className="font-bold text-gray-900">
                            {confirmBookingDetails.tickets
                              .map((t) => t.seatCode)
                              .filter(Boolean)
                              .join(", ")}
                          </p>
                        </div>
                      )}

                      <div>
                        <p className="font-semibold text-gray-700 mb-1">
                          Category
                        </p>
                        <p className="font-bold text-gray-900">
                          {confirmBookingDetails.tickets
                            .map((t) => t.category)
                            .join(", ")}
                        </p>
                      </div>

                      <div>
                        <p className="font-semibold text-gray-700 mb-1">
                          Ticket IDs
                        </p>
                        <p className="font-bold text-gray-900">
                          {confirmBookingDetails.tickets
                            .map((t) => t.ticketId)
                            .join(", ")}
                        </p>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-700 mb-1">
                          Booking No
                        </p>
                        <p className="font-bold text-gray-900">
                          {confirmBookingDetails?.bookingNo}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SECTION - Payment Summary */}
        <div className="w-full lg:w-1/3">
          {/* Payment Summary Card */}
          <div className="bg-white shadow-xl rounded-2xl p-6 border border-gray-100 h-full">
            <div className="flex items-center gap-3 mb-6">
              <FaCreditCard className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-bold text-gray-900">
                Payment Summary
              </h3>
            </div>

            <div className="space-y-4">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-700">
                    Order ID
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    #{confirmBookingDetails?.orderNo}
                  </span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-700">
                    Payment Status
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    {confirmBookingDetails?.payment?.responseDesc}
                  </span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-700">
                    Tickets
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    M{confirmBookingDetails?.bookingAmount.baseAmount}
                  </span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-700">
                    Taxes & Fees
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    M{confirmBookingDetails?.bookingAmount.taxAmount}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-bold text-gray-900">
                      Total Amount Paid
                    </span>
                    <span className="text-lg font-bold text-green-600">
                      M{confirmBookingDetails?.bookingAmount.totalAmount}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showParticipantForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">
                Participant Information
              </h2>
              <button
                type="button"
                onClick={() => setShowParticipantForm(false)}
                className="text-gray-500 hover:text-gray-700 text-xl leading-none"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleParticipantSubmit} className="p-6 space-y-4">
              {isExistingRegistration && (
                <div className="bg-blue-50 text-blue-700 text-sm rounded-lg px-3 py-2">
                  Registration already exists. Showing saved details.
                </div>
              )}

              {loadingParticipantRegistration ? (
                <div className="py-8 flex items-center justify-center text-gray-600">
                  Loading registration details...
                </div>
              ) : (
                <fieldset
                  disabled={isExistingRegistration}
                  className={isExistingRegistration ? "opacity-80" : ""}
                >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    placeholder="Name"
                    value={participantForm.name}
                    onChange={(e) =>
                      handleParticipantChange("name", e.target.value)
                    }
                    className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${
                      participantErrors.name
                        ? "border-red-500 focus:ring-red-400"
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
                  />
                  {participantErrors.name && (
                    <p className="mt-1 text-xs text-red-600">
                      {participantErrors.name}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Surname
                  </label>
                  <input
                    type="text"
                    placeholder="Surname"
                    value={participantForm.surname}
                    onChange={(e) =>
                      handleParticipantChange("surname", e.target.value)
                    }
                    className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${
                      participantErrors.surname
                        ? "border-red-500 focus:ring-red-400"
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
                  />
                  {participantErrors.surname && (
                    <p className="mt-1 text-xs text-red-600">
                      {participantErrors.surname}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Identity Type
                  </label>
                  <select
                    value={participantForm.identityType}
                    onChange={(e) =>
                      handleParticipantChange(
                        "identityType",
                        e.target.value as "id" | "passport"
                      )
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="id">ID Number (LS Citizens)</option>
                    <option value="passport">
                      Passport Number (Foreign Nationals)
                    </option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {participantForm.identityType === "id"
                      ? "ID Number"
                      : "Passport Number"}
                  </label>
                  <input
                    type="text"
                    placeholder={
                      participantForm.identityType === "id"
                        ? "ID Number"
                        : "Passport Number"
                    }
                    value={participantForm.identityValue}
                    onChange={(e) =>
                      handleParticipantChange("identityValue", e.target.value)
                    }
                    className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${
                      participantErrors.identityValue
                        ? "border-red-500 focus:ring-red-400"
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
                  />
                  {participantErrors.identityValue && (
                    <p className="mt-1 text-xs text-red-600">
                      {participantErrors.identityValue}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={participantForm.email}
                    onChange={(e) =>
                      handleParticipantChange("email", e.target.value)
                    }
                    className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${
                      participantErrors.email
                        ? "border-red-500 focus:ring-red-400"
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
                  />
                  {participantErrors.email && (
                    <p className="mt-1 text-xs text-red-600">
                      {participantErrors.email}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cell Number
                  </label>
                  <input
                    type="tel"
                    placeholder="Cell Number"
                    value={participantForm.cellNumber}
                    onChange={(e) =>
                      handleParticipantChange("cellNumber", e.target.value)
                    }
                    className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${
                      participantErrors.cellNumber
                        ? "border-red-500 focus:ring-red-400"
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
                  />
                  {participantErrors.cellNumber && (
                    <p className="mt-1 text-xs text-red-600">
                      {participantErrors.cellNumber}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    District
                  </label>
                  <input
                    type="text"
                    placeholder="District"
                    value={participantForm.district}
                    onChange={(e) =>
                      handleParticipantChange("district", e.target.value)
                    }
                    className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${
                      participantErrors.district
                        ? "border-red-500 focus:ring-red-400"
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
                  />
                  {participantErrors.district && (
                    <p className="mt-1 text-xs text-red-600">
                      {participantErrors.district}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    T-shirt Size
                  </label>
                  <select
                    value={participantForm.shirtSize}
                    onChange={(e) =>
                      handleParticipantChange(
                        "shirtSize",
                        e.target.value as ParticipantFormData["shirtSize"]
                      )
                    }
                    className={`w-full border rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 ${
                      participantErrors.shirtSize
                        ? "border-red-500 focus:ring-red-400"
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
                  >
                    <option value="">T-shirt Size</option>
                    <option value="XS">XS</option>
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                    <option value="XXL">XXL</option>
                  </select>
                  {participantErrors.shirtSize && (
                    <p className="mt-1 text-xs text-red-600">
                      {participantErrors.shirtSize}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Emergency Contact Name
                  </label>
                  <input
                    type="text"
                    placeholder="Emergency Contact Name"
                    value={participantForm.emergencyContactName}
                    onChange={(e) =>
                      handleParticipantChange(
                        "emergencyContactName",
                        e.target.value
                      )
                    }
                    className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${
                      participantErrors.emergencyContactName
                        ? "border-red-500 focus:ring-red-400"
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
                  />
                  {participantErrors.emergencyContactName && (
                    <p className="mt-1 text-xs text-red-600">
                      {participantErrors.emergencyContactName}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Emergency Number
                  </label>
                  <input
                    type="tel"
                    placeholder="Emergency Number"
                    value={participantForm.emergencyNumber}
                    onChange={(e) =>
                      handleParticipantChange("emergencyNumber", e.target.value)
                    }
                    className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${
                      participantErrors.emergencyNumber
                        ? "border-red-500 focus:ring-red-400"
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
                  />
                  {participantErrors.emergencyNumber && (
                    <p className="mt-1 text-xs text-red-600">
                      {participantErrors.emergencyNumber}
                    </p>
                  )}
                </div>
              </div>

              <label className="flex items-start gap-3 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={participantForm.disclaimerAccepted}
                  onChange={(e) =>
                    handleParticipantChange("disclaimerAccepted", e.target.checked)
                  }
                  className="mt-1"
                />
                <span>
                  I warrant that I am physically fit and sufficiently trained to
                  participate.
                </span>
              </label>
              {participantErrors.disclaimerAccepted && (
                <p className="text-xs text-red-600 -mt-3">
                  {participantErrors.disclaimerAccepted}
                </p>
              )}

              {!isExistingRegistration && (
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={!participantForm.disclaimerAccepted || submittingParticipant}
                  className={`w-full text-white font-semibold py-2.5 rounded-lg transition-colors ${
                    participantForm.disclaimerAccepted && !submittingParticipant
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  {submittingParticipant ? "Submitting..." : "Submit"}
                </button>
              </div>
              )}
                </fieldset>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
