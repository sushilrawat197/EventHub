import { FaAngleRight, FaChartLine, FaDollarSign, FaCalendarAlt, FaRocket, FaShieldAlt, FaUsers } from "react-icons/fa";

const SellWithEase = () => {
  const features = [
    {
      title: "Real-Time Analytics",
      description: "Track your event performance with live dashboards and detailed insights.",
      icon: FaChartLine,
      color: "from-blue-300 to-blue-400"
    },
    {
      title: "Smart Pricing",
      description: "Dynamic pricing strategies to maximize your revenue potential.",
      icon: FaDollarSign,
      color: "from-green-500 to-green-600"
    },
    {
      title: "Easy Scheduling",
      description: "Intuitive calendar management for all your event dates and times.",
      icon: FaCalendarAlt,
      color: "from-purple-500 to-purple-600"
    }
  ];

  const benefits = [
    {
      icon: FaRocket,
      title: "Lightning Fast Setup",
      description: "Get your event live in minutes, not hours"
    },
    {
      icon: FaShieldAlt,
      title: "Secure Payments",
      description: "Bank-level security for all transactions"
    },
    {
      icon: FaUsers,
      title: "24/7 Support",
      description: "Expert help whenever you need it"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Header */}
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Sell Tickets with{" "}
                <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  Ease
                </span>
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full mb-6"></div>
              <p className="text-xl text-gray-600 leading-relaxed">
                No more struggling with complex{" "}
                <span className="font-semibold text-gray-900">event ticketing systems</span>.
                EventHub makes it simple to set up and manage your events. Host
                standout experiences — we'll handle the technology.
              </p>
            </div>

            {/* Feature Cards */}
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="group bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="text-white text-xl" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {feature.description}
                      </p>
                    </div>
                    <FaAngleRight className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                </div>
              ))}
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="text-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <benefit.icon className="text-blue-500 text-xl" />
                  </div>
                  <h4 className="font-semibold text-gray-900 text-sm mb-1">
                    {benefit.title}
                  </h4>
                  <p className="text-xs text-gray-600">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Image Gallery */}
          <div className="relative">
            {/* Main Image */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="img11.jpg"
                alt="Event Management Dashboard"
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="text-2xl font-bold mb-2">Event Dashboard</h3>
                <p className="text-blue-100">Manage everything from one place</p>
              </div>
            </div>

            {/* Floating Cards */}
            <div className="absolute -top-6 -right-6 bg-white rounded-2xl p-4 shadow-xl border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <FaChartLine className="text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">1,234</div>
                  <div className="text-sm text-gray-600">Tickets Sold</div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-xl border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FaDollarSign className="text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">$12,456</div>
                  <div className="text-sm text-gray-600">Revenue</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SellWithEase;
