const PosterRanking = () => {
  const stats = [
    {
      number: "599+",
      label: "Active Organizers",
      description: "Trusted event organizers",
      icon: "👥",
      color: "from-blue-500 to-blue-600"
    },
    {
      number: "1,999+",
      label: "Events Created",
      description: "Successful events hosted",
      icon: "🎉",
      color: "from-green-500 to-green-600"
    },
    {
      number: "4,999+",
      label: "Happy Attendees",
      description: "Satisfied customers",
      icon: "⭐",
      color: "from-purple-500 to-purple-600"
    }
  ];

  return (
    <section className="relative py-24 bg-gradient-to-br from-gray-900 via-blue-900 to-black text-white overflow-hidden rounded-3xl mx-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      
      {/* Floating Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/10 rounded-full blur-lg"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            Trusted by Thousands
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Join the growing community of event organizers and attendees who trust EventHub for their ticketing needs.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="group text-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-8 hover:bg-white/30 transition-all duration-500 transform hover:scale-105 border border-white/30">
                {/* Icon */}
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {stat.icon}
                </div>
                
                {/* Number */}
                <div className="mb-4">
                  <h3 className="text-5xl lg:text-6xl font-bold mb-2 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                    {stat.number}
                  </h3>
                  <h4 className="text-2xl font-semibold text-white mb-2">
                    {stat.label}
                  </h4>
                  <p className="text-gray-300 text-lg">
                    {stat.description}
                  </p>
                </div>
                
                {/* Decorative Line */}
                <div className={`w-16 h-1 bg-gradient-to-r ${stat.color} rounded-full mx-auto group-hover:w-24 transition-all duration-300`}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-8 border border-white/30 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Ready to Join Our Community?</h3>
            <p className="text-gray-300 mb-6 text-lg">
              Start creating amazing events and selling tickets with EventHub today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105">
                Create Event
              </button>
              <button className="border-2 border-blue-400 text-blue-400 px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-blue-400 hover:text-white transition-all duration-300">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PosterRanking;
