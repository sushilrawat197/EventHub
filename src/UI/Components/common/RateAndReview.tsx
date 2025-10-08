import { useState } from "react";
import { useAppDispatch } from "../../../reducers/hooks";
import { ratingAndReview } from "../../../services/operations/rateAndReview";
import { useNavigate } from "react-router-dom";
import { ImSad2 } from "react-icons/im";
import { FaSmile } from "react-icons/fa";
import { FaGrinStars } from "react-icons/fa";
import { FaSadTear } from "react-icons/fa";

export default function RateAndReview() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [review, setReview] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  // Icon set for rating
const emojis = [
  { icon: <FaSadTear size={36} color="red" />, label: "Bad" },
  { icon: <ImSad2 size={36} className="text-yellow-400" />, label: "Ok" },
  { icon: <FaSmile size={36} className="text-green-400"/>, label: "Good" },
  { icon: <FaGrinStars size={36} className="text-green-500" />, label: "Great" },
];


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(ratingAndReview(rating, review));

    if (result.success) {
      setRating(0);
      setReview("");
      setShowPopup(true); // ✅ popup show
    }
    console.log("Rating:", rating, "Review:", review);
  };

  return (
    <div className="lg:min-h-[calc(100vh-6rem)] min-h-[calc(100vh-40px)] flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md relative flex flex-col items-center">
        <h2 className="text-2xl font-bold text-center mb-6">
          Rate our service
        </h2>

        {/* Rating Section with Emojis */}
        <div className="flex justify-center gap-3 mb-6 text-3xl">
          {emojis.map((item, index) => {
            const value = index + 1;
            return (
              <span
                key={value}
                role="button"
                aria-label={item.label}
                className={`cursor-pointer flex flex-col items-center mx-2 transition-transform ${
                  value === rating || value === hover
                    ? "scale-125 opacity-100"
                    : "opacity-80"
                }`}
                onClick={() => setRating(value)}
                onMouseEnter={() => setHover(value)}
                onMouseLeave={() => setHover(0)}
              >
                <span className="">{item.icon}</span>
                <span className="text-xs">{item.label}</span>
              </span>
            );
          })}
        </div>
        <button
         onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          SUBMIT YOUR RESPONSE
        </button>

        {/* Review Section */}
        {/* <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Write your review..."
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-sky-400 outline-none"
            rows={4}
            required
          />

         
        </form> */}

        {/* ✅ Success Popup */}
        {showPopup && (
          <div className="absolute inset-0 bg-white flex items-center justify-center rounded-2xl">
            <div className="bg-white p-6 rounded-xl text-center">
              <h3 className="text-lg font-semibold mb-4">
                🎉 Thank you for your response!
              </h3>
              <button
                onClick={() => {
                  setShowPopup(false);
                  navigate("/orders");
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
