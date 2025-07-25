import React from "react";

const ContactPage: React.FC = () => {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gradient-to-r from-blue-50 to-white p-4 lg:p-10 gap-8">
      <div className="w-full lg:w-1/2 h-72 sm:h-96 lg:h-auto shadow-lg rounded-xl overflow-hidden">
        <iframe
          title="Company Location"
          src="https://www.google.com/maps/embed?..."
          className="w-full h-full border-none"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>

      <div className="w-full lg:w-1/2 rounded-xl shadow-2xl p-6 md:p-10 border border-sky-500 bg-white">
        <h2 className="text-3xl font-bold text-center mb-8 text-black">
          Contact Us
          <div className="w-20 h-1 bg-sky-500 mx-auto mt-2 rounded-full" />
        </h2>
        <form className="space-y-5">
          {["Name*", "Email*", "Phone*"].map((placeholder, idx) => (
            <input
              key={idx}
              type={
                placeholder === "Email*"
                  ? "email"
                  : placeholder === "Phone*"
                  ? "tel"
                  : "text"
              }
              placeholder={placeholder}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
            />
          ))}
          <textarea
            rows={4}
            placeholder="Message*"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm resize-none"
          ></textarea>
          <button
            type="submit"
            className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 rounded-lg shadow-md transition-transform transform hover:-translate-y-1"
          >
            SEND MESSAGE
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;
