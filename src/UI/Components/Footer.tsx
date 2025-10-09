import React from "react";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaInstagram,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhoneAlt,
} from "react-icons/fa";
import {NavLink } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-6">
              <div className="w-24 h-12 bg-white rounded-xl p-2 shadow-lg">
                <img
                  className="w-full h-full object-cover rounded-lg"
                  src="logo.jpeg"
                  alt="EventHub Logo"
                />
              </div>
              {/* <div className="ml-4">
                <h2 className="text-2xl font-bold text-white">My Tag</h2>
                <p className="text-blue-200 text-sm">Discover Amazing Events</p>
              </div> */}
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              Your premier destination for discovering and booking the best events. 
              From concerts to sports, we bring you closer to unforgettable experiences.
            </p>
            <div className="flex space-x-4">
              {[
                { icon: <FaFacebookF />, href: "#", color: "hover:text-blue-400" },
                { icon: <FaLinkedinIn />, href: "#", color: "hover:text-blue-400" },
                { icon: <FaInstagram />, href: "#", color: "hover:text-pink-400" },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className={`w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center text-gray-300 transition-all duration-200 ${social.color} hover:bg-white/20 hover:scale-110`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-bold text-white mb-6">Quick Links</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
               <NavLink to={"/events"}>
                <h4 className="text-sm font-semibold text-blue-200 mb-3 hover:text-white ">Events</h4>
               </NavLink> 
                
                 <ul className="space-y-2">
                  {["Help Center", "Contact Us", "Privacy Policy", "Terms of Service"].map((link) => (
                    <li key={link}>
                      <a href="#" className="text-blue-200 font-semibold hover:text-white text-sm transition-colors duration-200">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>

                {/* <ul className="space-y-2">
                  {["Comedy"].map((link) => (
                    <li key={link}>
                      <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors duration-200">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul> */}
              </div>
             
            </div>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-bold text-white mb-6">Get in Touch</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <FaMapMarkerAlt className="text-blue-400 text-sm" />
                </div>
                <div>
                  <p className="text-white font-medium text-sm">Location</p>
                  <p className="text-gray-300 text-sm">Maseru, Lesotho</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <FaEnvelope className="text-blue-400 text-sm" />
                </div>
                <div>
                  <p className="text-white font-medium text-sm">Email</p>
                  <a href="mailto:support@eventhub.com" className="text-gray-300 text-sm hover:text-white transition-colors">
                    support@mytag.com
                  </a>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <FaPhoneAlt className="text-blue-400 text-sm" />
                </div>
                <div>
                  <p className="text-white font-medium text-sm">Phone</p>
                  <a href="tel:+26663820303" className="text-gray-300 text-sm hover:text-white transition-colors">
                    +266 63820303
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-400 text-sm">
              © 2025 MyTag. All rights reserved. Powered by THINK IT.
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
