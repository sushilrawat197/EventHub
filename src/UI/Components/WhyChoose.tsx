import { FaVectorSquare, FaCalendarPlus, FaHeadset, FaShieldAlt, FaRocket, FaUsers } from "react-icons/fa";

const WhyChoose = () => {
  const features = [
    {
      icon: FaVectorSquare,
      title: "Ultimate Flexibility",
      description: "EventHub offers a user-friendly ticketing system designed to streamline both online and box office ticket sales — ensuring a seamless and efficient experience.",
      color: "from-blue-300 to-blue-400"
    },
    {
      icon: FaHeadset,
      title: "24/7 Expert Support",
      description: "Round-the-clock expert assistance to help organizers set up and manage tickets efficiently. Our support team ensures a seamless and stress-free ticketing service.",
      color: "from-green-500 to-green-600"
    },
    {
      icon: FaCalendarPlus,
      title: "Smart Scheduling",
      description: "Customize and simplify event schedules easily — whether date ranges or time slots. Smooth management with our flexible scheduling features.",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: FaShieldAlt,
      title: "Secure Transactions",
      description: "Bank-level security for all transactions with advanced encryption and fraud protection. Your data and payments are always safe with us.",
      color: "from-red-500 to-red-600"
    },
    {
      icon: FaRocket,
      title: "Lightning Fast",
      description: "Experience blazing-fast ticket booking with our optimized platform. No waiting, no delays — just instant ticket purchases.",
      color: "from-orange-500 to-orange-600"
    },
    {
      icon: FaUsers,
      title: "Community Driven",
      description: "Join thousands of event organizers and attendees who trust EventHub for their ticketing needs. Be part of our growing community.",
      color: "from-blue-300 to-blue-400"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-4xl font-bold text-gray-900">
              Why Choose <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">EventHub?</span>
            </h2>
          </div>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            The{" "}
            <span className="font-semibold text-blue-600">
              #1 Event Ticketing Platform
            </span>{" "}
            for all event types. Whether it's concerts, amusement parks, trade
            shows, or marathons — we've got you covered. Sell tickets online for
            any event effortlessly.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="group relative">
              <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 hover:border-blue-200">
                {/* Icon */}
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="text-white text-2xl" />
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
                
                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default WhyChoose;
