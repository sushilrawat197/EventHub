import React, { useEffect, useState } from "react";
import { FaEnvelope } from "react-icons/fa";

const sliderImages = ["Heroimg.png", "SignIn3000.png"];

export default function SignUp() {
  const [currentImage, setCurrentImage] = useState(0);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % sliderImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-sky-200 p-4">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg flex flex-col md:flex-row overflow-hidden">
        {/* Left Side */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-10 flex flex-col justify-center">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img
              src="ticketlogo2.jpg"
              alt="Ticket  Logo"
              className="h-[2.2rem]"
            />
          </div>

          {/* Heading */}
          <h2 className="text-2xl font-bold text-center text-black mb-4">
            Sign Up
          </h2>

          <div className="relative mb-4">
            <FaEnvelope className="absolute top-3 left-3 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
            />
          </div>

          <button
            type="button"
            className="w-full bg-sky-700 hover:bg-sky-600 text-white font-semibold py-2 rounded-md transition"
          >
            Sign Up
          </button>
        </div>

        {/* Right Slider */}
        <div className="hidden md:flex md:w-1/2 justify-center items-center bg-sky-200">
          <img
            src={sliderImages[currentImage]}
            alt="Slider"
            className="max-w-full h-auto object-contain p-8 transition-all duration-500 "
          />
        </div>
      </div>
    </div>
  );
}
