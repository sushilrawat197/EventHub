import React from "react";

const plans = [
  {
    title: "Regular",
    price: 89,
    features: [
      "Regular Seat",
      "Free Lunch & Coffee",
      "Photo Prohibited",
      "Regular Access",

      " Access",
    ],
  },
  {
    title: "VVIP",
    price: 190,
    highlighted: true,
    features: [
      "Front Row Seat",
      "Free Lunch & Coffee",
      "Photo & Video Allowed",
      "Extended Access",
      "VIP Lounge Access",
    ],
  },
  {
    title: "VIP",
    price: 150,
    features: [
      "VIP Seat",
      "Free Lunch & Coffee",
      "Photo Prohibited",
      "Photo With Speakers",
      "VIP Access",
    ],
  },
];

const TicketPlans: React.FC = () => (
  <section className="py-16 px-4 bg-white">
    <div className="text-center mb-10">
      <h2 className="text-3xl sm:text-4xl font-bold text-black">
        Get <span className="text-sky-500 font-bold">Ticket</span>
      </h2>
      <div className="w-45 h-1 bg-sky-500 mx-auto mt-2 rounded-full" />
    </div>

    <div className="max-w-6xl mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {plans.map((plan, idx) => (
        <div
          key={idx}
          className={`relative bg-white rounded-2xl shadow-md hover:shadow-lg border transition-all duration-300 hover:scale-105 flex flex-col ${
            plan.highlighted
              ? "border-sky-500 border-2"
              : " border-2  border-sky-500"
          }`}
        >
          {plan.highlighted && (
            <div className="absolute top-0 left-0 w-full h-12 bg-sky-500 text-white flex items-center justify-center text-xl font-semibold rounded-t-2xl z-10">
              VVIP
            </div>
          )}

          <div
            className={`text-center ${
              plan.highlighted ? "pt-16" : "pt-10"
            } pb-6 px-4`}
          >
            {!plan.highlighted && (
              <h3 className="text-2xl font-semibold text-black">
                {plan.title}
              </h3>
            )}
            <p className="text-xl font-bold text-sky-500 mt-2">L{plan.price}</p>
          </div>

          <ul className="flex-1 divide-y divide-gray-200 text-center text-sm text-gray-600">
            {Array.from(new Set(plan.features)).map((feature, i) => (
              <li key={i} className="py-3 px-4">
                {feature}
              </li>
            ))}
          </ul>

          {/* Purchase Button */}
          <div className="p-5">
            <button className="w-full bg-sky-500 hover:bg-sky-600 text-white font-medium py-2.5 rounded-full transition cursor-pointer">
              PURCHASE
            </button>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default TicketPlans;
