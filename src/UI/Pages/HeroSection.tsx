

const HeroSection = () => {

  return (
    <>
      <div className="relative min-h-[60vh] bg-gradient-to-br from-gray-900 via-blue-900 to-black overflow-hidden rounded-3xl mx-2 lg:mt-40 mt-28">

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>

        <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pb-8 flex items-center">
          <div className="grid pt-4 grid-cols-1 lg:grid-cols-2 gap-8 items-center min-h-[60vh]">
            {/* Left Content */}
            <div className="space-y-6">
  

              {/* Main Heading */}
              <div className="space-y-4 ">
                        <h1 className="text-4xl text-center  font-bold leading-tight">
                          <span className="block text-white text-7xl">Your Ultimate</span>
                          <span className="block text-[55px] bg-gradient-to-r from-blue-400 via-blue-300 to-white bg-clip-text text-transparent">
                            Ticket Destination
                          </span>
                        </h1>
                
                <p className="text-xl text-gray-300 leading-relaxed max-w-lg text-center" >
                 Step into the future of events with MyTag. We offer a hassle free experience. #No lines, just vibes!
                </p>
              </div>

              {/* CTA Buttons */}
              {/* <div className="flex flex-col sm:flex-row gap-4">
                        <Link to={'/events'}>
                          <button className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300 flex items-center gap-3">
                    <span className="relative z-10">Explore Events</span>
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                </Link>
     
              </div> */}

                     
            </div>

            {/* Right Content - Hero Image */}
            <div className="relative">
              <div className="relative z-10">
                <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur-2xl opacity-30"></div>

                <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl  lg:p-8 border border-white/20">
                  <img
                    src="mainimg00.jpg"
                    alt="Event Experience"
                    className="w-full object-cover rounded-2xl shadow-2xl"
                  />
                 
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeroSection;
