import { useState } from "react";
import { useAppDispatch } from "../../../reducers/hooks";
import { ratingAndReview } from "../../../services/operations/rateAndReview";
import { useNavigate } from "react-router-dom";

export default function RateAndReview() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [review, setReview] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  // Emoji set for rating
  const emojis = [
    { emoji: "😞", label: "Bad" },
    { emoji: "😐", label: "Ok" },
    { emoji: "🙂", label: "Good" },
    { emoji: "🤩", label: "Great" },
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
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md relative">
        <h2 className="text-2xl font-bold text-center mb-6">Rate our service</h2>

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
                    : "opacity-70"
                }`}
                onClick={() => setRating(value)}
                onMouseEnter={() => setHover(value)}
                onMouseLeave={() => setHover(0)}
              >
                <span className="text-3xl">{item.emoji}</span>
                <span className="text-xs">{item.label}</span>
              </span>
            );
          })}
        </div>

        {/* Review Section */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Write your review..."
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-sky-400 outline-none"
            rows={4}
            required
          />

          <button
            type="submit"
            className="bg-sky-500 text-white px-4 py-2 rounded-lg hover:bg-sky-600 transition"
          >
           SUBMIT YOUR RESPONSE
          </button>
        </form>

        {/* ✅ Success Popup */}
        {showPopup && (
          <div className="absolute inset-0 backdrop-blur-lg flex items-center justify-center rounded-2xl">
            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <h3 className="text-lg font-semibold mb-4">
                🎉 Thank you for your response!
              </h3>
              <button
                onClick={() => {
                  setShowPopup(false);
                  navigate("/orders");
                }}
                className="bg-sky-500 text-white px-4 py-2 rounded-lg hover:bg-sky-600 transition"
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
