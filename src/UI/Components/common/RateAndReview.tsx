import { useState } from "react";
import { Star } from "lucide-react";

export default function RateAndReview() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [review, setReview] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Rating:", rating, "Review:", review);
    alert("Thanks for your feedback!");
  };

  return (
    <div className="lg:min-h-[calc(100vh-6rem)] min-h-[calc(100vh-40px)] flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Rate & Review</h2>

        {/* Rating Section */}
        <div className="flex justify-center gap-2 mb-6">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-8 h-8 cursor-pointer transition 
                ${star <= (hover || rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-400"}`}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
            />
          ))}
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
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
}
