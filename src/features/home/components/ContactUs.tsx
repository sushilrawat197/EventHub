import React from "react";
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

const ContactPage: React.FC = () => {



  const contactInfo = [
    {
      icon: FaEnvelope,
      title: "Email Us",
      details: "mytagtankiso@gmail.com",
      description: "We'll respond within 24 hours"
    },
    {
      icon: FaPhone,
      title: "Call Us",
      details: "+266 63820303, +266 5787 5950",
      description: "Mon-Fri from 8AM to 6PM"
    },
    {
      icon: FaMapMarkerAlt,
      title: "Visit Us",
      details: "Thetsane West, Maseru",
      description: "Come say hello at our office"
    }
  ];

  return (
    <section className="py-3 bg-gradient-to-br from-gray-50 to-white pb-9">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
         <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Get in <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Touch</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Have a question or need help? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div> 

        <div className="max-w-4xl mx-auto bg-gray-50 rounded-3xl p-5 md:p-8 border border-gray-200">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h3>
              <p className="text-gray-600 mb-8">
                We're here to help you create amazing events. Reach out to us through any of the channels below.
              </p>
            </div>

            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <div key={index} className="flex items-start gap-4 p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <info.icon className="text-blue-500 text-xl" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-1">{info.title}</h4>
                    <p className="text-gray-900 font-medium mb-1">{info.details}</p>
                    <p className="text-gray-600 text-sm">{info.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div> 
      </div>
    </section>
  );
};

export default ContactPage;
