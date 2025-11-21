
export default function HelpAndSupport() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 flex items-center justify-center">
      <div className="max-w-3xl w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-800">Help & Support</h1>
          <p className="text-gray-600">We’re here to assist you anytime</p>
        </div>

        {/* Contact Info */}
        <div className="bg-white shadow-md rounded-2xl p-6 space-y-4">
          <h2 className="text-xl font-semibold text-gray-700">Contact Information</h2>
          <div className="space-y-3 text-gray-700">
            <p>
              <span className="font-medium">Email:</span> support@mytag.co.ls
            </p>
            <p>
              <span className="font-medium">Phone:</span> +266 63820303 / 62210465
            </p>
            <p>
              <span className="font-medium">Address:</span> Maseru, Lesotho
            </p>
          </div>
        </div>

        {/* Social Media */}
        <div className="bg-white shadow-md rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Follow Us</h2>
          <div className="flex flex-wrap gap-3">
            <a
              href="#"
              className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-blue-600 hover:text-white transition"
            >
              Facebook
            </a>
            <a
              href="#"
              className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-blue-500 hover:text-white transition"
            >
              LinkedIn
            </a>
            <a
              href="#"
              className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-pink-500 hover:text-white transition"
            >
              Instagram
            </a>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white shadow-md rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Send us a Message</h2>
          <form className="space-y-4">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <textarea
              rows={4}
              placeholder="Your Message"
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            ></textarea>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
