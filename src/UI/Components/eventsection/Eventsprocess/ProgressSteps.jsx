import React from "react";
import { FaChevronRight } from "react-icons/fa";

export default function ProgressSteps({ steps, currentStep }) {
  return (
    <div className="w-full overflow-x-auto scrollbar-hide">
      <div className="flex items-center justify-center space-x-2 text-sm p-4 border-b border-gray-200 shadow min-w-max flex-nowrap">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            {/* Step */}
            <div className="flex items-center space-x-2">
              <span
                className={`w-5 h-5 flex items-center justify-center rounded-full text-xs font-bold ${
                  currentStep === step.id
                    ? "bg-black text-white"
                    : "bg-gray-300 text-gray-700"
                }`}
              >
                {step.id}
              </span>
              <span
                className={`${
                  currentStep === step.id
                    ? "text-black font-medium"
                    : "text-gray-500"
                }`}
              >
                {step.label}
              </span>
            </div>

            {/* Arrow */}
            {index < steps.length - 1 && (
              <FaChevronRight className="text-gray-400 flex-shrink-0" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
