import React from "react";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaInstagram,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhoneAlt,
} from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-b from-sky-100 to-sky-300 text-gray-700 pt-10 pb-4">
      <div className="container mx-auto px-4">
        {/* Logo + Description */}
        <div className="mb-10 max-w-3xl">
          <div className="flex items-center mb-4">
            <div className="bg-white rounded-full flex items-center justify-center text-xl font-bold text-sky-500">
              <img
                className="rounded-lg w-20 h-10"
                src="ticketlogo2.jpg"
                alt="logo"
              />
            </div>
          </div>
          
        </div>
        <p className="pb-4">
            MyTag is a robust, secure, and highly customizable ticketing platform tailored for the needs of event organizers and attendees. It stands as the future ticketing in the region.
        </p>

        {/* Links Grid */}
        <div className="grid md:grid-cols-5 gap-4 text-sm">
          {[
            // {
            //   title: "Explore",
            //   links: ["Features", "Pricing", "Example", "Newsletter"],
            // },
            // {
            //   title: "Company",
            //   links: ["Careers", "Blog", "Press", "Partners"],
            // },
            {
              title: "Support",
              links: ["Help Center", "Privacy Policy", "Terms of Use"],
            },
          ].map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold mb-3">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="hover:text-sky-600">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Social & Contact */}
          <div className="md:col-span-2">
            <h3 className="font-semibold mb-3">Contact & Social</h3>
            <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
              {/* Social Links */}
              <div className="flex flex-col space-y-2">
                {[
                  { icon: <FaFacebookF />, label: "Facebook" },
                  { icon: <FaLinkedinIn />, label: "LinkedIn" },
                  { icon: <FaInstagram />, label: "Instagram" },
                ].map((social) => (
                  <div
                    key={social.label}
                    className="flex items-center space-x-2 hover:text-sky-600"
                  >
                    {social.icon}
                    <a href="#">{social.label}</a>
                  </div>
                ))}
              </div>

              {/* Contact Info */}
              <div className="flex flex-col space-y-2 text-gray-600">
                <div className="flex items-start space-x-2">
                  <FaMapMarkerAlt className="mt-1" />
                  <span>Maseru, Lesotho</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaEnvelope />
                  <a href="mailto:support@mytag.com">support@mytag.com</a>
                </div>
                <div className="flex items-center space-x-2">
                  <FaPhoneAlt />
                  <a href="tel:+26663820303">+266 63820303 / 62210465</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-10 border-t pt-4 text-center text-xs text-gray-800">
          &copy; 2025 MyTag - Powered by Giant Technologies
        </div>
      </div>
    </footer>
  );
};

export default Footer;
