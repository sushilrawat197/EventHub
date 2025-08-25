import React from "react";
import ProgressSteps from "./ProgressSteps";
import PrimaryButton from "./PrimaryButton";

export default function DateTimeSelectionUI({
  venue = ["lesotho"],
  dates = ["19 Aug"],
  times = ["9pm"],
  onDateSelect = ["20Aug"],
  onTimeSelect = ["2pm"],
  onProceed,
}) {
  return (
    <div className="  ">
      {/* Progress Steps */}
      <ProgressSteps
        steps={[
          { id: 1, label: "Venue" },
          { id: 2, label: "Date & Time" },
          { id: 3, label: "Ticket" },
          { id: 4, label: "Review & Pay" },
        ]}
        currentStep={2}
      />

      {/* Venue Info */}
      <div className="bg-gray-200 text-center py-1  ">
        <h2 className="font-semibold text-lg">{venue}</h2>
      </div>

      {/* Availability Legend */}
      <div className=" border-2 border-sky-500 rounded-lg shadow p-6 max-w-md mx-auto mt-3">
        <div className="flex justify-center space-x-6 text-sm mb-6">
          <div className="flex items-center space-x-1">
            <span className="w-3 h-3 rounded-full bg-green-500"></span>
            <span>Available</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-3 h-3 rounded-full bg-orange-400"></span>
            <span>Fast Filling</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-3 h-3 rounded-full bg-gray-400"></span>
            <span>Sold out</span>
          </div>
        </div>

        {/* Select Date */}
        <div className="mb-6">
          <p className="font-semibold mb-2">Select Date</p>
          <div className="flex flex-wrap gap-3 justify-center">
            {dates.map((date, idx) => (
              <button
                key={idx}
                onClick={() => onDateSelect(date)}
                className={`px-6 py-2 rounded-md font-medium ${
                  date.status === "available"
                    ? "bg-green-500 text-white"
                    : date.status === "fast"
                    ? "bg-orange-400 text-white"
                    : "bg-gray-300 text-gray-600 cursor-not-allowed"
                }`}
                disabled={date.status === "sold"}
              >
                {date.label}
              </button>
            ))}
          </div>
        </div>

        {/* Select Time */}
        <div>
          <p className="font-semibold mb-2">Select Time</p>
          <div className="flex space-x-4 justify-center">
            {times.map((time, idx) => (
              <button
                key={idx}
                onClick={() => onTimeSelect(time)}
                className="border border-green-500 text-green-600 px-6 py-2 rounded-md font-medium"
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Proceed Button */}
      <div className="mt-3 flex justify-center">
        <PrimaryButton className="w-full max-w-md py-3 rounded-lg font-semibold cursor-pointer" />
      </div>
    </div>
  );
}
