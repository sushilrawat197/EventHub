import { useState } from "react";
import { useAppDispatch } from "../../../reducers/hooks";
import { ratingAndReview } from "../../../services/operations/rateAndReview";
import { useNavigate } from "react-router-dom";
import { ImSad2 } from "react-icons/im";
import { FaSmile, FaGrinStars, FaSadTear, FaStar, FaHeart, FaThumbsUp, FaCheckCircle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function RateAndReview() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [review, setReview] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Enhanced rating options with colorful icons
  const ratingOptions = [
    { 
      icon: <FaSadTear className="w-8 h-8 text-red-500" />, 
      label: "Poor", 
      color: "text-red-500",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      description: "Very disappointed"
    },
    { 
      icon: <ImSad2 className="w-8 h-8 text-orange-500" />, 
      label: "Fair", 
      color: "text-orange-500",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      description: "Could be better"
    },
    { 
      icon: <FaSmile className="w-8 h-8 text-green-500" />, 
      label: "Good", 
      color: "text-green-500",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      description: "Satisfied"
    },
    { 
      icon: <FaGrinStars className="w-8 h-8 text-purple-500" />, 
      label: "Excellent", 
      color: "text-purple-500",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      description: "Outstanding experience"
    },
  ];


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;
    
    setIsSubmitting(true);
    try {
      const result = await dispatch(ratingAndReview(rating, review));
      
      if (result.success) {
        setShowPopup(true);
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl p-8 w-full max-w-2xl border border-white/20"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
          >
            <FaHeart className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
            Share Your Experience
          </h1>
          <p className="text-gray-600 text-lg">
            Your feedback helps us improve our service
          </p>
        </div>

        {/* Rating Section */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">
            How would you rate your experience?
          </h3>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {ratingOptions.map((option, index) => {
              const value = index + 1;
              const isSelected = value === rating;
              const isHovered = value === hover;
              
              return (
                <motion.button
                  key={value}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setRating(value)}
                  onMouseEnter={() => setHover(value)}
                  onMouseLeave={() => setHover(0)}
                  className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                    isSelected || isHovered
                      ? `${option.bgColor} ${option.borderColor} shadow-lg transform scale-105`
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex flex-col items-center space-y-3">
                    <motion.div
                      animate={isSelected ? { scale: [1, 1.2, 1] } : {}}
                      transition={{ duration: 0.3 }}
                      className={isSelected ? option.color : 'text-gray-400'}
                    >
                      {option.icon}
                    </motion.div>
                    <div className="text-center">
                      <p className="font-semibold text-sm">{option.label}</p>
                      <p className="text-xs text-gray-500 mt-1">{option.description}</p>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Review Section - Commented Out */}
        {/* <div className="mb-8">
          <label className="block text-lg font-semibold text-gray-800 mb-4">
            Tell us more about your experience (optional)
          </label>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Share your thoughts, suggestions, or any specific feedback..."
            className="w-full border-2 border-gray-200 rounded-2xl p-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 resize-none"
            rows={4}
          />
        </div> */}

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmit}
          disabled={rating === 0 || isSubmitting}
          className={`w-full py-4 px-8 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 ${
            rating === 0 || isSubmitting
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl'
          }`}
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Submitting...</span>
            </>
          ) : (
            <>
              <FaThumbsUp className="w-5 h-5" />
              <span>Submit Feedback</span>
            </>
          )}
        </motion.button>

        {/* Success Popup */}
        <AnimatePresence>
          {showPopup && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-3xl flex items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="text-center p-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
                >
                  <FaCheckCircle className="w-10 h-10 text-white" />
                </motion.div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Thank You! 🎉
                </h3>
                <p className="text-gray-600 mb-8 text-lg">
                  Your feedback has been submitted successfully. We appreciate your time!
                </p>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setShowPopup(false);
                    navigate("/orders");
                  }}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  View My Orders
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
