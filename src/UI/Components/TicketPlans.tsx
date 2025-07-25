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
      "Free Lunch & Coffee",
      "Photo Prohibited",
    ],
  },
  {
    title: "VVIP",
    price: 190,
    highlighted: true,
    features: [
      "Regular Seat",
      "Free Lunch & Coffee",
      "Photo & Video Allowed",
      "Regular Access",
      "Extended Access",
    ],
  },
  {
    title: "VIP",
    price: 150,
    features: [
      "VIP & Front Row Seat",
      "Free Lunch & Coffee",
      "Photo Prohibited",
      "Photo With Speakers",
      "VIP Access",
      "Photo Prohibited",
    ],
  },
];

const TicketPlans: React.FC = () => (
  <section className=" py-16 px-4">
    <div className="text-center mb-10">
      <h2 className="text-3xl sm:text-4xl font-light text-black">
        Get <span className="text-sky-500 font-bold">Ticket</span>
      </h2>
      <div className="w-20 h-1 bg-sky-500 mx-auto mt-2 rounded-full" />
    </div>

    <div className="max-w-6xl mx-auto grid gap-6 sm:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {plans.map((plan, idx) => (
        <div
          key={idx}
          className={`relative bg-white rounded-2xl shadow hover:shadow-lg border transition-transform duration-300 hover:scale-105 ${
            plan.highlighted ? "border-sky-500 border-2" : "border-gray-200"
          }`}
        >
          {plan.highlighted && (
            <div className="absolute top-0 left-0 w-full h-16 bg-sky-500 text-white flex items-center justify-center text-base font-semibold rounded-t-2xl">
              {plan.title}
            </div>
          )}

          <div
            className={`text-center ${
              plan.highlighted ? "pt-20" : "pt-10"
            } pb-6`}
          >
            <h3
              className={`text-lg font-semibold ${
                plan.highlighted ? "text-sky-500" : "text-[#777777]"
              }`}
            >
              {plan.title}
            </h3>
            <p className="text-3xl font-bold text-sky-500 mt-2">
              ${plan.price}
            </p>
          </div>

          <ul className="divide-y divide-gray-200 text-center text-[#777777] text-sm">
            {plan.features.map((feature, i) => (
              <li key={i} className="py-3 px-4">
                {feature}
              </li>
            ))}
          </ul>

          <div className="p-5">
            <button className="w-full bg-sky-500 hover:bg-sky-600 text-white font-medium py-2.5 rounded-full transition">
              PURCHASE
            </button>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default TicketPlans;
